package job.projsew.dto;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import job.projsew.entities.User;



public class UserDTO implements Serializable{
	private static final long serialVersionUID = 1L;

	private Long id;
	
	@Size(min = 5, max = 30, message = "Deve ter entre 5 e 30 caracteres")
	@NotBlank(message = "Campo obrigatório")
	private String login;
	
	@Size(min = 5, max = 100, message = "Deve ter entre 5 e 100 caracteres")
	@NotBlank(message = "Campo obrigatório")
	private String name;
	
	@NotBlank(message = "Campo obrigatório")
	private String cpf;
	
	@Email(message = "Email inválido")
	private String email;
	
	Set<RoleDTO> roles = new HashSet<>();
	
	public UserDTO() {
		
	}

	public UserDTO(Long id, String login, String name, String cpf, String email) {
		this.id = id;
		this.login = login;
		this.name = name;
		this.cpf = cpf;
		this.email = email;
	}
	
	public UserDTO(User entity) {
		id = entity.getId();
		login = entity.getLogin();
		name = entity.getName();
		cpf = entity.getCpf();
		email = entity.getEmail();
		entity.getRoles().forEach(role -> this.roles.add(new RoleDTO(role)));
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Set<RoleDTO> getRoles() {
		return roles;
	}
}
