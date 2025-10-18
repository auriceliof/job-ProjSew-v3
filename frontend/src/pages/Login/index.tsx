import "./styles.css";
import ButtonPrimary from "../../components/ButtonPrimary";
import { CredentialsDTO } from "../../models/authDto";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from '../../services/auth-service';
import Maquina from "../../assets/MaquinaCostura.png";
import { toast } from "react-toastify";

export default function Login() {
  const [formData, setFormData] = useState<CredentialsDTO>({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    authService.loginRequest(formData)
      .then(response => {
        authService.saveAccessToken(response.data.access_token);

        toast.success("✅ Login realizado com sucesso!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored"
        });

        navigate("/");
      })
      .catch(error => {
        toast.error("❌ Usuário ou senha inválidos!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored"
        });

        console.error("Erro de login", error);
      });
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <main className="login-main">
      <div className="overlay"></div>
      <section className="proj-login-form-section proj-container">
        <div className="proj-login-card">
          <form className="proj-login-form" onSubmit={handleSubmit}>
            <img className="proj-mb20" src={Maquina} alt="MaquinaCostura" />
            <div>
              <h1 className="proj-mt20 proj-mb20"> SEW </h1>
            </div>
            <div>
              <h2 className="proj-mb20">
                Sistema de Gerenciamento de Confecção de Roupas e Costuras
              </h2>
            </div>

            <div className="proj-login-form-controls-container">
              <div>
                <h5></h5>
                <input
                  name="username"
                  value={formData.username}
                  type="text"
                  placeholder="Login"
                  className="proj-mt20 proj-login-form-control"
                  onChange={handleInputChange}
                />
                <h5></h5>
                <input
                  name="password"
                  value={formData.password}
                  type="password"
                  placeholder="Password"
                  className="proj-login-form-control"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="proj-mb20 proj-mt20 proj-login-form-buttons">
              <ButtonPrimary name="Entrar" />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
