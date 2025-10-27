package job.projsew.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import job.projsew.entities.OrderExit;

@Repository
public interface OrderExitRepository extends JpaRepository<OrderExit, Long> {
	    
}
