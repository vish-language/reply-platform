import { createContext, useContext, useEffect, useState } from "react";

import { getMe } from "../api/auth.api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;

  loading: boolean;

  loginUser: (token: string, user: User) => void;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);

        return;
      }

      try {
        const response = await getMe();

        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("token");

        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, []);

  function loginUser(token: string, userData: User) {
    localStorage.setItem("token", token);

    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("token");

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,

        loading,

        loginUser,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return context;
}
