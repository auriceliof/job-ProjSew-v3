package job.projsew.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import job.projsew.entities.Supplier;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long>{

}
