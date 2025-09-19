import { HttpError } from 'wasp/server';
import type { 
  GetCurrentOrganization, 
  UpdateOrganization 
} from 'wasp/server/operations';
import type { Organization } from 'wasp/entities';

export const getCurrentOrganization: GetCurrentOrganization<void, Organization | null> = async (
  _args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Utilisateur non authentifié');
  }

  // Vérifier les permissions (seuls les admins peuvent gérer l'organisation)
  if (!context.user.isAdmin && context.user.role !== 'ADMIN' && context.user.role !== 'DIRECTEUR') {
    throw new HttpError(403, 'Permission refusée - accès admin requis');
  }

  try {
    // Récupérer l'organisation de l'utilisateur connecté
    const organization = await context.entities.Organization.findUnique({
      where: {
        id: context.user.organizationId || ''
      }
    });

    return organization;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'organisation:', error);
    throw new HttpError(500, 'Erreur lors de la récupération des données');
  }
};

type UpdateOrganizationArgs = {
  id: string;
  name?: string;
  description?: string;
  adminEmail?: string;
  phone?: string;
  address?: string;
  website?: string;
  logo?: string;
};

export const updateOrganization: UpdateOrganization<UpdateOrganizationArgs, Organization> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Utilisateur non authentifié');
  }

  // Vérifier les permissions (seuls les admins peuvent modifier l'organisation)
  if (!context.user.isAdmin && context.user.role !== 'ADMIN' && context.user.role !== 'DIRECTEUR') {
    throw new HttpError(403, 'Permission refusée - accès admin requis');
  }

  // Vérifier que l'utilisateur modifie bien son organisation
  if (context.user.organizationId !== args.id) {
    throw new HttpError(403, 'Vous ne pouvez modifier que votre propre organisation');
  }

  try {
    // Valider les données
    if (args.name && args.name.trim().length < 2) {
      throw new HttpError(400, 'Le nom de l\'organisation doit contenir au moins 2 caractères');
    }

    if (args.adminEmail && !isValidEmail(args.adminEmail)) {
      throw new HttpError(400, 'Format d\'email invalide');
    }

    if (args.website && !isValidUrl(args.website)) {
      throw new HttpError(400, 'Format d\'URL invalide pour le site web');
    }

    if (args.logo && !isValidUrl(args.logo)) {
      throw new HttpError(400, 'Format d\'URL invalide pour le logo');
    }

    // Préparer les données à mettre à jour (exclure les valeurs undefined)
    const updateData: any = {};
    
    if (args.name !== undefined) updateData.name = args.name.trim();
    if (args.description !== undefined) updateData.description = args.description.trim() || null;
    if (args.adminEmail !== undefined) updateData.adminEmail = args.adminEmail.trim();
    if (args.phone !== undefined) updateData.phone = args.phone.trim() || null;
    if (args.address !== undefined) updateData.address = args.address.trim() || null;
    if (args.website !== undefined) updateData.website = args.website.trim() || null;
    if (args.logo !== undefined) updateData.logo = args.logo.trim() || null;

    // Mettre à jour l'organisation
    const updatedOrganization = await context.entities.Organization.update({
      where: { id: args.id },
      data: updateData
    });

    return updatedOrganization;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la mise à jour de l\'organisation:', error);
    throw new HttpError(500, 'Erreur lors de la mise à jour de l\'organisation');
  }
};

// Fonctions utilitaires de validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
