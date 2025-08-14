import { HttpError } from 'wasp/server';
import type {
  GetAllBeneficiaries,
  GetBeneficiaryById,
  CreateBeneficiary,
  UpdateBeneficiary,
  DeleteBeneficiary
} from 'wasp/server/operations';
import type { Beneficiary } from 'wasp/entities';

// Types
type CreateBeneficiaryInput = {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phone?: string;
  address?: string;
  familySituation?: string;
  professionalSituation?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  nationalId?: string;
  birthPlace?: string;
  maritalStatus?: string;
  numberOfChildren?: number;
  monthlyIncome?: number;
  educationLevel?: string;
  healthConditions?: string;
  notes?: string;
};

type UpdateBeneficiaryInput = {
  id: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  familySituation?: string;
  professionalSituation?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  nationalId?: string;
  birthPlace?: string;
  maritalStatus?: string;
  numberOfChildren?: number;
  monthlyIncome?: number;
  educationLevel?: string;
  healthConditions?: string;
  notes?: string;
  isActive?: boolean;
};

// Get all beneficiaries
export const getAllBeneficiaries: GetAllBeneficiaries<void, Beneficiary[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    return await context.entities.Beneficiary.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        documents: {
          select: {
            id: true,
            type: true,
            status: true
          }
        },
        stays: {
          where: {
            status: 'ACTIVE'
          },
          select: {
            id: true,
            dormitory: true,
            bed: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des bénéficiaires:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des bénéficiaires');
  }
};

// Get beneficiary by ID with full details
export const getBeneficiaryById: GetBeneficiaryById<{ id: string }, Beneficiary | null> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    const beneficiary = await context.entities.Beneficiary.findUnique({
      where: {
        id: args.id
      },
      include: {
        documents: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        stays: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        meals: {
          orderBy: {
            date: 'desc'
          },
          take: 10
        },
        activityParticipations: {
          include: {
            activity: {
              select: {
                title: true,
                category: true,
                startDate: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        entrepreneurialProjects: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        enrollments: {
          orderBy: {
            enrollmentDate: 'desc'
          }
        },
        educations: {
          orderBy: {
            startDate: 'desc'
          }
        }
      }
    });

    if (!beneficiary) {
      throw new HttpError(404, 'Bénéficiaire non trouvé');
    }

    return beneficiary;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la récupération du bénéficiaire:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération du bénéficiaire');
  }
};

// Create new beneficiary
export const createBeneficiary: CreateBeneficiary<CreateBeneficiaryInput, Beneficiary> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Validation des champs requis
  if (!args.firstName || !args.lastName || !args.gender || !args.dateOfBirth) {
    throw new HttpError(400, 'Les champs nom, prénom, genre et date de naissance sont obligatoires');
  }

  try {
    return await context.entities.Beneficiary.create({
      data: {
        firstName: args.firstName.trim(),
        lastName: args.lastName.trim(),
        gender: args.gender,
        dateOfBirth: new Date(args.dateOfBirth),
        phone: args.phone?.trim(),
        address: args.address?.trim(),
        familySituation: args.familySituation?.trim(),
        professionalSituation: args.professionalSituation?.trim(),
        emergencyContact: args.emergencyContact?.trim(),
        emergencyPhone: args.emergencyPhone?.trim(),
        nationalId: args.nationalId?.trim(),
        birthPlace: args.birthPlace?.trim(),
        maritalStatus: args.maritalStatus?.trim(),
        numberOfChildren: args.numberOfChildren || 0,
        monthlyIncome: args.monthlyIncome || 0,
        educationLevel: args.educationLevel?.trim(),
        healthConditions: args.healthConditions?.trim(),
        notes: args.notes?.trim(),
        isActive: true
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du bénéficiaire:', error);
    throw new HttpError(500, 'Erreur serveur lors de la création du bénéficiaire');
  }
};

// Update beneficiary
export const updateBeneficiary: UpdateBeneficiary<UpdateBeneficiaryInput, Beneficiary> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID du bénéficiaire requis');
  }

  try {
    // Vérifier que le bénéficiaire existe
    const existingBeneficiary = await context.entities.Beneficiary.findUnique({
      where: { id: args.id }
    });

    if (!existingBeneficiary) {
      throw new HttpError(404, 'Bénéficiaire non trouvé');
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (args.firstName !== undefined) updateData.firstName = args.firstName.trim();
    if (args.lastName !== undefined) updateData.lastName = args.lastName.trim();
    if (args.gender !== undefined) updateData.gender = args.gender;
    if (args.dateOfBirth !== undefined) updateData.dateOfBirth = new Date(args.dateOfBirth);
    if (args.phone !== undefined) updateData.phone = args.phone?.trim();
    if (args.address !== undefined) updateData.address = args.address?.trim();
    if (args.familySituation !== undefined) updateData.familySituation = args.familySituation?.trim();
    if (args.professionalSituation !== undefined) updateData.professionalSituation = args.professionalSituation?.trim();
    if (args.emergencyContact !== undefined) updateData.emergencyContact = args.emergencyContact?.trim();
    if (args.emergencyPhone !== undefined) updateData.emergencyPhone = args.emergencyPhone?.trim();
    if (args.nationalId !== undefined) updateData.nationalId = args.nationalId?.trim();
    if (args.birthPlace !== undefined) updateData.birthPlace = args.birthPlace?.trim();
    if (args.maritalStatus !== undefined) updateData.maritalStatus = args.maritalStatus?.trim();
    if (args.numberOfChildren !== undefined) updateData.numberOfChildren = args.numberOfChildren;
    if (args.monthlyIncome !== undefined) updateData.monthlyIncome = args.monthlyIncome;
    if (args.educationLevel !== undefined) updateData.educationLevel = args.educationLevel?.trim();
    if (args.healthConditions !== undefined) updateData.healthConditions = args.healthConditions?.trim();
    if (args.notes !== undefined) updateData.notes = args.notes?.trim();
    if (args.isActive !== undefined) updateData.isActive = args.isActive;

    return await context.entities.Beneficiary.update({
      where: { id: args.id },
      data: updateData
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la mise à jour du bénéficiaire:', error);
    throw new HttpError(500, 'Erreur serveur lors de la mise à jour du bénéficiaire');
  }
};

// Delete beneficiary (soft delete - set isActive to false)
export const deleteBeneficiary: DeleteBeneficiary<{ id: string }, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les autorisations (seuls les admins peuvent supprimer)
  if (context.user.role !== 'ADMIN') {
    throw new HttpError(403, 'Seuls les administrateurs peuvent supprimer des bénéficiaires');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID du bénéficiaire requis');
  }

  try {
    // Vérifier que le bénéficiaire existe
    const existingBeneficiary = await context.entities.Beneficiary.findUnique({
      where: { id: args.id }
    });

    if (!existingBeneficiary) {
      throw new HttpError(404, 'Bénéficiaire non trouvé');
    }

    // Soft delete - marquer comme inactif
    await context.entities.Beneficiary.update({
      where: { id: args.id },
      data: { isActive: false }
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la suppression du bénéficiaire:', error);
    throw new HttpError(500, 'Erreur serveur lors de la suppression du bénéficiaire');
  }
};
