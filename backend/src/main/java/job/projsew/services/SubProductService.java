package job.projsew.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import job.projsew.dto.SubProductDTO;
import job.projsew.entities.SubProduct;
import job.projsew.repositories.SubProductRepository;
import job.projsew.services.exceptions.ResourceNotFoundException;

@Service
public class SubProductService {

    @Autowired
    private SubProductRepository subProductRepository;

    @Transactional(readOnly = true)
    public Page<SubProductDTO> findAllPaged(Pageable pageable) {
        
        Page<SubProduct> list = subProductRepository.findAll(pageable);
        
        return list.map(x -> new SubProductDTO(x));
    }

    @Transactional(readOnly = true)
    public SubProductDTO findById(Long id) {

        Optional<SubProduct> obj = subProductRepository.findById(id);
        SubProduct entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
        
        return new SubProductDTO(entity);
    }

    @Transactional
    public SubProductDTO insert(SubProductDTO dto) {
        
        SubProduct entity = new SubProduct();
        
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());        
             
        entity = subProductRepository.save(entity);
        
        return new SubProductDTO(entity);
    }

    @Transactional
    public SubProductDTO update(Long id, SubProductDTO dto) {
        try {
            SubProduct entity = subProductRepository.getReferenceById(id);
            
            entity.setName(dto.getName());
            entity.setDescription(dto.getDescription());
            
            entity = subProductRepository.save(entity);
            
            return new SubProductDTO(entity);            
        } catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException("ID not found: " + id);
        }
    }

    public void delete(Long id) {
        
        try {
            subProductRepository.deleteById(id);
        } catch (EmptyResultDataAccessException e) {
            throw new ResourceNotFoundException("ID not found: " + id);
        }
    }
}
