import { createContext, useState, useEffect } from "react";
import { request } from "../utils/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const register = async (formData) => {
    const data = await request("/auth/register", "POST", formData);
    setUser(data);
    return data;
  };

  const login = async (formData) => {
    const data = await request("/auth/login", "POST", formData);
    setUser(data);
    return data;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
