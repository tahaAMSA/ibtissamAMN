import React, { useState } from 'react';
import {
  Users,
  FileText,
  Activity,
  DollarSign,
  Home,
  MessageSquare,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  PieChart,
  Target,
  Star,
  Award,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getAllBeneficiaries, getAllActivities, getAllBudgets, getAllDocuments, getAllStays, getAllInterventions } from 'wasp/client/operations';

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
    { type: 'beneficiary', action: 'Nouveau bénéficiaire ajouté', time: '2 min', icon: Users },
    { type: 'document', action: 'Document médical uploadé', time: '15 min', icon: FileText },
    { type: 'intervention', action: 'Intervention sociale programmée', time: '1h', icon: MessageSquare },
    { type: 'budget', action: 'Nouvelle dépense enregistrée', time: '2h', icon: DollarSign },
    { type: 'activity', action: 'Activité culturelle terminée', time: '3h', icon: Activity }
  ];

  const alerts = [
    { type: 'warning', message: 'Budget alimentation à 85% utilisé', priority: 'high' },
    { type: 'info', message: '5 documents expirent cette semaine', priority: 'medium' },
    { type: 'success', message: '12 nouvelles inscriptions ce mois', priority: 'low' },
    { type: 'error', message: 'Intervention urgente programmée', priority: 'high' }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 text-black">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{t.title}</h1>
            <p className="mt-2 opacity-90">{t.welcome}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-lg font-semibold">
              {new Date().toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Sélecteur de période */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          {Object.entries(t.period).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedPeriod(key)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                selectedPeriod === key
                  ? 'bg-yellow-500 text-black font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.stats.totalBeneficiaries}</p>
              <p className="text-3xl font-bold text-gray-900">{totalBeneficiaries}</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% ce mois
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50">
              <Home className="w-8 h-8 text-green-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.stats.activeStays}</p>
              <p className="text-3xl font-bold text-gray-900">{activeStays}</p>
              <p className="text-sm text-blue-600">85% d'occupation</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-50">
              <MessageSquare className="w-8 h-8 text-yellow-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.stats.pendingInterventions}</p>
              <p className="text-3xl font-bold text-gray-900">{pendingInterventions}</p>
              <p className="text-sm text-orange-600">3 urgentes</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-50">
              <DollarSign className="w-8 h-8 text-red-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">Budget vs Dépenses</p>
              <p className="text-3xl font-bold text-gray-900">{((totalBudget - totalExpenses) / 1000).toFixed(0)}K</p>
              <p className="text-sm text-red-600 flex items-center">
                <TrendingDown className="w-4 h-4 mr-1" />
                -{((totalExpenses / totalBudget) * 100).toFixed(0)}% utilisé
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section principale avec graphiques et alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique de tendance */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Évolution mensuelle</h2>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Bénéficiaires</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Interventions</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>Activités</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
                <div className="flex-1 flex space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="bg-blue-500 h-4 rounded-full"
                      style={{ width: `${(data.beneficiaires / 70) * 100}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {data.beneficiaires}
                    </span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${(data.interventions / 25) * 100}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {data.interventions}
                    </span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="bg-yellow-500 h-4 rounded-full"
                      style={{ width: `${(data.activites / 20) * 100}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {data.activites}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.alerts}</h2>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.priority)}`}>
                <div className="flex items-start">
                  {getAlertIcon(alert.type)}
                  <p className="ml-3 text-sm text-gray-700">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Répartition des dépenses et activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition des dépenses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Répartition des dépenses</h2>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${category.color} mr-3`}></div>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${category.color}`}
                      style={{ width: `${category.value}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{category.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.recentActivity}</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center">
                <div className="p-2 rounded-lg bg-gray-100">
                  <activity.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">Il y a {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.quickActions}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            to="/beneficiaries"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
          >
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 text-center">
              {t.actions.addBeneficiary}
            </span>
          </Link>

          <Link
            to="/documents"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
          >
            <FileText className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 text-center">
              {t.actions.createDocument}
            </span>
          </Link>

          <Link
            to="/interventions"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
          >
            <MessageSquare className="w-8 h-8 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 text-center">
              {t.actions.scheduleIntervention}
            </span>
          </Link>

          <Link
            to="/accommodation"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
          >
            <Home className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 text-center">
              {t.actions.manageAccommodation}
            </span>
          </Link>

          <Link
            to="/activities"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
          >
            <Activity className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 text-center">
              {t.actions.addActivity}
            </span>
          </Link>

          <Link
            to="/budget"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
          >
            <DollarSign className="w-8 h-8 text-red-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 text-center">
              {t.actions.manageBudget}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;