import './styles.css';
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { IMaskInput } from "react-imask";
import ButtonPrimary from "../../../components/ButtonPrimary";
import ButtonSecondary from "../../../components/ButtonSecondary";
import * as userService from "../../../services/user-service";
import { UserDTO } from "../../../models/userDto";
import { RoleDTO } from "../../../models/roleDto";

export default function FormUser() {
  const navigate = useNavigate();
  const params = useParams();
  const isEditing = params.userId !== "create";

  const [id, setId] = useState<string>("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [availableRoles, setAvailableRoles] = useState<RoleDTO[]>([]);

  const [errorMessage, setErrorMessage] = useState({
    login: "",
    password: "",
    name: "",
    cpf: "",
    email: "",
  });

  const rolesLoaded = useRef(false);

  useEffect(() => {
    if (!rolesLoaded.current) {
      userService.findAllRoles().then((response) => {
        setAvailableRoles(response.data.content || []);
        rolesLoaded.current = true;
      });
    }

    if (isEditing) {
      userService.findById(Number(params.userId)).then((response) => {
        const user = response.data as UserDTO;
        setId(user.id !== undefined && user.id !== null ? user.id.toString() : "");
        setLogin(user.login || "");
        setPassword(user.password || "");
        setName(user.name || "");
        setCpf(user.cpf || "");
        setEmail(user.email || "");
        setSelectedRoles(user.roles?.map((role) => role.id) || []);
      });
    }
  }, [isEditing, params.userId]);

  function handleRoleChange(roleId: number) {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  }

  function handleLoginChange(value: string) {
    setLogin(value);

    if (!value.trim()) {
      setErrorMessage((prev) => ({ ...prev, login: "Favor informar o login" }));
    } else if (value.trim().length < 5 || value.trim().length > 15) {
      setErrorMessage((prev) => ({
        ...prev,
        login: "O login deve ter entre 5 e 15 caracteres",
      }));
    } else {
      setErrorMessage((prev) => ({ ...prev, login: "" }));
    }
  }

  function handlePasswordChange(value: string) {
    setPassword(value);

    if (!value.trim()) {
      setErrorMessage((prev) => ({ ...prev, password: "Favor informar a senha" }));
    } else if (value.trim().length < 5 || value.trim().length > 15) {
      setErrorMessage((prev) => ({
        ...prev,
        password: "A senha deve ter entre 5 e 15 caracteres",
      }));
    } else {
      setErrorMessage((prev) => ({ ...prev, password: "" }));
    }
  }

   function handleNameChange(value: string) {
    setName(value);

    if (!value.trim()) {
      setErrorMessage((prev) => ({ ...prev, name: "Favor informar o nome completo" }));
    } else if (value.length < 5) {
      setErrorMessage((prev) => ({
        ...prev,
        name: "O nome deve ter no mínimo 5 caracteres",
      }));
    } else {
      setErrorMessage((prev) => ({ ...prev, name: "" }));
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let hasError = false;

    if (errorMessage.login) hasError = true;
    if (errorMessage.password) hasError = true;
    if (errorMessage.name) hasError = true;

    if (cpf) {
      if (/^(([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}))$/.test(cpf)) {
        setErrorMessage((prev) => ({ ...prev, cpf: "" }));
      } else {
        setErrorMessage((prev) => ({ ...prev, cpf: "Favor informar um CPF válido" }));
        hasError = true;
      }
    }

    if (email) {
      if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        setErrorMessage((prev) => ({ ...prev, email: "" }));
      } else {
        setErrorMessage((prev) => ({ ...prev, email: "Favor informar um email válido" }));
        hasError = true;
      }
    }

    if (hasError) return;

    const userData: UserDTO = {
      id: id ? Number(id) : 0,
      login,
      password,
      name,
      cpf,
      email,
      roles: selectedRoles.map((roleId) => ({ id: roleId } as RoleDTO)),
    };

    const request = isEditing
      ? userService.updateRequest(userData)
      : userService.insertRequest(userData);

    request.then(() => navigate("/listingUsers"));
  }

  return (
    <main id="proj-user-form-section" className="proj-container">
      <div className="proj-user-form-container">
        <form className="proj-user-card proj-user-form" onSubmit={handleSubmit}>
          {isEditing && (
            <div className="proj-user-id">
              <h5>Id:</h5>
              <input
                type="text"
                value={id}
                disabled
                className="proj-user-form-control"
              />
            </div>
          )}

          <h2>{isEditing ? "Editar Usuário" : "Cadastrar Usuário"}</h2>

          <div className="proj-user-form-controls-container">
            <div>
              <h5>Login</h5>
              <input
                type="text"
                value={login || ""}
                onChange={(e) => handleLoginChange(e.target.value)}
                className="proj-user-form-control"
                required
              />
              {errorMessage.login && (
                <div className="proj-user-form-error">{errorMessage.login}</div>
              )}
            </div>

            <div>
              <h5>Senha</h5>
              <input
                type="password"
                value={password || ""}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="proj-user-form-control"
                required
              />
              {errorMessage.password && (
                <div className="proj-user-form-error">{errorMessage.password}</div>
              )}
            </div>

            <div>
              <h5>Nome Completo</h5>
              <input
                type="text"
                value={name || ""}
                onChange={(e) => handleNameChange(e.target.value)}
                className="proj-user-form-control"
                required
              />
              {errorMessage.name && (
                <div className="proj-user-form-error">{errorMessage.name}</div>
              )}
            </div>

            <div>
              <h5>CPF</h5>
              <IMaskInput 
                mask="000.000.000-00"
                value={cpf || ""}
                onAccept={(value) => setCpf(value)}
                className="proj-user-form-control"
                required
              />
              {errorMessage.cpf && (
                <div className="proj-user-form-error">{errorMessage.cpf}</div>
              )}
            </div>

            <div>
              <h5>Email</h5>
              <input
                type="text"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                className="proj-user-form-control"
              />
              {errorMessage.email && (
                <div className="proj-user-form-error">{errorMessage.email}</div>
              )}
            </div>

            <div>
              <h5>Perfis</h5>
              <div className="proj-user-form-roles-checkboxes">
                {Array.isArray(availableRoles) &&
                  availableRoles.map((role) => (
                    <label key={role.id}>
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role.id)}
                        onChange={() => handleRoleChange(role.id)}
                      />
                      {` ${role.authority}`}
                    </label>
                  ))}
              </div>
            </div>
          </div>

          <div className="proj-user-form-buttons">
            <Link to="/listingUsers">
              <ButtonSecondary name="Cancelar" />
            </Link>
            <ButtonPrimary name="Salvar" />
          </div>
        </form>
      </div>
    </main>
  );
}
