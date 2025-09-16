import React from 'react';
import { usePermissions, PermissionModule, PermissionAction } from '../hooks/usePermissions';

interface ProtectedComponentProps {
  children: React.ReactNode;
  module: PermissionModule;
  action: PermissionAction;
  resourceUserId?: string;
  fallback?: React.ReactNode;
  hideIfNoAccess?: boolean;
}

/**
 * Composant pour protéger des éléments selon les permissions
 */
export function ProtectedComponent({
  children,
  module,
  action,
  resourceUserId,
  fallback = null,
  hideIfNoAccess = true,
}: ProtectedComponentProps) {
  const { hasPermission } = usePermissions();

  const canAccess = hasPermission(module, action, resourceUserId);

  if (!canAccess) {
    if (hideIfNoAccess) {
      return null;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  module: PermissionModule;
  fallback?: React.ReactNode;
}

/**
 * Composant pour protéger des routes selon l'accès au module
 */
export function ProtectedRoute({
  children,
  module,
  fallback = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Accès non autorisé
        </h2>
        <p className="text-gray-600">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
      </div>
    </div>
  ),
}: ProtectedRouteProps) {
  const { canAccessModule } = usePermissions();

  const canAccess = canAccessModule(module);

  if (!canAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface ConditionalRenderProps {
  children: React.ReactNode;
  condition: boolean;
  fallback?: React.ReactNode;
  hideIfFalse?: boolean;
}

/**
 * Composant pour affichage conditionnel simple
 */
export function ConditionalRender({
  children,
  condition,
  fallback = null,
  hideIfFalse = true,
}: ConditionalRenderProps) {
  if (!condition) {
    if (hideIfFalse) {
      return null;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RoleBasedComponentProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
  hideIfNotAllowed?: boolean;
}

/**
 * Composant pour afficher selon les rôles autorisés
 */
export function RoleBasedComponent({
  children,
  allowedRoles,
  fallback = null,
  hideIfNotAllowed = true,
}: RoleBasedComponentProps) {
  const { user } = usePermissions();

  const isAllowed = user && (
    user.isAdmin || 
    allowedRoles.includes(user.role)
  );

  if (!isAllowed) {
    if (hideIfNotAllowed) {
      return null;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
