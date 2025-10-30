import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { notifyInfo } from "../utils/Toast";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const shownRef = useRef(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && !shownRef.current) {
      notifyInfo("You need to be logged in!");
      shownRef.current = true;
    }
    if (isAuthenticated) {
      shownRef.current = false;
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Checking access...
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default ProtectedRoute;
