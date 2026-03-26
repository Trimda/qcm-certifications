'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User, Role } from '@/types';
import { loginUser, registerUser, logoutUser } from '@/services/userService';

interface AuthContextValue {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current user from session on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const user = await res.json() as User;
          setCurrentUser(user);
        }
      } catch {
        // No active session
      } finally {
        setIsLoading(false);
      }
    };
    void fetchCurrentUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const user = await loginUser(email, password);
    setCurrentUser(user);
  }, []);

  const register = useCallback(async (
    username: string,
    email: string,
    password: string,
    role: Role
  ) => {
    const user = await registerUser(username, email, password, role);
    setCurrentUser(user);
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setCurrentUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const user = await res.json() as User;
        setCurrentUser(user);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
