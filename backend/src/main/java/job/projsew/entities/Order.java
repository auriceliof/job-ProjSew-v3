package job.projsew.entities;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
@Table(name = "tb_order")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Order implements Serializable{
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private LocalDate entryDate;
	private Double unitAmountProd;
	private Integer quantityProd;
	private Double unitAmountSubProd;
	private Integer quantitySubProd;
	private LocalDate exitDate;	
	private Double totalAmount;
	private Double paidValue = 0.0;
	private Boolean isPaid = false;
	private LocalDate endOs;
	private Instant createdAt;
	private Instant updatedAt; 
		
	@ManyToOne
	@JoinColumn(name = "supplier_Id")
	private Supplier supplier;

	@ManyToOne
	@JoinColumn(name = "product_Id")
	private Product product;
	
	@ManyToOne
	@JoinColumn(name = "subProduct_Id", nullable = true )
	private SubProduct subProduct;

	@ManyToOne
	@JoinColumn(name = "status_Id")
	private Status status;
	
	public Order() {
		
	}

	public Order(Long id, LocalDate entryDate,
            Double unitAmountProd, Integer quantityProd,
            Double unitAmountSubProd, Integer quantitySubProd,
            LocalDate exitDate, Double totalAmount, Double paidValue, Boolean isPaid,
            LocalDate endOs, Supplier supplier, Product product, SubProduct subProduct, Status status) {

	   this.id = id;
	   this.entryDate = entryDate;
	   this.unitAmountProd = unitAmountProd;
	   this.quantityProd = quantityProd;
	   this.unitAmountSubProd = unitAmountSubProd;
	   this.quantitySubProd = quantitySubProd;
	   this.exitDate = exitDate;
	   this.totalAmount = totalAmount;
	   this.paidValue = paidValue != null ? paidValue : 0.0;
	   this.isPaid = isPaid != null ? isPaid : false;
	   this.endOs = endOs;
	   this.supplier = supplier;
	   this.product = product;
	   this.subProduct = subProduct;
	   this.status = status;
	   calculateTotalAmount();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDate getEntryDate() {
		return entryDate;
	}

	public void setEntryDate(LocalDate entryDate) {
		this.entryDate = entryDate;
	}

	public Double getUnitAmountProd() {
		return unitAmountProd;
	}

	public void setUnitAmountProd(Double unitAmountProd) {
		this.unitAmountProd = unitAmountProd;
		calculateTotalAmount();
	}

	public Integer getQuantityProd() {
		return quantityProd;
	}

	public void setQuantityProd(Integer quantityProd) {
		this.quantityProd = quantityProd;
		calculateTotalAmount();
	}
	
	public Double getUnitAmountSubProd() {
		return unitAmountSubProd;
	}

	public void setUnitAmountSubProd(Double unitAmountSubProd) {
		this.unitAmountSubProd = unitAmountSubProd;
		calculateTotalAmount();
	}

	public Integer getQuantitySubProd() {
		return quantitySubProd;
	}

	public void setQuantitySubProd(Integer quantitySubProd) {
		this.quantitySubProd = quantitySubProd;
		calculateTotalAmount();
	}


	public LocalDate getExitDate() {
		return exitDate;
	}

	public void setExitDate(LocalDate exitDate) {
		this.exitDate = exitDate;
	}

	public Double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public Double getPaidValue() {
		return paidValue;
	}

	public void setPaidValue(Double paidValue) {
		this.paidValue = paidValue != null ? paidValue : 0.0;
	}

	public Boolean getIsPaid() {
		return isPaid;
	}

	public void setIsPaid(Boolean isPaid) {
		this.isPaid = isPaid != null ? isPaid : false;
	}

	public LocalDate getEndOs() {
		return endOs;
	}

	public void setEndOs(LocalDate endOs) {
		this.endOs = endOs;
	}

	public Supplier getSupplier() {
		return supplier;
	}

	public void setSupplier(Supplier supplier) {
		this.supplier = supplier;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}
	
	public SubProduct getSubProduct() {
		return subProduct;
	}

	public void setSubProduct(SubProduct subProduct) {
		this.subProduct = subProduct;
	}


	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
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
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Order other = (Order) obj;
		return Objects.equals(id, other.id);
	}	
	
	public void calculateTotalAmount() {
	    if (unitAmountProd != null && quantityProd != null) {
	        this.totalAmount = unitAmountProd * quantityProd;

	        if (unitAmountSubProd != null && quantitySubProd != null) {
	            this.totalAmount += (unitAmountSubProd * quantitySubProd) * quantityProd; 
	        }
	    }
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
