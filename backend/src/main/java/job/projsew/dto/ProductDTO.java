package job.projsew.dto;

import java.io.Serializable;
import java.util.Objects;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import job.projsew.entities.Product;
import job.projsew.entities.SubProduct;

public class ProductDTO implements Serializable{
	private static final long serialVersionUID = 1L;
	
	private Long id;
	
	@Size(min = 3, max = 20, message = "Deve ter entre 3 e 20 caracteres")
	@NotBlank(message = "Campo obrigatório")
	private String name;
	
	@Size(min = 5, max = 200, message = "Deve ter entre 5 e 200 caracteres")
	@NotBlank(message = "Campo obrigatório")
	private String description;
	
	private Boolean hasSubProd;
	private SubProduct subProduct;
	
	public ProductDTO() {
		
	}	

	public ProductDTO(Long id, String name, String description, 
			Boolean hasSubProd, SubProduct subProduct) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.hasSubProd = hasSubProd;
		this.subProduct = subProduct;
	}

	public ProductDTO(Product entity) {
		id = entity.getId();
		name = entity.getName();
		description = entity.getDescription();
		hasSubProd = entity.getHasSubProd();
		subProduct = entity.getSubProduct();
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

	public Boolean getHasSubProd() {
		return hasSubProd;
	}

	public void setHasSubProd(Boolean hasSubProd) {
		this.hasSubProd = hasSubProd;
	}

	public SubProduct getSubProduct() {
		return subProduct;
	}

	public void setSubProduct(SubProduct subProduct) {
		this.subProduct = subProduct;
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
		ProductDTO other = (ProductDTO) obj;
		return Objects.equals(id, other.id);
	}
}









