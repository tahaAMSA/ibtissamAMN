import { HttpError } from 'wasp/server';
import type {
  GetAllInterventions,
  CreateIntervention,
  UpdateIntervention,
  DeleteIntervention
} from 'wasp/server/operations';
import type { SocialIntervention } from 'wasp/entities';
import { InterventionStatus } from '@prisma/client';
import { 
  withOrganizationAccess,
  createWithOrganization
} from '../server/multiTenant';

// Types
type CreateInterventionInput = {
  title: string;
  description: string;
  interventionDate: string;
  duration?: number;
  location?: string;
  status?: InterventionStatus;
};

type UpdateInterventionInput = {
  id: string;
  title?: string;
  description?: string;
  interventionDate?: string;
  duration?: number;
  location?: string;
  status?: InterventionStatus;
};

// Get all interventions
export const getAllInterventions: GetAllInterventions<void, SocialIntervention[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    return await context.entities.SocialIntervention.findMany({
      orderBy: {
        interventionDate: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des interventions:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des interventions');
  }
};

// Create new intervention
export const createIntervention: CreateIntervention<CreateInterventionInput, SocialIntervention> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Validation des champs requis
  if (!args.title || !args.description || !args.interventionDate) {
    throw new HttpError(400, 'Les champs titre, description et date d\'intervention sont obligatoires');
  }

  return await withOrganizationAccess(context.user, context, async (organizationId) => {
    try {
      return await context.entities.SocialIntervention.create({
        data: createWithOrganization(organizationId, {
          title: args.title.trim(),
          description: args.description.trim(),
          interventionDate: new Date(args.interventionDate),
          duration: args.duration,
          location: args.location?.trim(),
          status: args.status || InterventionStatus.PLANNED,
          userId: context.user!.id
        }),
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'intervention:', error);
      throw new HttpError(500, 'Erreur serveur lors de la création de l\'intervention');
    }
  });
};

// Update intervention
export const updateIntervention: UpdateIntervention<UpdateInterventionInput, SocialIntervention> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID de l\'intervention requis');
  }

  try {
    // Vérifier que l'intervention existe
    const existingIntervention = await context.entities.SocialIntervention.findUnique({
      where: { id: args.id },
      include: {
        user: true
      }
    });

    if (!existingIntervention) {
      throw new HttpError(404, 'Intervention non trouvée');
    }

    // Vérifier les autorisations (seul le créateur ou un admin peut modifier)
    if (existingIntervention.userId !== context.user.id && context.user.role !== 'ADMIN') {
      throw new HttpError(403, 'Vous n\'êtes pas autorisé à modifier cette intervention');
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (args.title !== undefined) updateData.title = args.title.trim();
    if (args.description !== undefined) updateData.description = args.description.trim();
    if (args.interventionDate !== undefined) updateData.interventionDate = new Date(args.interventionDate);
    if (args.duration !== undefined) updateData.duration = args.duration;
    if (args.location !== undefined) updateData.location = args.location?.trim();
    if (args.status !== undefined) updateData.status = args.status;

    return await context.entities.SocialIntervention.update({
      where: { id: args.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la mise à jour de l\'intervention:', error);
    throw new HttpError(500, 'Erreur serveur lors de la mise à jour de l\'intervention');
  }
};

// Delete intervention
export const deleteIntervention: DeleteIntervention<{ id: string }, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID de l\'intervention requis');
  }

  try {
    // Vérifier que l'intervention existe
    const existingIntervention = await context.entities.SocialIntervention.findUnique({
      where: { id: args.id },
      include: {
        user: true
      }
    });

    if (!existingIntervention) {
      throw new HttpError(404, 'Intervention non trouvée');
    }

    // Vérifier les autorisations (seul le créateur ou un admin peut supprimer)
    if (existingIntervention.userId !== context.user.id && context.user.role !== 'ADMIN') {
      throw new HttpError(403, 'Vous n\'êtes pas autorisé à supprimer cette intervention');
    }

    // Suppression physique de l'intervention
    await context.entities.SocialIntervention.delete({
      where: { id: args.id }
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la suppression de l\'intervention:', error);
    throw new HttpError(500, 'Erreur serveur lors de la suppression de l\'intervention');
  }
};
