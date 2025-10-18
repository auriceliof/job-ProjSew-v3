package job.projsew.controllers;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import job.projsew.dto.StatusDTO;
import job.projsew.services.StatusService;

@RestController
@RequestMapping(value = "/status")
public class StatusController {
	
	@Autowired
	private StatusService service;

	@Operation(summary = "Busca todos os status", method = "GET")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@GetMapping
	public	ResponseEntity<Page<StatusDTO>> findAll(Pageable pageable) {
		
		Page<StatusDTO> list = service.findAllPaged(pageable);
			
		return	ResponseEntity.ok().body(list);
	}
	
	@Operation(summary = "Busca o status por ID", method = "GET")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@GetMapping(value = "/{id}")
	public ResponseEntity<StatusDTO> findById(@PathVariable Long id) {
		
		StatusDTO dto = service.findById(id);
		
		return ResponseEntity.ok().body(dto);
	}
	
	@Operation(summary = "Cadastra novos status", method = "POST")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping
	public ResponseEntity<StatusDTO> insert(@Valid @RequestBody StatusDTO dto) {
		
		dto = service.insert(dto);
		
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{/id}")
				.buildAndExpand(dto.getId()).toUri();
		
		return ResponseEntity.created(uri).body(dto);
	}
	
	@Operation(summary = "Atualiza status existente", method = "PUT")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PutMapping(value = "/{id}")
	public ResponseEntity<StatusDTO> update(@PathVariable Long id, @Valid @RequestBody StatusDTO dto) {
		
		dto = service.update(id, dto);
		
		return ResponseEntity.ok().body(dto);
	}
	
	@Operation(summary = "Deleta status existente", method = "DELETE")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<StatusDTO> delete(@PathVariable Long id) {
		
		service.delete(id);
		
		return ResponseEntity.noContent().build();		
	}
}
