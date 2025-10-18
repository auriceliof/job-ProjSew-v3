package job.projsew.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import job.projsew.entities.Order;
import job.projsew.entities.Pay;

public class PayDTO implements Serializable{
	private static final long serialVersionUID = 1L;

	private Long id;
	
	@PastOrPresent(message = "A data não pode ser futura")
	private LocalDate payDate;
	
	@Positive(message = "O valor deve ser positivo")
	private Double payValue;
	
	private Order order;	
	
	public PayDTO() {	
	}
	
	public PayDTO(Long id, LocalDate payDate, Double payValue, Order order) {
		this.id = id;
		this.payDate = payDate;
		this.payValue = payValue;
		this.order = order;
	}

	public PayDTO(Pay entity) {
		id = entity.getId();
		payDate = entity.getPayDate();
		payValue = entity.getPayValue();
		order = entity.getOrder();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDate getPayDate() {
		return payDate;
	}

	public void setPayDate(LocalDate payDate) {
		this.payDate = payDate;
	}

	public Double getPayValue() {
		return payValue;
	}

	public void setPayValue(Double payValue) {
		this.payValue = payValue;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
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
		PayDTO other = (PayDTO) obj;
		return Objects.equals(id, other.id);
	}
}
