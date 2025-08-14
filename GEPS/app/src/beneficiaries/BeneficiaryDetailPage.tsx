import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getBeneficiaryById } from 'wasp/client/operations';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  FileText, 
  Home, 
  Utensils, 
  Activity, 
  Lightbulb,
  GraduationCap,
  Edit,
  Plus
} from 'lucide-react';

const BeneficiaryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [activeTab, setActiveTab] = useState('overview');

  const { data: beneficiary, isLoading, error } = useQuery(getBeneficiaryById, { id: id! });

  const isRTL = language === 'ar';

  // Traductions
  const t = {
    back: language === 'ar' ? 'رجوع' : 'Retour',
    edit: language === 'ar' ? 'تحرير' : 'Modifier',
    overview: language === 'ar' ? 'نظرة عامة' : 'Vue d\'ensemble',
    documents: language === 'ar' ? 'الوثائق' : 'Documents',
    accommodation: language === 'ar' ? 'الإيواء' : 'Hébergement',
    meals: language === 'ar' ? 'الوجبات' : 'Repas',
    activities: language === 'ar' ? 'الأنشطة' : 'Activités',
    projects: language === 'ar' ? 'المشاريع' : 'Projets',
    education: language === 'ar' ? 'التعليم' : 'Éducation',
    personalInfo: language === 'ar' ? 'المعلومات الشخصية' : 'Informations personnelles',
    firstName: language === 'ar' ? 'الاسم الأول' : 'Prénom',
    lastName: language === 'ar' ? 'اسم العائلة' : 'Nom de famille',
    gender: language === 'ar' ? 'الجنس' : 'Genre',
    dateOfBirth: language === 'ar' ? 'تاريخ الميلاد' : 'Date de naissance',
    age: language === 'ar' ? 'العمر' : 'Âge',
    phone: language === 'ar' ? 'الهاتف' : 'Téléphone',
    address: language === 'ar' ? 'العنوان' : 'Adresse',
    familySituation: language === 'ar' ? 'الوضع العائلي' : 'Situation familiale',
    professionalSituation: language === 'ar' ? 'الوضع المهني' : 'Situation professionnelle',
    male: language === 'ar' ? 'ذكر' : 'Homme',
    female: language === 'ar' ? 'أنثى' : 'Femme',
    loading: language === 'ar' ? 'جاري التحميل...' : 'Chargement...',
    notFound: language === 'ar' ? 'المستفيد غير موجود' : 'Bénéficiaire non trouvé',
    type: language === 'ar' ? 'النوع' : 'Type',
    status: language === 'ar' ? 'الحالة' : 'Statut',
    date: language === 'ar' ? 'التاريخ' : 'Date',
    author: language === 'ar' ? 'الكاتب' : 'Auteur',
    dormitory: language === 'ar' ? 'المهجع' : 'Dortoir',
    bed: language === 'ar' ? 'السرير' : 'Lit',
    checkIn: language === 'ar' ? 'تاريخ الدخول' : 'Date d\'entrée',
    checkOut: language === 'ar' ? 'تاريخ الخروج' : 'Date de sortie',
    current: language === 'ar' ? 'حالي' : 'Actuel',
    menu: language === 'ar' ? 'القائمة' : 'Menu',
    preferences: language === 'ar' ? 'التفضيلات' : 'Préférences',
    quantity: language === 'ar' ? 'الكمية' : 'Quantité',
    title: language === 'ar' ? 'العنوان' : 'Titre',
    category: language === 'ar' ? 'الفئة' : 'Catégorie',
    participation: language === 'ar' ? 'المشاركة' : 'Participation',
    present: language === 'ar' ? 'حاضر' : 'Présent',
    absent: language === 'ar' ? 'غائب' : 'Absent',
    description: language === 'ar' ? 'الوصف' : 'Description',
    idea: language === 'ar' ? 'الفكرة' : 'Idée',
    progress: language === 'ar' ? 'التقدم' : 'Progression',
    budget: language === 'ar' ? 'الميزانية' : 'Budget',
    institution: language === 'ar' ? 'المؤسسة' : 'Établissement',
    level: language === 'ar' ? 'المستوى' : 'Niveau',
    year: language === 'ar' ? 'السنة' : 'Année',
    results: language === 'ar' ? 'النتائج' : 'Résultats',
    support: language === 'ar' ? 'الدعم' : 'Soutien',
    active: language === 'ar' ? 'نشط' : 'Actif',
    inactive: language === 'ar' ? 'غير نشط' : 'Inactif',
    noData: language === 'ar' ? 'لا توجد بيانات' : 'Aucune donnée disponible'
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

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR');
  };

  const tabs = [
    { id: 'overview', label: t.overview, icon: <User className="w-4 h-4" /> },
    { id: 'documents', label: t.documents, icon: <FileText className="w-4 h-4" /> },
    { id: 'accommodation', label: t.accommodation, icon: <Home className="w-4 h-4" /> },
    { id: 'meals', label: t.meals, icon: <Utensils className="w-4 h-4" /> },
    { id: 'activities', label: t.activities, icon: <Activity className="w-4 h-4" /> },
    { id: 'projects', label: t.projects, icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'education', label: t.education, icon: <GraduationCap className="w-4 h-4" /> }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">{t.loading}</div>
      </div>
    );
  }

  if (error || !beneficiary) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{t.notFound}</p>
        <Link
          to="/beneficiaries"
          className="text-blue-600 hover:text-blue-800"
        >
          {t.back}
        </Link>
      </div>
    );
  }

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/beneficiaries"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {beneficiary.firstName} {beneficiary.lastName}
              </h1>
              <p className="text-gray-600">
                {beneficiary.gender === 'Male' ? t.male : t.female} • {t.age}: {calculateAge(beneficiary.dateOfBirth)} {language === 'ar' ? 'سنة' : 'ans'}
              </p>
            </div>
          </div>
          <button className="flex items-center px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors">
            <Edit className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t.edit}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className={`${isRTL ? 'ml-2' : 'mr-2'}`}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.personalInfo}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">{t.firstName}</label>
                    <p className="mt-1 text-sm text-gray-900">{beneficiary.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">{t.lastName}</label>
                    <p className="mt-1 text-sm text-gray-900">{beneficiary.lastName}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">{t.gender}</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {beneficiary.gender === 'Male' ? t.male : t.female}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">{t.dateOfBirth}</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(beneficiary.dateOfBirth)}</p>
                  </div>
                </div>

                {beneficiary.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">{t.phone}</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <Phone className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} text-gray-400`} />
                      {beneficiary.phone}
                    </p>
                  </div>
                )}

                {beneficiary.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">{t.address}</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <MapPin className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} text-gray-400`} />
                      {beneficiary.address}
                    </p>
                  </div>
                )}

                {beneficiary.familySituation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">{t.familySituation}</label>
                    <p className="mt-1 text-sm text-gray-900">{beneficiary.familySituation}</p>
                  </div>
                )}

                {beneficiary.professionalSituation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">{t.professionalSituation}</label>
                    <p className="mt-1 text-sm text-gray-900">{beneficiary.professionalSituation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">0</p>
                    <p className="text-sm text-gray-600">{t.documents}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">0</p>
                    <p className="text-sm text-gray-600">{t.activities}</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Lightbulb className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">0</p>
                    <p className="text-sm text-gray-600">{t.projects}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <GraduationCap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">0</p>
                    <p className="text-sm text-gray-600">{t.education}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">{t.documents}</h2>
                <button className="flex items-center px-3 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors">
                  <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Ajouter
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-center text-gray-500 py-8">{t.noData}</p>
            </div>
          </div>
        )}

        {activeTab === 'accommodation' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{t.accommodation}</h2>
            </div>
            <div className="p-6">
              <p className="text-center text-gray-500 py-8">{t.noData}</p>
            </div>
          </div>
        )}

        {/* Autres onglets peuvent être ajoutés ici de manière similaire */}
      </div>
    </div>
  );
};

export default BeneficiaryDetailPage;
