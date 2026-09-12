import { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";

export type Role = "DOCTOR" | "NURSE";

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
}

export const DUMMY_CREDENTIALS = [
  {
    email: "doctor@aegis.com",
    password: "password123",
    user: {
      id: "doc-1",
      name: "Dr. Sarah Jenkins",
      role: "DOCTOR" as Role,
      email: "doctor@aegis.com"
    }
  },
  {
    email: "nurse@aegis.com",
    password: "password123",
    user: {
      id: "nur-1",
      name: "Nurse Mike Ross",
      role: "NURSE" as Role,
      email: "nurse@aegis.com"
    }
  }
];

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem("aegis_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("aegis_user");
      }
    }
  }, []);

  const login = (email: string) => {
    const found = DUMMY_CREDENTIALS.find(c => c.email === email);
    if (found) {
      setUser(found.user);
      localStorage.setItem("aegis_user", JSON.stringify(found.user));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("aegis_user");
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
