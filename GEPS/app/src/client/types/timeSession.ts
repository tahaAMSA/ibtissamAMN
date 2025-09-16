import type { TimeSession, User, Beneficiary } from 'wasp/entities';

// Types étendus pour les sessions avec relations incluses
export interface TimeSessionWithRelations extends TimeSession {
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'role'>;
  beneficiary: Pick<Beneficiary, 'id' | 'firstName' | 'lastName'>;
}

// Type pour les statistiques de temps
export interface TimeStats {
  totalTimeMinutes: number;
  totalSessions: number;
  averageSessionTime: number;
  timeByUser: Array<{
    userId: string;
    userFirstName: string;
    userLastName: string;
    totalTimeMinutes: number;
    sessionCount: number;
  }>;
  timeByMonth: Array<{
    month: string;
    totalTimeMinutes: number;
    sessionCount: number;
  }>;
}

// Type pour les filtres d'historique
export interface TimeHistoryFilters {
  beneficiaryId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}
