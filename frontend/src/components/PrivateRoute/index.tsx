import { Navigate, Outlet } from "react-router-dom";
import * as authService from "../../services/auth-service";
import { RoleEnum } from "../../models/authDto";
import { toast } from "react-toastify";

type Props = {
  roles?: RoleEnum[];
};

export function PrivateRoute({ roles = [] }: Props) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !authService.hasAnyRoles(roles)) {
    toast.warning("⚠️ Você não tem permissão para acessar esta página!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored"
    });

    return <Navigate to="/" />;
  }

  return <Outlet />;
}
