import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "business_owner" | "admin";
  businessId?: string; // For business owners
  avatar?: string;
  provider?: "email" | "google" | "facebook"; // OAuth provider
  providerId?: string; // OAuth provider user ID
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithFacebook: () => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users - In production, this would be handled by a backend
const DEMO_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "user@demo.com",
    password: "password123",
    role: "user" as const,
  },
  {
    id: "2",
    name: "Business Owner",
    email: "business@demo.com",
    password: "business123",
    role: "business_owner" as const,
    businessId: "1",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@demo.com",
    password: "admin123",
    role: "admin" as const,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundUser = DEMO_USERS.find(
      (u) => u.email === email && u.password === password,
    );

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        businessId: foundUser.businessId,
        provider: "email",
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);

    // Simulate Google OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate Google user data
    const googleUser: User = {
      id: `google_${Date.now()}`,
      name: "John Google User",
      email: "user@gmail.com",
      role: "user",
      provider: "google",
      providerId: "google_123456",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    };

    setUser(googleUser);
    localStorage.setItem("user", JSON.stringify(googleUser));
    setIsLoading(false);
    return true;
  };

  const loginWithFacebook = async (): Promise<boolean> => {
    setIsLoading(true);

    // Simulate Facebook OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate Facebook user data
    const facebookUser: User = {
      id: `facebook_${Date.now()}`,
      name: "Jane Facebook User",
      email: "user@facebook.com",
      role: "user",
      provider: "facebook",
      providerId: "facebook_789012",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b3c2?w=150&h=150&fit=crop&crop=face",
    };

    setUser(facebookUser);
    localStorage.setItem("user", JSON.stringify(facebookUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
