package job.projsew.repositories;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import job.projsew.entities.OrderExit;

@Repository
public interface OrderExitRepository extends JpaRepository<OrderExit, Long> {

    // 🔹 Retorna a última data de saída (MAX) para uma ordem específica
    @Query("SELECT MAX(e.exitDate) FROM OrderExit e WHERE e.order.id = :orderId")
    Optional<LocalDate> findLatestExitDate(@Param("orderId") Long orderId);

    // 🔹 Soma total de quantidades de saída para um pedido específico
    @Query("SELECT COALESCE(SUM(e.quantityProd), 0) FROM OrderExit e WHERE e.order.id = :orderId")
    Integer sumQuantityByOrderId(@Param("orderId") Long orderId);

    // 🔹 Soma total de quantidades de saída excluindo uma saída específica (usado em updates)
    @Query("""
           SELECT COALESCE(SUM(e.quantityProd), 0)
           FROM OrderExit e
           WHERE e.order.id = :orderId AND e.id <> :exitId
           """)
    Integer sumQuantityByOrderIdExcludingExit(
        @Param("orderId") Long orderId,
        @Param("exitId") Long exitId
    );

    // 🔹 Busca paginada de saídas com filtro opcional por orderId
    @Query("""
           SELECT e
           FROM OrderExit e
           WHERE (:orderId IS NULL OR e.order.id = :orderId)
           """)
    Page<OrderExit> findAllByOrderId(
        @Param("orderId") Long orderId,
        Pageable pageable
    );
}
