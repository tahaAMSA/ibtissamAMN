import { HttpError } from 'wasp/server';
import type {
  GetAllActivities,
  CreateActivity,
  UpdateActivity,
  DeleteActivity
} from 'wasp/server/operations';
import type { Activity } from 'wasp/entities';
import { ActivityCategory, ActivityStatus } from '@prisma/client';
import { 
  withOrganizationAccess,
  createWithOrganization
} from '../server/multiTenant';

// Types
type CreateActivityInput = {
  title: string;
  category: ActivityCategory;
  description?: string;
  location: string;
  startDate: string;
  endDate?: string;
  capacity?: number;
  status?: ActivityStatus;
};

type UpdateActivityInput = {
  id: string;
  title?: string;
  category?: ActivityCategory;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  capacity?: number;
  status?: ActivityStatus;
};

// Get all activities
export const getAllActivities: GetAllActivities<void, Activity[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    return await context.entities.Activity.findMany({
      orderBy: {
        startDate: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        participations: {
          include: {
            beneficiary: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        _count: {
          select: {
            participations: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des activités');
  }
};

// Create new activity
export const createActivity: CreateActivity<CreateActivityInput, Activity> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Validation des champs requis
  if (!args.title || !args.category || !args.location || !args.startDate) {
    throw new HttpError(400, 'Les champs titre, catégorie, lieu et date de début sont obligatoires');
  }

  return await withOrganizationAccess(context.user, context, async (organizationId) => {
    try {
      return await context.entities.Activity.create({
        data: createWithOrganization(organizationId, {
          title: args.title.trim(),
          category: args.category,
          description: args.description?.trim(),
          location: args.location.trim(),
          startDate: new Date(args.startDate),
          endDate: args.endDate ? new Date(args.endDate) : undefined,
          capacity: args.capacity,
          status: args.status || ActivityStatus.PLANNED,
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
          },
          _count: {
            select: {
              participations: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'activité:', error);
      throw new HttpError(500, 'Erreur serveur lors de la création de l\'activité');
    }
  });
};

// Update activity
export const updateActivity: UpdateActivity<UpdateActivityInput, Activity> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID de l\'activité requis');
  }

  try {
    // Vérifier que l'activité existe
    const existingActivity = await context.entities.Activity.findUnique({
      where: { id: args.id },
      include: {
        user: true
      }
    });

    if (!existingActivity) {
      throw new HttpError(404, 'Activité non trouvée');
    }

    // Vérifier les autorisations (seul le créateur ou un admin peut modifier)
    if (existingActivity.userId !== context.user.id && context.user.role !== 'ADMIN') {
      throw new HttpError(403, 'Vous n\'êtes pas autorisé à modifier cette activité');
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (args.title !== undefined) updateData.title = args.title.trim();
    if (args.category !== undefined) updateData.category = args.category;
    if (args.description !== undefined) updateData.description = args.description?.trim();
    if (args.location !== undefined) updateData.location = args.location.trim();
    if (args.startDate !== undefined) updateData.startDate = new Date(args.startDate);
    if (args.endDate !== undefined) updateData.endDate = args.endDate ? new Date(args.endDate) : null;
    if (args.capacity !== undefined) updateData.capacity = args.capacity;
    if (args.status !== undefined) updateData.status = args.status;

    return await context.entities.Activity.update({
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
        },
        _count: {
          select: {
            participations: true
          }
        }
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la mise à jour de l\'activité:', error);
    throw new HttpError(500, 'Erreur serveur lors de la mise à jour de l\'activité');
  }
};

// Delete activity
export const deleteActivity: DeleteActivity<{ id: string }, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID de l\'activité requis');
  }

  try {
    // Vérifier que l'activité existe
    const existingActivity = await context.entities.Activity.findUnique({
      where: { id: args.id },
      include: {
        user: true,
        participations: true
      }
    });

    if (!existingActivity) {
      throw new HttpError(404, 'Activité non trouvée');
    }

    // Vérifier les autorisations (seul le créateur ou un admin peut supprimer)
    if (existingActivity.userId !== context.user.id && context.user.role !== 'ADMIN') {
      throw new HttpError(403, 'Vous n\'êtes pas autorisé à supprimer cette activité');
    }

    // Les participations seront supprimées automatiquement avec onDelete: Cascade

    // Puis supprimer l'activité
    await context.entities.Activity.delete({
      where: { id: args.id }
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la suppression de l\'activité:', error);
    throw new HttpError(500, 'Erreur serveur lors de la suppression de l\'activité');
  }
};
