import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import api from "../api/axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const login = async (credentials) => {
    try {
      const res = await api.post("/api/auth/login", credentials, {
        withCredentials: true,
      });
      setCurrentUser(res.user);
      return res.data.user;
    } catch (err) {
      setCurrentUser(null);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {}
    setCurrentUser(null);
  };

  const current = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/auth/current", {
        withCredentials: true,
      });
      setCurrentUser(res.user);
    } catch (err) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    current();
  }, []);
  const value = {
    currentUser,
    login,
    logout,
    current,

    loading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
