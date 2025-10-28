package job.projsew.services;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import job.projsew.dto.OrderExitDTO;
import job.projsew.entities.Order;
import job.projsew.entities.OrderExit;
import job.projsew.repositories.OrderExitRepository;
import job.projsew.repositories.OrderRepository;
import job.projsew.services.exceptions.ResourceNotFoundException;

@Service
public class OrderExitService {
    
    @Autowired
    private OrderExitRepository exitRepository;

    @Autowired
    private OrderRepository orderRepository;
    
    /* ====== READ ====== */

    @Transactional(readOnly = true)
    public Page<OrderExitDTO> findAllPaged(Pageable pageable) {
        Page<OrderExit> list = exitRepository.findAll(pageable);
        return list.map(OrderExitDTO::new);
    }

    @Transactional(readOnly = true)
    public OrderExitDTO findById(Long id) {
        OrderExit entity = exitRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
        return new OrderExitDTO(entity);
    }

    /* ====== CREATE ====== */

    @Transactional
    public OrderExitDTO insert(OrderExitDTO dto) {
        if (dto.getOrder() == null || dto.getOrder().getId() == null) {
            throw new ResourceNotFoundException("Order is required");
        }

        Order order = lockOrderForUpdate(dto.getOrder().getId());

        if (order.getQuantityProd() == null) {
            throw new IllegalArgumentException("Quantidade de entrada do pedido (quantityProd) não definida");
        }

        int newQty = normalize(dto.getQuantityProd());
        validateNonNegative(newQty);

        int alreadyExited = normalize(Optional.ofNullable(
                exitRepository.sumQuantityByOrderId(order.getId()))
                .orElse(0));
        
        // Validação unificada
        validateAvailabilityOrThrow(
            order.getQuantityProd(), // entrada
            alreadyExited,           // já saiu
            newQty,                  // nova saída
            ""                       // sufixo do rótulo para CREATE
        );

        OrderExit entity = new OrderExit();
        entity.setOrder(order);
        entity.setExitDate(dto.getExitDate() != null ? dto.getExitDate() : LocalDate.now());
        entity.setQuantityProd(newQty);

        entity = exitRepository.save(entity);

        // Sincroniza Order.exitDate -> MAX(exitDate)
        refreshOrderLatestExitDate(order.getId());

        return new OrderExitDTO(entity);
    }

    /* ====== UPDATE ====== */

    @Transactional
    public OrderExitDTO update(Long id, OrderExitDTO dto) {
        OrderExit entity = exitRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("OrderExit não encontrado: " + id));

        final Long orderId = (entity.getOrder() != null ? entity.getOrder().getId() : null);
        if (orderId == null) {
            throw new ResourceNotFoundException("Order não encontrado para a saída: " + id);
        }

        Order order = lockOrderForUpdate(orderId);

        if (order.getQuantityProd() == null) {
            throw new IllegalArgumentException("Quantidade de entrada do pedido (quantityProd) não definida");
        }

        int newQty = normalize(dto.getQuantityProd() != null ? dto.getQuantityProd() : entity.getQuantityProd());
        validateNonNegative(newQty);

        int outrasSaidas = normalize(Optional.ofNullable(
                exitRepository.sumQuantityByOrderIdExcludingExit(orderId, id))
                .orElse(0));

        // Validação unificada (com rótulo específico do UPDATE)
        validateAvailabilityOrThrow(
            order.getQuantityProd(),   // entrada
            outrasSaidas,              // já saiu (outras saídas)
            newQty,                    // nova saída
            " (outras saídas)"         // sufixo para UPDATE
        );

        if (dto.getExitDate() != null) {
            entity.setExitDate(dto.getExitDate());
        }
        entity.setQuantityProd(newQty);

        entity = exitRepository.save(entity);

        // Recalcula a última data após a alteração
        refreshOrderLatestExitDate(orderId);

        return new OrderExitDTO(entity);
    }

    /* ====== DELETE ====== */

    @Transactional
    public void delete(Long id) {
        // Para recalcular depois do delete, precisamos saber qual Order foi afetado
        Long orderId = exitRepository.findById(id)
            .map(e -> e.getOrder() != null ? e.getOrder().getId() : null)
            .orElseThrow(() -> new ResourceNotFoundException("ID not found: " + id));

        try {
            exitRepository.deleteById(id);
        }
        catch (EmptyResultDataAccessException e) {
            throw new ResourceNotFoundException("ID not found: " + id);
        }

        // Recalcula a maior data remanescente (ou null se não houver mais saídas)
        refreshOrderLatestExitDate(orderId);
    }

    /* ====== SYNC EXIT DATE ====== */

    /**
     * Busca MAX(exitDate) das saídas do pedido e grava em Order.exitDate (ou null se não houver).
     * Usa lock pessimista no Order para evitar condição de corrida.
     */
    @Transactional
    protected void refreshOrderLatestExitDate(Long orderId) {
        LocalDate latest = exitRepository.findLatestExitDate(orderId).orElse(null);

        Order order = orderRepository.findByIdForUpdate(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (!Objects.equals(order.getExitDate(), latest)) {
            order.setExitDate(latest);
            orderRepository.save(order);
        }
    }

    /* ====== HELPERS (reuso) ====== */

    /** Lock pessimista no Order para consistência em cenários concorrentes */
    private Order lockOrderForUpdate(Long orderId) {
        return orderRepository.findByIdForUpdate(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
    }

    /** Normaliza Integer possivelmente nulo para int */
    private int normalize(Integer value) {
        return value == null ? 0 : value.intValue();
    }

    /** Valida quantidade não negativa */
    private void validateNonNegative(int qty) {
        if (qty < 0) {
            throw new IllegalArgumentException("Quantidade de saída não pode ser negativa");
        }
    }

    /**
     * Regras:
     * - Se (jaSaiu + novaSaida) > entrada -> lança IllegalArgumentException com mensagem padronizada
     * - Limite permitido = entrada - jaSaiu (não inclui a nova, pois ela excedeu)
     */
    private void validateAvailabilityOrThrow(int entrada, int jaSaiu, int novaSaida, String saiuLabelSuffix) {
        long proposedTotal = (long) jaSaiu + (long) novaSaida;
        if (proposedTotal > (long) entrada) {
            int limitePermitido = entrada - jaSaiu;
            throw new IllegalArgumentException(String.format(
                "Operação inválida: a quantidade de saída excede o total do pedido. "
                + "Entrada total: %d, já saiu%s: %d, nova saída recusada: %d. "
                + "Limite permitido: %d unidade(s).",
                entrada,
                (saiuLabelSuffix == null ? "" : saiuLabelSuffix),
                jaSaiu,
                novaSaida,
                limitePermitido
            ));
        }
    }
}
