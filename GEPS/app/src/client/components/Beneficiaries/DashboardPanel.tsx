import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Users, 
  Heart, 
  Shield, 
  Activity, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  Calendar
} from 'lucide-react';

interface DashboardPanelProps {
  beneficiaries: any[];
  language: 'fr' | 'ar';
  isDirector?: boolean;
  showPendingOrientation?: boolean;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({
  beneficiaries,
  language,
  isDirector = false,
  showPendingOrientation = false
}) => {
  // Calculer l'âge à partir de la date de naissance
  const calculateAge = (dateOfBirth: string | Date) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Statistiques globales
  const stats = {
    total: beneficiaries.length,
    women: beneficiaries.filter(b => {
      const age = calculateAge(b.dateOfBirth);
      return age >= 18;
    }).length,
    children: beneficiaries.filter(b => {
      const age = calculateAge(b.dateOfBirth);
      return age < 18;
    }).length,
    pendingOrientation: beneficiaries.filter(b => (b as any).status === 'EN_ATTENTE_ORIENTATION').length,
    active: beneficiaries.filter(b => (b as any).status === 'EN_SUIVI').length,
    thisMonth: beneficiaries.filter(b => {
      const created = new Date(b.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length
  };

  const isRTL = language === 'ar';

  const t = {
    overview: language === 'ar' ? 'نظرة عامة' : 'Vue d\'ensemble',
    totalBeneficiaries: language === 'ar' ? 'إجمالي المستفيدين' : 'Total bénéficiaires',
    women: language === 'ar' ? 'النساء' : 'Femmes',
    children: language === 'ar' ? 'الأطفال' : 'Enfants',
    pendingOrientation: language === 'ar' ? 'في انتظار التوجيه' : 'En attente d\'orientation',
    activeSupport: language === 'ar' ? 'في المتابعة' : 'En suivi actif',
    thisMonth: language === 'ar' ? 'هذا الشهر' : 'Ce mois-ci',
    womenSupport: language === 'ar' ? 'دعم النساء' : 'Accompagnement femmes',
    childProtection: language === 'ar' ? 'حماية الطفولة' : 'Protection enfance',
    orientationNeeded: language === 'ar' ? 'تحتاج توجيه' : 'Nécessite orientation',
    newArrivals: language === 'ar' ? 'وافدون جدد' : 'Nouvelles arrivées'
  };

  const statCards = [
    {
      title: t.totalBeneficiaries,
      value: stats.total,
      icon: Users,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: `+${stats.thisMonth} ${t.thisMonth.toLowerCase()}`
    },
    {
      title: t.women,
      value: stats.women,
      icon: Heart,
      color: 'bg-gradient-to-br from-pink-500 to-pink-600',
      textColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
      subtitle: t.womenSupport
    },
    {
      title: t.children,
      value: stats.children,
      icon: Shield,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      subtitle: t.childProtection
    },
    {
      title: t.activeSupport,
      value: stats.active,
      icon: CheckCircle,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      subtitle: `${Math.round((stats.active / stats.total) * 100)}%`
    }
  ];

  // Ajouter la carte d'orientation si c'est un directeur
  if (isDirector) {
    statCards.push({
      title: t.pendingOrientation,
      value: stats.pendingOrientation,
      icon: AlertTriangle,
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      subtitle: t.orientationNeeded
    });
  }

  return (
    <div className="space-y-6">
      {/* Titre de la section */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Activity className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{t.overview}</h3>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          
          return (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-0">
                <div className={`${stat.color} p-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/90 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      {stat.subtitle && (
                        <p className="text-white/80 text-xs mt-1">{stat.subtitle}</p>
                      )}
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                
                {stat.trend && (
                  <div className={`${stat.bgColor} p-3`}>
                    <div className={`flex items-center ${stat.textColor} text-sm`}>
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>{stat.trend}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alertes et actions rapides pour les directeurs */}
      {isDirector && stats.pendingOrientation > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div className="flex-1">
                <p className="text-amber-800 font-medium">
                  {language === 'ar' 
                    ? `يوجد ${stats.pendingOrientation} مستفيد في انتظار التوجيه`
                    : `${stats.pendingOrientation} bénéficiaire${stats.pendingOrientation > 1 ? 's' : ''} en attente d'orientation`
                  }
                </p>
                <p className="text-amber-700 text-sm mt-1">
                  {language === 'ar' 
                    ? 'يجب توجيههم إلى المساعدات الاجتماعيات المناسبات'
                    : 'Ils doivent être orientés vers les assistantes sociales appropriées'
                  }
                </p>
              </div>
              <UserCheck className="w-5 h-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Indicateur de mode spécial */}
      {showPendingOrientation && (
        <Card className="border-l-4 border-l-amber-500 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-amber-800 font-medium">
                  {language === 'ar' ? 'وضع التوجيه النشط' : 'Mode orientation actif'}
                </span>
              </div>
              <span className="text-amber-700 text-sm">
                {language === 'ar' 
                  ? 'يتم عرض المستفيدين الذين يحتاجون إلى توجيه فقط'
                  : 'Seuls les bénéficiaires nécessitant une orientation sont affichés'
                }
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPanel;
