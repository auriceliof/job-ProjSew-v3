package job.projsew.entities;

import java.time.Instant;
import java.util.Collection;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@SuppressWarnings("serial")
@Entity
@Table(name = "tb_user")
public class User implements UserDetails {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique = true)
	private String login;
	private String password;
	private String name;
	
	@Column(unique = true)
	private String cpf;
	
	@Column(unique = true)
	private String email;
	
	private Instant createdAt;
	private Instant updatedAt;  
	
	@ManyToMany
	@JoinTable(name = "tb_user_role",
		joinColumns = @JoinColumn(name = "user_id"),
		inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> roles = new HashSet<>();
	
	public User() {
		
	}

	public User(Long id, String login, String password, 
			String name, String cpf, String email) {
		this.id = id;
		this.login = login;
		this.password = password;
		this.name = name;
		this.cpf = cpf;
		this.email = email;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}

	public Set<Role> getRoles() {
		return roles;
	}
	
	public void addRole(Role role) {
		roles.add(role);
	}
	
	public boolean hasRole(String roleName) {
		for (Role role : roles) {
			if (role.getAuthority().equals(roleName)) {
				return true;
			}
		}
		return false;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		User other = (User) obj;
		return Objects.equals(id, other.id);
	}
	
	@PrePersist
	public void prePersist() {
		createdAt = Instant.now();
	}

	@PreUpdate
	public void preUpdate() {
		updatedAt = Instant.now();
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return roles;
	}

	@Override
	public String getUsername() {
		return login;
	}
}
