import { ReactNode } from 'react';
import { useAuthStore } from '@/lib/authStore';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  module?: string;
  action?: string;
  requireAll?: boolean; // For permissions array - require all or any
  fallback?: ReactNode;
}

const PermissionGuard = ({ 
  children, 
  permission, 
  permissions, 
  module, 
  action, 
  requireAll = false,
  fallback = null 
}: PermissionGuardProps) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, canAccess } = useAuthStore();

  let hasAccess = false;

  // Check specific permission
  if (permission) {
    hasAccess = hasPermission(permission);
  }
  // Check multiple permissions
  else if (permissions && permissions.length > 0) {
    hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
  }
  // Check module and action access
  else if (module && action) {
    hasAccess = canAccess(module, action);
  }
  // Default to true if no restrictions specified
  else {
    hasAccess = true;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard; 