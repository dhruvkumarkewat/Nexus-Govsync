import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Role = 'Citizen' | 'Officer' | 'Admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  department?: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { supabase } from './supabase';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active Supabase session on load (for Citizens who logged in via Google)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email || 'Citizen',
          role: 'Citizen',
          permissions: ['apply', 'view_history', 'manage_permissions']
        });
      }
      setIsLoading(false);
    });

    // Listen for auth changes (like returning from Google OAuth redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email || 'Citizen',
          role: 'Citizen',
          permissions: ['apply', 'view_history', 'manage_permissions']
        });
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = async () => {
    setUser(null);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
