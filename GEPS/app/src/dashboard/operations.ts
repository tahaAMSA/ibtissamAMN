import { HttpError } from 'wasp/server';
import type { 
  GetDashboardStats,
  GetDashboardActivities,
  GetDashboardAlerts,
  GetDashboardExpenses
} from 'wasp/server/operations';
import type { AuthUser } from 'wasp/auth';

// Types pour les données du dashboard (compatibles SuperJSON)
interface DashboardStats {
  [key: string]: any;
  totalBeneficiaries: number;
  activeBeneficiaries: number;
  totalDocuments: number;
  activeStays: number;
  pendingInterventions: number;
  completedActivities: number;
  totalBudget: number;
  totalExpenses: number;
  monthlyData: {
    [key: string]: any;
    month: string;
    beneficiaires: number;
    interventions: number;
    activites: number;
  }[];
}

interface DashboardActivity {
  [key: string]: any;
  id: string;
  type: string;
  action: string;
  createdAt: string; // ISO string pour SuperJSON
  relatedEntity?: string;
  priority: 'high' | 'medium' | 'low';
}

interface DashboardAlert {
  [key: string]: any;
  type: 'warning' | 'error' | 'success' | 'info';
  message: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string; // ISO string pour SuperJSON
}

interface ExpenseCategory {
  [key: string]: any;
  name: string;
  amount: number;
  budget: number;
  percentage: number;
}

// Statistiques principales du dashboard
export const getDashboardStats: GetDashboardStats<void, DashboardStats> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Utilisateur non authentifié');
  }

  try {
    const organizationId = (context.user as AuthUser & { organizationId?: number }).organizationId;
    
    // Compter les bénéficiaires
    const totalBeneficiaries = await context.entities.Beneficiary.count({
      where: organizationId ? { organizationId } : {}
    });

    const activeBeneficiaries = await context.entities.Beneficiary.count({
      where: organizationId ? { organizationId } : {}
    });

    // Compter les documents
    const totalDocuments = await context.entities.Document.count({
      where: organizationId ? { 
        beneficiary: { organizationId }
      } : {}
    });

    // Compter les séjours actifs
    const activeStays = await context.entities.Stay.count({
      where: {
        ...(organizationId ? { 
          beneficiary: { organizationId }
        } : {}),
        status: 'ACTIVE'
      }
    });

    // Compter les interventions en attente
    const pendingInterventions = await context.entities.SocialIntervention.count({
      where: {
        ...(organizationId ? { organizationId } : {}),
        status: 'PLANNED'
      }
    });

    // Compter les activités terminées
    const completedActivities = await context.entities.Activity.count({
      where: {
        ...(organizationId ? { organizationId } : {}),
        status: 'COMPLETED'
      }
    });

    // Calculer les budgets
    const budgets = await context.entities.Budget.findMany({
      where: organizationId ? { organizationId } : {}
    });

    const totalBudget = budgets.reduce((sum, b) => sum + (b.initialAmount || 0), 0);
    const totalExpenses = budgets.reduce((sum, b) => sum + (b.usedAmount || 0), 0);

    // Données mensuelles pour les graphiques (6 derniers mois)
    const now = new Date();
    const monthlyData: Array<{
      month: string;
      beneficiaires: number;
      interventions: number;
      activites: number;
    }> = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      
      // Compter les nouveaux bénéficiaires du mois
      const monthlyBeneficiaries = await context.entities.Beneficiary.count({
        where: {
          ...(organizationId ? { organizationId } : {}),
          createdAt: {
            gte: date,
            lt: nextMonth
          }
        }
      });

      // Compter les interventions du mois
      const monthlyInterventions = await context.entities.SocialIntervention.count({
        where: {
          ...(organizationId ? { organizationId } : {}),
          createdAt: {
            gte: date,
            lt: nextMonth
          }
        }
      });

      // Compter les activités du mois
      const monthlyActivities = await context.entities.Activity.count({
        where: {
          ...(organizationId ? { organizationId } : {}),
          createdAt: {
            gte: date,
            lt: nextMonth
          }
        }
      });

      monthlyData.push({
        month: monthName,
        beneficiaires: monthlyBeneficiaries,
        interventions: monthlyInterventions,
        activites: monthlyActivities
      });
    }

    return {
      totalBeneficiaries,
      activeBeneficiaries,
      totalDocuments,
      activeStays,
      pendingInterventions,
      completedActivities,
      totalBudget,
      totalExpenses,
      monthlyData
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques du dashboard:', error);
    throw new HttpError(500, 'Erreur lors de la récupération des statistiques');
  }
};

