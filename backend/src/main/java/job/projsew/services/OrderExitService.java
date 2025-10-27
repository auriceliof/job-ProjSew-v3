package job.projsew.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
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
	
 	@Transactional(readOnly = true)
    public Page<OrderExitDTO> findAllPaged(Pageable pageable) {
        Page<OrderExit> list = exitRepository.findAll(pageable);
        return list.map(x -> new OrderExitDTO(x));
    }

    @Transactional(readOnly = true)
    public OrderExitDTO findById(Long id) {
        Optional<OrderExit> obj = exitRepository.findById(id);
        OrderExit entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
        return new OrderExitDTO(entity);
    }

    @Transactional
	public OrderExitDTO insert(OrderExitDTO dto) {
		
    	OrderExit entity = new OrderExit();
		
			entity.setExitDate(dto.getExitDate());
			entity.setQuantityProd(dto.getQuantityProd());
			
			 Order order = orderRepository.findById(dto.getOrder().getId())
		                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
		        entity.setOrder(order);
			
		entity = exitRepository.save(entity);
		
		return new OrderExitDTO(entity);
	}

	@Transactional
	public OrderExitDTO update(Long id, OrderExitDTO dto) {
		try {
			OrderExit entity = exitRepository.getReferenceById(id);
			
			entity.setExitDate(dto.getExitDate());
			entity.setQuantityProd(dto.getQuantityProd());
			
			 Order order = orderRepository.findById(dto.getOrder().getId())
		                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
		        entity.setOrder(order);
			
			entity = exitRepository.save(entity);
			
			return new OrderExitDTO(entity);			
		}
		
		catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("ID not found: " + id);
		}
	}

	public void delete(Long id) {
		
		try {
			exitRepository.deleteById(id);
		}
		catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException("ID not found: " + id);
		}
	}
}
