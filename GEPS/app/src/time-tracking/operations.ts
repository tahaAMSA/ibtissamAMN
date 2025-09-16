import { HttpError } from 'wasp/server'
import type { 
  StartTimeSession, 
  EndTimeSession, 
  GetTimeSessionHistory,
  GetActiveTimeSession,
  GetBeneficiaryTimeStats
} from 'wasp/server/operations'
import type { TimeSession } from 'wasp/entities'

// Types pour les opérations
type StartTimeSessionInput = {
  beneficiaryId: string
  activityType?: string
  notes?: string
}

type EndTimeSessionInput = {
  sessionId: string
  notes?: string
}

type TimeSessionHistoryInput = {
  beneficiaryId?: string
  userId?: string
  startDate?: string
  endDate?: string
  limit?: number
}

type TimeStatsResponse = {
  totalTimeMinutes: number
  totalSessions: number
  averageSessionTime: number
  timeByUser: Array<{
    userId: string
    userFirstName: string
    userLastName: string
    totalTimeMinutes: number
    sessionCount: number
  }>
  timeByMonth: Array<{
    month: string
    totalTimeMinutes: number
    sessionCount: number
  }>
}

/**
 * Démarre une nouvelle session de temps pour un bénéficiaire
 */
export const startTimeSession: StartTimeSession<StartTimeSessionInput, TimeSession> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier qu'aucune session n'est déjà active pour cet utilisateur et ce bénéficiaire
  const activeSession = await context.entities.TimeSession.findFirst({
    where: {
      userId: context.user.id,
      beneficiaryId: args.beneficiaryId,
      isActive: true
    }
  });

  if (activeSession) {
    // Terminer automatiquement l'ancienne session si elle existe depuis plus de 12h
    const now = new Date();
    const sessionAge = now.getTime() - activeSession.startTime.getTime();
    const twelveHours = 12 * 60 * 60 * 1000;
    
    if (sessionAge > twelveHours) {
      console.log(`Fermeture automatique d'une session ancienne (${sessionAge / (60 * 60 * 1000)} heures)`);
      const durationMinutes = Math.round(sessionAge / (1000 * 60));
      
      await context.entities.TimeSession.update({
        where: { id: activeSession.id },
        data: {
          endTime: now,
          durationMinutes,
          isActive: false,
          notes: 'Session fermée automatiquement (durée excessive)'
        }
      });
    } else {
      throw new HttpError(400, 'Une session est déjà active pour ce bénéficiaire');
    }
  }

  // Vérifier que le bénéficiaire existe
  const beneficiary = await context.entities.Beneficiary.findUnique({
    where: { id: args.beneficiaryId }
  });

  if (!beneficiary) {
    throw new HttpError(404, 'Bénéficiaire introuvable');
  }

  const session = await context.entities.TimeSession.create({
    data: {
      userId: context.user.id,
      beneficiaryId: args.beneficiaryId,
      startTime: new Date(),
      activityType: args.activityType || 'CONSULTATION_DOSSIER',
      notes: args.notes,
      isActive: true
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
      beneficiary: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });

  return session;
};

/**
 * Termine une session de temps active
 */
export const endTimeSession: EndTimeSession<EndTimeSessionInput, TimeSession> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  const session = await context.entities.TimeSession.findFirst({
    where: {
      id: args.sessionId,
      userId: context.user.id,
      isActive: true
    }
  });

  if (!session) {
    // Si la session n'est pas trouvée, essayons de trouver n'importe quelle session active pour cet utilisateur
    const anyActiveSession = await context.entities.TimeSession.findFirst({
      where: {
        userId: context.user.id,
        isActive: true
      },
      orderBy: {
        startTime: 'desc' // La plus récente
      }
    });

    if (!anyActiveSession) {
      console.log(`Aucune session active trouvée pour l'utilisateur ${context.user.id}`);
      // Au lieu de throw une erreur, on retourne une session "fictive" pour éviter les erreurs côté client
      return {
        id: 'not-found',
        createdAt: new Date(),
        updatedAt: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        durationMinutes: 0,
        activityType: 'CONSULTATION_DOSSIER',
        notes: 'Session déjà fermée',
        isActive: false,
        userId: context.user.id,
        beneficiaryId: 'unknown'
      } as TimeSession;
    }

    // Utiliser la session trouvée
    args.sessionId = anyActiveSession.id;
  }

  const targetSession = session || await context.entities.TimeSession.findUnique({
    where: { id: args.sessionId }
  });

  if (!targetSession) {
    throw new HttpError(404, 'Session introuvable');
  }

  const endTime = new Date();
  const durationMinutes = Math.round((endTime.getTime() - targetSession.startTime.getTime()) / (1000 * 60));

  const updatedSession = await context.entities.TimeSession.update({
    where: { id: args.sessionId },
    data: {
      endTime,
      durationMinutes: Math.max(0, durationMinutes), // Assurer que la durée n'est pas négative
      isActive: false,
      notes: args.notes || targetSession.notes
    }
  });

  return updatedSession;
};

