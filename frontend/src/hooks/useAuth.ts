// frontend/src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    logout, 
    loadUser, 
    clearError 
  } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
  };
};

