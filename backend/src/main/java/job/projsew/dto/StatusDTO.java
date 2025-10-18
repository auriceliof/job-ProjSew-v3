package job.projsew.dto;

import java.io.Serializable;
import java.util.Objects;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import job.projsew.entities.Status;

public class StatusDTO implements Serializable{
	private static final long serialVersionUID = 1L;

	private Long id;
	
	@Size(min = 5, max = 20, message = "Deve ter entre 5 e 20 caracteres")
	@NotBlank(message = "Campo obrigatório")
	private String name;
	
	public StatusDTO() {	
	}

	public StatusDTO(Long id, String name) {
		this.id = id;
		this.name = name;
	}
	
	public StatusDTO(Status entity) {
		id = entity.getId();
		name = entity.getName();
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

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		StatusDTO other = (StatusDTO) obj;
		return Objects.equals(id, other.id);
	}
}
	