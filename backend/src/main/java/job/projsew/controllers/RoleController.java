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
import job.projsew.dto.RoleDTO;
import job.projsew.services.RoleService;

@RestController
@RequestMapping(value = "/roles")
public class RoleController {
	
	@Autowired
	private RoleService service;
	
	@Operation(summary = "Busca todos os Roles", method = "GET")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping
	public	ResponseEntity<Page<RoleDTO>> findAll(Pageable pageable) {
		
		Page<RoleDTO> list = service.findAllPaged(pageable);
			
		return	ResponseEntity.ok().body(list);
	}
	
	@Operation(summary = "Busca o Roles por ID", method = "GET")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(value = "/{id}")
	public ResponseEntity<RoleDTO> findById(@PathVariable Long id) {
		
		RoleDTO dto = service.findById(id);
		
		return ResponseEntity.ok().body(dto);
	}
	
	@Operation(summary = "Cadastra novos Roles", method = "POST")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping
	public ResponseEntity<RoleDTO> insert(@Valid @RequestBody RoleDTO dto) {
		
		RoleDTO newDto = service.insert(dto);
		
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{/id}")
				.buildAndExpand(newDto.getId()).toUri();
		
		return ResponseEntity.created(uri).body(newDto);
	}
	
	@Operation(summary = "Atualiza Roles existente", method = "PUT")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PutMapping(value = "/{id}")
	public ResponseEntity<RoleDTO> update(@PathVariable Long id, @Valid @RequestBody RoleDTO dto) {
		
		RoleDTO newDto = service.update(id, dto);
		
		return ResponseEntity.ok().body(newDto);
	}
	
	@Operation(summary = "Deleta Roles existente", method = "DELETE")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<RoleDTO> delete(@PathVariable Long id) {
		
		service.delete(id);
		
		return ResponseEntity.noContent().build();		
	}
}