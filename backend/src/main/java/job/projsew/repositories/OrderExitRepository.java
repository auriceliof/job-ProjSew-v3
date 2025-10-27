package job.projsew.repositories;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import job.projsew.entities.OrderExit;

@Repository
public interface OrderExitRepository extends JpaRepository<OrderExit, Long> {

    // Última data de saída (MAX) do pedido
    @Query("select max(e.exitDate) from OrderExit e where e.order.id = :orderId")
    Optional<LocalDate> findLatestExitDate(@Param("orderId") Long orderId);

    // (OPCIONAL incluído) Soma total de quantidades de saída para um pedido
    @Query("select coalesce(sum(e.quantityProd), 0) from OrderExit e where e.order.id = :orderId")
    Integer sumQuantityByOrderId(@Param("orderId") Long orderId);

    // (OPCIONAL incluído) Soma de quantidades de saída EXCLUINDO uma saída específica (útil no update)
    @Query("""
           select coalesce(sum(e.quantityProd), 0)
           from OrderExit e
           where e.order.id = :orderId and e.id <> :exitId
           """)
    Integer sumQuantityByOrderIdExcludingExit(@Param("orderId") Long orderId, @Param("exitId") Long exitId);
}
