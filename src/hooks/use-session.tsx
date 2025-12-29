'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { decodeToken } from '@/lib/jwt';
import { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface SessionContextType {
  user: User | null;
  token: string | null;
  setToken: (token: string | null) => void;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('event-go-token');
      if (storedToken) {
        setTokenState(storedToken);
        const decodedUser = decodeToken(storedToken);
        setUser(decodedUser);
      }
    } catch (error) {
      console.error('Could not access localStorage or decode token:', error);
      // Ensure state is clean if localStorage is inaccessible
      setTokenState(null);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const setToken = useCallback((newToken: string | null) => {
    setLoading(true);
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('event-go-token', newToken);
      const decodedUser = decodeToken(newToken);
      setUser(decodedUser);
    } else {
      localStorage.removeItem('event-go-token');
      setUser(null);
    }
    setLoading(false);
  }, []);

  const value = { user, token, setToken, loading };
  
  if (loading) {
    // You can return a global loader here
    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center">
                    <Skeleton className="h-8 w-32" />
                    <div className="mx-6 hidden md:flex items-center space-x-4 lg:space-x-6">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="ml-auto">
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </div>
            </header>
            <main className="flex-1 container p-4">
                <Skeleton className="h-full w-full" />
            </main>
        </div>
    );
  }

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
