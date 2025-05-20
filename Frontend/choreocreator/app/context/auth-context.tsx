'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/auth';

type User = {
  username: string;
  email: string;
  role: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getMe();
        setUser(currentUser);
      } catch (e) {
        console.error('Ошибка при проверке авторизации', e);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await apiLogin({ email, password });
      const currentUser = await getMe();
      setUser(currentUser);
      return true;
    } catch (e: any) {
      setError(e.message || 'Ошибка входа');
      return false;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    setError(null);
    try {
      await apiRegister({ email, username, password });
      const currentUser = await getMe();
      setUser(currentUser);
      return true;
    } catch (e: any) {
      setError(e.message || 'Ошибка регистрации');
      return false;
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth должен использоваться внутри <AuthProvider>');
  return context;
};
