import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getBeneficiaryById } from 'wasp/client/operations';
import type { Beneficiary } from 'wasp/entities';
import { 
  User, 
  FileText, 
  Home, 
  Utensils, 
  Activity, 
  Lightbulb,
  GraduationCap,
  Plus,
  MessageSquare,
  ArrowLeft,
  Edit,
  Phone,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Heart,
  Shield,
  Info
} from 'lucide-react';

// Plus d'imports de composants complexes
import { Card, CardContent, CardHeader, CardTitle } from '../client/components/ui/card';
import { Button } from '../client/components/ui/button';
import { Alert, AlertDescription } from '../client/components/ui/alert';
import { Badge } from '../client/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { TimeTracker } from '../client/components/TimeTracking';
import WomenBeneficiaryForm from './WomenBeneficiaryForm';
import ChildProtectionForm from './ChildProtectionForm';

const BeneficiaryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditForm, setShowEditForm] = useState(false);
  const [showChildForm, setShowChildForm] = useState(false);

  const { data: beneficiary, isLoading, error, refetch } = useQuery(getBeneficiaryById, { id: id! });

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

  const getBeneficiaryType = (beneficiary: any) => {
    // Si le champ beneficiaryType existe, l'utiliser
    if (beneficiary.beneficiaryType) {
      return beneficiary.beneficiaryType;
    }
    // Sinon, détecter basé sur l'âge
    const age = calculateAge(beneficiary.dateOfBirth);
    return age < 18 ? 'ENFANT' : 'FEMME';
  };

  const isChildBeneficiary = (beneficiary: any) => {
    return getBeneficiaryType(beneficiary) === 'ENFANT';
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR');
  };

  const tabs = [
    { id: 'overview', label: t.overview, icon: User, count: undefined },
    { id: 'documents', label: t.documents, icon: FileText, count: 0 },
    { id: 'accommodation', label: t.accommodation, icon: Home, count: 0 },
    { id: 'meals', label: t.meals, icon: Utensils, count: 0 },
    { id: 'activities', label: t.activities, icon: Activity, count: 0 },
    { id: 'projects', label: t.projects, icon: Lightbulb, count: 0 },
    { id: 'education', label: t.education, icon: GraduationCap, count: 0 }
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-blue-100">
          <CardContent className="p-8">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-20 w-20 bg-blue-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-8 bg-blue-200 rounded mb-2"></div>
                  <div className="h-4 bg-blue-100 rounded w-2/3"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-blue-100 rounded"></div>
                <div className="h-20 bg-blue-100 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !beneficiary) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {language === 'ar' 
            ? 'خطأ في تحميل بيانات المستفيد. المستفيد غير موجود.'
            : 'Erreur lors du chargement du bénéficiaire. Bénéficiaire non trouvé.'
          }
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-8 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header personnalisé avec navigation - COULEURS DIFFÉRENTES SELON LE TYPE */}
      <div className={`${
        isChildBeneficiary(beneficiary) 
          ? 'bg-gradient-to-r from-orange-500 to-orange-700' 
          : 'bg-gradient-to-r from-blue-600 to-blue-800'
      } text-white p-6 rounded-xl shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/beneficiaries')}
              className={`text-white ${
                isChildBeneficiary(beneficiary) 
                  ? 'hover:bg-orange-400 hover:text-white' 
                  : 'hover:bg-blue-500 hover:text-white'
              }`}
            >
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t.back}
            </Button>
            
            {/* Badge du type de bénéficiaire */}
            <Badge 
              variant="secondary" 
              className={`${
                isChildBeneficiary(beneficiary) 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-blue-100 text-blue-800'
              } font-semibold`}
            >
              {isChildBeneficiary(beneficiary) 
                ? (language === 'ar' ? 'وحدة حماية الطفولة' : 'Protection Enfance')
                : (language === 'ar' ? 'مستفيدة' : 'Bénéficiaire Femme')
              }
            </Badge>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  language === 'fr' 
                    ? 'bg-white text-orange-600' 
                    : isChildBeneficiary(beneficiary) 
                      ? 'bg-orange-500 text-white hover:bg-orange-400' 
                      : 'bg-blue-500 text-white hover:bg-blue-400'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  language === 'ar' 
                    ? 'bg-white text-orange-600' 
                    : isChildBeneficiary(beneficiary) 
                      ? 'bg-orange-500 text-white hover:bg-orange-400' 
                      : 'bg-blue-500 text-white hover:bg-blue-400'
                }`}
              >
                AR
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                if (isChildBeneficiary(beneficiary)) {
                  setShowChildForm(true);
                } else {
                  setShowEditForm(true);
                }
              }}
              className={`bg-white ${
                isChildBeneficiary(beneficiary) 
                  ? 'text-orange-600 hover:bg-orange-50' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Edit className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t.edit}
            </Button>
          </div>
        </div>

        {/* Informations principales */}
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
            {beneficiary.firstName.charAt(0)}{beneficiary.lastName.charAt(0)}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {beneficiary.firstName} {beneficiary.lastName}
            </h1>
            
            <div className="flex items-center space-x-4 text-blue-100">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>{beneficiary.gender === 'Male' ? t.male : t.female}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{calculateAge(beneficiary.dateOfBirth)} {t.age}</span>
              </div>
              {beneficiary.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{beneficiary.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Time Tracker - Suivi du temps passé sur le dossier */}
      <TimeTracker 
        beneficiaryId={beneficiary.id}
        beneficiaryName={`${beneficiary.firstName} ${beneficiary.lastName}`}
        autoStart={false}
        autoStop={false}
        showStats={false}
      />

      {/* Tabs simples */}
      <Card className="p-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="whitespace-nowrap"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Contenu des onglets */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Alert différent selon le type de bénéficiaire */}
            <Alert className={`${
              isChildBeneficiary(beneficiary) 
                ? 'border-orange-200 bg-orange-50' 
                : 'border-blue-200 bg-blue-50'
            }`}>
              <Shield className={`h-4 w-4 ${
                isChildBeneficiary(beneficiary) ? 'text-orange-600' : 'text-blue-600'
              }`} />
              <AlertDescription className={`${
                isChildBeneficiary(beneficiary) ? 'text-orange-800' : 'text-blue-800'
              }`}>
                {isChildBeneficiary(beneficiary) 
                  ? (language === 'ar' 
                    ? 'هذا ملف طفل تحت الحماية. يتطلب اهتماماً خاصاً ومتابعة دقيقة.'
                    : 'Dossier enfant sous protection. Nécessite une attention particulière et un suivi rigoureux.'
                  )
                  : (language === 'ar' 
                    ? 'ملف مستفيدة. يمكن الوصول إلى جميع الخدمات المتاحة.'
                    : 'Dossier bénéficiaire femme. Accès à tous les services disponibles.'
                  )
                }
              </AlertDescription>
            </Alert>

            {/* Statut du dossier */}
            <div className="mb-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Statut du dossier</h3>
                <Badge variant="default">
                  {beneficiary.status || 'Actif'}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">
                  Créé le {new Date(beneficiary.createdAt).toLocaleDateString()}
                </p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Informations personnelles de base */}
              <Card className={`border-2 ${
                isChildBeneficiary(beneficiary) ? 'border-orange-100' : 'border-blue-100'
              }`}>
                <CardHeader className={`${
                  isChildBeneficiary(beneficiary) 
                    ? 'bg-gradient-to-r from-orange-50 to-orange-100' 
                    : 'bg-gradient-to-r from-blue-50 to-blue-100'
                }`}>
                  <CardTitle className={`text-xl ${
                    isChildBeneficiary(beneficiary) ? 'text-orange-900' : 'text-blue-900'
                  } flex items-center`}>
                    <User className="w-5 h-5 mr-2" />
                    {t.personalInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t.firstName}</label>
                    <p className="text-lg font-semibold text-gray-900">{beneficiary.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t.lastName}</label>
                    <p className="text-lg font-semibold text-gray-900">{beneficiary.lastName}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t.gender}</label>
                    <Badge variant={beneficiary.gender === 'Female' ? 'secondary' : 'info'}>
                      {beneficiary.gender === 'Male' ? t.male : t.female}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t.age}</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {calculateAge(beneficiary.dateOfBirth)} {language === 'ar' ? 'سنة' : 'ans'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{t.dateOfBirth}</label>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(beneficiary.dateOfBirth)}
                  </p>
                </div>

                {beneficiary.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t.phone}</label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {beneficiary.phone}
                    </p>
                  </div>
                )}

                {beneficiary.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t.address}</label>
                    <p className="text-gray-900 flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                      <span>{beneficiary.address}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations sociales */}
            <Card className="border-2 border-green-100">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <CardTitle className="text-xl text-green-900 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  {language === 'ar' ? 'المعلومات الاجتماعية' : 'Informations sociales'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {beneficiary.familySituation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t.familySituation}</label>
                    <p className="text-gray-900 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {beneficiary.familySituation}
                    </p>
                  </div>
                )}
                
                {beneficiary.professionalSituation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t.professionalSituation}</label>
                    <p className="text-gray-900 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                      {beneficiary.professionalSituation}
                    </p>
                  </div>
                )}

                {beneficiary.maritalStatus && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {language === 'ar' ? 'الحالة المدنية' : 'État civil'}
                    </label>
                    <p className="text-gray-900">{beneficiary.maritalStatus}</p>
                  </div>
                )}

                {beneficiary.numberOfChildren !== undefined && beneficiary.numberOfChildren !== null && beneficiary.numberOfChildren > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {language === 'ar' ? 'عدد الأطفال' : 'Nombre d\'enfants'}
                    </label>
                    <p className="text-gray-900">{beneficiary.numberOfChildren}</p>
                  </div>
                )}

                {beneficiary.educationLevel && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {language === 'ar' ? 'المستوى التعليمي' : 'Niveau d\'éducation'}
                    </label>
                    <p className="text-gray-900">{beneficiary.educationLevel}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations complémentaires */}
            <Card className="border-2 border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                <CardTitle className="text-xl text-purple-900 flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  {language === 'ar' ? 'معلومات إضافية' : 'Informations complémentaires'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {beneficiary.emergencyContact && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {language === 'ar' ? 'جهة الاتصال الطارئة' : 'Contact d\'urgence'}
                    </label>
                    <p className="text-gray-900">{beneficiary.emergencyContact}</p>
                    {beneficiary.emergencyPhone && (
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Phone className="w-3 h-3 mr-1" />
                        {beneficiary.emergencyPhone}
                      </p>
                    )}
                  </div>
                )}

                {beneficiary.nationalId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {language === 'ar' ? 'رقم الهوية' : 'Numéro d\'identité'}
                    </label>
                    <p className="text-gray-900">{beneficiary.nationalId}</p>
                  </div>
                )}

                {beneficiary.birthPlace && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {language === 'ar' ? 'مكان الميلاد' : 'Lieu de naissance'}
                    </label>
                    <p className="text-gray-900">{beneficiary.birthPlace}</p>
                  </div>
                )}

                {beneficiary.healthConditions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {language === 'ar' ? 'الحالة الصحية' : 'Conditions de santé'}
                    </label>
                    <p className="text-gray-900">{beneficiary.healthConditions}</p>
                  </div>
                )}

                {beneficiary.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {language === 'ar' ? 'ملاحظات' : 'Notes'}
                    </label>
                    <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg">{beneficiary.notes}</p>
                  </div>
                )}

                {!beneficiary.emergencyContact && !beneficiary.nationalId && !beneficiary.birthPlace && !beneficiary.healthConditions && !beneficiary.notes && (
                  <div className="text-center py-8">
                    <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {language === 'ar' ? 'لا توجد معلومات إضافية' : 'Aucune information complémentaire'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <Card className="border-2 border-blue-100">
            <CardHeader className="border-b border-blue-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-blue-900">{t.documents}</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">{t.noData}</p>
                <p className="text-gray-500 text-sm">
                  {language === 'ar' 
                    ? 'لم يتم رفع أي وثائق بعد'
                    : 'Aucun document téléchargé pour le moment'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'accommodation' && (
          <Card className="border-2 border-blue-100">
            <CardHeader className="border-b border-blue-100">
              <CardTitle className="text-xl text-blue-900">{t.accommodation}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">{t.noData}</p>
                <p className="text-gray-500 text-sm">
                  {language === 'ar' 
                    ? 'لا توجد معلومات إيواء متاحة'
                    : 'Aucune information d\'hébergement disponible'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Autres onglets avec un design similaire */}
        {(activeTab === 'meals' || activeTab === 'activities' || activeTab === 'projects' || activeTab === 'education') && (
          <Card className="border-2 border-blue-100">
            <CardHeader className="border-b border-blue-100">
              <CardTitle className="text-xl text-blue-900">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {React.createElement(tabs.find(tab => tab.id === activeTab)?.icon || FileText, { 
                    className: "w-8 h-8 text-gray-400" 
                  })}
                </div>
                <p className="text-gray-600 text-lg mb-2">{t.noData}</p>
                <p className="text-gray-500 text-sm">
                  {language === 'ar' 
                    ? 'لا توجد بيانات متاحة لهذا القسم'
                    : 'Aucune donnée disponible pour cette section'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Formulaires modaux */}
      <WomenBeneficiaryForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        beneficiary={beneficiary}
        onSuccess={() => {
          refetch();
          setShowEditForm(false);
        }}
      />

      <ChildProtectionForm
        isOpen={showChildForm}
        onClose={() => setShowChildForm(false)}
        beneficiary={beneficiary}
        onSuccess={() => {
          refetch();
          setShowChildForm(false);
        }}
      />
    </div>
  );
};

export default BeneficiaryDetailPage;
