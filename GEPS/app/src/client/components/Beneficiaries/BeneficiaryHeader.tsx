import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../cn';
import { Users, Shield, Plus, UserPlus, BarChart3, UserCheck, Heart } from 'lucide-react';
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
    <Card className={cn('border-2 border-blue-200 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white shadow-2xl relative overflow-hidden', className)}>
      {/* Motifs décoratifs d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-10 -right-8 w-16 h-16 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-4 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-16 left-4 w-8 h-8 bg-white/10 rounded-full"></div>
      </div>
      
      <CardHeader className="relative">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <CardTitle className="text-4xl font-bold mb-3 text-white drop-shadow-lg">
              {t.title}
            </CardTitle>
            <p className="text-white/90 text-lg font-medium">
              {t.subtitle}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm">
                {language === 'ar' ? 'نظام إدارة شامل' : 'Système de gestion intégré'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Agent d'accueil: formulaire simplifié */}
            {isAgentAccueil && onAddSimpleAccueil && (
              <div className="relative">
                <Button
                  onClick={onAddSimpleAccueil}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 shadow-xl transition-all duration-300 group hover:scale-105"
                  size="lg"
                >
                  <UserCheck className={cn('w-5 h-5 group-hover:scale-110 transition-transform', isRTL ? 'ml-2' : 'mr-2')} />
                  {t.addSimpleAccueil}
                </Button>
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-semibold shadow-lg"
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
                    className="bg-gradient-to-r from-pink-500/90 to-rose-500/90 hover:from-pink-500 hover:to-rose-500 backdrop-blur-sm text-white border border-pink-300/30 shadow-xl transition-all duration-300 group hover:scale-105"
                    size="lg"
                  >
                    <Heart className={cn('w-5 h-5 group-hover:scale-110 transition-transform', isRTL ? 'ml-2' : 'mr-2')} />
                    {t.addWoman}
                  </Button>
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-semibold shadow-lg"
                  >
                    {language === 'ar' ? 'نساء 18+' : 'Femmes 18+'}
                  </Badge>
                </div>
                
                <div className="relative">
                  <Button
                    onClick={onAddChildProtection}
                    className="bg-gradient-to-r from-orange-500/90 to-orange-600/90 hover:from-orange-500 hover:to-orange-600 backdrop-blur-sm text-white border border-orange-300/30 shadow-xl transition-all duration-300 group hover:scale-105"
                    size="lg"
                  >
                    <Shield className={cn('w-5 h-5 group-hover:scale-110 transition-transform', isRTL ? 'ml-2' : 'mr-2')} />
                    {t.addChildProtection}
                  </Button>
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-semibold shadow-lg"
                  >
                    {language === 'ar' ? 'أطفال 0-17' : 'Enfants 0-17'}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total des bénéficiaires */}
          <div className="flex items-center space-x-4 p-6 bg-white/95 backdrop-blur-sm rounded-xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-900">{totalCount}</p>
              <p className="text-sm text-blue-700 font-medium">{t.totalBeneficiaries}</p>
            </div>
          </div>

          {/* Bénéficiaires actifs */}
          <div className="flex items-center space-x-4 p-6 bg-white/95 backdrop-blur-sm rounded-xl border border-green-200/50 shadow-lg hover:shadow-xl transition-all">
            <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-green-900">{Math.round(totalCount * 0.85)}</p>
              <p className="text-sm text-green-700 font-medium">{t.activeBeneficiaries}</p>
            </div>
          </div>

          {/* Nouveaux ce mois */}
          <div className="flex items-center space-x-4 p-6 bg-white/95 backdrop-blur-sm rounded-xl border border-amber-200/50 shadow-lg hover:shadow-xl transition-all">
            <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-900">{Math.round(totalCount * 0.15)}</p>
              <p className="text-sm text-amber-700 font-medium">{t.newThisMonth}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
