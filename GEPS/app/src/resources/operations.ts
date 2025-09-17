import { HttpError } from 'wasp/server';
import type {
  GetAllResources,
  CreateResource,
  UpdateResource,
  DeleteResource
} from 'wasp/server/operations';
import type { Resource } from 'wasp/entities';
import { ResourceType } from '@prisma/client';
import {
  withOrganizationAccess,
  createWithOrganization
} from '../server/multiTenant';

// Types
type CreateResourceInput = {
  name: string;
  type: ResourceType;
  quantity: number;
  unit: string;
  module?: string;
  alertThreshold?: number;
};

type UpdateResourceInput = {
  id: string;
  name?: string;
  type?: ResourceType;
  quantity?: number;
  unit?: string;
  module?: string;
  alertThreshold?: number;
  isActive?: boolean;
};

// Get all resources
export const getAllResources: GetAllResources<void, Resource[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    return await context.entities.Resource.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { type: 'asc' },
        { name: 'asc' }
      ]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des ressources:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des ressources');
  }
};

// Create new resource
export const createResource: CreateResource<CreateResourceInput, Resource> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  return withOrganizationAccess(context.user, context, async (organizationId) => {
    // Validation des champs requis
    if (!args.name || !args.type || args.quantity === undefined || !args.unit) {
      throw new HttpError(400, 'Les champs nom, type, quantité et unité sont obligatoires');
    }

    if (args.quantity < 0) {
      throw new HttpError(400, 'La quantité ne peut pas être négative');
    }

    try {
      return await context.entities.Resource.create({
        data: createWithOrganization(organizationId, {
          name: args.name.trim(),
          type: args.type,
          quantity: args.quantity,
          unit: args.unit.trim(),
          module: args.module?.trim(),
          alertThreshold: args.alertThreshold,
          isActive: true
        })
      });
    } catch (error) {
      console.error('Erreur lors de la création de la ressource:', error);
      throw new HttpError(500, 'Erreur serveur lors de la création de la ressource');
    }
  });
};

// Update resource
export const updateResource: UpdateResource<UpdateResourceInput, Resource> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID de la ressource requis');
  }

  try {
    // Vérifier que la ressource existe
    const existingResource = await context.entities.Resource.findUnique({
      where: { id: args.id }
    });

    if (!existingResource) {
      throw new HttpError(404, 'Ressource non trouvée');
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (args.name !== undefined) updateData.name = args.name.trim();
    if (args.type !== undefined) updateData.type = args.type;
    if (args.quantity !== undefined) {
      if (args.quantity < 0) {
        throw new HttpError(400, 'La quantité ne peut pas être négative');
      }
      updateData.quantity = args.quantity;
    }
    if (args.unit !== undefined) updateData.unit = args.unit.trim();
    if (args.module !== undefined) updateData.module = args.module?.trim();
    if (args.alertThreshold !== undefined) updateData.alertThreshold = args.alertThreshold;
    if (args.isActive !== undefined) updateData.isActive = args.isActive;

    return await context.entities.Resource.update({
      where: { id: args.id },
      data: updateData
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la mise à jour de la ressource:', error);
    throw new HttpError(500, 'Erreur serveur lors de la mise à jour de la ressource');
  }
};

// Delete resource (soft delete)
export const deleteResource: DeleteResource<{ id: string }, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les autorisations (seuls les admins peuvent supprimer)
  if (context.user.role !== 'ADMIN') {
    throw new HttpError(403, 'Seuls les administrateurs peuvent supprimer des ressources');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID de la ressource requis');
  }

  try {
    // Vérifier que la ressource existe
    const existingResource = await context.entities.Resource.findUnique({
      where: { id: args.id }
    });

    if (!existingResource) {
      throw new HttpError(404, 'Ressource non trouvée');
    }

    // Soft delete - marquer comme inactive
    await context.entities.Resource.update({
      where: { id: args.id },
      data: { isActive: false }
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la suppression de la ressource:', error);
    throw new HttpError(500, 'Erreur serveur lors de la suppression de la ressource');
  }
};
