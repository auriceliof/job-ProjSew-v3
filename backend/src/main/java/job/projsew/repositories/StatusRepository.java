package job.projsew.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import job.projsew.entities.Status;

@Repository
public interface StatusRepository extends JpaRepository<Status, Long>{

}
