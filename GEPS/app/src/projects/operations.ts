import { HttpError } from 'wasp/server';
import type {
  GetAllProjects,
  CreateProject,
  UpdateProject,
  DeleteProject
} from 'wasp/server/operations';
import type { EntrepreneurialProject } from 'wasp/entities';
import { ProjectProgress, ProjectStatus } from '@prisma/client';
import {
  withOrganizationAccess,
  createWithOrganization
} from '../server/multiTenant';

// Types
type CreateProjectInput = {
  beneficiaryId: string;
  title: string;
  description: string;
  idea: string;
  mentoring?: string;
  progress?: ProjectProgress;
  estimatedBudget?: number;
  status?: ProjectStatus;
};

type UpdateProjectInput = {
  id: string;
  title?: string;
  description?: string;
  idea?: string;
  mentoring?: string;
  progress?: ProjectProgress;
  estimatedBudget?: number;
  status?: ProjectStatus;
};

// Get all projects
export const getAllProjects: GetAllProjects<void, EntrepreneurialProject[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    return await context.entities.EntrepreneurialProject.findMany({
      orderBy: {
        createdAt: 'desc'
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
            lastName: true,
            role: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des projets');
  }
};

// Create new project
export const createProject: CreateProject<CreateProjectInput, EntrepreneurialProject> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  return withOrganizationAccess(context.user, context, async (organizationId) => {
    // Validation des champs requis
    if (!args.beneficiaryId || !args.title || !args.description || !args.idea) {
      throw new HttpError(400, 'Les champs bénéficiaire, titre, description et idée sont obligatoires');
    }

    try {
      // Vérifier que le bénéficiaire existe
      const beneficiary = await context.entities.Beneficiary.findUnique({
        where: { id: args.beneficiaryId }
      });

      if (!beneficiary) {
        throw new HttpError(404, 'Bénéficiaire non trouvé');
      }

      return await context.entities.EntrepreneurialProject.create({
        data: createWithOrganization(organizationId, {
          beneficiaryId: args.beneficiaryId,
          title: args.title.trim(),
          description: args.description.trim(),
          idea: args.idea.trim(),
          mentoring: args.mentoring?.trim(),
          progress: args.progress || ProjectProgress.IDEA,
          estimatedBudget: args.estimatedBudget,
          status: args.status || ProjectStatus.ACTIVE,
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
      console.error('Erreur lors de la création du projet:', error);
      throw new HttpError(500, 'Erreur serveur lors de la création du projet');
    }
  });
};

// Update project
export const updateProject: UpdateProject<UpdateProjectInput, EntrepreneurialProject> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID du projet requis');
  }

  try {
    // Vérifier que le projet existe
    const existingProject = await context.entities.EntrepreneurialProject.findUnique({
      where: { id: args.id },
      include: {
        user: true
      }
    });

    if (!existingProject) {
      throw new HttpError(404, 'Projet non trouvé');
    }

    // Vérifier les autorisations (seul le créateur ou un admin peut modifier)
    if (existingProject.userId !== context.user.id && context.user.role !== 'ADMIN') {
      throw new HttpError(403, 'Vous n\'êtes pas autorisé à modifier ce projet');
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (args.title !== undefined) updateData.title = args.title.trim();
    if (args.description !== undefined) updateData.description = args.description.trim();
    if (args.idea !== undefined) updateData.idea = args.idea.trim();
    if (args.mentoring !== undefined) updateData.mentoring = args.mentoring?.trim();
    if (args.progress !== undefined) updateData.progress = args.progress;
    if (args.estimatedBudget !== undefined) updateData.estimatedBudget = args.estimatedBudget;
    if (args.status !== undefined) updateData.status = args.status;

    return await context.entities.EntrepreneurialProject.update({
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
    console.error('Erreur lors de la mise à jour du projet:', error);
    throw new HttpError(500, 'Erreur serveur lors de la mise à jour du projet');
  }
};

// Delete project
export const deleteProject: DeleteProject<{ id: string }, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID du projet requis');
  }

  try {
    // Vérifier que le projet existe
    const existingProject = await context.entities.EntrepreneurialProject.findUnique({
      where: { id: args.id },
      include: {
        user: true
      }
    });

    if (!existingProject) {
      throw new HttpError(404, 'Projet non trouvé');
    }

    // Vérifier les autorisations (seul le créateur ou un admin peut supprimer)
    if (existingProject.userId !== context.user.id && context.user.role !== 'ADMIN') {
      throw new HttpError(403, 'Vous n\'êtes pas autorisé à supprimer ce projet');
    }

    // Suppression physique du projet
    await context.entities.EntrepreneurialProject.delete({
      where: { id: args.id }
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la suppression du projet:', error);
    throw new HttpError(500, 'Erreur serveur lors de la suppression du projet');
  }
};
