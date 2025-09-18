import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

const REMEMBER_ME_KEY = 'resqcare_remember_me_token';
const PREFERRED_NAME_KEY = 'resqcare_preferred_name';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  logoutAll: () => void;
  isNameModalOpen: boolean;
  openNameModal: () => void;
  closeNameModal: () => void;
  updateUserName: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const navigate = useNavigate();

  const openNameModal = () => setIsNameModalOpen(true);
  const closeNameModal = () => setIsNameModalOpen(false);

  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...userData } : null);
  };

  const updateUserName = (name: string) => {
    // Simulate API call to save the name
    console.log(`Saving preferred name: ${name}`);
    try {
      localStorage.setItem(PREFERRED_NAME_KEY, name);
      updateUser({ preferredName: name, hasSetPreferredName: true });
      closeNameModal();
    } catch (error) {
      console.error("Failed to save preferred name", error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem(REMEMBER_ME_KEY);
        if (token) {
          await new Promise(resolve => setTimeout(resolve, 500));
          const preferredName = localStorage.getItem(PREFERRED_NAME_KEY) || undefined;
          const mockUser: User = { 
            id: 'user-123', 
            name: 'Demo User', 
            email: 'user@example.com',
            preferredName: preferredName,
            hasSetPreferredName: !!preferredName
          };
          setUser(mockUser);
          if (!mockUser.hasSetPreferredName) {
            // Delay opening the modal slightly to allow the app to render
            setTimeout(() => openNameModal(), 500);
          }
        }
      } catch (error) {
        console.error("Failed to restore session", error);
        setUser(null);
        localStorage.removeItem(REMEMBER_ME_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, rememberMe: boolean) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const preferredName = localStorage.getItem(PREFERRED_NAME_KEY) || undefined;
    const mockUser: User = { 
      id: 'user-123', 
      name: 'Demo User', 
      email,
      preferredName: preferredName,
      hasSetPreferredName: !!preferredName
    };
    setUser(mockUser);

    if (rememberMe) {
      localStorage.setItem(REMEMBER_ME_KEY, 'mock-persistent-token-for-demo');
    }
    
    if (!mockUser.hasSetPreferredName) {
      setTimeout(() => openNameModal(), 500);
    }
  };

  const performLogout = () => {
    setUser(null);
    localStorage.removeItem(REMEMBER_ME_KEY);
    // Don't remove preferred name on logout
    navigate('/login', { replace: true });
  };

  const logout = () => {
    performLogout();
  };

  const logoutAll = () => {
    performLogout();
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    logoutAll,
    isNameModalOpen,
    openNameModal,
    closeNameModal,
    updateUserName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};