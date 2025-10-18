package job.projsew.dto;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import job.projsew.entities.Supplier;

public class SupplierDTO implements Serializable{
	private static final long serialVersionUID = 1L;
	
	private Long id;
	
	@Size(min = 5, max = 100, message = "Deve ter entre 5 e 100 caracteres")
	@NotBlank(message = "Campo obrigatório")
	private String name;
	
	@NotBlank(message = "Campo obrigatório")
	private String contact;
	
	@NotBlank(message = "Campo obrigatório")
	private String cpf;
	
	@Size(min = 10, max = 200, message = "Deve ter entre 10 e 200 caracteres")
	@NotBlank(message = "Campo obrigatório")
	private String address;
	
	public SupplierDTO() {
		
	}
	
	public SupplierDTO(Long id, String name, String contact, String cpf, String address) {
		super();
		this.id = id;
		this.name = name;
		this.contact = contact;
		this.cpf = cpf;
		this.address = address;
	}



	public SupplierDTO(Supplier entity) {
		id = entity.getId();
		name = entity.getName();
		cpf = entity.getCpf();
		contact = entity.getContact();
		address = entity.getAddress();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

}









