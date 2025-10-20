import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated } from '@/services/auth/auth.service';
import { type UserContext, type User } from '@/types/user/user.types';

const AuthContext = createContext<UserContext | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    // Khi có API /me thì gọi ở đây để set user
  }, []);

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{
      user, setUser,
      isLoggedIn, setIsLoggedIn,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): UserContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};