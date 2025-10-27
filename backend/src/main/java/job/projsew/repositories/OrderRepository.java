package job.projsew.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import job.projsew.entities.Order;
import job.projsew.entities.Product;
import job.projsew.entities.Status;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    @Query("""
           SELECT DISTINCT obj FROM Order obj
           WHERE (:status IS NULL OR obj.status = :status)
             AND (:product IS NULL OR obj.product = :product)
           """)
    Page<Order> find(Status status, Product product, Pageable pageable);

    // --- Método com lock pessimista para uso em operações críticas (ex.: registrar saída parcial)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.id = :id")
    Optional<Order> findByIdForUpdate(@Param("id") Long id);
}
