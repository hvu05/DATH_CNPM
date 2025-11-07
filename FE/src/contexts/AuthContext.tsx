import React, { createContext, useContext, useState, useEffect } from "react";
import { isAuthenticated } from "@/services/auth/auth.service";
import { getProfileAPI } from "@/services/global";

export interface UserContext {
  user: IUser | null;
  setUser: (v: IUser | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  updateUser: (user: Partial<IUser>) => void;
}

const AuthContext = createContext<UserContext | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authenticated = isAuthenticated();
    if (authenticated) {
      setIsLoggedIn(authenticated);
      const loadUsers = async () => {
        const result = await getProfileAPI();
        if (result.data) {
          setUser(result.data);
        }
      };
      loadUsers();
    }
  }, []);

  const updateUser = (userData: Partial<IUser>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): UserContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
