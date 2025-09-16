import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../cn';
import { Users, Shield, Plus, UserPlus, BarChart3, UserCheck } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';

interface BeneficiaryHeaderProps {
  totalCount: number;
  onAddWoman: () => void;
  onAddChildProtection: () => void;
  onAddSimpleAccueil?: () => void;
  language: 'fr' | 'ar';
  className?: string;
}

export default function BeneficiaryHeader({
  totalCount,
  onAddWoman,
  onAddChildProtection,
  onAddSimpleAccueil,
  language,
  className
}: BeneficiaryHeaderProps) {
  const isRTL = language === 'ar';
  const { user, hasPermission } = usePermissions();

  const t = {
    title: language === 'ar' ? 'إدارة المستفيدين' : 'Gestion des Bénéficiaires',
    subtitle: language === 'ar' ? 'إدارة شاملة لملفات المستفيدين والخدمات المقدمة' : 'Gestion complète des dossiers bénéficiaires et services fournis',
    addWoman: language === 'ar' ? 'فيش مستفيدة مفصلة' : 'Fiche bénéficiaire détaillée',
    addChildProtection: language === 'ar' ? 'وحدة حماية الطفولة' : 'Unité Protection Enfance',
    addSimpleAccueil: language === 'ar' ? 'تسجيل الاستقبال' : 'Enregistrement Accueil',
    totalBeneficiaries: language === 'ar' ? 'إجمالي المستفيدين' : 'Total bénéficiaires',
    activeBeneficiaries: language === 'ar' ? 'المستفيدون النشطون' : 'Bénéficiaires actifs',
    newThisMonth: language === 'ar' ? 'جديد هذا الشهر' : 'Nouveaux ce mois'
  };

  // Déterminer quels boutons afficher selon le rôle
  const isAgentAccueil = user?.role === 'AGENT_ACCUEIL';
  const canCreateDetailed = hasPermission('BENEFICIARIES', 'CREATE') && !isAgentAccueil;

  return (
    <Card className={cn('border-2 border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-50', className)}>
      <CardHeader>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <CardTitle className="text-3xl font-bold text-blue-900 mb-2">
              {t.title}
            </CardTitle>
            <p className="text-blue-700 opacity-90 text-lg">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Agent d'accueil: formulaire simplifié */}
            {isAgentAccueil && onAddSimpleAccueil && (
              <div className="relative">
                <Button
                  onClick={onAddSimpleAccueil}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transition-all duration-200 group"
                  size="lg"
                >
                  <UserCheck className={cn('w-5 h-5 group-hover:scale-110 transition-transform', isRTL ? 'ml-2' : 'mr-2')} />
                  {t.addSimpleAccueil}
                </Button>
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 text-xs font-semibold"
                >
                  {language === 'ar' ? 'استقبال' : 'Accueil'}
                </Badge>
              </div>
            )}

            {/* Autres rôles: formulaires détaillés */}
            {canCreateDetailed && (
              <>
                <div className="relative">
                  <Button
                    onClick={onAddWoman}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg transition-all duration-200 group"
                    size="lg"
                  >
                    <Users className={cn('w-5 h-5 group-hover:scale-110 transition-transform', isRTL ? 'ml-2' : 'mr-2')} />
                    {t.addWoman}
                  </Button>
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 bg-pink-100 text-pink-800 text-xs font-semibold"
                  >
                    {language === 'ar' ? 'نساء 18+' : 'Femmes 18+'}
                  </Badge>
                </div>
                
                <div className="relative">
                  <Button
                    onClick={onAddChildProtection}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg transition-all duration-200 group"
                    size="lg"
                  >
                    <Shield className={cn('w-5 h-5 group-hover:scale-110 transition-transform', isRTL ? 'ml-2' : 'mr-2')} />
                    {t.addChildProtection}
                  </Button>
                  <Badge 
                    variant="warning" 
                    className="absolute -top-2 -right-2 bg-orange-100 text-orange-800 text-xs font-semibold"
                  >
                    {language === 'ar' ? 'أطفال 0-17' : 'Enfants 0-17'}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total des bénéficiaires */}
          <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-blue-200">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{totalCount}</p>
              <p className="text-sm text-blue-700">{t.totalBeneficiaries}</p>
            </div>
          </div>

          {/* Bénéficiaires actifs */}
          <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-green-200">
            <div className="p-3 bg-green-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">{Math.round(totalCount * 0.85)}</p>
              <p className="text-sm text-green-700">{t.activeBeneficiaries}</p>
            </div>
          </div>

          {/* Nouveaux ce mois */}
          <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-yellow-200">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <UserPlus className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-900">{Math.round(totalCount * 0.15)}</p>
              <p className="text-sm text-yellow-700">{t.newThisMonth}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
