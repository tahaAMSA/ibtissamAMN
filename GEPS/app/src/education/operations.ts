import { HttpError } from 'wasp/server';
import type {
  GetAllEducations,
  CreateEducation,
  UpdateEducation,
  DeleteEducation
} from 'wasp/server/operations';
import type { Education } from 'wasp/entities';
import { EducationStatus } from '@prisma/client';
import { 
  withOrganizationAccess,
  createWithOrganization
} from '../server/multiTenant';

// Types
type CreateEducationInput = {
  beneficiaryId: string;
  institution: string;
  level: string;
  academicYear: string;
  startDate: string;
  endDate?: string;
  results?: string;
  activeSupport?: boolean;
  status?: EducationStatus;
};

type UpdateEducationInput = {
  id: string;
  institution?: string;
  level?: string;
  academicYear?: string;
  startDate?: string;
  endDate?: string;
  results?: string;
  activeSupport?: boolean;
  status?: EducationStatus;
};

// Get all educations
export const getAllEducations: GetAllEducations<void, Education[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    return await context.entities.Education.findMany({
      orderBy: {
        startDate: 'desc'
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
    console.error('Erreur lors de la récupération des éducations:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des éducations');
  }
};

// Create new education
export const createEducation: CreateEducation<CreateEducationInput, Education> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Validation des champs requis
  if (!args.beneficiaryId || !args.institution || !args.level || !args.academicYear || !args.startDate) {
    throw new HttpError(400, 'Les champs bénéficiaire, institution, niveau, année scolaire et date de début sont obligatoires');
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

      return await context.entities.Education.create({
        data: createWithOrganization(organizationId, {
          beneficiaryId: args.beneficiaryId,
          institution: args.institution.trim(),
          level: args.level.trim(),
          academicYear: args.academicYear.trim(),
          startDate: new Date(args.startDate),
          endDate: args.endDate ? new Date(args.endDate) : undefined,
          results: args.results?.trim(),
          activeSupport: args.activeSupport || false,
          status: args.status || EducationStatus.ACTIVE,
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
      console.error('Erreur lors de la création de l\'éducation:', error);
      throw new HttpError(500, 'Erreur serveur lors de la création de l\'éducation');
    }
  });
};

// Update education
export const updateEducation: UpdateEducation<UpdateEducationInput, Education> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID de l\'éducation requis');
  }

  try {
    // Vérifier que l'éducation existe
    const existingEducation = await context.entities.Education.findUnique({
      where: { id: args.id }
    });

    if (!existingEducation) {
      throw new HttpError(404, 'Éducation non trouvée');
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (args.institution !== undefined) updateData.institution = args.institution.trim();
    if (args.level !== undefined) updateData.level = args.level.trim();
    if (args.academicYear !== undefined) updateData.academicYear = args.academicYear.trim();
    if (args.startDate !== undefined) updateData.startDate = new Date(args.startDate);
    if (args.endDate !== undefined) updateData.endDate = args.endDate ? new Date(args.endDate) : null;
    if (args.results !== undefined) updateData.results = args.results?.trim();
    if (args.activeSupport !== undefined) updateData.activeSupport = args.activeSupport;
    if (args.status !== undefined) updateData.status = args.status;

    return await context.entities.Education.update({
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
    console.error('Erreur lors de la mise à jour de l\'éducation:', error);
    throw new HttpError(500, 'Erreur serveur lors de la mise à jour de l\'éducation');
  }
};

// Delete education
export const deleteEducation: DeleteEducation<{ id: string }, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID de l\'éducation requis');
  }

  try {
    // Vérifier que l'éducation existe
    const existingEducation = await context.entities.Education.findUnique({
      where: { id: args.id }
    });

    if (!existingEducation) {
      throw new HttpError(404, 'Éducation non trouvée');
    }

    // Suppression physique de l'éducation
    await context.entities.Education.delete({
      where: { id: args.id }
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la suppression de l\'éducation:', error);
    throw new HttpError(500, 'Erreur serveur lors de la suppression de l\'éducation');
  }
};
