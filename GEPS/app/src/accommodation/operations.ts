import { HttpError } from 'wasp/server';
import type {
  GetAllStays,
  CreateStay,
  UpdateStay,
  DeleteStay
} from 'wasp/server/operations';
import type { Stay } from 'wasp/entities';
import { StayStatus } from '@prisma/client';

// Types
type CreateStayInput = {
  beneficiaryId: string;
  dormitory: string;
  bed: string;
  checkInDate: string;
  checkOutDate?: string;
  status?: StayStatus;
};

type UpdateStayInput = {
  id: string;
  dormitory?: string;
  bed?: string;
  checkInDate?: string;
  checkOutDate?: string;
  status?: StayStatus;
};

// Get all stays
export const getAllStays: GetAllStays<void, Stay[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    return await context.entities.Stay.findMany({
      orderBy: {
        checkInDate: 'desc'
      },
      include: {
        beneficiary: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gender: true
          }
        },
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
    console.error('Erreur lors de la récupération des séjours:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des séjours');
  }
};

// Create new stay
export const createStay: CreateStay<CreateStayInput, Stay> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Validation des champs requis
  if (!args.beneficiaryId || !args.dormitory || !args.bed || !args.checkInDate) {
    throw new HttpError(400, 'Les champs bénéficiaire, dortoir, lit et date d\'entrée sont obligatoires');
  }

  try {
    // Vérifier que le bénéficiaire existe
    const beneficiary = await context.entities.Beneficiary.findUnique({
      where: { id: args.beneficiaryId }
    });

    if (!beneficiary) {
      throw new HttpError(404, 'Bénéficiaire non trouvé');
    }

    // Vérifier qu'il n'y a pas déjà un séjour actif pour ce bénéficiaire
    const existingActiveStay = await context.entities.Stay.findFirst({
      where: {
        beneficiaryId: args.beneficiaryId,
        status: StayStatus.ACTIVE
      }
    });

    if (existingActiveStay) {
      throw new HttpError(409, 'Ce bénéficiaire a déjà un séjour actif');
    }

    // Vérifier que le lit n'est pas déjà occupé
    const existingBedStay = await context.entities.Stay.findFirst({
      where: {
        dormitory: args.dormitory,
        bed: args.bed,
        status: StayStatus.ACTIVE
      }
    });

    if (existingBedStay) {
      throw new HttpError(409, 'Ce lit est déjà occupé');
    }

    return await context.entities.Stay.create({
      data: {
        beneficiaryId: args.beneficiaryId,
        dormitory: args.dormitory.trim(),
        bed: args.bed.trim(),
        checkInDate: new Date(args.checkInDate),
        checkOutDate: args.checkOutDate ? new Date(args.checkOutDate) : undefined,
        status: args.status || StayStatus.ACTIVE,
        userId: context.user.id
      },
      include: {
        beneficiary: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gender: true
          }
        },
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
    console.error('Erreur lors de la création du séjour:', error);
    throw new HttpError(500, 'Erreur serveur lors de la création du séjour');
  }
};

// Update stay
export const updateStay: UpdateStay<UpdateStayInput, Stay> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID du séjour requis');
  }

  try {
    // Vérifier que le séjour existe
    const existingStay = await context.entities.Stay.findUnique({
      where: { id: args.id },
      include: {
        user: true
      }
    });

    if (!existingStay) {
      throw new HttpError(404, 'Séjour non trouvé');
    }

    // Vérifier les autorisations (seul le créateur ou un admin peut modifier)
    if (existingStay.userId !== context.user.id && context.user.role !== 'ADMIN') {
      throw new HttpError(403, 'Vous n\'êtes pas autorisé à modifier ce séjour');
    }

    // Si on change le lit, vérifier qu'il n'est pas occupé
    if (args.dormitory && args.bed && 
        (args.dormitory !== existingStay.dormitory || args.bed !== existingStay.bed)) {
      const existingBedStay = await context.entities.Stay.findFirst({
        where: {
          dormitory: args.dormitory,
          bed: args.bed,
          status: StayStatus.ACTIVE,
          id: { not: args.id } // Exclure le séjour actuel
        }
      });

      if (existingBedStay) {
        throw new HttpError(409, 'Ce lit est déjà occupé');
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (args.dormitory !== undefined) updateData.dormitory = args.dormitory.trim();
    if (args.bed !== undefined) updateData.bed = args.bed.trim();
    if (args.checkInDate !== undefined) updateData.checkInDate = new Date(args.checkInDate);
    if (args.checkOutDate !== undefined) {
      updateData.checkOutDate = args.checkOutDate ? new Date(args.checkOutDate) : null;
    }
    if (args.status !== undefined) updateData.status = args.status;

    return await context.entities.Stay.update({
      where: { id: args.id },
      data: updateData,
      include: {
        beneficiary: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gender: true
          }
        },
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
    console.error('Erreur lors de la mise à jour du séjour:', error);
    throw new HttpError(500, 'Erreur serveur lors de la mise à jour du séjour');
  }
};

// Delete stay
export const deleteStay: DeleteStay<{ id: string }, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID du séjour requis');
  }

  try {
    // Vérifier que le séjour existe
    const existingStay = await context.entities.Stay.findUnique({
      where: { id: args.id },
      include: {
        user: true
      }
    });

    if (!existingStay) {
      throw new HttpError(404, 'Séjour non trouvé');
    }

    // Vérifier les autorisations (seul le créateur ou un admin peut supprimer)
    if (existingStay.userId !== context.user.id && context.user.role !== 'ADMIN') {
      throw new HttpError(403, 'Vous n\'êtes pas autorisé à supprimer ce séjour');
    }

    // Suppression physique du séjour
    await context.entities.Stay.delete({
      where: { id: args.id }
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la suppression du séjour:', error);
    throw new HttpError(500, 'Erreur serveur lors de la suppression du séjour');
  }
};
