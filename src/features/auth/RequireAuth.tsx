import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

interface RequireAuthProps {
  allowedRoles: string[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  // console.log("allowedRoles", allowedRoles);
  const location = useLocation();
  const { status } = useAuth();

  // console.log("status", status);

  const isAllowed = allowedRoles.includes(status);
  // console.log("isAllowed", isAllowed);

  const content = isAllowed ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );

  return content;
};
export default RequireAuth;
