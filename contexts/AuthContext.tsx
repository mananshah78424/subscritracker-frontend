import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load stored authentication data
  const loadStoredAuth = () => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        return true;
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    return false;
  };

  useEffect(() => {
    // Check for existing token on app load
    loadStoredAuth();
    setIsLoading(false);
  }, []);

  // Handle Google OAuth redirects
  useEffect(() => {
    if (router.isReady) {
      const { token: urlToken, user: urlUser, error: urlError } = router.query;
      
      // If we have OAuth parameters, set loading to prevent premature redirects
      if (urlToken || urlUser || urlError) {
        setIsLoading(true);
      }
      
      // If we have token and user from Google OAuth redirect
      if (urlToken && urlUser) {
        try {
          const userData = typeof urlUser === 'string' ? JSON.parse(urlUser) : urlUser;
          login(urlToken as string, userData);
          
          // Clean up URL and redirect to home
          router.replace('/home', undefined, { shallow: true });
        } catch (error) {
          // If parsing fails, redirect to login
          router.replace('/login', undefined, { shallow: true });
        } finally {
          setIsLoading(false);
        }
      }
      
      // If there's an error from Google OAuth
      if (urlError) {
        // Clean up URL and redirect to login
        router.replace('/login', undefined, { shallow: true });
        setIsLoading(false);
      }
    }
  }, [router.isReady, router.query]);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const isAuthenticated = !!token && !!user;

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 