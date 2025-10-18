package job.projsew.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;
import job.projsew.dto.StatusDTO;
import job.projsew.entities.Status;
import job.projsew.repositories.StatusRepository;
import job.projsew.services.exceptions.ResourceNotFoundException;

@Service
public class StatusService {

	@Autowired
	private StatusRepository repository;
	
	@Transactional(readOnly = true)
	public Page<StatusDTO> findAllPaged(Pageable pageable) {
		
		Page<Status> list = repository.findAll(pageable);
		
		return list.map(x -> new StatusDTO(x));
	}

	@Transactional(readOnly = true)
	public StatusDTO findById(Long id) {

		Optional<Status> obj = repository.findById(id);
		Status entity = obj.orElseThrow(() 
				-> new ResourceNotFoundException("Entity not found"));
		
		return new StatusDTO(entity);
	}

	@Transactional
	public StatusDTO insert(StatusDTO dto) {
		
		Status entity = new Status();
		
			entity.setName(dto.getName());
			
		entity = repository.save(entity);
		
		return new StatusDTO(entity);
	}

	@Transactional
	public StatusDTO update(Long id, StatusDTO dto) {
		try {
			Status entity = repository.getReferenceById(id);
			
			entity.setName(dto.getName());
			
			entity = repository.save(entity);
			
			return new StatusDTO(entity);			
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



























