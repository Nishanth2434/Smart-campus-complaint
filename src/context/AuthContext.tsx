import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface User {
  email: string;
  name: string;
  role: "admin" | "student";
  rollId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginAdmin: (email: string, pass: string) => { success: boolean; error?: string };
  loginStudent: (email: string, pass: string) => { success: boolean; error?: string };
  registerStudent: (name: string, email: string, pass: string, rollId?: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "smart_campus_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  function loginAdmin(email: string, pass: string) {
    const trimmedEmail = email.trim().toLowerCase();
    // Default authorized admin credentials or staff accounts
    const isDefaultAdmin =
      (trimmedEmail === "principle@gmail.com" || trimmedEmail === "principal@smartcampus.edu" || trimmedEmail === "admin@smartcampus.edu") &&
      (pass === "123456" || pass === "admin123");

    // Allow staff / admin login for valid demo email and password (at least 4 chars)
    if (isDefaultAdmin || (trimmedEmail.length > 5 && trimmedEmail.includes("@") && pass.length >= 4)) {
      const adminUser: User = {
        email: trimmedEmail,
        name: trimmedEmail.startsWith("princ") ? "Campus Principal" : "Admin Staff",
        role: "admin",
      };
      setUser(adminUser);
      return { success: true };
    }

    return {
      success: false,
      error: "Invalid email or password. Use default credentials: principle@gmail.com / 123456",
    };
  }

  function loginStudent(email: string, pass: string) {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (!pass || pass.length < 4) {
      return { success: false, error: "Password must be at least 4 characters long." };
    }

    const studentUser: User = {
      email: trimmedEmail,
      name: trimmedEmail.split("@")[0].replace(/[^a-zA-Z]/g, " ") || "Student User",
      role: "student",
    };
    setUser(studentUser);
    return { success: true };
  }

  function registerStudent(name: string, email: string, pass: string, rollId?: string) {
    if (!name.trim()) return { success: false, error: "Please enter your name." };
    if (!email.trim() || !email.includes("@")) return { success: false, error: "Please enter a valid email." };
    if (!pass || pass.length < 4) return { success: false, error: "Password must be at least 4 characters." };

    const studentUser: User = {
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role: "student",
      rollId: rollId?.trim(),
    };
    setUser(studentUser);
    return { success: true };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        loginAdmin,
        loginStudent,
        registerStudent,
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
