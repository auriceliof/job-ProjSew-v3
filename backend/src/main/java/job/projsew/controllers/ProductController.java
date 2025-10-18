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
import job.projsew.dto.ProductDTO;
import job.projsew.services.ProductService;

@RestController
@RequestMapping(value = "/products")
public class ProductController {
	
	@Autowired
	private ProductService service;

	@Operation(summary = "Busca todos os produtos", method = "GET")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@GetMapping
	public	ResponseEntity<Page<ProductDTO>> findAll(
			@RequestParam(value = "productId", defaultValue = "0" ) Long categoryId,
			@RequestParam(value = "name", defaultValue = "" ) Long name,
			Pageable pageable) {
		
		Page<ProductDTO> list = service.findAllPaged(pageable);
			
		return	ResponseEntity.ok().body(list);
	}	
	
	@Operation(summary = "Busca o produto por ID", method = "GET")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@GetMapping(value = "/{id}")
	public ResponseEntity<ProductDTO> findById(@PathVariable Long id) {
		
		ProductDTO dto = service.findById(id);
		
		return ResponseEntity.ok().body(dto);
	}
	
	@Operation(summary = "Cadastra novos produtos", method = "POST")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@PostMapping
	public ResponseEntity<ProductDTO> insert(@Valid @RequestBody ProductDTO dto) {
		
		dto = service.insert(dto);
		
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{/id}")
				.buildAndExpand(dto.getId()).toUri();
		
		return ResponseEntity.created(uri).body(dto);
	}
	
	@Operation(summary = "Atualiza produtos existente", method = "PUT")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
	@PutMapping(value = "/{id}")
	public ResponseEntity<ProductDTO> update(@PathVariable Long id, @Valid @RequestBody ProductDTO dto) {
		
		dto = service.update(id, dto);
		
		return ResponseEntity.ok().body(dto);
	}
	
	@Operation(summary = "Deleta produto existente", method = "DELETE")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<ProductDTO> delete(@PathVariable Long id) {
		
		service.delete(id);
		
		return ResponseEntity.noContent().build();		
	}
}
