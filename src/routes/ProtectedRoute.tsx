import { useEffect, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loggedIn } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loggedIn) toast("로그인이 필요한 서비스입니다.");
  }, [loggedIn]);

  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
