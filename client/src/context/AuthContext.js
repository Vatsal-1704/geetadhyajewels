import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("gjToken");
    const saved = localStorage.getItem("gjUser");
    if (token && saved) { setUser(JSON.parse(saved)); }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("gjToken", data.token);
    localStorage.setItem("gjUser", JSON.stringify(data));
    setUser(data); return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post("/auth/register", { name, email, password, phone });
    localStorage.setItem("gjToken", data.token);
    localStorage.setItem("gjUser", JSON.stringify(data));
    setUser(data); return data;
  };

  const logout = () => {
    localStorage.removeItem("gjToken"); localStorage.removeItem("gjUser"); setUser(null);
  };

  const updateUser = (data) => { setUser(data); localStorage.setItem("gjUser", JSON.stringify(data)); };

  return <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
