package job.projsew.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import job.projsew.dto.OrderDTO;
import job.projsew.entities.Order;
import job.projsew.entities.Product;
import job.projsew.entities.Status;
import job.projsew.repositories.OrderRepository;
import job.projsew.repositories.ProductRepository;
import job.projsew.repositories.StatusRepository;
import job.projsew.services.exceptions.ResourceNotFoundException;

@Service
public class OrderService {

    @Autowired
    private OrderRepository repository;
    
    @Autowired
    private StatusRepository statusRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Transactional(readOnly = true)
    public Page<OrderDTO> findAllPaged(Long statusId, Long productId, Pageable pageable) {
    	
        Status statusID = (statusId == 0) ? null : statusRepository.getReferenceById(statusId);
        Product productID = (productId == 0) ? null : productRepository.getReferenceById(productId);
        
        Page<Order> list = repository.find(statusID, productID, pageable);
        
        return list.map(OrderDTO::new);
    }

    @Transactional(readOnly = true)
    public OrderDTO findById(Long id) {
    	
        Optional<Order> obj = repository.findById(id);
        Order entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
        
        return new OrderDTO(entity);
    }

    @Transactional
    public OrderDTO insert(OrderDTO dto) {
    	
        Order entity = new Order();
        
        entity.setEntryDate(dto.getEntryDate());
        entity.setUnitAmountProd(dto.getUnitAmountProd());
        entity.setQuantityProd(dto.getQuantityProd());
        entity.setUnitAmountSubProd(dto.getUnitAmountSubProd());
        entity.setQuantitySubProd(dto.getQuantitySubProd());
        entity.setExitDate(dto.getExitDate());
        entity.setTotalAmount(dto.getTotalAmount());
        entity.setPaidValue(dto.getPaidValue());
        entity.setIsPaid(dto.getIsPaid());
        entity.setEndOs(dto.getEndOs());
        entity.setStatus(dto.getStatus());
        entity.setSupplier(dto.getSupplier());
        entity.setProduct(dto.getProduct());

        if (dto.getSubProduct() != null && dto.getSubProduct().getId() != null) {
            entity.setSubProduct(dto.getSubProduct());
        }

        entity.calculateTotalAmount();        
        entity = repository.save(entity);
        
        return new OrderDTO(entity);
    }

    @Transactional
    public OrderDTO update(Long id, OrderDTO dto) {
        try {
            Order entity = repository.getReferenceById(id);
            
            entity.setEntryDate(dto.getEntryDate());
            entity.setUnitAmountProd(dto.getUnitAmountProd());
            entity.setQuantityProd(dto.getQuantityProd());
            entity.setUnitAmountSubProd(dto.getUnitAmountSubProd());
            entity.setQuantitySubProd(dto.getQuantitySubProd());
            entity.setExitDate(dto.getExitDate());
            entity.setTotalAmount(dto.getTotalAmount());
            entity.setPaidValue(dto.getPaidValue());
            entity.setIsPaid(dto.getIsPaid());
            entity.setEndOs(dto.getEndOs());
            entity.setStatus(dto.getStatus());
            entity.setSupplier(dto.getSupplier());
            entity.setProduct(dto.getProduct());

            if (dto.getSubProduct() != null && dto.getSubProduct().getId() != null) {
                entity.setSubProduct(dto.getSubProduct());
            } else {
                entity.setSubProduct(null); 
            }

            entity.calculateTotalAmount();
            entity = repository.save(entity);
            
            return new OrderDTO(entity);
            
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
}
