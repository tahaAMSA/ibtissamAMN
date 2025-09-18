import { HttpError } from 'wasp/server';
import type { UpdateUserProfile } from 'wasp/server/operations';
import type { User } from 'wasp/entities';
import { convertToDatabase, type Language } from '../translations/utils';

export interface UpdateUserProfileInput {
  firstName?: string | null;
  lastName?: string | null;
  firstNameAr?: string | null;
  lastNameAr?: string | null;
  gender?: 'HOMME' | 'FEMME' | 'AUTRE' | null;
  phone?: string | null;
  dateOfBirth?: Date | null;
  avatar?: string | null;
  preferredLanguage?: Language;
  [key: string]: any; // Index signature pour SuperJSONObject
}

export const updateUserProfile: UpdateUserProfile<UpdateUserProfileInput, User> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (args.firstName !== undefined) updateData.firstName = args.firstName?.trim() || null;
    if (args.lastName !== undefined) updateData.lastName = args.lastName?.trim() || null;
    if (args.firstNameAr !== undefined) updateData.firstNameAr = args.firstNameAr?.trim() || null;
    if (args.lastNameAr !== undefined) updateData.lastNameAr = args.lastNameAr?.trim() || null;
    if (args.gender !== undefined) updateData.gender = args.gender;
    if (args.phone !== undefined) updateData.phone = args.phone?.trim() || null;
    if (args.dateOfBirth !== undefined) updateData.dateOfBirth = args.dateOfBirth;
    if (args.avatar !== undefined) updateData.avatar = args.avatar?.trim() || null;
    
    // Convertir la langue du frontend vers le format base de données
    if (args.preferredLanguage !== undefined) {
      updateData.preferredLanguage = convertToDatabase(args.preferredLanguage);
    }

    const updatedUser = await context.entities.User.update({
      where: { id: context.user.id },
      data: updateData
    });

    return updatedUser;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la mise à jour du profil utilisateur:', error);
    throw new HttpError(500, 'Erreur serveur lors de la mise à jour du profil');
  }
};
