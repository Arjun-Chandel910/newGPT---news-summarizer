import { useAuth } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";
import { notifyError } from "../utils/Toast";

export default function AdminRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser || !currentUser.isAdmin) {
    notifyError("Access Denied! ");
    return <Navigate to="/" replace />;
  }
  return children;
}
