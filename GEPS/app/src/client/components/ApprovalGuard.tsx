import React from 'react';
import { useAuth } from 'wasp/client/auth';
import { Navigate } from 'react-router-dom';

interface ApprovalGuardProps {
  children: React.ReactNode;
}

/**
 * Composant qui redirige les utilisateurs non approuvés vers la page d'attente
 */
export function ApprovalGuard({ children }: ApprovalGuardProps) {
  const { data: user, isLoading } = useAuth();

  // Afficher un loading pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification du compte...</p>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur connecté, laisser l'auth guard gérer
  if (!user) {
    return <>{children}</>;
  }

  // Si utilisateur admin, toujours autoriser l'accès
  if (user.isAdmin) {
    return <>{children}</>;
  }

  // Si utilisateur non approuvé ou sans rôle assigné, rediriger vers la page d'attente
  if (user.status !== 'APPROVED' || user.role === 'PENDING_ROLE') {
    return <Navigate to="/pending-approval" replace />;
  }

  // Si utilisateur approuvé, autoriser l'accès
  return <>{children}</>;
}
