import { HttpError } from 'wasp/server';
import type { 
  GetAllNotifications,
  GetUnreadNotifications,
  CreateNotification,
  MarkNotificationAsRead,
  OrientBeneficiary,
  GetAssistantesSociales
} from 'wasp/server/operations';
import type { Notification, Beneficiary, User } from 'wasp/entities';
import { 
  NotificationType, 
  NotificationStatus, 
  BeneficiaryStatus,
  UserRole 
} from '@prisma/client';

// Types pour les opérations
type NotificationWithRelations = Notification & {
  sender: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    role: UserRole;
  };
  beneficiary?: {
    id: string;
    firstName: string;
    lastName: string;
    beneficiaryType: string;
  } | null;
};

type CreateNotificationInput = {
  type: NotificationType;
  title: string;
  message: string;
  receiverId: string;
  beneficiaryId?: string;
  metadata?: any;
};

type OrientBeneficiaryInput = {
  beneficiaryId: string;
  assignedToId: string;
  reason?: string;
};

// Récupérer toutes les notifications de l'utilisateur connecté
export const getAllNotifications: GetAllNotifications<void, NotificationWithRelations[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    return await context.entities.Notification.findMany({
      where: {
        receiverId: context.user.id
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        beneficiary: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            beneficiaryType: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des notifications');
  }
};

// Récupérer les notifications non lues
export const getUnreadNotifications: GetUnreadNotifications<void, NotificationWithRelations[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    return await context.entities.Notification.findMany({
      where: {
        receiverId: context.user.id,
        status: NotificationStatus.UNREAD
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        beneficiary: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            beneficiaryType: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications non lues:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des notifications non lues');
  }
};

// Créer une notification
export const createNotification: CreateNotification<CreateNotificationInput, Notification> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Validation des champs requis
  if (!args.type || !args.title || !args.message || !args.receiverId) {
    throw new HttpError(400, 'Les champs type, titre, message et destinataire sont obligatoires');
  }

  try {
    // Vérifier que le destinataire existe
    const receiver = await context.entities.User.findUnique({
      where: { id: args.receiverId }
    });

    if (!receiver) {
      throw new HttpError(404, 'Destinataire non trouvé');
    }

    // Si un bénéficiaire est mentionné, vérifier qu'il existe
    if (args.beneficiaryId) {
      const beneficiary = await context.entities.Beneficiary.findUnique({
        where: { id: args.beneficiaryId }
      });

      if (!beneficiary) {
        throw new HttpError(404, 'Bénéficiaire non trouvé');
      }
    }

    return await context.entities.Notification.create({
      data: {
        type: args.type,
        title: args.title.trim(),
        message: args.message.trim(),
        senderId: context.user.id,
        receiverId: args.receiverId,
        beneficiaryId: args.beneficiaryId,
        metadata: args.metadata,
        status: NotificationStatus.UNREAD
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la création de la notification:', error);
    throw new HttpError(500, 'Erreur serveur lors de la création de la notification');
  }
};

// Marquer une notification comme lue
export const markNotificationAsRead: MarkNotificationAsRead<{ notificationId: string }, Notification> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    // Vérifier que la notification existe et appartient à l'utilisateur
    const notification = await context.entities.Notification.findFirst({
      where: {
        id: args.notificationId,
        receiverId: context.user.id
      }
    });

    if (!notification) {
      throw new HttpError(404, 'Notification non trouvée');
    }

    return await context.entities.Notification.update({
      where: { id: args.notificationId },
      data: { 
        status: NotificationStatus.READ,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la mise à jour de la notification:', error);
    throw new HttpError(500, 'Erreur serveur lors de la mise à jour de la notification');
  }
};

// Orienter un bénéficiaire vers une assistante sociale
export const orientBeneficiary: OrientBeneficiary<OrientBeneficiaryInput, Beneficiary> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier que l'utilisateur a le droit d'orienter (DIRECTEUR ou COORDINATEUR)
  if (context.user.role !== UserRole.DIRECTEUR && 
      context.user.role !== UserRole.COORDINATEUR && 
      !context.user.isAdmin) {
    throw new HttpError(403, 'Accès refusé. Seuls les directeurs et coordinateurs peuvent orienter les bénéficiaires');
  }

  // Validation des champs requis
  if (!args.beneficiaryId || !args.assignedToId) {
    throw new HttpError(400, 'Les champs bénéficiaire et assigné à sont obligatoires');
  }

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
        }
      }
    });

    if (!beneficiary) {
      throw new HttpError(404, 'Bénéficiaire non trouvé');
    }

    // Vérifier que l'assistante sociale existe
    const assistanteSociale = await context.entities.User.findUnique({
      where: { id: args.assignedToId }
    });

    if (!assistanteSociale) {
      throw new HttpError(404, 'Assistante sociale non trouvée');
    }

    // Vérifier que c'est bien une assistante sociale
    if (assistanteSociale.role !== UserRole.ASSISTANTE_SOCIALE) {
      throw new HttpError(400, 'Le destinataire doit être une assistante sociale');
    }

    // Mettre à jour le bénéficiaire avec la traçabilité complète
    const updatedBeneficiary = await context.entities.Beneficiary.update({
      where: { id: args.beneficiaryId },
      data: {
        status: 'ORIENTE' as any,
        // Qui a orienté
        orientedById: context.user.id,
        orientedAt: new Date(),
        orientationReason: args.reason,
        // Vers qui c'est assigné
        assignedToId: args.assignedToId,
        assignedAt: new Date()
      }
    });

    // Créer une notification pour l'assistante sociale
    await context.entities.Notification.create({
      data: {
        type: NotificationType.ORIENTATION_REQUEST,
        title: 'Nouvelle orientation',
        message: `Le bénéficiaire ${beneficiary.firstName} ${beneficiary.lastName} vous a été assigné(e) par ${context.user.firstName} ${context.user.lastName}. ${args.reason ? `Raison: ${args.reason}` : ''}`,
        senderId: context.user.id,
        receiverId: args.assignedToId,
        beneficiaryId: args.beneficiaryId,
        metadata: {
          orientationReason: args.reason,
          orientationDate: new Date().toISOString()
        }
      }
    });

    return updatedBeneficiary;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de l\'orientation du bénéficiaire:', error);
    throw new HttpError(500, 'Erreur serveur lors de l\'orientation du bénéficiaire');
  }
};

