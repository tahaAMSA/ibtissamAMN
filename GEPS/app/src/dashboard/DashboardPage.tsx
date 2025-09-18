import React, { useState } from 'react';
import {
  Users,
  FileText,
  Activity,
  DollarSign,
  Home,
  MessageSquare,
  Calendar,
  GraduationCap,
  Utensils,
  Package,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import { useQuery } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import { useI18n } from '../translations/useI18n';
import { 
  getDashboardStats, 
  getDashboardActivities, 
  getDashboardAlerts, 
  getDashboardExpenses 
} from 'wasp/client/operations';

// Import des composants shadcn/ui dashboard
import StatCard from '../client/components/Dashboard/StatCard';
import ChartCard from '../client/components/Dashboard/ChartCard';
import AlertCard from '../client/components/Dashboard/AlertCard';
import QuickActions from '../client/components/Dashboard/QuickActions';
import RecentActivity from '../client/components/Dashboard/RecentActivity';
import ExpenseChart from '../client/components/Dashboard/ExpenseChart';
import { Card, CardContent, CardHeader, CardTitle } from '../client/components/ui/card';
import { Button } from '../client/components/ui/button';
import { Badge } from '../client/components/ui/badge';

const Dashboard: React.FC = () => {
  const { data: user } = useAuth();
  const { t, lang: language, isRTL, dir } = useI18n(user as any);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Vraies données du dashboard
  const { data: dashboardStats, isLoading: statsLoading } = useQuery(getDashboardStats, {});
  const { data: dashboardActivities, isLoading: activitiesLoading } = useQuery(getDashboardActivities, {});
  const { data: dashboardAlerts, isLoading: alertsLoading } = useQuery(getDashboardAlerts, {});
  const { data: dashboardExpenses, isLoading: expensesLoading } = useQuery(getDashboardExpenses, {});

  // Maintenant nous utilisons le système de traduction centralisé

  // Vraies statistiques
  const totalBeneficiaries = dashboardStats?.totalBeneficiaries || 0;
  const activeBeneficiaries = dashboardStats?.activeBeneficiaries || 0;
  const totalDocuments = dashboardStats?.totalDocuments || 0;
  const activeStays = dashboardStats?.activeStays || 0;
  const pendingInterventions = dashboardStats?.pendingInterventions || 0;
  const completedActivities = dashboardStats?.completedActivities || 0;
  const totalBudget = dashboardStats?.totalBudget || 0;
  const totalExpenses = dashboardStats?.totalExpenses || 0;

  // Vraies données mensuelles
  const monthlyData = dashboardStats?.monthlyData || [];

  // Suppression des données de catégories simulées - elles seront dans expenseCategories

  // Transformer les vraies activités pour l'affichage
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'beneficiary': return Users;
      case 'document': return FileText;
      case 'intervention': return MessageSquare;
      case 'budget': return DollarSign;
      case 'activity': return Activity;
      default: return Activity;
    }
  };

  const recentActivities = (dashboardActivities || []).map(activity => ({
    type: activity.type,
    action: activity.action,
    time: getTimeAgo(new Date(activity.createdAt)),
    icon: getActivityIcon(activity.type),
    priority: activity.priority
  }));

  // Vraies alertes
  const alerts = dashboardAlerts || [];

  const quickActions = [
    { title: t('dashboard.action.addBeneficiary'), icon: Users, to: '/beneficiaries', color: 'bg-blue-500' },
    { title: t('dashboard.action.createDocument'), icon: FileText, to: '/documents', color: 'bg-green-500' },
    { title: t('dashboard.action.scheduleIntervention'), icon: MessageSquare, to: '/interventions', color: 'bg-yellow-500' },
    { title: t('dashboard.action.manageAccommodation'), icon: Home, to: '/accommodation', color: 'bg-purple-500' },
    { title: t('dashboard.action.addActivity'), icon: Activity, to: '/activities', color: 'bg-orange-500' },
    { title: t('dashboard.action.manageBudget'), icon: DollarSign, to: '/budget', color: 'bg-red-500' }
  ];

  // Vraies catégories de dépenses avec couleurs
  const categoryColors = {
    'Hébergement': 'bg-blue-500',
    'Alimentation': 'bg-green-500',
    'Santé': 'bg-red-500',
    'Éducation': 'bg-yellow-500',
    'Transport': 'bg-purple-500',
    'Formation': 'bg-orange-500',
    'Autres': 'bg-gray-500'
  };

  const expenseCategories = (dashboardExpenses || []).map(expense => ({
    name: expense.name,
    value: expense.percentage,
    amount: expense.amount,
    budget: expense.budget,
    color: categoryColors[expense.name as keyof typeof categoryColors] || 'bg-gray-500'
  }));

  return (
    <div className="space-y-8 p-1" dir={dir}>
      {/* En-tête moderne */}
      <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 via-pink-50 to-blue-50 shadow-lg">
        <CardContent className="p-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-pink-600 bg-clip-text text-transparent mb-2">{t('dashboard.title')}</h1>
              <p className="text-blue-700 opacity-90">{t('dashboard.welcome')}</p>
            </div>
            <div className="text-right">
              <Badge variant="info" className="mb-2">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Badge>
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                {new Date().toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sélecteur de période moderne */}
      <div className="flex justify-center">
        <Card className="border-blue-200 shadow-md">
          <CardContent className="p-2">
            <div className="flex space-x-1">
              {[
                { key: 'today', label: t('period.today') },
                { key: 'week', label: t('period.week') },
                { key: 'month', label: t('period.month') },
                { key: 'year', label: t('period.year') }
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={selectedPeriod === key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPeriod(key)}
                  className={selectedPeriod === key ? "bg-gradient-to-r from-blue-600 to-pink-600 text-white shadow-md" : "text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50"}
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques principales avec StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('stats.totalBeneficiaries')}
          value={statsLoading ? '...' : totalBeneficiaries}
          icon={Users}
          variant="primary"
        />
        
        <StatCard
          title={t('stats.activeStays')}
          value={statsLoading ? '...' : activeStays}
          icon={Home}
          variant="success"
        />
        
        <StatCard
          title={t('stats.pendingInterventions')}
          value={statsLoading ? '...' : pendingInterventions}
          icon={MessageSquare}
          variant="warning"
        />
        
        <StatCard
          title="Budget disponible"
          value={statsLoading ? '...' : `${((totalBudget - totalExpenses) / 1000).toFixed(0)}K MAD`}
          icon={DollarSign}
          variant="danger"
        />
      </div>

      {/* Section principale avec graphiques et alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique de tendance moderne */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Évolution mensuelle"
            description="Tendances des activités GEPS sur 6 mois"
            data={monthlyData}
          />
        </div>

        {/* Alertes modernes */}
        <AlertCard
          title={t('dashboard.alerts')}
          alerts={alerts}
        />
      </div>

      {/* Répartition des dépenses et activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart
          title="Répartition des dépenses"
          categories={expenseCategories}
        />

        <RecentActivity
          title={t('dashboard.recentActivity')}
          activities={recentActivities}
        />
      </div>

      {/* Actions rapides modernes */}
      <QuickActions
        title={t('dashboard.quickActions')}
        actions={quickActions}
      />
    </div>
  );
};

export default Dashboard;