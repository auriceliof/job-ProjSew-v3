package job.projsew.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import job.projsew.dto.PayDTO;
import job.projsew.entities.Pay;
import job.projsew.entities.Order;
import job.projsew.entities.Status;
import job.projsew.repositories.PayRepository;
import job.projsew.repositories.OrderRepository;
import job.projsew.repositories.StatusRepository;
import job.projsew.services.exceptions.ResourceNotFoundException;

@Service
public class PayService {

    @Autowired
    private PayRepository repository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StatusRepository statusRepository;
    
    @Transactional(readOnly = true)
    public Page<PayDTO> findAllPaged(Pageable pageable) {
        Page<Pay> list = repository.findAll(pageable);
        return list.map(x -> new PayDTO(x));
    }

    @Transactional(readOnly = true)
    public PayDTO findById(Long id) {
        Optional<Pay> obj = repository.findById(id);
        Pay entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
        return new PayDTO(entity);
    }

    @Transactional
    public PayDTO insert(PayDTO dto) {
        Pay entity = new Pay();
        
        entity.setPayDate(dto.getPayDate());
        entity.setPayValue(dto.getPayValue());

        Order order = orderRepository.findById(dto.getOrder().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        entity.setOrder(order);

        // Calcula a diferença como o valor do pagamento (pois é uma inserção)
        double payDifference = entity.getPayValue() != null ? entity.getPayValue() : 0.0;

        // Atualiza o valor pago e o status da ordem associada
        updateOrderPaidValueAndStatus(entity, payDifference);

        entity = repository.save(entity);
        return new PayDTO(entity);
    }

    @Transactional
    public PayDTO update(Long id, PayDTO dto) {
        try {
            Pay entity = repository.getReferenceById(id);
            
            Order order = orderRepository.findById(dto.getOrder().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

            // Calcula a diferença entre o valor antigo e o novo
            double oldPayValue = entity.getPayValue() != null ? entity.getPayValue() : 0.0;
            double newPayValue = dto.getPayValue() != null ? dto.getPayValue() : 0.0;
            double payDifference = newPayValue - oldPayValue;

            entity.setPayDate(dto.getPayDate());
            entity.setPayValue(newPayValue);
            entity.setOrder(order);

            // Atualiza o valor pago e o status da ordem associada
            updateOrderPaidValueAndStatus(entity, payDifference);

            entity = repository.save(entity);
            return new PayDTO(entity);
        } catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException("ID not found: " + id);
        }
    }

    public void delete(Long id) {
        try {
            repository.deleteById(id);
        } catch (EmptyResultDataAccessException e) {
            throw new ResourceNotFoundException("ID not found: " + id);
        }
    }

    private void updateOrderPaidValueAndStatus(Pay entity, double payDifference) {
        Order order = entity.getOrder();
        if (order != null) {
            double totalPaid = order.getPaidValue() != null ? order.getPaidValue() : 0.0;
            totalPaid += payDifference;
            order.setPaidValue(totalPaid);
            
            if (order.getTotalAmount() != null && totalPaid >= order.getTotalAmount()) {
                order.setIsPaid(true);

                Status paidoffStatus = statusRepository.findById(4L)
                        .orElseThrow(() -> new ResourceNotFoundException("Status 'Quitado' not found"));
                order.setStatus(paidoffStatus);

                order.setEndOs(entity.getPayDate());
            } else {
                order.setIsPaid(false);
            }
            orderRepository.save(order);
        }
    }
}