/**
 * Récupère la session active pour un utilisateur sur un bénéficiaire
 */
export const getActiveTimeSession: GetActiveTimeSession<{ beneficiaryId: string }, TimeSession | null> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  const activeSession = await context.entities.TimeSession.findFirst({
    where: {
      userId: context.user.id,
      beneficiaryId: args.beneficiaryId,
      isActive: true
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
      beneficiary: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });

  return activeSession;
};

/**
 * Récupère l'historique des sessions de temps
 */
export const getTimeSessionHistory: GetTimeSessionHistory<TimeSessionHistoryInput, TimeSession[]> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  const where: any = {};

  // Filtrage par bénéficiaire
  if (args.beneficiaryId) {
    where.beneficiaryId = args.beneficiaryId;
  }

  // Filtrage par utilisateur (si fourni et si l'utilisateur courant a les droits)
  if (args.userId) {
    // Seuls les admins ou l'utilisateur lui-même peuvent voir ses sessions
    if (context.user.role !== 'ADMIN' && context.user.id !== args.userId) {
      throw new HttpError(403, 'Accès non autorisé aux sessions d\'un autre utilisateur');
    }
    where.userId = args.userId;
  } else {
    // Par défaut, ne montrer que ses propres sessions (sauf pour les admins)
    if (context.user.role !== 'ADMIN') {
      where.userId = context.user.id;
    }
  }

  // Filtrage par date
  if (args.startDate || args.endDate) {
    where.createdAt = {};
    if (args.startDate) {
      where.createdAt.gte = new Date(args.startDate);
    }
    if (args.endDate) {
      where.createdAt.lte = new Date(args.endDate);
    }
  }

  const sessions = await context.entities.TimeSession.findMany({
    where,
    include: {
      user: {
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
          lastName: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: args.limit || 50
  });

  return sessions;
};

/**
 * Récupère les statistiques de temps pour un bénéficiaire
 */
export const getBeneficiaryTimeStats: GetBeneficiaryTimeStats<{ beneficiaryId: string }, TimeStatsResponse> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Récupérer toutes les sessions terminées pour ce bénéficiaire
  const sessions = await context.entities.TimeSession.findMany({
    where: {
      beneficiaryId: args.beneficiaryId,
      isActive: false,
      durationMinutes: { not: null }
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });

  // Calculer les statistiques totales
  const totalTimeMinutes = sessions.reduce((total, session) => total + (session.durationMinutes || 0), 0);
  const totalSessions = sessions.length;
  const averageSessionTime = totalSessions > 0 ? Math.round(totalTimeMinutes / totalSessions) : 0;

  // Grouper par utilisateur
  const timeByUserMap = new Map();
  sessions.forEach(session => {
    const userId = session.user.id;
    if (!timeByUserMap.has(userId)) {
      timeByUserMap.set(userId, {
        userId,
        userFirstName: session.user.firstName || '',
        userLastName: session.user.lastName || '',
        totalTimeMinutes: 0,
        sessionCount: 0
      });
    }
    const userStats = timeByUserMap.get(userId);
    userStats.totalTimeMinutes += session.durationMinutes || 0;
    userStats.sessionCount += 1;
  });

  const timeByUser = Array.from(timeByUserMap.values());

  // Grouper par mois
  const timeByMonthMap = new Map();
  sessions.forEach(session => {
    const monthKey = session.createdAt.toISOString().substring(0, 7); // YYYY-MM
    if (!timeByMonthMap.has(monthKey)) {
      timeByMonthMap.set(monthKey, {
        month: monthKey,
        totalTimeMinutes: 0,
        sessionCount: 0
      });
    }
    const monthStats = timeByMonthMap.get(monthKey);
    monthStats.totalTimeMinutes += session.durationMinutes || 0;
    monthStats.sessionCount += 1;
  });

  const timeByMonth = Array.from(timeByMonthMap.values()).sort((a, b) => a.month.localeCompare(b.month));

  return {
    totalTimeMinutes,
    totalSessions,
    averageSessionTime,
    timeByUser,
    timeByMonth
  };
};
