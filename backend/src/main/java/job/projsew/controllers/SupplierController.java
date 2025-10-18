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
import job.projsew.dto.SupplierDTO;
import job.projsew.services.SupplierService;

@RestController
@RequestMapping(value = "/suppliers")
public class SupplierController {
	
	@Autowired
	private SupplierService service;

	@Operation(summary = "Busca todos os fornecedores", method = "GET")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@GetMapping
	public	ResponseEntity<Page<SupplierDTO>> findAll(Pageable pageable) {
		
		Page<SupplierDTO> list = service.findAllPaged(pageable);
			
		return	ResponseEntity.ok().body(list);
	}
	
	
	@Operation(summary = "Busca o fornecedor por ID", method = "GET")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@GetMapping(value = "/{id}")
	public ResponseEntity<SupplierDTO> findById(@PathVariable Long id) {
		
		SupplierDTO dto = service.findById(id);
		
		return ResponseEntity.ok().body(dto);
	}
	
	@Operation(summary = "Cadastra novos fornecedores", method = "POST")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@PostMapping
	public ResponseEntity<SupplierDTO> insert(@Valid @RequestBody SupplierDTO dto) {
		
		dto = service.insert(dto);
		
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{/id}")
				.buildAndExpand(dto.getId()).toUri();
		
		return ResponseEntity.created(uri).body(dto);
	}
	
	@Operation(summary = "Atualiza fornecedores existente", method = "PUT")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@PutMapping(value = "/{id}")
	public ResponseEntity<SupplierDTO> update(@PathVariable Long id, @Valid @RequestBody SupplierDTO dto) {
		
		dto = service.update(id, dto);
		
		return ResponseEntity.ok().body(dto);
	}
	
	@Operation(summary = "Deleta fornecedor existente", method = "DELETE")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<SupplierDTO> delete(@PathVariable Long id) {
		
		service.delete(id);
		
		return ResponseEntity.noContent().build();		
	}
}