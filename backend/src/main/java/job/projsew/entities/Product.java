package job.projsew.entities;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_product")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Boolean hasSubProd = false;
    private Instant createdAt;
	private Instant updatedAt;    

    @ManyToOne
    @JoinColumn(name = "subProduct_id")
    private SubProduct subProduct;

    public Product() {
    }

    public Product(Long id, String name, String description, SubProduct subProduct) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.setSubProduct(subProduct);
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

    public SubProduct getSubProduct() {
        return subProduct;
    }

    public void setSubProduct(SubProduct subProduct) {
        this.subProduct = subProduct;
        updateHasSubProduct();
    }

    public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	@Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Product other = (Product) obj;
        return Objects.equals(id, other.id);
    }

    private void updateHasSubProduct() {
        this.hasSubProd = (this.subProduct != null);
    }
    
    @PrePersist
	public void prePersist() {
		createdAt = Instant.now();
	}

	@PreUpdate
	public void preUpdate() {
		updatedAt = Instant.now();
	}
}
