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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import job.projsew.dto.OrderDTO;
import job.projsew.services.OrderService;

@RestController
@RequestMapping(value = "/orders")
public class OrderController {
	
	@Autowired
	private OrderService service;

	@Operation(summary = "Busca todas as Ordens", method = "GET")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@GetMapping
	public	ResponseEntity<Page<OrderDTO>> findAll(
			@RequestParam(value = "statusId", defaultValue = "0" ) Long statusId,
			@RequestParam(value = "productId", defaultValue = "0" ) Long productId,
			Pageable pageable) {
		
		Page<OrderDTO> list = service.findAllPaged(statusId, productId, pageable);
			
		return	ResponseEntity.ok().body(list);
	}
	
	@Operation(summary = "Busca a Ordem por ID", method = "GET")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@GetMapping(value = "/{id}")
	public ResponseEntity<OrderDTO> findById(@PathVariable Long id) {
		
		OrderDTO dto = service.findById(id);
		
		return ResponseEntity.ok().body(dto);
	}
	
	@Operation(summary = "Cadastra novas Ordens", method = "POST")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping
	public ResponseEntity<OrderDTO> insert(@Valid @RequestBody OrderDTO dto) {
		
		dto = service.insert(dto);
		
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{/id}")
				.buildAndExpand(dto.getId()).toUri();
		
		return ResponseEntity.created(uri).body(dto);
	}
	
	@Operation(summary = "Atualiza um Ordem existente", method = "PUT")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PutMapping(value = "/{id}")
	public ResponseEntity<OrderDTO> update(@PathVariable Long id, @Valid @RequestBody OrderDTO dto) {
		
		dto = service.update(id, dto);
		
		return ResponseEntity.ok().body(dto);
	}
	
	@Operation(summary = "Deleta uma Ordem existente", method = "DELETE")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<OrderDTO> delete(@PathVariable Long id) {
		
		service.delete(id);
		
		return ResponseEntity.noContent().build();		
	}
}
