package job.projsew.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import job.projsew.entities.Order;
import job.projsew.entities.Product;
import job.projsew.entities.Status;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
	
	@Query("SELECT DISTINCT obj FROM Order obj WHERE "
			+ "(:status IS NULL OR obj.status = :status) "
			+ "AND (:product IS NULL OR obj.product = :product) ")
	Page<Order> find(Status status, Product product, Pageable pageable);
}
