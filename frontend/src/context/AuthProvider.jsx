import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios.js";
import { notifyInfo } from "../utils/Toast.js";
import Loader from "../utils/Loader.jsx";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login
  const login = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials);
      setCurrentUser(res.data.user);
      return res.data;
    } catch (err) {
      setCurrentUser(null);
      throw err;
    }
  };

  // Signup
  const signup = async (credentials) => {
    try {
      const res = await api.post("/auth/signup", credentials);
      setCurrentUser(res.data.user);
      return res.data;
    } catch (err) {
      setCurrentUser(null);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout", {});
      setCurrentUser(null);
      notifyInfo("Logged out successfully!");
    } catch (err) {
      setCurrentUser(null);
      notifyInfo("Session expired — logged out.");
    }
  };

  // Fetch current user from backend (/me)
  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setCurrentUser(res.data.user);
    } catch (err) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Listen for session changes
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Respond to logout event (global)
  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener("forceLogout", handleLogout);
    return () => window.removeEventListener("forceLogout", handleLogout);
  }, []);

  const value = {
    login,
    logout,
    signup,
    refreshUser: fetchCurrentUser,
    loading,
    currentUser,
    isAuthenticated: !!currentUser,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <Loader />
      </div>
    );
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
