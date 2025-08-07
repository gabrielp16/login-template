import { useEffect } from 'react';
import { useTokenManager } from '../../hooks/useTokenManager';

interface TokenManagerProviderProps {
  children: React.ReactNode;
}

/**
 * Provider que maneja automáticamente la verificación de tokens
 * Se debe usar dentro del AuthProvider
 */
export const TokenManagerProvider = ({ children }: TokenManagerProviderProps) => {
  const { verifyTokenManually } = useTokenManager();

  useEffect(() => {
    // Verificar token al montar el componente (solo en el cliente)
    if (typeof window !== 'undefined') {
      const verifyInitialToken = async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          await verifyTokenManually();
        }
      };

      verifyInitialToken();
    }
  }, [verifyTokenManually]);

  return <>{children}</>;
};
