import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { Clock, Shield, User, Key, AlertTriangle, CheckCircle } from 'lucide-react';

interface AuthStatusProps {
  className?: string;
}

export const AuthStatusPanel = ({ className }: AuthStatusProps) => {
  const { user, isAuthenticated, verifyToken } = useAuth();
  const [tokenStatus, setTokenStatus] = useState<{
    isValid: boolean;
    lastCheck: Date | null;
    error?: string;
  }>({
    isValid: false,
    lastCheck: null,
  });

  const checkTokenStatus = async () => {
    try {
      const response = await authService.verify();
      setTokenStatus({
        isValid: response.success,
        lastCheck: new Date(),
        error: response.success ? undefined : response.error,
      });
    } catch (error) {
      setTokenStatus({
        isValid: false,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkTokenStatus();
      
      // Verificar token cada 30 segundos
      const interval = setInterval(checkTokenStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">No autenticado</span>
        </div>
        <p className="text-red-600 text-sm mt-1">
          No hay sesión activa. Por favor, inicia sesión.
        </p>
      </div>
    );
  }

  const token = localStorage.getItem('auth_token');
  const tokenPreview = token ? `${token.substring(0, 20)}...` : 'No token';

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Estado de Autenticación
        </h3>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Usuario */}
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <div className="font-medium text-gray-900">{user?.name}</div>
            <div className="text-sm text-gray-600">{user?.email}</div>
            <div className="text-sm text-gray-500">Rol: {user?.role}</div>
          </div>
        </div>

        {/* Token */}
        <div className="flex items-start gap-3">
          <Key className="h-5 w-5 text-green-500 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium text-gray-900">Token JWT</div>
            <div className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded mt-1">
              {tokenPreview}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {tokenStatus.isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ${tokenStatus.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {tokenStatus.isValid ? 'Token válido' : 'Token inválido'}
              </span>
            </div>
            {tokenStatus.error && (
              <div className="text-sm text-red-600 mt-1">
                Error: {tokenStatus.error}
              </div>
            )}
          </div>
        </div>

        {/* Última verificación */}
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <div className="font-medium text-gray-900">Última verificación</div>
            <div className="text-sm text-gray-600">
              {tokenStatus.lastCheck ? tokenStatus.lastCheck.toLocaleString() : 'Nunca'}
            </div>
          </div>
        </div>

        {/* Permisos */}
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-purple-500 mt-0.5" />
          <div>
            <div className="font-medium text-gray-900">Permisos</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {user?.permissions?.map((permission) => (
                <span
                  key={permission}
                  className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-2 border-t border-gray-200">
          <button
            onClick={checkTokenStatus}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            <Key className="h-4 w-4" />
            Verificar Token
          </button>
          <button
            onClick={verifyToken}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            Actualizar Usuario
          </button>
        </div>
      </div>
    </div>
  );
};
