import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  fallbackRoute?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredPermission, 
  requiredPermissions = [],
  fallbackRoute = '/dashboard' 
}: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si no está autenticado, redirigir a Welcome
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Construir array de permisos requeridos
    const permissions = requiredPermission 
      ? [requiredPermission, ...requiredPermissions]
      : requiredPermissions;

    // Si no se especifican permisos, permitir acceso
    if (permissions.length === 0) {
      return;
    }

    // Verificar si tiene al menos uno de los permisos requeridos
    const hasRequiredPermission = permissions.some(permission => hasPermission(permission));

    if (!hasRequiredPermission) {
      console.log(`❌ Usuario sin permiso para esta ruta. Permisos requeridos: ${permissions.join(', ')}`);
      
      // Si no tiene permiso para esta ruta, intentar redirigir al dashboard
      if (fallbackRoute === '/dashboard' && !hasPermission('READ_DASHBOARD')) {
        // Si tampoco tiene permiso de dashboard, verificar permisos básicos
        const hasBasicPermissions = hasPermission('READ_USERS') || 
                                   hasPermission('READ_ROLES') || 
                                   hasPermission('READ_PERMISSIONS');

        if (!hasBasicPermissions) {
          // Sin permisos básicos, cerrar sesión y redirigir a Welcome
          console.log('❌ Usuario sin permisos básicos, cerrando sesión');
          logout();
          navigate('/');
          return;
        }
      }

      // Redirigir a la ruta de fallback (dashboard por defecto)
      navigate(fallbackRoute);
      return;
    }
  }, [isAuthenticated, hasPermission, logout, navigate, requiredPermission, requiredPermissions, fallbackRoute]);

  // Si no está autenticado o no tiene permisos, no renderizar nada
  if (!isAuthenticated) {
    return null;
  }

  // Verificar permisos antes de renderizar
  const permissions = requiredPermission 
    ? [requiredPermission, ...requiredPermissions]
    : requiredPermissions;

  if (permissions.length > 0) {
    const hasRequiredPermission = permissions.some(permission => hasPermission(permission));
    if (!hasRequiredPermission) {
      return null;
    }
  }

  return <>{children}</>;
}
