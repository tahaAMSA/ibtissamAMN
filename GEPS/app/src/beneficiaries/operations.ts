import { HttpError } from 'wasp/server';
import type {
  GetAllBeneficiaries,
  GetBeneficiaryById,
  CreateBeneficiary,
  UpdateBeneficiary,
  DeleteBeneficiary,
  AssignBeneficiary
} from 'wasp/server/operations';
import type { Beneficiary } from 'wasp/entities';
import { hasPermission, filterByPermissions } from '../server/permissions';
import { notifyDirectorsOfNewArrival } from '../notifications/operations';
import { BeneficiaryStatus, UserRole, NotificationType } from '@prisma/client';
import { 
  getUserOrganizationId, 
  addOrganizationFilter, 
  withOrganizationAccess,
  createWithOrganization,
  checkOrganizationLimits,
  verifyOrganizationAccess
} from '../server/multiTenant';

// Types
type CreateBeneficiaryInput = {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  beneficiaryType?: 'FEMME' | 'ENFANT';
  visitReason?: string; // Nouveau champ pour le motif de visite
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
  beneficiaryType?: 'FEMME' | 'ENFANT';
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

// Get all beneficiaries (avec isolation multi-tenant)
export const getAllBeneficiaries: GetAllBeneficiaries<void, Beneficiary[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les permissions
  if (!hasPermission(context.user, 'BENEFICIARIES', 'READ')) {
    throw new HttpError(403, 'Accès refusé: vous n\'avez pas les permissions pour consulter les bénéficiaires');
  }

  // Utiliser le système multi-tenant
  return await withOrganizationAccess(context.user, context, async (organizationId) => {
    try {
      const beneficiaries = await context.entities.Beneficiary.findMany({
        where: addOrganizationFilter(organizationId, {
          isActive: true
        }),
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

      return beneficiaries;
    } catch (error) {
      console.error('Erreur lors de la récupération des bénéficiaires:', error);
      throw new HttpError(500, 'Erreur serveur lors de la récupération des bénéficiaires');
    }
  });
};

// Get beneficiary by ID with full details (avec vérification multi-tenant)
export const getBeneficiaryById: GetBeneficiaryById<{ id: string }, Beneficiary | null> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Utiliser le système multi-tenant avec vérification d'accès
  return await withOrganizationAccess(context.user, context, async (organizationId) => {
    // Vérifier que le bénéficiaire appartient à l'organisation de l'utilisateur
    await verifyOrganizationAccess(args.id, 'beneficiary', organizationId, context);

    try {
      const beneficiary = await context.entities.Beneficiary.findUnique({
        where: {
          id: args.id,
          organizationId // Double sécurité
        },
      include: {
        // Traçabilité du cycle de vie
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        orientedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
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
  });
};

// Create new beneficiary (avec système multi-tenant)
export const createBeneficiary: CreateBeneficiary<CreateBeneficiaryInput, Beneficiary> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les permissions
  if (!hasPermission(context.user, 'BENEFICIARIES', 'CREATE')) {
    throw new HttpError(403, 'Accès refusé: vous n\'avez pas les permissions pour créer des bénéficiaires');
  }

  // Validation des champs requis
  if (!args.firstName || !args.lastName || !args.gender || !args.dateOfBirth) {
    throw new HttpError(400, 'Les champs nom, prénom, genre et date de naissance sont obligatoires');
  }

  // Utiliser le système multi-tenant
  return await withOrganizationAccess(context.user, context, async (organizationId) => {
    // Vérifier les limites de l'organisation
    await checkOrganizationLimits(organizationId, 'beneficiaries', context);

  try {
    // Déterminer automatiquement le type si non fourni
    let beneficiaryType = args.beneficiaryType;
    if (!beneficiaryType) {
      const birthDate = new Date(args.dateOfBirth);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      beneficiaryType = age < 18 ? 'ENFANT' : 'FEMME';
    }

    // Déterminer le statut initial basé sur le rôle de l'utilisateur
    let initialStatus: any = 'EN_ATTENTE_ACCUEIL';
    if (context.user!.role === UserRole.AGENT_ACCUEIL) {
      initialStatus = 'EN_ATTENTE_ORIENTATION';
    }

    const newBeneficiary = await context.entities.Beneficiary.create({
        data: createWithOrganization(organizationId, {
          firstName: args.firstName.trim(),
          lastName: args.lastName.trim(),
          gender: args.gender,
          dateOfBirth: new Date(args.dateOfBirth),
          beneficiaryType: beneficiaryType,
          status: initialStatus,
          visitReason: args.visitReason?.trim() as any,
          // Enregistrer qui a fait l'accueil
          createdById: context.user!.id,
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
        })
      });

      // Si c'est un agent d'accueil qui crée le bénéficiaire, notifier les directeurs/coordinateurs
      if (context.user!.role === UserRole.AGENT_ACCUEIL) {
        await notifyDirectorsOfNewArrival(context, newBeneficiary, context.user!);
      }

      return newBeneficiary;
    } catch (error) {
      console.error('Erreur lors de la création du bénéficiaire:', error);
      throw new HttpError(500, 'Erreur serveur lors de la création du bénéficiaire');
    }
  });
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
    if (args.beneficiaryType !== undefined) updateData.beneficiaryType = args.beneficiaryType;
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

// Types pour l'assignation
type AssignBeneficiaryInput = {
  beneficiaryId: string;
  assignedToId: string;
  reason?: string;
};

// Assigner un bénéficiaire à une assistante sociale
export const assignBeneficiary: AssignBeneficiary<AssignBeneficiaryInput, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier que l'utilisateur est directeur ou coordinateur
  if (!hasPermission(context.user, 'BENEFICIARIES', 'ASSIGN')) {
    throw new HttpError(403, 'Accès refusé - permissions insuffisantes');
  }

  return await withOrganizationAccess(context.user, context, async (organizationId) => {
    try {
    // Vérifier que le bénéficiaire existe
    const beneficiary = await context.entities.Beneficiary.findUnique({
      where: { id: args.beneficiaryId },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });

    if (!beneficiary) {
      throw new HttpError(404, 'Bénéficiaire non trouvé');
    }

    // Vérifier que l'assistante sociale existe
    const assistanteSociale = await context.entities.User.findUnique({
      where: { id: args.assignedToId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        approvedAt: true
      }
    });

    if (!assistanteSociale) {
      throw new HttpError(404, 'Assistante sociale non trouvée');
    }

    if (!assistanteSociale.isActive || !assistanteSociale.approvedAt) {
      throw new HttpError(400, 'L\'assistante sociale n\'est pas active ou approuvée');
    }

    if (assistanteSociale.role !== UserRole.ASSISTANTE_SOCIALE) {
      throw new HttpError(400, 'Le destinataire doit être une assistante sociale');
    }

    // Mettre à jour le bénéficiaire
    const updatedBeneficiary = await context.entities.Beneficiary.update({
      where: { id: args.beneficiaryId },
      data: {
        status: 'EN_SUIVI' as any,
        // Qui a assigné
        orientedById: context.user!.id,
        orientedAt: new Date(),
        orientationReason: args.reason || 'Assignation directe',
        // Vers qui c'est assigné
        assignedToId: args.assignedToId,
        assignedAt: new Date()
      }
    });

    // Créer une notification pour l'assistante sociale
    await context.entities.Notification.create({
      data: createWithOrganization(organizationId, {
        type: NotificationType.ORIENTATION_REQUEST,
        title: 'Nouveau dossier assigné',
        message: `Un nouveau dossier vous a été assigné : ${beneficiary.firstName} ${beneficiary.lastName}`,
        senderId: context.user!.id,
        receiverId: args.assignedToId,
        beneficiaryId: args.beneficiaryId,
        metadata: {
          assignedBy: `${context.user!.firstName} ${context.user!.lastName}`,
          assignmentDate: new Date().toISOString(),
          reason: args.reason || 'Assignation directe'
        }
      })
    });

      return { success: true };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error('Erreur lors de l\'assignation du bénéficiaire:', error);
      throw new HttpError(500, 'Erreur serveur lors de l\'assignation du bénéficiaire');
    }
  });
};
