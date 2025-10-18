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
import job.projsew.dto.UserDTO;
import job.projsew.dto.UserInsertDTO;
import job.projsew.dto.UserUpdateDTO;
import job.projsew.services.UserService;

@RestController
@RequestMapping(value = "/users")
public class UserController {
	
	@Autowired
	private UserService service;
	
	@Operation(summary = "Busca todos os usuários", method = "GET")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@GetMapping
	public	ResponseEntity<Page<UserDTO>> findAll(Pageable pageable) {
		
		Page<UserDTO> list = service.findAllPaged(pageable);
			
		return	ResponseEntity.ok().body(list);
	}
	
	@Operation(summary = "Busca o usuários por ID", method = "GET")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@GetMapping(value = "/{id}")
	public ResponseEntity<UserDTO> findById(@PathVariable Long id) {
		
		UserDTO dto = service.findById(id);
		
		return ResponseEntity.ok().body(dto);
	}
	
	@Operation(summary = "Cadastra novos usuários", method = "POST")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@PostMapping
	public ResponseEntity<UserDTO> insert(@Valid @RequestBody UserInsertDTO dto) {
		
		UserDTO newDto = service.insert(dto);
		
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{/id}")
				.buildAndExpand(newDto.getId()).toUri();
		
		return ResponseEntity.created(uri).body(newDto);
	}
	
	@Operation(summary = "Atualiza usuários existente", method = "PUT")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@PutMapping(value = "/{id}")
	public ResponseEntity<UserDTO> update(@PathVariable Long id, @Valid @RequestBody UserUpdateDTO dto) {
		
		UserDTO newDto = service.update(id, dto);
		
		return ResponseEntity.ok().body(newDto);
	}
	
	@Operation(summary = "Deleta usuários existente", method = "DELETE")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<UserDTO> delete(@PathVariable Long id) {
		
		service.delete(id);
		
		return ResponseEntity.noContent().build();		
	}
	
	@Operation(summary = "Busca o usuário logado", method = "GET")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@GetMapping(value = "/me")
	public ResponseEntity<UserDTO> findMe() {
		
		UserDTO dto = service.findMe();
		
		return ResponseEntity.ok().body(dto);
	}
}
