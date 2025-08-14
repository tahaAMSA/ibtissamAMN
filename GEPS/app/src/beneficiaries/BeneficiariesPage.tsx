import React, { useState, useEffect } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getAllBeneficiaries, createBeneficiary, updateBeneficiary, deleteBeneficiary } from 'wasp/client/operations';
import { Link } from 'react-router-dom';
import WomenBeneficiaryForm from './WomenBeneficiaryForm';
import ChildProtectionForm from './ChildProtectionForm';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  UserPlus,
  Calendar,
  MapPin,
  Phone,
  Users,
  FileText,
  ChevronDown,
  Shield
} from 'lucide-react';



const BeneficiariesPage: React.FC = () => {
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('');

  const [showWomenForm, setShowWomenForm] = useState(false);
  const [showChildProtectionForm, setShowChildProtectionForm] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<any>(null);

  const { data: beneficiaries, isLoading, error, refetch } = useQuery(getAllBeneficiaries);

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

  const handleEdit = (beneficiary: any) => {
    setEditingBeneficiary(beneficiary);
    setShowWomenForm(true);
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

  const filteredBeneficiaries = beneficiaries?.filter(beneficiary => {
    const searchMatch = 
      beneficiary.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const genderMatch = !filterGender || beneficiary.gender === filterGender;
    
    return searchMatch && genderMatch;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">{t.loading}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Erreur lors du chargement des bénéficiaires
      </div>
    );
  }

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-600 mt-1">
              {language === 'ar' 
                ? `إجمالي المستفيدين: ${filteredBeneficiaries.length}`
                : `Total des bénéficiaires: ${filteredBeneficiaries.length}`
              }
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowWomenForm(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg"
            >
              <Users className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t.addWoman}
            </button>
            
            <button
              onClick={() => setShowChildProtectionForm(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
            >
              <Shield className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t.addChildProtection}
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">{t.all}</option>
              <option value="Male">{t.male}</option>
              <option value="Female">{t.female}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Beneficiaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBeneficiaries.map((beneficiary) => (
          <div key={beneficiary.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {beneficiary.firstName} {beneficiary.lastName}
                </h3>
                <p className="text-gray-600 text-sm flex items-center mt-1">
                  <Calendar className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {t.age}: {calculateAge(beneficiary.dateOfBirth)} {language === 'ar' ? 'سنة' : 'ans'}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/beneficiaries/${beneficiary.id}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title={t.view}
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleEdit(beneficiary)}
                  className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                  title={t.edit}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(beneficiary.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={t.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {beneficiary.gender === 'Male' ? t.male : t.female}
              </div>
              
              {beneficiary.phone && (
                <div className="flex items-center">
                  <Phone className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {beneficiary.phone}
                </div>
              )}

              {beneficiary.address && (
                <div className="flex items-center">
                  <MapPin className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {beneficiary.address}
                </div>
              )}

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center">
                  <FileText className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  <span>0 {t.documents}</span>
                </div>
                <div className="flex items-center">
                  <UserPlus className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  <span>0 {t.accommodation}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBeneficiaries.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t.noData}</p>
        </div>
      )}



      {/* Formulaire détaillé pour les femmes */}
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

      {/* Formulaire Protection de l'Enfance */}
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

    </div>
  );
};

export default BeneficiariesPage;
