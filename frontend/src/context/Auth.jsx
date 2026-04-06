import { createContext, useState, useEffect } from "react";
import { request } from "../utils/api.js";


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const register = async (formData) => {
    try {
      const data = await request("/auth/register", "POST", formData);
      setUser(data);
      return data;
    } catch (err) {
      console.error("Register error:", err);
      throw err;
    }
  };

  const login = async (formData) => {
    try {
      const data = await request("/auth/login", "POST", formData);
      setUser(data);
      return data;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};