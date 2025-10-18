import "./styles.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import homeIcon from "../../assets/home.svg";
import productIcon from "../../assets/product.svg";
import supplierIcon from "../../assets/supplier.svg";
import userIcon from "../../assets/user.svg";
import orderIcon from "../../assets/order.svg";
import payIcon from "../../assets/pay.svg";
import { useEffect, useState } from "react";
import { UserDTO } from "../../models/userDto";
import * as userService from "../../services/user-service";
import { getAccessToken, logout } from "../../services/auth-service";
import * as authService from '../../services/auth-service';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDTO>();

  useEffect(() => {
    const token = getAccessToken();

    if (token) {
      userService
        .findMe()
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          setUser(undefined);
        });
    } else {
      setUser(undefined);
    }
  }, [location.pathname]);

  function handleLogout() {
    logout();
    setUser(undefined); 
    navigate("/login");
  }

  return (
    <header className="proj-header">
      <nav className="proj-container">
        <div>
          <div className="proj-header-content">
            {user && (
              <>
                <div>
                  <a href="https://github.com/auriceliof/job-ProjSew">ProjSew</a>
                </div>
            
                <div>
                  <h5>Logado: {user.login}</h5>
                </div>
              </>
            )}
          </div>

          <div className="proj-header-content-icon">
            {user && (
              <div className="proj-header-icon">
                <Link to="/">
                  <img
                    src={homeIcon}
                    alt="Home"
                    title="Home"
                    className={location.pathname === "/" ? "active" : ""}
                  />
                </Link>
                <Link to="/listingProducts">
                  <img
                    src={productIcon}
                    alt="Produto"
                    title="Produto"
                    className={location.pathname === "/listingProducts" ? "active" : ""}
                  />
                </Link>
                <Link to="/listingSuppliers">
                  <img
                    src={supplierIcon}
                    alt="Fornecedor"
                    title="Fornecedor"
                    className={location.pathname === "/listingSuppliers" ? "active" : ""}
                  />
                </Link>
                <Link to="/listingOrders">
                  <img
                    src={orderIcon}
                    alt="Ordem"
                    title="Ordem de Serviço"
                    className={location.pathname === "/listingOrders" ? "active" : ""}
                  />
                </Link>
                <Link to="/listingOrdersPay">
                  <img
                    src={payIcon}
                    alt="Pagamento"
                    title="Pagamento"
                    className={location.pathname === "/listingOrdersPay" ? "active" : ""}
                  />
                </Link>
                {
                  authService.hasAnyRoles(['ROLE_ADMIN']) &&
                  <Link to="/listingUsers">
                    <img
                      src={userIcon}
                      alt="Usuario"
                      title="Usuario"
                      className={location.pathname === "/listingUsers" ? "active" : ""}
                    />
                  </Link>
                }
              </div>
            )}

            {user && (
              <div className="login-link">
                <button onClick={handleLogout} className="logout-button">
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
