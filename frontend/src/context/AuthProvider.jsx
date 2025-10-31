import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios.js";
import { notifyInfo, notifySuccess } from "../utils/Toast.js";
import Loader from "../utils/Loader.jsx";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // login
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

  // logout
  const logout = async () => {
    try {
      const response = await api.post("/auth/logout", {});
      notifyInfo(response.message);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setCurrentUser(null);
    }
  };

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

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    signup,
    refreshUser: fetchCurrentUser,
    loading,
    currentUser,
    isAuthenticated: !!currentUser,
  };
  // setLoading(false);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <Loader />
      </div>
    );
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
