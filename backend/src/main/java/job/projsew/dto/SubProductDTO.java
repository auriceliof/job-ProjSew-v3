package job.projsew.dto;

import java.io.Serializable;
import java.util.Objects;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import job.projsew.entities.SubProduct;

public class SubProductDTO implements Serializable{
	private static final long serialVersionUID = 1L;
	
	private Long id;
	
	@Size(min = 5, max = 100, message = "Deve ter entre 5 e 100 caracteres")
	@NotBlank(message = "Campo obrigatório")
	private String name;
	
	@Size(min = 10, max = 200, message = "Deve ter entre 10 e 200 caracteres")
	@NotBlank(message = "Campo obrigatório")
	private String description;
	
	public SubProductDTO() {		
	}

	public SubProductDTO(Long id, String name, String description) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
	}

	public SubProductDTO(SubProduct entity) {
		id = entity.getId();
		name = entity.getName();
		description = entity.getDescription();		
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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
		SubProductDTO other = (SubProductDTO) obj;
		return Objects.equals(id, other.id);
	}
}
