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

// Plus d'imports de composants complexes
import { Button } from '../client/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../client/components/ui/card';
import { Alert, AlertDescription } from '../client/components/ui/alert';
import { AlertTriangle, Users, Filter, UserCheck, Activity } from 'lucide-react';
// Suppression de l'import problématique de Label et Select qui n'existent pas

// Import des composants de protection
import { ProtectedRoute, ProtectedComponent } from '../client/components/ProtectedComponent';
import { usePermissions } from '../client/hooks/usePermissions';
import BeneficiaryGrid from '../client/components/Beneficiaries/BeneficiaryGrid';



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
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
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
  
  // Récupérer l'utilisateur courant et son rôle
  const { data: user } = useAuth();
  const isAgentAccueil = user?.role === UserRole.AGENT_ACCUEIL;
  const isDirector = user?.role === UserRole.DIRECTEUR || user?.role === UserRole.COORDINATEUR;
  
  // État pour filtrer les bénéficiaires à orienter (mode spécial pour directrice)
  const [showPendingOrientation, setShowPendingOrientation] = useState(false);
  const [showAssistantsSocialSelect, setShowAssistantsSocialSelect] = useState(false);
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>("");
  const [orientationReason, setOrientationReason] = useState<string>("");
  
  const { data: beneficiaries, isLoading, error, refetch } = useQuery(getAllBeneficiaries);
  const { data: assistantsSociales } = useQuery(getAssistantesSociales);

  const isRTL = language === 'ar';

  // Traductions
  const t = {
    title: language === 'ar' ? 'إدارة المستفيدين' : 'Gestion des Bénéficiaires',
    addNew: language === 'ar' ? 'إضافة مستفيد جديد' : 'Ajouter un nouveau bénéficiaire',
    addWoman: language === 'ar' ? 'فيش مستفيدة مفصلة' : 'Fiche bénéficiaire détaillée',
    addChildProtection: language === 'ar' ? 'وحدة حماية الطفولة' : 'Unité Protection Enfance',
    search: language === 'ar' ? 'البحث...' : 'Rechercher...',
    filter: language === 'ar' ? 'تصفية' : 'Filtrer',
    all: language === 'ar' ? 'الكل' : 'Tous',
    male: language === 'ar' ? 'ذكر' : 'Homme',
    female: language === 'ar' ? 'أنثى' : 'Femme',
    firstName: language === 'ar' ? 'الاسم الأول' : 'Prénom',
    lastName: language === 'ar' ? 'اسم العائلة' : 'Nom de famille',
    gender: language === 'ar' ? 'الجنس' : 'Genre',
    dateOfBirth: language === 'ar' ? 'تاريخ الميلاد' : 'Date de naissance',
    phone: language === 'ar' ? 'الهاتف' : 'Téléphone',
    address: language === 'ar' ? 'العنوان' : 'Adresse',
    familySituation: language === 'ar' ? 'الوضع العائلي' : 'Situation familiale',
    professionalSituation: language === 'ar' ? 'الوضع المهني' : 'Situation professionnelle',
    actions: language === 'ar' ? 'الإجراءات' : 'Actions',
    edit: language === 'ar' ? 'تحرير' : 'Modifier',
    delete: language === 'ar' ? 'حذف' : 'Supprimer',
    view: language === 'ar' ? 'عرض' : 'Voir',
    save: language === 'ar' ? 'حفظ' : 'Enregistrer',
    cancel: language === 'ar' ? 'إلغاء' : 'Annuler',
    close: language === 'ar' ? 'إغلاق' : 'Fermer',
    loading: language === 'ar' ? 'جاري التحميل...' : 'Chargement...',
    noData: language === 'ar' ? 'لا توجد بيانات' : 'Aucune donnée',
    confirmDelete: language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Êtes-vous sûr de vouloir supprimer ?',
    documents: language === 'ar' ? 'الوثائق' : 'Documents',
    accommodation: language === 'ar' ? 'الإيواء' : 'Hébergement',
    age: language === 'ar' ? 'العمر' : 'Âge'
  };

  const handleEdit = (beneficiary: Beneficiary) => {
    setEditingBeneficiary(beneficiary);
    setShowWomenForm(true);
  };

  const handleView = (beneficiary: Beneficiary) => {
    // Naviguer vers la page de détail du bénéficiaire
    navigate(`/beneficiaries/${beneficiary.id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t.confirmDelete)) {
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
    <div className={`space-y-8 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header simple */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'ar' ? 'إدارة المستفيدين' : 'Gestion des Bénéficiaires'}
            </h1>
            <p className="text-gray-600 mt-1">
              {beneficiaries?.length || 0} {language === 'ar' ? 'مستفيد' : 'bénéficiaires'}
            </p>
          </div>
          <div className="flex gap-2">
            {isAgentAccueil ? (
              // Formulaire simplifié pour les agents d'accueil
              <Button onClick={() => setShowSimpleAccueilForm(true)}>
                {language === 'ar' ? 'إضافة مستفيد جديد' : 'Ajouter un bénéficiaire'}
              </Button>
            ) : (
              // Formulaires standard pour les autres rôles
              <>
                {isDirector && (
                  <Button 
                    variant={showPendingOrientation ? "default" : "outline"}
                    className={showPendingOrientation ? "bg-amber-600 hover:bg-amber-700" : ""}
                    onClick={() => setShowPendingOrientation(!showPendingOrientation)}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    {showPendingOrientation
                      ? 'Voir tous les bénéficiaires'
                      : 'Voir bénéficiaires à orienter'
                    }
                  </Button>
                )}
                <Button onClick={() => setShowWomenForm(true)}>
                  {language === 'ar' ? 'إضافة امرأة' : 'Ajouter une femme'}
                </Button>
                <Button onClick={() => setShowChildProtectionForm(true)} variant="outline">
                  {language === 'ar' ? 'إضافة طفل' : 'Ajouter un enfant'}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Filtres simples */}
      <Card className="p-4">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder={language === 'ar' ? 'البحث...' : 'Rechercher...'}
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={filters.gender}
            onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">{language === 'ar' ? 'كل الأجناس' : 'Tous les genres'}</option>
            <option value="Male">{language === 'ar' ? 'ذكر' : 'Homme'}</option>
            <option value="Female">{language === 'ar' ? 'أنثى' : 'Femme'}</option>
          </select>
          <span className="px-3 py-2 text-sm text-gray-600">
            {filteredBeneficiaries.length} {language === 'ar' ? 'نتيجة' : 'résultats'}
          </span>
          
          {isDirector && showPendingOrientation && (
            <div className="ml-auto px-3 py-1 text-sm bg-yellow-50 border border-yellow-200 rounded-md flex items-center">
              <UserCheck className="h-4 w-4 text-yellow-600 mr-1.5" />
              <span className="text-yellow-700">Mode orientation active</span>
            </div>
          )}
        </div>
      </Card>

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
          language={language}
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
