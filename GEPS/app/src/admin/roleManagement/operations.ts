import { HttpError } from 'wasp/server';
import type { 
  GetRoles, 
  GetRoleDetails, 
  CreateRole, 
  UpdateRole, 
  DeleteRole,
  AddPermission,
  UpdatePermission,
  RemovePermission,
  AssignRoleToUser
} from 'wasp/server/operations';
import type { Role, Permission, User } from 'wasp/entities';
import { hasPermission } from '../../server/permissions';

// Types pour les arguments
type CreateRoleInput = {
  name: string;
  description?: string;
};

type UpdateRoleInput = {
  id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
};

type AddPermissionInput = {
  roleId: string;
  module: string;
  action: string;
  ownRecordsOnly?: boolean;
};

type UpdatePermissionInput = {
  id: string;
  module?: string;
  action?: string;
  ownRecordsOnly?: boolean;
};

type AssignRoleInput = {
  userId: string;
  roleId: string;
};

// Récupérer tous les rôles
export const getRoles: GetRoles<void, Role[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les permissions
  if (!hasPermission(context.user, 'SYSTEM', 'READ')) {
    throw new HttpError(403, 'Accès refusé');
  }

  try {
    return await context.entities.Role.findMany({
      include: {
        permissions: true,
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des rôles:', error);
    throw new HttpError(500, 'Erreur serveur');
  }
};

// Récupérer les détails d'un rôle spécifique
export const getRoleDetails: GetRoleDetails<{ id: string }, Role | null> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les permissions
  if (!hasPermission(context.user, 'SYSTEM', 'READ')) {
    throw new HttpError(403, 'Accès refusé');
  }

  try {
    return await context.entities.Role.findUnique({
      where: { id: args.id },
      include: {
        permissions: true,
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du rôle:', error);
    throw new HttpError(500, 'Erreur serveur');
  }
};

// Créer un nouveau rôle
export const createRole: CreateRole<CreateRoleInput, Role> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les permissions
  if (!hasPermission(context.user, 'SYSTEM', 'CREATE')) {
    throw new HttpError(403, 'Accès refusé');
  }

  if (!args.name?.trim()) {
    throw new HttpError(400, 'Le nom du rôle est requis');
  }

  try {
    // Vérifier que le nom n'existe pas déjà
    const existingRole = await context.entities.Role.findUnique({
      where: { name: args.name.trim() }
    });

    if (existingRole) {
      throw new HttpError(400, 'Un rôle avec ce nom existe déjà');
    }

    return await context.entities.Role.create({
      data: {
        name: args.name.trim(),
        description: args.description?.trim()
      },
      include: {
        permissions: true,
        users: true
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la création du rôle:', error);
    throw new HttpError(500, 'Erreur serveur');
  }
};

// Mettre à jour un rôle
export const updateRole: UpdateRole<UpdateRoleInput, Role> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les permissions
  if (!hasPermission(context.user, 'SYSTEM', 'UPDATE')) {
    throw new HttpError(403, 'Accès refusé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID du rôle requis');
  }

  try {
    // Vérifier que le rôle existe
    const existingRole = await context.entities.Role.findUnique({
      where: { id: args.id }
    });

    if (!existingRole) {
      throw new HttpError(404, 'Rôle non trouvé');
    }

    // Si le nom change, vérifier qu'il n'existe pas déjà
    if (args.name && args.name !== existingRole.name) {
      const roleWithSameName = await context.entities.Role.findUnique({
        where: { name: args.name.trim() }
      });

      if (roleWithSameName) {
        throw new HttpError(400, 'Un rôle avec ce nom existe déjà');
      }
    }

    const updateData: any = {};
    if (args.name !== undefined) updateData.name = args.name.trim();
    if (args.description !== undefined) updateData.description = args.description?.trim();
    if (args.isActive !== undefined) updateData.isActive = args.isActive;

    return await context.entities.Role.update({
      where: { id: args.id },
      data: updateData,
      include: {
        permissions: true,
        users: true
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la mise à jour du rôle:', error);
    throw new HttpError(500, 'Erreur serveur');
  }
};

// Supprimer un rôle
export const deleteRole: DeleteRole<{ id: string }, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les permissions
  if (!hasPermission(context.user, 'SYSTEM', 'DELETE')) {
    throw new HttpError(403, 'Accès refusé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID du rôle requis');
  }

  try {
    // Vérifier que le rôle existe
    const existingRole = await context.entities.Role.findUnique({
      where: { id: args.id },
      include: { users: true }
    });

    if (!existingRole) {
      throw new HttpError(404, 'Rôle non trouvé');
    }

    // Vérifier qu'aucun utilisateur n'utilise ce rôle
    if (existingRole.users.length > 0) {
      throw new HttpError(400, 'Impossible de supprimer un rôle utilisé par des utilisateurs');
    }

    // Supprimer le rôle (les permissions seront supprimées automatiquement grâce à onDelete: Cascade)
    await context.entities.Role.delete({
      where: { id: args.id }
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la suppression du rôle:', error);
    throw new HttpError(500, 'Erreur serveur');
  }
};

// Ajouter une permission à un rôle
export const addPermission: AddPermission<AddPermissionInput, Permission> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les permissions
  if (!hasPermission(context.user, 'SYSTEM', 'CREATE')) {
    throw new HttpError(403, 'Accès refusé');
  }

  if (!args.roleId || !args.module || !args.action) {
    throw new HttpError(400, 'Rôle, module et action requis');
  }

  try {
    // Vérifier que le rôle existe
    const role = await context.entities.Role.findUnique({
      where: { id: args.roleId }
    });

    if (!role) {
      throw new HttpError(404, 'Rôle non trouvé');
    }

    // Vérifier que la permission n'existe pas déjà
    const existingPermission = await context.entities.Permission.findUnique({
      where: {
        roleId_module_action: {
          roleId: args.roleId,
          module: args.module,
          action: args.action
        }
      }
    });

    if (existingPermission) {
      throw new HttpError(400, 'Cette permission existe déjà pour ce rôle');
    }

    return await context.entities.Permission.create({
      data: {
        roleId: args.roleId,
        module: args.module,
        action: args.action,
        ownRecordsOnly: args.ownRecordsOnly || false
      },
      include: {
        role: true
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de l\'ajout de la permission:', error);
    throw new HttpError(500, 'Erreur serveur');
  }
};

// Mettre à jour une permission
export const updatePermission: UpdatePermission<UpdatePermissionInput, Permission> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les permissions
  if (!hasPermission(context.user, 'SYSTEM', 'UPDATE')) {
    throw new HttpError(403, 'Accès refusé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID de la permission requis');
  }

  try {
    // Vérifier que la permission existe
    const existingPermission = await context.entities.Permission.findUnique({
      where: { id: args.id }
    });

    if (!existingPermission) {
      throw new HttpError(404, 'Permission non trouvée');
    }

    const updateData: any = {};
    if (args.module !== undefined) updateData.module = args.module;
    if (args.action !== undefined) updateData.action = args.action;
    if (args.ownRecordsOnly !== undefined) updateData.ownRecordsOnly = args.ownRecordsOnly;

    return await context.entities.Permission.update({
      where: { id: args.id },
      data: updateData,
      include: {
        role: true
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la mise à jour de la permission:', error);
    throw new HttpError(500, 'Erreur serveur');
  }
};

// Supprimer une permission
export const removePermission: RemovePermission<{ id: string }, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les permissions
  if (!hasPermission(context.user, 'SYSTEM', 'DELETE')) {
    throw new HttpError(403, 'Accès refusé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID de la permission requis');
  }

  try {
    // Vérifier que la permission existe
    const existingPermission = await context.entities.Permission.findUnique({
      where: { id: args.id }
    });

    if (!existingPermission) {
      throw new HttpError(404, 'Permission non trouvée');
    }

    await context.entities.Permission.delete({
      where: { id: args.id }
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la suppression de la permission:', error);
    throw new HttpError(500, 'Erreur serveur');
  }
};

// Assigner un rôle à un utilisateur
export const assignRoleToUser: AssignRoleToUser<AssignRoleInput, User> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les permissions
  if (!hasPermission(context.user, 'USERS', 'UPDATE')) {
    throw new HttpError(403, 'Accès refusé');
  }

  if (!args.userId || !args.roleId) {
    throw new HttpError(400, 'ID utilisateur et ID rôle requis');
  }

  try {
    // Vérifier que l'utilisateur existe
    const user = await context.entities.User.findUnique({
      where: { id: args.userId }
    });

    if (!user) {
      throw new HttpError(404, 'Utilisateur non trouvé');
    }

    // Vérifier que le rôle existe
    const role = await context.entities.Role.findUnique({
      where: { id: args.roleId }
    });

    if (!role) {
      throw new HttpError(404, 'Rôle non trouvé');
    }

    return await context.entities.User.update({
      where: { id: args.userId },
      data: {
        customRoleId: args.roleId
      },
      include: {
        customRole: {
          include: {
            permissions: true
          }
        }
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de l\'assignation du rôle:', error);
    throw new HttpError(500, 'Erreur serveur');
  }
};
