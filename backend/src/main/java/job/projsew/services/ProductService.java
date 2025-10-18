package job.projsew.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import job.projsew.dto.ProductDTO;
import job.projsew.entities.Product;
import job.projsew.repositories.ProductRepository;
import job.projsew.services.exceptions.ResourceNotFoundException;

@Service
public class ProductService {

	@Autowired
	private ProductRepository productRepository;
	
	@Transactional(readOnly = true)
	public Page<ProductDTO> findAllPaged(Pageable pageable) {
		
		Page<Product> list = productRepository.findAll(pageable);
		
		return list.map(x -> new ProductDTO(x));
	}

	@Transactional(readOnly = true)
	public ProductDTO findById(Long id) {

		Optional<Product> obj = productRepository.findById(id);
		Product entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
		
		return new ProductDTO(entity);
	}

	@Transactional
	public ProductDTO insert(ProductDTO dto) {
		
		Product entity = new Product();
		
			entity.setName(dto.getName());
			entity.setDescription(dto.getDescription());
			entity.setSubProduct(dto.getSubProduct());
			
		entity = productRepository.save(entity);
		
		return new ProductDTO(entity);
	}

	@Transactional
	public ProductDTO update(Long id, ProductDTO dto) {
		try {
			Product entity = productRepository.getReferenceById(id);
			
			entity.setName(dto.getName());
			entity.setDescription(dto.getDescription());
			entity.setSubProduct(dto.getSubProduct());
			
			entity = productRepository.save(entity);
			
			return new ProductDTO(entity);			
		}
		catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("ID not found: " + id);
		}
	}

	public void delete(Long id) {
		
		try {
			productRepository.deleteById(id);
		}
		catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException("ID not found: " + id);
		}
	}
}



























