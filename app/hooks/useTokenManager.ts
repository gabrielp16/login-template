import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

/**
 * Hook para manejar automáticamente la verificación y renovación de tokens
 */
export const useTokenManager = () => {
  const { user, logout, verifyToken } = useAuth();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // Solo configurar verificación si hay un usuario logueado
    if (user?.token) {
      // Verificar token cada 5 minutos
      intervalId = setInterval(async () => {
        try {
          const response = await authService.verify();
          
          if (!response.success) {
            console.warn('Token validation failed, logging out...');
            logout();
          }
        } catch (error) {
          console.error('Error during token verification:', error);
          logout();
        }
      }, 5 * 60 * 1000); // 5 minutos
    }

    // Limpiar interval al desmontar o cambiar usuario
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user?.token, logout]);

  /**
   * Función para verificar manualmente el token
   */
  const verifyTokenManually = async (): Promise<boolean> => {
    try {
      const response = await authService.verify();
      
      if (!response.success) {
        logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Manual token verification failed:', error);
      logout();
      return false;
    }
  };

  /**
   * Función para renovar el token
   */
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await authService.refresh();
      
      if (response.success && response.data?.token) {
        // Actualizar token en localStorage (solo en el cliente)
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
        }
        
        // Verificar token actualizado
        await verifyToken();
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  return {
    verifyTokenManually,
    refreshToken,
  };
};
