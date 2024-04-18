import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import FirstTimeLogin from "@/components/firstTimeLogin";

interface RequireAuthProps {
  allowedRoles: string[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  // console.log("allowedRoles", allowedRoles);
  const location = useLocation();
  const { status, hasResetPassword } = useAuth();

  console.log("status", status);

  const isAllowed = allowedRoles.includes(status);

  if (!hasResetPassword) {
    return <FirstTimeLogin />;
  }

  const content = isAllowed ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );

  return content;
};
export default RequireAuth;
