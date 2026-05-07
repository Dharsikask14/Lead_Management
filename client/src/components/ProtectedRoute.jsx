import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function ProtectedRoute({ children }) {
  const { user, booting } = useAuth();

  if (booting) {
    return <div className="screen-loader">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