// Récupérer toutes les assistantes sociales actives
export const getAssistantesSociales: GetAssistantesSociales<void, any[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier que l'utilisateur a le droit d'orienter (DIRECTEUR ou COORDINATEUR)
  if (context.user.role !== UserRole.DIRECTEUR && 
      context.user.role !== UserRole.COORDINATEUR && 
      !context.user.isAdmin) {
    throw new HttpError(403, 'Accès refusé. Seuls les directeurs et coordinateurs peuvent voir les assistantes sociales');
  }

  try {
    return await context.entities.User.findMany({
      where: {
        role: UserRole.ASSISTANTE_SOCIALE,
        isActive: true,
        status: 'APPROVED'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
      },
      orderBy: {
        firstName: 'asc'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des assistantes sociales:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des assistantes sociales');
  }
};

// Fonction utilitaire pour notifier les directeurs et coordinateurs d'une nouvelle arrivée
export async function notifyDirectorsOfNewArrival(
  context: any,
  beneficiary: Beneficiary,
  createdBy: User
) {
  try {
    // Récupérer tous les directeurs et coordinateurs actifs
    const recipients = await context.entities.User.findMany({
      where: {
        OR: [
          { role: UserRole.DIRECTEUR },
          { role: UserRole.COORDINATEUR }
        ],
        isActive: true,
        status: 'APPROVED'
      }
    });

    // Créer une notification pour chaque destinataire
    const notifications = recipients.map((recipient: any) => ({
      type: NotificationType.BENEFICIARY_ARRIVAL,
      title: 'Nouvelle arrivée',
      message: `Un(e) nouveau/nouvelle bénéficiaire ${beneficiary.firstName} ${beneficiary.lastName} a été enregistré(e) par ${createdBy.firstName} ${createdBy.lastName}. Motif: ${beneficiary.visitReason || 'Non spécifié'}`,
      senderId: createdBy.id,
      receiverId: recipient.id,
      beneficiaryId: beneficiary.id,
      metadata: {
        arrivalDate: beneficiary.createdAt.toISOString(),
        visitReason: beneficiary.visitReason
      }
    }));

    // Créer toutes les notifications une par une
    for (const notification of notifications) {
      await context.entities.Notification.create({
        data: notification
      });
    }
  } catch (error) {
    console.error('Erreur lors de la notification des directeurs:', error);
    // Ne pas faire échouer la création du bénéficiaire si la notification échoue
  }
}
