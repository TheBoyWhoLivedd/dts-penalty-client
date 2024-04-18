import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { useMemo } from "react";

interface CustomJwtPayload extends JwtPayload {
  UserInfo: {
    userId: string;
    userName: string;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    hasResetPassword: boolean;
  };
}

const useAuth = () => {
  const token = useSelector(selectCurrentToken);

  const decodedUserInfo = useMemo(() => {
    if (token) {
      return jwtDecode<CustomJwtPayload>(token).UserInfo;
    }
    return null;
  }, [token]);

  if (decodedUserInfo) {
    const { userId, userName, isAdmin, isSuperAdmin, hasResetPassword } =
      decodedUserInfo;
    // Adjusted logic for determining the status
    let status = "Employee";
    if (isSuperAdmin) {
      status = "Admin";
    } else if (isAdmin) {
      status = "Supervisor";
    } else {
      status = "Employee";
    }

    // console.log("Decoded", decodedUserInfo);

    return {
      userId,
      userName,
      status,
      isAdmin,
      isSuperAdmin,
      hasResetPassword,
    }; // Added isSuperAdmin to the return object for consistency
  }

  return {
    userId: "",
    userName: "",
    isAdmin: false,
    isSuperAdmin: false,
    hasResetPassword: true,
    status: "",
  };
};

export default useAuth;
