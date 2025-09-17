import { HttpError } from 'wasp/server';
import type {
  GetAllTraining,
  CreateTraining,
  UpdateTraining,
  DeleteTraining
} from 'wasp/server/operations';
import type { Training } from 'wasp/entities';
import { ActivityStatus } from '@prisma/client';
import {
  withOrganizationAccess,
  createWithOrganization
} from '../server/multiTenant';

// Types
type CreateTrainingInput = {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  capacity?: number;
  status?: ActivityStatus;
};

type UpdateTrainingInput = {
  id: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  capacity?: number;
  status?: ActivityStatus;
};

// Get all training
export const getAllTraining: GetAllTraining<void, Training[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    return await context.entities.Training.findMany({
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
        beneficiaries: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            beneficiaries: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des formations');
  }
};

// Create new training
export const createTraining: CreateTraining<CreateTrainingInput, Training> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  return withOrganizationAccess(context.user, context, async (organizationId) => {
    // Validation des champs requis
    if (!args.title || !args.startDate) {
      throw new HttpError(400, 'Les champs titre et date de début sont obligatoires');
    }

    try {
      return await context.entities.Training.create({
        data: createWithOrganization(organizationId, {
          title: args.title.trim(),
          description: args.description?.trim(),
          startDate: new Date(args.startDate),
          endDate: args.endDate ? new Date(args.endDate) : undefined,
          location: args.location?.trim(),
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
            beneficiaries: true
          }
        }
      }
      });
    } catch (error) {
      console.error('Erreur lors de la création de la formation:', error);
      throw new HttpError(500, 'Erreur serveur lors de la création de la formation');
    }
  });
};

// Update training
export const updateTraining: UpdateTraining<UpdateTrainingInput, Training> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID de la formation requis');
  }

  try {
    // Vérifier que la formation existe
    const existingTraining = await context.entities.Training.findUnique({
      where: { id: args.id },
      include: {
        user: true
      }
    });

    if (!existingTraining) {
      throw new HttpError(404, 'Formation non trouvée');
    }

    // Vérifier les autorisations (seul le créateur ou un admin peut modifier)
    if (existingTraining.userId !== context.user.id && context.user.role !== 'ADMIN') {
      throw new HttpError(403, 'Vous n\'êtes pas autorisé à modifier cette formation');
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (args.title !== undefined) updateData.title = args.title.trim();
    if (args.description !== undefined) updateData.description = args.description?.trim();
    if (args.startDate !== undefined) updateData.startDate = new Date(args.startDate);
    if (args.endDate !== undefined) updateData.endDate = args.endDate ? new Date(args.endDate) : null;
    if (args.location !== undefined) updateData.location = args.location?.trim();
    if (args.capacity !== undefined) updateData.capacity = args.capacity;
    if (args.status !== undefined) updateData.status = args.status;

    return await context.entities.Training.update({
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
            beneficiaries: true
          }
        }
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la mise à jour de la formation:', error);
    throw new HttpError(500, 'Erreur serveur lors de la mise à jour de la formation');
  }
};

// Delete training
export const deleteTraining: DeleteTraining<{ id: string }, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID de la formation requis');
  }

  try {
    // Vérifier que la formation existe
    const existingTraining = await context.entities.Training.findUnique({
      where: { id: args.id },
      include: {
        user: true,
        beneficiaries: true
      }
    });

    if (!existingTraining) {
      throw new HttpError(404, 'Formation non trouvée');
    }

    // Vérifier les autorisations (seul le créateur ou un admin peut supprimer)
    if (existingTraining.userId !== context.user.id && context.user.role !== 'ADMIN') {
      throw new HttpError(403, 'Vous n\'êtes pas autorisé à supprimer cette formation');
    }

    // Supprimer la formation (les relations many-to-many seront automatiquement supprimées)
    await context.entities.Training.delete({
      where: { id: args.id }
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la suppression de la formation:', error);
    throw new HttpError(500, 'Erreur serveur lors de la suppression de la formation');
  }
};
