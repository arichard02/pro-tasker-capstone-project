import { createContext, useState, useEffect } from "react";

// create context
export const AuthContext = createContext();

// provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // login function
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
