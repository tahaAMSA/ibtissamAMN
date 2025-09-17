import { HttpError } from 'wasp/server';
import type {
  GetAllMeals,
  CreateMeal,
  UpdateMeal,
  DeleteMeal
} from 'wasp/server/operations';
import type { Meal } from 'wasp/entities';
import { MealType } from '@prisma/client';
import { 
  withOrganizationAccess,
  createWithOrganization
} from '../server/multiTenant';

// Types
type CreateMealInput = {
  beneficiaryId: string;
  type: MealType;
  menu: string;
  date: string;
  preferences?: string;
  quantity?: number;
};

type UpdateMealInput = {
  id: string;
  type?: MealType;
  menu?: string;
  date?: string;
  preferences?: string;
  quantity?: number;
};

// Get all meals
export const getAllMeals: GetAllMeals<void, Meal[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    return await context.entities.Meal.findMany({
      orderBy: {
        date: 'desc'
      },
      include: {
        beneficiary: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des repas:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des repas');
  }
};

// Create new meal
export const createMeal: CreateMeal<CreateMealInput, Meal> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Validation des champs requis
  if (!args.beneficiaryId || !args.type || !args.menu || !args.date) {
    throw new HttpError(400, 'Les champs bénéficiaire, type, menu et date sont obligatoires');
  }

  return await withOrganizationAccess(context.user, context, async (organizationId) => {
    try {
      // Vérifier que le bénéficiaire existe
      const beneficiary = await context.entities.Beneficiary.findUnique({
        where: { id: args.beneficiaryId }
      });

      if (!beneficiary) {
        throw new HttpError(404, 'Bénéficiaire non trouvé');
      }

      return await context.entities.Meal.create({
        data: createWithOrganization(organizationId, {
          beneficiaryId: args.beneficiaryId,
          type: args.type,
          menu: args.menu.trim(),
          date: new Date(args.date),
          preferences: args.preferences?.trim(),
          quantity: args.quantity || 1,
          userId: context.user!.id
        }),
        include: {
          beneficiary: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error('Erreur lors de la création du repas:', error);
      throw new HttpError(500, 'Erreur serveur lors de la création du repas');
    }
  });
};

// Update meal
export const updateMeal: UpdateMeal<UpdateMealInput, Meal> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID du repas requis');
  }

  try {
    // Vérifier que le repas existe
    const existingMeal = await context.entities.Meal.findUnique({
      where: { id: args.id }
    });

    if (!existingMeal) {
      throw new HttpError(404, 'Repas non trouvé');
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (args.type !== undefined) updateData.type = args.type;
    if (args.menu !== undefined) updateData.menu = args.menu.trim();
    if (args.date !== undefined) updateData.date = new Date(args.date);
    if (args.preferences !== undefined) updateData.preferences = args.preferences?.trim();
    if (args.quantity !== undefined) updateData.quantity = args.quantity;

    return await context.entities.Meal.update({
      where: { id: args.id },
      data: updateData,
      include: {
        beneficiary: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la mise à jour du repas:', error);
    throw new HttpError(500, 'Erreur serveur lors de la mise à jour du repas');
  }
};

// Delete meal
export const deleteMeal: DeleteMeal<{ id: string }, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID du repas requis');
  }

  try {
    // Vérifier que le repas existe
    const existingMeal = await context.entities.Meal.findUnique({
      where: { id: args.id }
    });

    if (!existingMeal) {
      throw new HttpError(404, 'Repas non trouvé');
    }

    // Suppression physique du repas
    await context.entities.Meal.delete({
      where: { id: args.id }
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la suppression du repas:', error);
    throw new HttpError(500, 'Erreur serveur lors de la suppression du repas');
  }
};
