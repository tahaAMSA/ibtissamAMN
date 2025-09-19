import { HttpError } from 'wasp/server';
import type {
  GetDashboardStats,
  GetDashboardActivities,
  GetDashboardAlerts,
  GetDashboardExpenses
} from 'wasp/server/operations';
import type { AuthUser } from 'wasp/auth';
import { getUserLanguage, t } from '../translations/utils';

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
    monthIndex: number;
    year: number;
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
    throw new HttpError(401, 'المستخدم غير مُعرَّف');
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
      monthIndex: number;
      year: number;
      beneficiaires: number;
      interventions: number;
      activites: number;
    }> = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      // On envoie l'index du mois et l'année, la traduction se fera côté client
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      
      // Compter les bénéficiaires nouveaux du mois
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
        month: `${monthIndex}_${year}`, // Temporaire, sera remplacé côté client
        monthIndex,
        year,
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
    console.error('خطأ في استرداد إحصائيات لوحة التحكم:', error);
    throw new HttpError(500, 'خطأ في استرداد الإحصائيات');
  }
};

// Activités récentes
export const getDashboardActivities: GetDashboardActivities<void, DashboardActivity[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'المستخدم غير مُعرَّف');
  }

  try {
    const organizationId = (context.user as AuthUser & { organizationId?: number }).organizationId;
    
    // Récupérer les informations utilisateur complètes pour la langue
    const fullUser = await context.entities.User.findUnique({
      where: { id: context.user.id },
      select: { preferredLanguage: true }
    });
    
    const userLanguage = getUserLanguage(fullUser || undefined);
    
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

    // إضافة المستفيدين الحديثين
    recentBeneficiaries.forEach(b => {
      const newBeneficiaryText = userLanguage === 'ar' ? 'مستفيد جديد' : 'Nouveau bénéficiaire';
      activities.push({
        id: b.id,
        type: 'beneficiary',
        action: `${newBeneficiaryText}: ${b.firstName} ${b.lastName}`,
        createdAt: b.createdAt.toISOString(),
        priority: 'low'
      });
    });

    // إضافة الوثائق الحديثة
    recentDocuments.forEach(d => {
      const documentText = userLanguage === 'ar' 
        ? `تم إضافة وثيقة ${d.type} لـ` 
        : `Document ${d.type} ajouté pour`;
      activities.push({
        id: d.id,
        type: 'document',
        action: `${documentText} ${d.beneficiary.firstName} ${d.beneficiary.lastName}`,
        createdAt: d.createdAt.toISOString(),
        priority: 'medium'
      });
    });

    // إضافة التدخلات الحديثة
    recentInterventions.forEach(i => {
      const interventionText = userLanguage === 'ar' ? 'تدخل' : 'Intervention';
      const inProgressText = userLanguage === 'ar' ? '(جاري)' : '(EN COURS)';
      const statusText = i.status === 'IN_PROGRESS' ? inProgressText : '';
      
      activities.push({
        id: i.id,
        type: 'intervention',
        action: `${interventionText} "${i.title}" ${statusText}`,
        createdAt: i.createdAt.toISOString(),
        priority: i.status === 'IN_PROGRESS' ? 'high' : 'medium'
      });
    });

    // Trier par date de création (plus récent en premier) et limiter à 10
    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

  } catch (error) {
    console.error('خطأ في استرداد الأنشطة:', error);
    throw new HttpError(500, 'خطأ في استرداد الأنشطة');
  }
};

