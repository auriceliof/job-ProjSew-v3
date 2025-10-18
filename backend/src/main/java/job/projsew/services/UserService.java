package job.projsew.services;

import java.util.List;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import job.projsew.dto.RoleDTO;
import job.projsew.dto.UserDTO;
import job.projsew.dto.UserInsertDTO;
import job.projsew.dto.UserUpdateDTO;
import job.projsew.entities.Role;
import job.projsew.entities.User;
import job.projsew.projections.UserDetailsProjection;
import job.projsew.repositories.RoleRepository;
import job.projsew.repositories.UserRepository;
import job.projsew.services.exceptions.ResourceNotFoundException;

@Service
public class UserService implements UserDetailsService {

	private final UserRepository repository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository repository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
		this.repository = repository;
		this.roleRepository = roleRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional(readOnly = true)
	public Page<UserDTO> findAllPaged(Pageable pageable) {
		Page<User> users = repository.findAll(pageable);
		return users.map(UserDTO::new);
	}

	@Transactional(readOnly = true)
	public UserDTO findById(Long id) {
		User user = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
		return new UserDTO(user);
	}

	@Transactional
	public UserDTO insert(UserInsertDTO dto) {
		User entity = new User();
		copyDtoToEntity(dto, entity);
		entity.setPassword(passwordEncoder.encode(dto.getPassword()));
		entity = repository.save(entity);
		return new UserDTO(entity);
	}

	@Transactional
	public UserDTO update(Long id, UserUpdateDTO dto) {
		try {
			User entity = repository.getReferenceById(id);
			copyDtoToEntity(dto, entity);
			entity.setPassword(passwordEncoder.encode(dto.getPassword()));
			entity = repository.save(entity);
			return new UserDTO(entity);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("User not found with ID: " + id);
		}
	}

	public void delete(Long id) {
		try {
			repository.deleteById(id);
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException("User not found with ID: " + id);
		}
	}

	private void copyDtoToEntity(UserDTO dto, User entity) {
		entity.setLogin(dto.getLogin());
		entity.setName(dto.getName());
		entity.setCpf(dto.getCpf());
		entity.setEmail(dto.getEmail());

		entity.getRoles().clear();
		for (RoleDTO roleDto : dto.getRoles()) {
			Role role = roleRepository.findById(roleDto.getId())
					.orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + roleDto.getId()));
			entity.getRoles().add(role);
		}
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		List<UserDetailsProjection> result = repository.searchUserAndRolesByLogin(username);
		if (result.size() == 0) {
			throw new UsernameNotFoundException("User not found");
		}

		User user = new User();
		user.setLogin(username);
		user.setPassword(result.get(0).getPassword());

		for (UserDetailsProjection projection : result) {
			user.addRole(new Role(projection.getRoleId(), projection.getAuthority()));
		}

		return user;
	}
	
	protected User authenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UsernameNotFoundException("Usuário não autenticado");
        }

        Object principal = authentication.getPrincipal();
        String username;

        if (principal instanceof Jwt jwt) {
            username = jwt.getClaimAsString("username");
            if (username == null) {
                username = jwt.getSubject();
            }
        }
        else if (principal instanceof UserDetails userDetails) {
            username = userDetails.getUsername();
        }
        else {
            throw new UsernameNotFoundException("Principal inesperado: " + principal.getClass());
        }

        User user = repository.findByLogin(username);
        if (user == null) {
            throw new UsernameNotFoundException("Usuário não encontrado no banco: " + username);
        }
        return user;
    }
   
    @Transactional(readOnly = true)
    public UserDTO findMe() {
        User entity = authenticated();
        return new UserDTO(entity);
    }
}
	
