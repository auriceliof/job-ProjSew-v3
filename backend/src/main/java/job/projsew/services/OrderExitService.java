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
        Optional<OrderExit> obj = exitRepository.findById(id);
        OrderExit entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
        return new OrderExitDTO(entity);
    }

    /* ====== CREATE ====== */

    @Transactional
    public OrderExitDTO insert(OrderExitDTO dto) {
        if (dto.getOrder() == null || dto.getOrder().getId() == null) {
            throw new ResourceNotFoundException("Order is required");
        }

        // Lock pessimista no pedido para consistência em concorrência
        Order order = orderRepository.findByIdForUpdate(dto.getOrder().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getQuantityProd() == null) {
            throw new IllegalArgumentException("Quantidade de entrada do pedido (quantityProd) não definida");
        }

        Integer newQty = dto.getQuantityProd() == null ? 0 : dto.getQuantityProd();
        if (newQty < 0) {
            throw new IllegalArgumentException("Quantidade de saída não pode ser negativa");
        }

        int alreadyExited = exitRepository.sumQuantityByOrderId(order.getId());
        long proposedTotal = (long) alreadyExited + (long) newQty;

        if (proposedTotal > order.getQuantityProd()) {
            throw new IllegalArgumentException(String.format(
                "Quantidade de saída excede o total do pedido. Já saiu: %d, nova saída: %d, entrada: %d",
                alreadyExited, newQty, order.getQuantityProd()
            ));
        }

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

        // >>> Correção: extrair orderId para variável local (efetivamente final)
        final Long orderId = entity.getOrder() != null ? entity.getOrder().getId() : null;
        if (orderId == null) {
            throw new ResourceNotFoundException("Order não encontrado para a saída: " + id);
        }

        // Lock no pedido vinculado usando orderId (evita capturar 'entity' no lambda)
        Order order = orderRepository.findByIdForUpdate(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order não encontrado: " + orderId));

        if (order.getQuantityProd() == null) {
            throw new IllegalArgumentException("Quantidade de entrada do pedido (quantityProd) não definida");
        }

        Integer newQty = dto.getQuantityProd() == null ? entity.getQuantityProd() : dto.getQuantityProd();
        if (newQty == null) newQty = 0;
        if (newQty < 0) {
            throw new IllegalArgumentException("Quantidade de saída não pode ser negativa");
        }

        int sumOthers = exitRepository.sumQuantityByOrderIdExcludingExit(orderId, id);
        long proposedTotal = (long) sumOthers + (long) newQty;

        if (proposedTotal > order.getQuantityProd()) {
            throw new IllegalArgumentException(String.format(
                "Quantidade de saída excede o total do pedido. Outras saídas: %d, nova quantidade: %d, entrada: %d",
                sumOthers, newQty, order.getQuantityProd()
            ));
        }

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
}
