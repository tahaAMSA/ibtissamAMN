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
import { getAllBeneficiaries, getAllActivities, getAllBudgets, getAllDocuments, getAllStays, getAllInterventions } from 'wasp/client/operations';

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
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const { data: beneficiaries } = useQuery(getAllBeneficiaries, {});
  const { data: activities } = useQuery(getAllActivities, {});
  const { data: budgets } = useQuery(getAllBudgets, {});
  const { data: documents } = useQuery(getAllDocuments, {});
  const { data: stays } = useQuery(getAllStays, {});
  const { data: interventions } = useQuery(getAllInterventions, {});

  const isRTL = language === 'ar';

  const t = {
    title: language === 'ar' ? 'لوحة التحكم - GEPS' : 'Tableau de Bord - GEPS',
    welcome: language === 'ar' ? 'مرحباً بك في نظام إدارة GEPS' : 'Bienvenue dans le système de gestion GEPS',
    overview: language === 'ar' ? 'نظرة عامة' : 'Vue d\'ensemble',
    quickActions: language === 'ar' ? 'إجراءات سريعة' : 'Actions rapides',
    recentActivity: language === 'ar' ? 'النشاط الأخير' : 'Activité récente',
    alerts: language === 'ar' ? 'التنبيهات' : 'Alertes',
    reports: language === 'ar' ? 'التقارير' : 'Rapports',
    statistics: language === 'ar' ? 'الإحصائيات' : 'Statistiques',
    period: {
      today: language === 'ar' ? 'اليوم' : 'Aujourd\'hui',
      week: language === 'ar' ? 'هذا الأسبوع' : 'Cette semaine',
      month: language === 'ar' ? 'هذا الشهر' : 'Ce mois',
      year: language === 'ar' ? 'هذا العام' : 'Cette année'
    },
    stats: {
      totalBeneficiaries: language === 'ar' ? 'إجمالي المستفيدين' : 'Total bénéficiaires',
      activeBeneficiaries: language === 'ar' ? 'المستفيدون النشطون' : 'Bénéficiaires actifs',
      totalDocuments: language === 'ar' ? 'إجمالي الوثائق' : 'Total documents',
      activeStays: language === 'ar' ? 'الإقامات النشطة' : 'Séjours actifs',
      pendingInterventions: language === 'ar' ? 'التدخلات المعلقة' : 'Interventions en attente',
      completedActivities: language === 'ar' ? 'الأنشطة المكتملة' : 'Activités terminées',
      monthlyBudget: language === 'ar' ? 'ميزانية الشهر' : 'Budget mensuel',
      monthlyExpenses: language === 'ar' ? 'مصروفات الشهر' : 'Dépenses mensuelles'
    },
    actions: {
      addBeneficiary: language === 'ar' ? 'إضافة مستفيد' : 'Ajouter bénéficiaire',
      createDocument: language === 'ar' ? 'إنشاء وثيقة' : 'Créer document',
      scheduleIntervention: language === 'ar' ? 'جدولة تدخل' : 'Programmer intervention',
      manageAccommodation: language === 'ar' ? 'إدارة الإيواء' : 'Gérer hébergement',
      addActivity: language === 'ar' ? 'إضافة نشاط' : 'Ajouter activité',
      manageBudget: language === 'ar' ? 'إدارة الميزانية' : 'Gérer budget'
    }
  };

  // Calculs des statistiques
  const totalBeneficiaries = beneficiaries?.length || 0;
  const totalDocuments = documents?.length || 0;
  const activeStays = stays?.filter(s => s.status === 'ACTIVE').length || 0;
  const pendingInterventions = interventions?.filter(i => i.status === 'PLANNED').length || 0;
  const completedActivities = activities?.filter(a => a.status === 'COMPLETED').length || 0;
  const totalBudget = budgets?.reduce((sum, b) => sum + (b.initialAmount || 0), 0) || 0;
  const totalExpenses = budgets?.reduce((sum, b) => sum + (b.usedAmount || 0), 0) || 0;

  // Données simulées pour les graphiques
  const monthlyData = [
    { month: 'Jan', beneficiaires: 45, interventions: 12, activites: 8 },
    { month: 'Fév', beneficiaires: 52, interventions: 15, activites: 10 },
    { month: 'Mar', beneficiaires: 48, interventions: 18, activites: 12 },
    { month: 'Avr', beneficiaires: 61, interventions: 14, activites: 9 },
    { month: 'Mai', beneficiaires: 58, interventions: 20, activites: 15 },
    { month: 'Jun', beneficiaires: 65, interventions: 16, activites: 11 }
  ];

  const categoryData = [
    { name: 'Hébergement', value: 40, color: 'bg-blue-500' },
    { name: 'Alimentation', value: 25, color: 'bg-green-500' },
    { name: 'Santé', value: 20, color: 'bg-red-500' },
    { name: 'Éducation', value: 15, color: 'bg-yellow-500' }
  ];

  const recentActivities = [
    { type: 'beneficiary', action: 'Nouveau bénéficiaire ajouté', time: '2 min', icon: Users, priority: 'low' as const },
    { type: 'document', action: 'Document médical uploadé', time: '15 min', icon: FileText, priority: 'medium' as const },
    { type: 'intervention', action: 'Intervention sociale programmée', time: '1h', icon: MessageSquare, priority: 'high' as const },
    { type: 'budget', action: 'Nouvelle dépense enregistrée', time: '2h', icon: DollarSign, priority: 'medium' as const },
    { type: 'activity', action: 'Activité culturelle terminée', time: '3h', icon: Activity, priority: 'low' as const }
  ];

  const alerts = [
    { type: 'warning' as const, message: 'Budget alimentation à 85% utilisé', priority: 'high' as const },
    { type: 'info' as const, message: '5 documents expirent cette semaine', priority: 'medium' as const },
    { type: 'success' as const, message: '12 nouvelles inscriptions ce mois', priority: 'low' as const },
    { type: 'error' as const, message: 'Intervention urgente programmée', priority: 'high' as const }
  ];

  const quickActions = [
    { title: t.actions.addBeneficiary, icon: Users, to: '/beneficiaries', color: 'bg-blue-500' },
    { title: t.actions.createDocument, icon: FileText, to: '/documents', color: 'bg-green-500' },
    { title: t.actions.scheduleIntervention, icon: MessageSquare, to: '/interventions', color: 'bg-yellow-500' },
    { title: t.actions.manageAccommodation, icon: Home, to: '/accommodation', color: 'bg-purple-500' },
    { title: t.actions.addActivity, icon: Activity, to: '/activities', color: 'bg-orange-500' },
    { title: t.actions.manageBudget, icon: DollarSign, to: '/budget', color: 'bg-red-500' }
  ];

  const expenseCategories = [
    { name: 'Hébergement', value: 40, amount: 120000, color: 'bg-blue-500', budget: 150000 },
    { name: 'Alimentation', value: 25, amount: 85000, color: 'bg-green-500', budget: 100000 },
    { name: 'Santé', value: 20, amount: 65000, color: 'bg-red-500', budget: 80000 },
    { name: 'Éducation', value: 15, amount: 45000, color: 'bg-yellow-500', budget: 60000 }
  ];

  return (
    <div className="space-y-8 p-1">
      {/* En-tête moderne */}
      <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 via-pink-50 to-blue-50 shadow-lg">
        <CardContent className="p-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-pink-600 bg-clip-text text-transparent mb-2">{t.title}</h1>
              <p className="text-blue-700 opacity-90">{t.welcome}</p>
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
              {Object.entries(t.period).map(([key, label]) => (
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
          title={t.stats.totalBeneficiaries}
          value={totalBeneficiaries}
          icon={Users}
          trend={{ value: 12, label: 'ce mois', type: 'up' }}
          variant="primary"
        />
        
        <StatCard
          title={t.stats.activeStays}
          value={activeStays}
          icon={Home}
          trend={{ value: 85, label: "d'occupation", type: 'neutral' }}
          variant="success"
        />
        
        <StatCard
          title={t.stats.pendingInterventions}
          value={pendingInterventions}
          icon={MessageSquare}
          trend={{ value: 3, label: 'urgentes', type: 'down' }}
          variant="warning"
        />
        
        <StatCard
          title="Budget disponible"
          value={`${((totalBudget - totalExpenses) / 1000).toFixed(0)}K MAD`}
          icon={DollarSign}
          trend={{ value: Math.round((totalExpenses / totalBudget) * 100), label: 'utilisé', type: 'down' }}
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
          title={t.alerts}
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
          title={t.recentActivity}
          activities={recentActivities}
        />
      </div>

      {/* Actions rapides modernes */}
      <QuickActions
        title={t.quickActions}
        actions={quickActions}
      />
    </div>
  );
};

export default Dashboard;