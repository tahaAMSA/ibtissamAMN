import React, { useState, useMemo } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getAllBeneficiaries, deleteBeneficiary, orientBeneficiary, getAssistantesSociales } from 'wasp/client/operations';
import type { Beneficiary } from 'wasp/entities';
import { Link, useNavigate } from 'react-router-dom';
import WomenBeneficiaryForm from './WomenBeneficiaryForm';
import ChildProtectionForm from './ChildProtectionForm';
import SimpleAccueilForm from './SimpleAccueilForm';
import { useAuth } from 'wasp/client/auth';
import { UserRole } from '@prisma/client';
import { useI18n } from '../translations/useI18n';

// Plus d'imports de composants complexes
import { Button } from '../client/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../client/components/ui/card';
import { Alert, AlertDescription } from '../client/components/ui/alert';
import { AlertTriangle, Users, Filter, UserCheck, Activity, Heart, Shield, Info, X } from 'lucide-react';
import BackButton from '../client/components/ui/BackButton';
import Breadcrumb from '../client/components/ui/Breadcrumb';
// Suppression de l'import problématique de Label et Select qui n'existent pas

// Import des composants de protection
import { ProtectedRoute, ProtectedComponent } from '../client/components/ProtectedComponent';
import { usePermissions } from '../client/hooks/usePermissions';
import BeneficiaryGrid from '../client/components/Beneficiaries/BeneficiaryGrid';
import DashboardPanel from '../client/components/Beneficiaries/DashboardPanel';



interface FilterState {
  searchTerm: string;
  beneficiaryType: string;
  gender: string;
  ageRange: string;
  city: string;
  status: string;
}

const BeneficiariesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const { t, lang: language, isRTL, dir } = useI18n(user as any);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    beneficiaryType: '',
    gender: '',
    ageRange: '',
    city: '',
    status: ''
  });

  const [showWomenForm, setShowWomenForm] = useState(false);
  const [showChildProtectionForm, setShowChildProtectionForm] = useState(false);
  const [showSimpleAccueilForm, setShowSimpleAccueilForm] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null);
  const [assigningBeneficiary, setAssigningBeneficiary] = useState<Beneficiary | null>(null);
  
  // Récupérer le rôle de l'utilisateur (user déjà défini plus haut)
  const isAgentAccueil = user?.role === UserRole.AGENT_ACCUEIL;
  const isDirector = user?.role === UserRole.DIRECTEUR || user?.role === UserRole.COORDINATEUR;
  
  // État pour filtrer les bénéficiaires à orienter (mode spécial pour directrice)
  const [showPendingOrientation, setShowPendingOrientation] = useState(false);
  const [showAssistantsSocialSelect, setShowAssistantsSocialSelect] = useState(false);
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>("");
  const [orientationReason, setOrientationReason] = useState<string>("");
  
  const { data: beneficiaries, isLoading, error, refetch } = useQuery(getAllBeneficiaries);
  const { data: assistantsSociales } = useQuery(getAssistantesSociales);

  // Variables isRTL et t sont maintenant fournies par useI18n hook

  const handleEdit = (beneficiary: Beneficiary) => {
    setEditingBeneficiary(beneficiary);
    setShowWomenForm(true);
  };

  const handleView = (beneficiary: Beneficiary) => {
    // Naviguer vers la page de détail du bénéficiaire
    navigate(`/beneficiaries/${beneficiary.id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('beneficiary.confirmDelete'))) {
      try {
        await deleteBeneficiary({ id });
        refetch();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleAssign = (beneficiary: Beneficiary) => {
    setAssigningBeneficiary(beneficiary);
    // Si mode orientation directrice et qu'il s'agit d'un bénéficiaire en attente d'orientation
    if (isDirector && showPendingOrientation && (beneficiary as any).status === 'EN_ATTENTE_ORIENTATION') {
      setShowAssistantsSocialSelect(true);
    } else {
      setShowAssignmentModal(true);
    }
  };

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

  // Gestion de l'orientation d'un bénéficiaire
  const handleOrient = async (beneficiaryId: string) => {
    if (!selectedAssistantId) {
      alert('Veuillez sélectionner une assistante sociale');
      return;
    }

    try {
      await orientBeneficiary({
        beneficiaryId,
        assignedToId: selectedAssistantId,
        reason: orientationReason
      });
      
      alert('Bénéficiaire orienté avec succès');
      setShowAssistantsSocialSelect(false);
      setSelectedAssistantId('');
      setOrientationReason('');
      setAssigningBeneficiary(null);
      refetch();
    } catch (error) {
      console.error('Erreur lors de l\'orientation:', error);
      alert('Erreur lors de l\'orientation du bénéficiaire');
    }
  };

  // Filtrage avancé des bénéficiaires avec useMemo pour optimiser les performances
  const filteredBeneficiaries = useMemo(() => {
    if (!beneficiaries) return [];
    
    return beneficiaries.filter(beneficiary => {
      // Filtre spécial pour le mode directrice - uniquement les bénéficiaires en attente d'orientation
      if (showPendingOrientation && (beneficiary as any).status !== 'EN_ATTENTE_ORIENTATION') {
        return false;
      }
      
      // Recherche textuelle
      const searchMatch = !filters.searchTerm || 
        beneficiary.firstName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        beneficiary.lastName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        beneficiary.phone?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        beneficiary.address?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Filtre par type de bénéficiaire (NOUVEAU FILTRE PRINCIPAL)
      let beneficiaryTypeMatch = true;
      if (filters.beneficiaryType) {
        // Si le champ beneficiaryType n'existe pas encore, on fait une détection basée sur l'âge
        const age = calculateAge(beneficiary.dateOfBirth);
        const detectedType = age < 18 ? 'ENFANT' : 'FEMME';
        beneficiaryTypeMatch = (beneficiary as any).beneficiaryType === filters.beneficiaryType || 
                               detectedType === filters.beneficiaryType;
      }
      
      // Filtre par genre
      const genderMatch = !filters.gender || beneficiary.gender === filters.gender;
      
      // Filtre par tranche d'âge
      let ageMatch = true;
      if (filters.ageRange) {
        const age = calculateAge(beneficiary.dateOfBirth);
        switch (filters.ageRange) {
          case '0-17':
            ageMatch = age >= 0 && age <= 17;
            break;
          case '18-64':
            ageMatch = age >= 18 && age <= 64;
            break;
          case '65+':
            ageMatch = age >= 65;
            break;
        }
      }
      
      // Filtre par ville (basé sur l'adresse)
      let cityMatch = true;
      if (filters.city && beneficiary.address) {
        cityMatch = beneficiary.address.toLowerCase().includes(filters.city.toLowerCase());
      }
      
      // Filtre par statut (pour l'instant tous actifs)
      const statusMatch = !filters.status || filters.status === 'active';
      
      return searchMatch && beneficiaryTypeMatch && genderMatch && ageMatch && cityMatch && statusMatch;
    });
  }, [beneficiaries, filters, showPendingOrientation]);

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {language === 'ar' 
              ? 'خطأ في تحميل بيانات المستفيدين. يرجى المحاولة مرة أخرى.'
              : 'Erreur lors du chargement des bénéficiaires. Veuillez réessayer.'
            }
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">
          {language === 'ar' ? 'إعادة المحاولة' : 'Réessayer'}
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Breadcrumb language={language as 'fr' | 'ar'} />
        <BackButton fallbackPath="/dashboard">
          {language === 'ar' ? 'العودة' : 'Retour'}
        </BackButton>
      </div>

      {/* Header avec statistiques et boutons améliorés */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">
                {language === 'ar' ? 'إدارة المستفيدين' : 'Gestion des Bénéficiaires'}
              </h1>
              <p className="text-blue-100 mt-2 text-lg">
                {language === 'ar' ? 'منصة إدارة الحالات المتخصصة' : 'Plateforme spécialisée de gestion des cas'}
              </p>
            </div>
            
            {/* Statistiques rapides */}
            <div className="flex gap-4">
              <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  {filteredBeneficiaries.filter(b => {
                    const age = calculateAge(b.dateOfBirth);
                    return age >= 18;
                  }).length}
                </div>
                <div className="text-sm text-blue-100">
                  {t('beneficiary.filter.women').replace('👩 ', '')}
                </div>
              </div>
              <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  {filteredBeneficiaries.filter(b => {
                    const age = calculateAge(b.dateOfBirth);
                    return age < 18;
                  }).length}
                </div>
                <div className="text-sm text-blue-100">
                  {t('beneficiary.filter.children').replace('🧒 ', '')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section des boutons d'ajout redesignée */}
        <div className="p-6 bg-gray-50">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">
                {beneficiaries?.length || 0} {language === 'ar' ? 'مستفيد مسجل' : 'bénéficiaires enregistrés'}
              </span>
              {showPendingOrientation && (
                <span className="text-amber-600 text-sm">
                  • {language === 'ar' ? 'في انتظار التوجيه' : 'En attente d\'orientation'}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {isAgentAccueil ? (
                // Bouton simplifié pour agents d'accueil
                <Button 
                  onClick={() => setShowSimpleAccueilForm(true)}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                  size="lg"
                >
                  <UserCheck className="w-5 h-5 mr-2" />
                  {language === 'ar' ? 'إضافة مستفيد جديد' : 'Nouvel accueil'}
                </Button>
              ) : (
                // Boutons spécialisés pour les autres rôles
                <>
                  {isDirector && (
                    <Button 
                      variant={showPendingOrientation ? "default" : "outline"}
                      className={showPendingOrientation 
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0" 
                        : "border-amber-300 text-amber-700 hover:bg-amber-50"
                      }
                      onClick={() => setShowPendingOrientation(!showPendingOrientation)}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      {showPendingOrientation
                        ? (language === 'ar' ? 'عرض الكل' : 'Voir tout')
                        : (language === 'ar' ? 'التوجيه' : 'À orienter')
                      }
                    </Button>
                  )}
                  
                  {/* Bouton Femmes - Design spécialisé */}
                  <Button 
                    onClick={() => setShowWomenForm(true)}
                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg border-0"
                    size="lg"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    {language === 'ar' ? 'مستفيدة جديدة' : 'Nouvelle femme'}
                  </Button>
                  
                  {/* Bouton Enfants - Design spécialisé */}
                  <Button 
                    onClick={() => setShowChildProtectionForm(true)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg border-0"
                    size="lg"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    {language === 'ar' ? 'طفل جديد' : 'Nouvel enfant'}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Message informatif selon le type d'utilisateur */}
          <div className="mt-4">
            {isAgentAccueil ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center text-blue-800 text-sm">
                  <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>
                    {language === 'ar' 
                      ? 'قم بإجراء الاستقبال الأولي. سيتم إشعار الإدارة لتوجيه المستفيد إلى الخدمة المناسبة.'
                      : 'Effectuez l\'accueil initial. La direction sera notifiée pour orienter le bénéficiaire vers le service approprié.'
                    }
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                  <div className="flex items-center text-pink-800">
                    <Heart className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      {language === 'ar' ? 'مساعدة النساء' : 'Aide aux femmes'}
                    </span>
                  </div>
                  <p className="text-pink-700 mt-1 text-xs">
                    {language === 'ar' 
                      ? 'النساء في حالات صعبة، عنف، طلاق أو صعوبات اجتماعية'
                      : 'Femmes en situation difficile, violence, divorce ou difficultés sociales'
                    }
                  </p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center text-orange-800">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      {t('beneficiary.protection.child')}
                    </span>
                  </div>
                  <p className="text-orange-700 mt-1 text-xs">
                    {t('beneficiary.protection.child.desc')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Filtres améliorés avec focus sur les types de bénéficiaires */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barre de recherche principale */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder={t('beneficiary.search.placeholder')}
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir={dir}
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Filtres par type et catégorie */}
          <div className="flex gap-3 flex-wrap">
            {/* Filtre par type de bénéficiaire */}
            <select
              value={filters.beneficiaryType}
              onChange={(e) => setFilters(prev => ({ ...prev, beneficiaryType: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
            >
              <option value="">{t('beneficiary.filter.allTypes')}</option>
              <option value="FEMME">{t('beneficiary.filter.women')}</option>
              <option value="ENFANT">{t('beneficiary.filter.children')}</option>
            </select>

            {/* Filtre par genre */}
            <select
              value={filters.gender}
              onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">{language === 'ar' ? 'كل الأجناس' : 'Tous genres'}</option>
              <option value="Male">{language === 'ar' ? 'ذكر' : 'Masculin'}</option>
              <option value="Female">{language === 'ar' ? 'أنثى' : 'Féminin'}</option>
            </select>

            {/* Filtre par tranche d'âge */}
            <select
              value={filters.ageRange}
              onChange={(e) => setFilters(prev => ({ ...prev, ageRange: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">{language === 'ar' ? 'كل الأعمار' : 'Tous âges'}</option>
              <option value="0-17">{language === 'ar' ? '0-17 سنة' : '0-17 ans'}</option>
              <option value="18-64">{language === 'ar' ? '18-64 سنة' : '18-64 ans'}</option>
              <option value="65+">{language === 'ar' ? '65+ سنة' : '65+ ans'}</option>
            </select>

            {/* Bouton de réinitialisation */}
            {(filters.searchTerm || filters.beneficiaryType || filters.gender || filters.ageRange) && (
              <Button
                variant="outline"
                onClick={() => setFilters({
                  searchTerm: '',
                  beneficiaryType: '',
                  gender: '',
                  ageRange: '',
                  city: '',
                  status: ''
                })}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-1" />
                {language === 'ar' ? 'مسح' : 'Effacer'}
              </Button>
            )}
          </div>
        </div>

        {/* Ligne d'informations et statut */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-1.5" />
              {filteredBeneficiaries.length} {language === 'ar' ? 'نتيجة' : 'résultats'}
            </span>
            
            {/* Répartition rapide */}
            <div className="flex gap-4 text-xs">
              <span className="text-pink-600 flex items-center">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-1"></div>
                {filteredBeneficiaries.filter(b => {
                  const age = calculateAge(b.dateOfBirth);
                  return age >= 18;
                }).length} {language === 'ar' ? 'امرأة' : 'femmes'}
              </span>
              <span className="text-orange-600 flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                {filteredBeneficiaries.filter(b => {
                  const age = calculateAge(b.dateOfBirth);
                  return age < 18;
                }).length} {language === 'ar' ? 'طفل' : 'enfants'}
              </span>
            </div>
          </div>
          
          {/* Indicateur de mode orientation */}
          {isDirector && showPendingOrientation && (
            <div className="flex items-center px-3 py-1 text-sm bg-amber-50 border border-amber-200 rounded-full">
              <UserCheck className="h-4 w-4 text-amber-600 mr-1.5" />
              <span className="text-amber-700 font-medium">
                {language === 'ar' ? 'وضع التوجيه نشط' : 'Mode orientation actif'}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Tableau de bord avec statistiques */}
      <DashboardPanel 
        beneficiaries={beneficiaries || []} 
        language={language}
        isDirector={isDirector}
        showPendingOrientation={showPendingOrientation}
      />

      {/* Liste des bénéficiaires avec BeneficiaryGrid */}
      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : filteredBeneficiaries.length === 0 ? (
        <Card className="p-12 text-center">
          {showPendingOrientation 
            ? 'Aucun bénéficiaire en attente d\'orientation' 
            : 'Aucun bénéficiaire trouvé'}
        </Card>
      ) : (
        <BeneficiaryGrid
          beneficiaries={filteredBeneficiaries}
          onEdit={isDirector && showPendingOrientation ? handleAssign : handleEdit}
          onView={handleView}
          isLoading={isLoading}
        />
      )}
      
      {/* Modal pour orienter un bénéficiaire (pour la directrice) */}
      {showAssistantsSocialSelect && assigningBeneficiary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>Orienter le bénéficiaire</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Bénéficiaire</div>
                  <div className="bg-gray-50 p-2 rounded-md border">
                    {assigningBeneficiary.firstName} {assigningBeneficiary.lastName}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Sélectionner une assistante sociale</div>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedAssistantId}
                    onChange={(e) => setSelectedAssistantId(e.target.value)}
                  >
                    <option value="">-- Choisir une assistante sociale --</option>
                    {assistantsSociales?.map((as: any) => (
                      <option key={as.id} value={as.id}>
                        {as.firstName} {as.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Raison de l'orientation (optionnel)</div>
                  <textarea
                    value={orientationReason}
                    onChange={(e) => setOrientationReason(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Raison de l'orientation..."
                  ></textarea>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAssistantsSocialSelect(false);
                  setAssigningBeneficiary(null);
                }}
              >
                Annuler
              </Button>
              <Button 
                onClick={() => handleOrient(assigningBeneficiary.id)}
                disabled={!selectedAssistantId}
              >
                Orienter le bénéficiaire
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Formulaires modaux */}
      <WomenBeneficiaryForm
        isOpen={showWomenForm}
        onClose={() => {
          setShowWomenForm(false);
          setEditingBeneficiary(null);
        }}
        beneficiary={editingBeneficiary}
        onSuccess={() => {
          refetch();
          setEditingBeneficiary(null);
        }}
      />

      <ChildProtectionForm
        isOpen={showChildProtectionForm}
        onClose={() => {
          setShowChildProtectionForm(false);
          setEditingBeneficiary(null);
        }}
        beneficiary={editingBeneficiary}
        onSuccess={() => {
          refetch();
          setEditingBeneficiary(null);
        }}
      />

      {/* Formulaire d'accueil simplifié pour agents d'accueil */}
      {showSimpleAccueilForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <SimpleAccueilForm
            onSuccess={() => {
              setShowSimpleAccueilForm(false);
              refetch();
            }}
            onCancel={() => setShowSimpleAccueilForm(false)}
          />
        </div>
      )}

      {/* Modal d'assignation simple */}
      {assigningBeneficiary && showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Assigner {assigningBeneficiary.firstName} {assigningBeneficiary.lastName}
            </h3>
            <p className="text-gray-600 mb-4">
              Fonctionnalité d'assignation à implémenter
            </p>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline"
                onClick={() => {
                  setShowAssignmentModal(false);
                  setAssigningBeneficiary(null);
                }}
              >
                Annuler
              </Button>
              <Button 
                onClick={() => {
                  setShowAssignmentModal(false);
                  setAssigningBeneficiary(null);
                  refetch();
                }}
              >
                Confirmer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BeneficiariesPage;
