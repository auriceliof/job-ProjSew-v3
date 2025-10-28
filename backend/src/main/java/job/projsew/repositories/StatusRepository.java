package job.projsew.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import job.projsew.entities.Status;

@Repository
public interface StatusRepository extends JpaRepository<Status, Long> {
    Optional<Status> findByNameIgnoreCase(String name);
}
