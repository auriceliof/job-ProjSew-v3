package job.projsew.services.validation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import job.projsew.controllers.exceptions.FieldMessage;
import job.projsew.dto.UserInsertDTO;
import job.projsew.entities.User;
import job.projsew.repositories.UserRepository;

public class UserInsertValidator implements ConstraintValidator<UserInsertValid, UserInsertDTO> {
	
	@Autowired
	private UserRepository repository;
	
	@Override
	public void initialize(UserInsertValid ann) {
	}

	@Override
	public boolean isValid(UserInsertDTO dto, ConstraintValidatorContext context) {
		
		List<FieldMessage> list = new ArrayList<>();
		
		User login = repository.findByLogin(dto.getLogin());
		if (login != null) {
			list.add(new FieldMessage("login", "Login já existe"));
		}
		
/*		User email = repository.findByEmail(dto.getEmail());
		if (email != null) {
			list.add(new FieldMessage("email", "Email já existe"));
		}
*/				
		for (FieldMessage e : list) {
			context.disableDefaultConstraintViolation();
			context.buildConstraintViolationWithTemplate(e.getMessage()).addPropertyNode(e.getFieldName())
					.addConstraintViolation();
		}
		return list.isEmpty();
	}
}