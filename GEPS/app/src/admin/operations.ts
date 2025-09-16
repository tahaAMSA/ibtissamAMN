import { HttpError } from 'wasp/server';
import type { User } from 'wasp/entities';
import { hasPermission } from '../server/permissions';

// Types pour les opérations admin
type ApproveUserArgs = {
  userId: string;
  role: string;
};

type RejectUserArgs = {
  userId: string;
  reason?: string;
};

type UpdateUserRoleArgs = {
  userId: string;
  role: string;
};

/**
 * Récupérer tous les utilisateurs (admin seulement)
 */
export const getAllUsers = async (args: void, context: any): Promise<User[]> => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Seuls les admins peuvent voir tous les utilisateurs
  if (!context.user.isAdmin && !hasPermission(context.user, 'USERS', 'READ')) {
    throw new HttpError(403, 'Accès refusé: seuls les administrateurs peuvent voir les utilisateurs');
  }

  try {
    return await context.entities.User.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isAdmin: true,
        isActive: true,
        status: true,
        createdAt: true,
        approvedAt: true,
        rejectionReason: true,
        approvedBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des utilisateurs');
  }
};

/**
 * Approuver un utilisateur (admin seulement)
 */
export const approveUser = async (args: ApproveUserArgs, context: any): Promise<User> => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Seuls les admins peuvent approuver des utilisateurs
  if (!context.user.isAdmin && !hasPermission(context.user, 'USERS', 'UPDATE')) {
    throw new HttpError(403, 'Accès refusé: seuls les administrateurs peuvent approuver des utilisateurs');
  }

  try {
    // Vérifier que l'utilisateur existe
    const userToApprove = await context.entities.User.findUnique({
      where: { id: args.userId }
    });

    if (!userToApprove) {
      throw new HttpError(404, 'Utilisateur non trouvé');
    }

    // Mettre à jour le statut de l'utilisateur
    return await context.entities.User.update({
      where: { id: args.userId },
      data: {
        status: 'APPROVED',
        role: args.role,
        approvedById: context.user.id,
        approvedAt: new Date(),
        rejectionReason: null // Effacer toute raison de rejet précédente
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'approbation de l\'utilisateur:', error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Erreur serveur lors de l\'approbation de l\'utilisateur');
  }
};

/**
 * Rejeter un utilisateur (admin seulement)
 */
export const rejectUser = async (args: RejectUserArgs, context: any): Promise<User> => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Seuls les admins peuvent rejeter des utilisateurs
  if (!context.user.isAdmin && !hasPermission(context.user, 'USERS', 'UPDATE')) {
    throw new HttpError(403, 'Accès refusé: seuls les administrateurs peuvent rejeter des utilisateurs');
  }

  try {
    // Vérifier que l'utilisateur existe
    const userToReject = await context.entities.User.findUnique({
      where: { id: args.userId }
    });

    if (!userToReject) {
      throw new HttpError(404, 'Utilisateur non trouvé');
    }

    // Mettre à jour le statut de l'utilisateur
    return await context.entities.User.update({
      where: { id: args.userId },
      data: {
        status: 'REJECTED',
        rejectionReason: args.reason || 'Aucune raison spécifiée',
        approvedById: context.user.id,
        approvedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Erreur lors du rejet de l\'utilisateur:', error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Erreur serveur lors du rejet de l\'utilisateur');
  }
};

/**
 * Mettre à jour le rôle d'un utilisateur (admin seulement)
 */
export const updateUserRole = async (args: UpdateUserRoleArgs, context: any): Promise<User> => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Seuls les admins peuvent modifier les rôles
  if (!context.user.isAdmin && !hasPermission(context.user, 'USERS', 'UPDATE')) {
    throw new HttpError(403, 'Accès refusé: seuls les administrateurs peuvent modifier les rôles');
  }

  try {
    // Vérifier que l'utilisateur existe
    const userToUpdate = await context.entities.User.findUnique({
      where: { id: args.userId }
    });

    if (!userToUpdate) {
      throw new HttpError(404, 'Utilisateur non trouvé');
    }

    // Ne pas permettre de modifier le rôle d'un autre admin (sauf si super admin)
    if (userToUpdate.isAdmin && !context.user.isAdmin) {
      throw new HttpError(403, 'Impossible de modifier le rôle d\'un administrateur');
    }

    // Mettre à jour le rôle
    return await context.entities.User.update({
      where: { id: args.userId },
      data: {
        role: args.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle:', error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Erreur serveur lors de la mise à jour du rôle');
  }
};

/**
 * Suspendre/activer un utilisateur (admin seulement)
 */
export const toggleUserStatus = async (args: { userId: string }, context: any): Promise<User> => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Seuls les admins peuvent suspendre/activer des utilisateurs
  if (!context.user.isAdmin && !hasPermission(context.user, 'USERS', 'UPDATE')) {
    throw new HttpError(403, 'Accès refusé: seuls les administrateurs peuvent suspendre/activer des utilisateurs');
  }

  try {
    // Vérifier que l'utilisateur existe
    const userToToggle = await context.entities.User.findUnique({
      where: { id: args.userId }
    });

    if (!userToToggle) {
      throw new HttpError(404, 'Utilisateur non trouvé');
    }

    // Ne pas permettre de suspendre un autre admin
    if (userToToggle.isAdmin && !context.user.isAdmin) {
      throw new HttpError(403, 'Impossible de suspendre un administrateur');
    }

    // Ne pas permettre de se suspendre soi-même
    if (userToToggle.id === context.user.id) {
      throw new HttpError(403, 'Impossible de modifier votre propre statut');
    }

    // Basculer entre APPROVED et SUSPENDED
    const newStatus = userToToggle.status === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';

    return await context.entities.User.update({
      where: { id: args.userId },
      data: {
        status: newStatus,
        isActive: newStatus === 'APPROVED'
      }
    });
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Erreur serveur lors du changement de statut');
  }
};
