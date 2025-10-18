package job.projsew.entities;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;

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
@Table(name = "tb_pay")
public class Pay implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate payDate;
    private Double payValue;
    private Instant createdAt;
	private Instant updatedAt; 
    
    @ManyToOne
    @JoinColumn(name = "order_Id")
    private Order order;
    
    public Pay() {
    }

    public Pay(Long id, LocalDate payDate, Double payValue, Order order) {
        this.id = id;
        this.payDate = payDate;
        this.payValue = payValue;
        this.order = order;
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
        Pay other = (Pay) obj;
        return Objects.equals(id, other.id);
    }

    public void calculateIsPaid() {
        if (order != null && order.getTotalAmount() != null) {
            Double paidValue = order.getPaidValue() != null ? order.getPaidValue() : 0.0;
            paidValue += this.payValue != null ? this.payValue : 0.0;
            order.setPaidValue(paidValue);
            
            if (paidValue >= order.getTotalAmount()) {
                order.setIsPaid(true);
            } else {
                order.setIsPaid(false);
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

















