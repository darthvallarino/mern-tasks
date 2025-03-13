import { Navigate } from "react-router-dom";
import { useAppSelector } from '../store/index';
import { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAppSelector((state) => state.auth);
  return auth && auth.accessToken ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;