package job.projsew.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import job.projsew.dto.SupplierDTO;
import job.projsew.entities.Supplier;
import job.projsew.repositories.SupplierRepository;
import job.projsew.services.exceptions.ResourceNotFoundException;

@Service
public class SupplierService {

	@Autowired
	private SupplierRepository repository;
	
	@Transactional(readOnly = true)
	public Page<SupplierDTO> findAllPaged(Pageable pageable) {
		
		Page<Supplier> list = repository.findAll(pageable);
		
		return list.map(x -> new SupplierDTO(x));
	}

	@Transactional(readOnly = true)
	public SupplierDTO findById(Long id) {

		Optional<Supplier> obj = repository.findById(id);
		Supplier entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
		
		return new SupplierDTO(entity);
	}

	@Transactional
	public SupplierDTO insert(SupplierDTO dto) {
		
		Supplier entity = new Supplier();
		
			entity.setName(dto.getName());
			entity.setCpf(dto.getCpf());
			entity.setContact(dto.getContact());
			entity.setAddress(dto.getAddress());
			
		entity = repository.save(entity);
		
		return new SupplierDTO(entity);
	}

	@Transactional
	public SupplierDTO update(Long id, SupplierDTO dto) {
		try {
			Supplier entity = repository.getReferenceById(id);
			
			entity.setName(dto.getName());
			entity.setCpf(dto.getCpf());
			entity.setContact(dto.getContact());
			entity.setAddress(dto.getAddress());
			
			entity = repository.save(entity);
			
			return new SupplierDTO(entity);			
		}
		
		catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("ID not found: " + id);
		}
	}

	public void delete(Long id) {
		
		try {
			repository.deleteById(id);
		}
		catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException("ID not found: " + id);
		}
	}
}



