// Activités récentes
export const getDashboardActivities: GetDashboardActivities<void, DashboardActivity[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Utilisateur non authentifié');
  }

  try {
    const organizationId = (context.user as AuthUser & { organizationId?: number }).organizationId;
    
    // On utilise une approche simplifiée en récupérant les dernières créations
    const recentBeneficiaries = await context.entities.Beneficiary.findMany({
      where: organizationId ? { organizationId } : {},
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        createdAt: true,
        firstName: true,
        lastName: true
      }
    });

    const recentDocuments = await context.entities.Document.findMany({
      where: organizationId ? { 
        beneficiary: { organizationId }
      } : {},
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        createdAt: true,
        type: true,
        beneficiary: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    const recentInterventions = await context.entities.SocialIntervention.findMany({
      where: organizationId ? { organizationId } : {},
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        createdAt: true,
        title: true,
        status: true
      }
    });

    const activities: DashboardActivity[] = [];

    // Ajouter les bénéficiaires récents
    recentBeneficiaries.forEach(b => {
      activities.push({
        id: b.id,
        type: 'beneficiary',
        action: `Nouveau bénéficiaire: ${b.firstName} ${b.lastName}`,
        createdAt: b.createdAt.toISOString(),
        priority: 'low'
      });
    });

    // Ajouter les documents récents
    recentDocuments.forEach(d => {
      activities.push({
        id: d.id,
        type: 'document',
        action: `Document ${d.type} ajouté pour ${d.beneficiary.firstName} ${d.beneficiary.lastName}`,
        createdAt: d.createdAt.toISOString(),
        priority: 'medium'
      });
    });

    // Ajouter les interventions récentes
    recentInterventions.forEach(i => {
      activities.push({
        id: i.id,
        type: 'intervention',
        action: `Intervention "${i.title}" ${i.status === 'IN_PROGRESS' ? '(EN COURS)' : ''}`,
        createdAt: i.createdAt.toISOString(),
        priority: i.status === 'IN_PROGRESS' ? 'high' : 'medium'
      });
    });

    // Trier par date de création (plus récent en premier) et limiter à 10
    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    throw new HttpError(500, 'Erreur lors de la récupération des activités');
  }
};

// Alertes du dashboard
export const getDashboardAlerts: GetDashboardAlerts<void, DashboardAlert[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Utilisateur non authentifié');
  }

  try {
    const organizationId = (context.user as AuthUser & { organizationId?: number }).organizationId;
    const alerts: DashboardAlert[] = [];
    const now = new Date();

    // Vérifier les budgets critiques (> 85% utilisés)
    const budgets = await context.entities.Budget.findMany({
      where: organizationId ? { organizationId } : {}
    });

    budgets.forEach(budget => {
      const usagePercentage = (budget.usedAmount / budget.initialAmount) * 100;
      if (usagePercentage > 85) {
        alerts.push({
          type: usagePercentage > 95 ? 'error' : 'warning',
          message: `Budget ${budget.module} utilisé à ${usagePercentage.toFixed(1)}%`,
          priority: usagePercentage > 95 ? 'high' : 'medium',
          createdAt: now.toISOString()
        });
      }
    });

    // Vérifier les documents qui expirent bientôt (dans les 30 jours)
    const expiringDocuments = await context.entities.Document.count({
      where: {
        ...(organizationId ? { 
          beneficiary: { organizationId }
        } : {}),
        createdAt: {
          gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 jours passés
        }
      }
    });

    if (expiringDocuments > 0) {
      alerts.push({
        type: 'warning',
        message: `${expiringDocuments} document(s) récents (30 derniers jours)`,
        priority: 'medium',
        createdAt: now.toISOString()
      });
    }

    // Vérifier les interventions en cours et planifiées
    const inProgressInterventions = await context.entities.SocialIntervention.count({
      where: {
        ...(organizationId ? { organizationId } : {}),
        status: 'IN_PROGRESS'
      }
    });

    if (inProgressInterventions > 0) {
      alerts.push({
        type: 'warning',
        message: `${inProgressInterventions} intervention(s) en cours`,
        priority: 'medium',
        createdAt: now.toISOString()
      });
    }

    // Vérifier les nouvelles inscriptions du mois
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const newBeneficiaries = await context.entities.Beneficiary.count({
      where: {
        ...(organizationId ? { organizationId } : {}),
        createdAt: {
          gte: thisMonthStart
        }
      }
    });

    if (newBeneficiaries > 10) {
      alerts.push({
        type: 'success',
        message: `${newBeneficiaries} nouveaux bénéficiaires ce mois`,
        priority: 'low',
        createdAt: now.toISOString()
      });
    }

    // Trier par priorité (high -> medium -> low) puis par type
    return alerts.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des alertes:', error);
    throw new HttpError(500, 'Erreur lors de la récupération des alertes');
  }
};

// Répartition des dépenses par catégorie
export const getDashboardExpenses: GetDashboardExpenses<void, ExpenseCategory[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Utilisateur non authentifié');
  }

  try {
    const organizationId = (context.user as AuthUser & { organizationId?: number }).organizationId;
    
    const budgets = await context.entities.Budget.findMany({
      where: organizationId ? { organizationId } : {}
    });

    // Regrouper par catégorie
    const categoryMap = new Map<string, { amount: number, budget: number }>();
    
    budgets.forEach(budget => {
      const category = budget.module || 'Autres';
      const existing = categoryMap.get(category) || { amount: 0, budget: 0 };
      
      categoryMap.set(category, {
        amount: existing.amount + (budget.usedAmount || 0),
        budget: existing.budget + (budget.initialAmount || 0)
      });
    });

    // Convertir en tableau avec pourcentages
    const categories: ExpenseCategory[] = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      amount: data.amount,
      budget: data.budget,
      percentage: data.budget > 0 ? (data.amount / data.budget) * 100 : 0
    }));

    // Trier par montant dépensé (décroissant)
    return categories.sort((a, b) => b.amount - a.amount);

  } catch (error) {
    console.error('Erreur lors de la récupération des dépenses:', error);
    throw new HttpError(500, 'Erreur lors de la récupération des dépenses');
  }
};
