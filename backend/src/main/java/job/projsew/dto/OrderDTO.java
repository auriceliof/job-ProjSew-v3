package job.projsew.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import job.projsew.entities.Order;
import job.projsew.entities.Product;
import job.projsew.entities.Status;
import job.projsew.entities.SubProduct;
import job.projsew.entities.Supplier;

public class OrderDTO implements Serializable{
	private static final long serialVersionUID = 1L;
	
	private Long id;
	
	@PastOrPresent(message = "A data não pode ser futura")
	private LocalDate entryDate;
	
	@Positive(message = "O valor deve ser positivo")
	private Double unitAmountProd;
	
	@Positive(message = "O valor deve ser positivo")
	private Integer quantityProd;
	
	private Double unitAmountSubProd;
	private Integer quantitySubProd;
	
	@PastOrPresent(message = "A data não pode ser futura")
	private LocalDate exitDate;	
	private Double totalAmount;
	private Double paidValue;
	private Boolean isPaid;
	private LocalDate endOs;
	
	private Status status;
	private Supplier supplier;
	private Product product;
	private SubProduct subProduct;
	
	public OrderDTO() {	
	}

	public OrderDTO(Long id, LocalDate entryDate, Double unitAmountProd, Integer quantityProd, Double unitAmountSubProd, 
			Integer quantitySubProd, LocalDate exitDate, Double totalAmount, Double paidValue, Boolean isPaid, 
			LocalDate endOs, Status status, Supplier supplier, Product product, SubProduct subProduct) {
		this.id = id;
		this.entryDate = entryDate;
		this.unitAmountProd = unitAmountProd;
		this.quantityProd = quantityProd;
		this.unitAmountSubProd = unitAmountSubProd;
		this.quantitySubProd = quantitySubProd;
		this.exitDate = exitDate;
		this.totalAmount = totalAmount;
		this.paidValue = paidValue;
		this.isPaid = isPaid;
		this.endOs = endOs;
		this.status = status;
		this.supplier = supplier;
		this.product = product;
		this.subProduct = subProduct;
	}

	public OrderDTO(Order entity) {
		id = entity.getId();
		entryDate = entity.getEntryDate();
		unitAmountProd = entity.getUnitAmountProd();
		quantityProd = entity.getQuantityProd();
		unitAmountSubProd = entity.getUnitAmountSubProd();
		quantitySubProd = entity.getQuantitySubProd();
		exitDate = entity.getExitDate();
		totalAmount = entity.getTotalAmount();
		paidValue = entity.getPaidValue();
		isPaid = entity.getIsPaid();
		endOs = entity.getEndOs();
		status = entity.getStatus();
		supplier = entity.getSupplier();
		product = entity.getProduct();
		subProduct = entity.getSubProduct();
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
	}

	public Integer getQuantityProd() {
		return quantityProd;
	}

	public void setQuantityProd(Integer quantityProd) {
		this.quantityProd = quantityProd;
	}

	public Double getUnitAmountSubProd() {
		return unitAmountSubProd;
	}

	public void setUnitAmountSubProd(Double unitAmountSubProd) {
		this.unitAmountSubProd = unitAmountSubProd;
	}

	public Integer getQuantitySubProd() {
		return quantitySubProd;
	}

	public void setQuantitySubProd(Integer quantitySubProd) {
		this.quantitySubProd = quantitySubProd;
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
		this.paidValue = paidValue;
	}

	public Boolean getIsPaid() {
		return isPaid;
	}

	public void setIsPaid(Boolean isPaid) {
		this.isPaid = isPaid;
	}

	public LocalDate getEndOs() {
		return endOs;
	}

	public void setEndOs(LocalDate endOs) {
		this.endOs = endOs;
	}
	
	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
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
		OrderDTO other = (OrderDTO) obj;
		return Objects.equals(id, other.id);
	}
}