// Alertes du dashboard
export const getDashboardAlerts: GetDashboardAlerts<void, DashboardAlert[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'المستخدم غير مُعرَّف');
  }

  try {
    const organizationId = (context.user as AuthUser & { organizationId?: number }).organizationId;
    
    // Récupérer les informations utilisateur complètes pour la langue
    const fullUser = await context.entities.User.findUnique({
      where: { id: context.user.id },
      select: { preferredLanguage: true }
    });
    
    const userLanguage = getUserLanguage(fullUser || undefined);
    const alerts: DashboardAlert[] = [];
    const now = new Date();

    // التحقق من الميزانيات الحرجة (> 85% مستخدمة)
    const budgets = await context.entities.Budget.findMany({
      where: organizationId ? { organizationId } : {}
    });

    budgets.forEach(budget => {
      const usagePercentage = (budget.usedAmount / budget.initialAmount) * 100;
      if (usagePercentage > 85) {
        const budgetText = userLanguage === 'ar' 
          ? `ميزانية ${budget.module} مستخدمة بنسبة ${usagePercentage.toFixed(1)}%`
          : `Budget ${budget.module} utilisé à ${usagePercentage.toFixed(1)}%`;
          
        alerts.push({
          type: usagePercentage > 95 ? 'error' : 'warning',
          message: budgetText,
          priority: usagePercentage > 95 ? 'high' : 'medium',
          createdAt: now.toISOString()
        });
      }
    });

    // التحقق من الوثائق التي تنتهي صلاحيتها قريباً (خلال 30 يوماً)
    const expiringDocuments = await context.entities.Document.count({
      where: {
        ...(organizationId ? { 
          beneficiary: { organizationId }
        } : {}),
        createdAt: {
          gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // آخر 30 يوماً
        }
      }
    });

    if (expiringDocuments > 0) {
      const documentsText = userLanguage === 'ar'
        ? `${expiringDocuments} وثيقة حديثة (آخر 30 يوماً)`
        : `${expiringDocuments} document(s) récents (30 derniers jours)`;
        
      alerts.push({
        type: 'warning',
        message: documentsText,
        priority: 'medium',
        createdAt: now.toISOString()
      });
    }

    // التحقق من التدخلات الجارية والمجدولة
    const inProgressInterventions = await context.entities.SocialIntervention.count({
      where: {
        ...(organizationId ? { organizationId } : {}),
        status: 'IN_PROGRESS'
      }
    });

    if (inProgressInterventions > 0) {
      const interventionsText = userLanguage === 'ar'
        ? `${inProgressInterventions} تدخل(ات) جارية`
        : `${inProgressInterventions} intervention(s) en cours`;
        
      alerts.push({
        type: 'warning',
        message: interventionsText,
        priority: 'medium',
        createdAt: now.toISOString()
      });
    }

    // التحقق من التسجيلات الجديدة للشهر
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
      const newBeneficiariesText = userLanguage === 'ar'
        ? `${newBeneficiaries} مستفيد جديد هذا الشهر`
        : `${newBeneficiaries} nouveaux bénéficiaires ce mois`;
        
      alerts.push({
        type: 'success',
        message: newBeneficiariesText,
        priority: 'low',
        createdAt: now.toISOString()
      });
    }

    // ترتيب حسب الأولوية (عالية -> متوسطة -> منخفضة) ثم حسب النوع
    return alerts.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  } catch (error) {
    console.error('خطأ في استرداد التنبيهات:', error);
    throw new HttpError(500, 'خطأ في استرداد التنبيهات');
  }
};

// Répartition des dépenses par catégorie
export const getDashboardExpenses: GetDashboardExpenses<void, ExpenseCategory[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'المستخدم غير مُعرَّف');
  }

  try {
    const organizationId = (context.user as AuthUser & { organizationId?: number }).organizationId;
    
    const budgets = await context.entities.Budget.findMany({
      where: organizationId ? { organizationId } : {}
    });

    // تجميع حسب الفئة
    const categoryMap = new Map<string, { amount: number, budget: number }>();
    
    budgets.forEach(budget => {
      const category = budget.module || 'Autres';
      const existing = categoryMap.get(category) || { amount: 0, budget: 0 };
      
      categoryMap.set(category, {
        amount: existing.amount + (budget.usedAmount || 0),
        budget: existing.budget + (budget.initialAmount || 0)
      });
    });

    // تحويل إلى مصفوفة مع النسب المئوية
    const categories: ExpenseCategory[] = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      amount: data.amount,
      budget: data.budget,
      percentage: data.budget > 0 ? (data.amount / data.budget) * 100 : 0
    }));

    // ترتيب حسب المبلغ المنفق (تنازلي)
    return categories.sort((a, b) => b.amount - a.amount);

  } catch (error) {
    console.error('خطأ في استرداد النفقات:', error);
    throw new HttpError(500, 'خطأ في استرداد النفقات');
  }
};
