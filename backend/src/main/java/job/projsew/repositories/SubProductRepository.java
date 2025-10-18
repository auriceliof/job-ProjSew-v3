package job.projsew.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import job.projsew.entities.SubProduct;

@Repository
public interface SubProductRepository extends JpaRepository<SubProduct, Long>{

}
