package job.projsew.dto;

import java.time.LocalDate;
import java.util.Objects;

import jakarta.validation.constraints.PastOrPresent;
import job.projsew.entities.Order;
import job.projsew.entities.OrderExit;

public class OrderExitDTO {

		private Long id;
		
		@PastOrPresent(message = "A data não pode ser futura")
	 	private LocalDate exitDate;
		
	 	private Integer quantityProd;
	 	
	 	private Order order;
	 	
	 	public OrderExitDTO() {
	 		
	 	}

		public OrderExitDTO(Long id, LocalDate exitDate,
				Integer quantityProd, Order order) {
			this.id = id;
			this.exitDate = exitDate;
			this.quantityProd = quantityProd;
			this.order = order;
		}
		
		public OrderExitDTO(OrderExit entity) {
			id = entity.getId();
			exitDate = entity.getExitDate();
			quantityProd = entity.getQuantityProd();
			order = entity.getOrder();
		}

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public LocalDate getExitDate() {
			return exitDate;
		}

		public void setExitDate(LocalDate exitDate) {
			this.exitDate = exitDate;
		}

		public Integer getQuantityProd() {
			return quantityProd;
		}

		public void setQuantityProd(Integer quantityProd) {
			this.quantityProd = quantityProd;
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
			OrderExitDTO other = (OrderExitDTO) obj;
			return Objects.equals(id, other.id);
		}		
	   
}

