import "./styles.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserDTO } from "../../models/userDto";
import { findMe } from "../../services/user-service";
import * as authService from "../../services/auth-service";

export default function Home() {
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    findMe()
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar usuário logado", error);
      });
  }, []);

  return (
    <main className="home-container">
      <header className="home-header">
        <h1>Bem-vindo{user ? `, ${user.name}` : ""}!</h1>
        <p>Gerencie tudo de forma simples e rápida.</p>
      </header>

      <section className="home-actions">
        <Link to="/listingProducts" className="home-card">
          <span className="home-icon">👚</span>
          <h3>Produtos</h3>
          <p>Controle e organize seus produtos.</p>
        </Link>

        <Link to="/listingSuppliers" className="home-card">
          <span className="home-icon">👨‍💼</span>
          <h3>Fornecedores</h3>
          <p>Gerencie seus fornecedores com facilidade.</p>
        </Link>

        <Link to="/listingOrders" className="home-card">
          <span className="home-icon">📋</span>
          <h3>Ordens de Serviço</h3>
          <p>Controle o fluxo da confecção.</p>
        </Link>

        <Link to="/listingOrdersPay" className="home-card">
          <span className="home-icon">💳</span>
          <h3>Pagamentos</h3>
          <p>Controle financeiro simplificado.</p>
        </Link>

        {authService.hasAnyRoles(["ROLE_ADMIN"]) && (
          <Link to="/listingUsers" className="home-card">
            <span className="home-icon">👨🏻‍💻</span>
            <h3>Usuários</h3>
            <p>Gerencie contas e permissões.</p>
          </Link>
        )}

        <Link to="/stats" className="home-card">
          <span className="home-icon">📊</span>
          <h3>Estatísticas</h3>
          <p>Visão geral com gráficos.</p>
        </Link>
      </section>
    </main>
  );
}
