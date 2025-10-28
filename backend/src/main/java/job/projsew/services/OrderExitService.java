package job.projsew.services;

import java.time.LocalDate;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import job.projsew.dto.OrderExitDTO;
import job.projsew.entities.Order;
import job.projsew.entities.OrderExit;
import job.projsew.entities.Status;
import job.projsew.repositories.OrderExitRepository;
import job.projsew.repositories.OrderRepository;
import job.projsew.repositories.StatusRepository;
import job.projsew.services.exceptions.ResourceNotFoundException;

@Service
public class OrderExitService {

    // Nomes tal como cadastrados em tb_status.name
    private static final String STATUS_PRODUCAO   = "Produção";
    private static final String STATUS_FINALIZADO = "Finalizado";

    @Autowired
    private OrderExitRepository exitRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StatusRepository statusRepository;

    // Cache simples por nome (lowercase) -> Status
    private final Map<String, Status> statusCache = new ConcurrentHashMap<>();

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

        validateAvailabilityOrThrow(
            order.getQuantityProd(), // entrada
            alreadyExited,           // já saiu
            newQty,                  // nova saída
            ""                       // sufixo para rótulo do CREATE
        );

        OrderExit entity = new OrderExit();
        entity.setOrder(order);
        entity.setExitDate(dto.getExitDate() != null ? dto.getExitDate() : LocalDate.now());
        entity.setQuantityProd(newQty);

        entity = exitRepository.save(entity);

        // Sincroniza agregados (exitDate + status)
        refreshOrderAggregates(order.getId());

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

        validateAvailabilityOrThrow(
            order.getQuantityProd(), // entrada
            outrasSaidas,            // já saiu (outras saídas)
            newQty,                  // nova saída
            " (outras saídas)"       // sufixo para rótulo do UPDATE
        );

        if (dto.getExitDate() != null) {
            entity.setExitDate(dto.getExitDate());
        }
        entity.setQuantityProd(newQty);

        entity = exitRepository.save(entity);

        // Recalcula agregados após a alteração
        refreshOrderAggregates(orderId);

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

        // Recalcula agregados (inclusive pode “desfinalizar”)
        refreshOrderAggregates(orderId);
    }

    /* ====== SYNC AGGREGATES (exitDate + status) ====== */

    /**
     * Recalcula e aplica:
     *  - exitDate = MAX(exitDate) das saídas do pedido (ou null)
     *  - status   = "Finalizado" se sum(saídas) == entrada; senão "Produção"
     * Usa lock pessimista no Order para evitar condição de corrida.
     */
    @Transactional
    protected void refreshOrderAggregates(Long orderId) {
        LocalDate latest = exitRepository.findLatestExitDate(orderId).orElse(null);
        int totalSaidas = normalize(Optional.ofNullable(exitRepository.sumQuantityByOrderId(orderId)).orElse(0));

        Order order = orderRepository.findByIdForUpdate(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        // Atualiza exitDate (se mudou)
        if (!Objects.equals(order.getExitDate(), latest)) {
            order.setExitDate(latest);
        }

        // Atualiza status conforme total de saídas vs entrada
        applyOrderStatus(order, totalSaidas);

        orderRepository.save(order);
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

    /**
     * Define o status da Order com base no total de saídas:
     * - Se totalSaidas == entrada → Status("Finalizado")
     * - Caso contrário → Status("Produção")
     *
     * Usa cache em memória para evitar busca repetida no banco.
     */
    private void applyOrderStatus(Order order, int totalSaidas) {
        Integer entradaBoxed = order.getQuantityProd();
        int entrada = (entradaBoxed == null ? 0 : entradaBoxed);

        final String nomeStatus = (totalSaidas == entrada) ? STATUS_FINALIZADO : STATUS_PRODUCAO;

        Status novoStatus = getStatusByName(nomeStatus); // obtém do cache/banco

        if (!Objects.equals(order.getStatus(), novoStatus)) {
            order.setStatus(novoStatus);
        }
    }

    /** Busca Status por nome (case-insensitive) com cache em memória */
    private Status getStatusByName(String name) {
        final String key = name.toLowerCase();
        Status cached = statusCache.get(key);
        if (cached != null) {
            return cached;
        }

        Status found = statusRepository.findByNameIgnoreCase(name)
            .orElseThrow(() -> new ResourceNotFoundException("Status não encontrado: " + name));

        statusCache.put(key, found);
        return found;
    }
}
