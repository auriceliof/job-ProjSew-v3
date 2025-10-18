package job.projsew.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import job.projsew.dto.RoleDTO;
import job.projsew.entities.Role;
import job.projsew.repositories.RoleRepository;
import job.projsew.services.exceptions.ResourceNotFoundException;

@Service
public class RoleService {

	@Autowired
	private RoleRepository repository;
	
	@Transactional(readOnly = true)
	public Page<RoleDTO> findAllPaged(Pageable pageable) {
		
		Page<Role> list = repository.findAll(pageable);
		
		return list.map(x -> new RoleDTO(x));
	}

	@Transactional(readOnly = true)
	public RoleDTO findById(Long id) {

		Optional<Role> obj = repository.findById(id);
		Role entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
		
		return new RoleDTO(entity);
	}

	@Transactional
	public RoleDTO insert(RoleDTO dto) {
		
		Role entity = new Role();
		
			entity.setAuthority(dto.getAuthority());
			
		entity = repository.save(entity);
		
		return new RoleDTO(entity);
	}

	@Transactional
	public RoleDTO update(Long id, RoleDTO dto) {
		try {
			Role entity = repository.getReferenceById(id);
			
			entity.setAuthority(dto.getAuthority());
			
			entity = repository.save(entity);
			
			return new RoleDTO(entity);			
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
