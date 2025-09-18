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
import { useAuth } from 'wasp/client/auth';
import { useI18n } from '../translations/useI18n';

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
  const { data: user } = useAuth();
  const { t, lang: language, isRTL, dir } = useI18n(user as any);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditForm, setShowEditForm] = useState(false);
  const [showChildForm, setShowChildForm] = useState(false);

  const { data: beneficiary, isLoading, error, refetch } = useQuery(getBeneficiaryById, { id: id! });


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
    { id: 'overview', label: t('dashboard.overview'), icon: User, count: undefined },
    { id: 'documents', label: t('beneficiary.documents'), icon: FileText, count: 0 },
    { id: 'accommodation', label: t('beneficiary.accommodation'), icon: Home, count: 0 },
    { id: 'meals', label: 'Repas', icon: Utensils, count: 0 },
    { id: 'activities', label: t('stats.activities'), icon: Activity, count: 0 },
    { id: 'projects', label: t('stats.projects'), icon: Lightbulb, count: 0 },
    { id: 'education', label: t('stats.education'), icon: GraduationCap, count: 0 }
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
    <div className={`space-y-8 ${isRTL ? 'rtl' : 'ltr'}`} dir={dir}>
      {/* Header amélioré avec design professionnel selon le type */}
      <Card className="overflow-hidden shadow-2xl">
        <div className={`${
          isChildBeneficiary(beneficiary) 
            ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700' 
            : 'bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700'
        } text-white p-8 relative`}>
          
          {/* Motif de fond décoratif */}
          <div className="absolute inset-0 bg-white/5">
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/10"></div>
            <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full bg-white/5"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate('/beneficiaries')}
                  className={`text-white bg-white/10 border border-white/20 ${
                    isChildBeneficiary(beneficiary) 
                      ? 'hover:bg-orange-400 hover:border-orange-300' 
                      : 'hover:bg-pink-400 hover:border-pink-300'
                  } backdrop-blur-sm`}
                >
                  <ArrowLeft className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('beneficiary.back')}
                </Button>
                
                {/* Badge amélioré du type de bénéficiaire */}
                <div className={`${
                  isChildBeneficiary(beneficiary) 
                    ? 'bg-orange-100 border-orange-200' 
                    : 'bg-pink-100 border-pink-200'
                } px-4 py-2 rounded-full border-2 shadow-lg`}>
                  <div className="flex items-center gap-2">
                    {isChildBeneficiary(beneficiary) ? (
                      <Shield className="w-5 h-5 text-orange-600" />
                    ) : (
                      <Heart className="w-5 h-5 text-pink-600" />
                    )}
                    <span className={`font-bold text-sm ${
                      isChildBeneficiary(beneficiary) ? 'text-orange-800' : 'text-pink-800'
                    }`}>
                      {isChildBeneficiary(beneficiary) 
                        ? (language === 'ar' ? 'وحدة حماية الطفولة' : 'Protection Enfance')
                        : (language === 'ar' ? 'مساعدة النساء' : 'Aide aux Femmes')
                      }
                    </span>
                  </div>
                </div>
              </div>
              
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => {
                  if (isChildBeneficiary(beneficiary)) {
                    setShowChildForm(true);
                  } else {
                    setShowEditForm(true);
                  }
                }}
                className={`bg-white/10 border border-white/30 text-white backdrop-blur-sm ${
                  isChildBeneficiary(beneficiary) 
                    ? 'hover:bg-orange-400 hover:border-orange-300' 
                    : 'hover:bg-pink-400 hover:border-pink-300'
                } shadow-lg`}
                size="lg"
              >
                <Edit className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('action.edit')}
              </Button>
            </div>
          </div>

          {/* Section profil avec avatar et informations */}
          <div className="flex items-center space-x-8 mt-6">
            {/* Avatar amélioré */}
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl border-4 border-white/30">
                {beneficiary.firstName.charAt(0)}{beneficiary.lastName.charAt(0)}
              </div>
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${
                isChildBeneficiary(beneficiary) ? 'bg-orange-400' : 'bg-pink-400'
              } rounded-full flex items-center justify-center shadow-lg`}>
                {isChildBeneficiary(beneficiary) ? (
                  <Shield className="w-4 h-4 text-white" />
                ) : (
                  <Heart className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            
            {/* Informations principales */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3 text-white">
                {beneficiary.firstName} {beneficiary.lastName}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/90">
                <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-medium">{beneficiary.gender === 'Male' ? t('beneficiary.male') : t('beneficiary.female')}</span>
                </div>
                <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-medium">{calculateAge(beneficiary.dateOfBirth)} {t('beneficiary.years')}</span>
                </div>
                {beneficiary.phone && (
                  <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                    <Phone className="w-5 h-5 mr-2" />
                    <span className="font-medium">{beneficiary.phone}</span>
                  </div>
                )}
              </div>
              
              {/* Statut du dossier */}
              <div className="mt-4">
                <div className="inline-flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-white font-medium text-sm">
                    {(beneficiary as any).status === 'EN_SUIVI' 
                      ? (language === 'ar' ? 'قيد المتابعة' : 'En suivi actif')
                      : (language === 'ar' ? 'نشط' : 'Dossier actif')
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

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
            {/* Alert amélioré selon le type de bénéficiaire */}
            <Card className={`border-2 ${
              isChildBeneficiary(beneficiary) 
                ? 'border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100' 
                : 'border-pink-200 bg-gradient-to-r from-pink-50 to-pink-100'
            } shadow-lg`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    isChildBeneficiary(beneficiary) ? 'bg-orange-500' : 'bg-pink-500'
                  } shadow-lg`}>
                    {isChildBeneficiary(beneficiary) ? (
                      <Shield className="h-6 w-6 text-white" />
                    ) : (
                      <Heart className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${
                      isChildBeneficiary(beneficiary) ? 'text-orange-800' : 'text-pink-800'
                    }`}>
                      {isChildBeneficiary(beneficiary) 
                        ? (language === 'ar' ? 'ملف حماية الطفولة' : 'Dossier Protection Enfance')
                        : (language === 'ar' ? 'ملف مساعدة النساء' : 'Dossier Aide aux Femmes')
                      }
                    </h3>
                    <p className={`${
                      isChildBeneficiary(beneficiary) ? 'text-orange-700' : 'text-pink-700'
                    } leading-relaxed`}>
                      {isChildBeneficiary(beneficiary) 
                        ? (language === 'ar' 
                          ? 'هذا ملف طفل تحت الحماية. يتطلب اهتماماً خاصاً ومتابعة دقيقة وحساسة وفقاً لبروتوكولات حماية الطفولة.'
                          : 'Dossier enfant sous protection. Nécessite une attention particulière et un suivi rigoureux selon les protocoles de protection de l\'enfance.'
                        )
                        : (language === 'ar' 
                          ? 'ملف مستفيدة من برامج مساعدة النساء. الوصول متاح لجميع الخدمات المتخصصة والدعم النفسي والاجتماعي.'
                          : 'Dossier bénéficiaire des programmes d\'aide aux femmes. Accès disponible à tous les services spécialisés et au soutien psychosocial.'
                        )
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
              <Card className={`border-2 shadow-lg ${
                isChildBeneficiary(beneficiary) ? 'border-orange-200' : 'border-pink-200'
              }`}>
                <CardHeader className={`${
                  isChildBeneficiary(beneficiary) 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
                    : 'bg-gradient-to-r from-pink-500 to-pink-600'
                } text-white`}>
                  <CardTitle className="text-xl flex items-center">
                    <User className="w-6 h-6 mr-3" />
                    {t('beneficiary.personalInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t('general.firstName')}</label>
                    <p className="text-lg font-semibold text-gray-900">{beneficiary.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t('general.lastName')}</label>
                    <p className="text-lg font-semibold text-gray-900">{beneficiary.lastName}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t('filters.gender')}</label>
                    <Badge variant={beneficiary.gender === 'Female' ? 'secondary' : 'info'}>
                      {beneficiary.gender === 'Male' ? t('beneficiary.male') : t('beneficiary.female')}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t('beneficiary.age')}</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {calculateAge(beneficiary.dateOfBirth)} {t('beneficiary.years')}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{t('beneficiary.birthdate')}</label>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(beneficiary.dateOfBirth)}
                  </p>
                </div>

                {beneficiary.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t('beneficiary.phone')}</label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {beneficiary.phone}
                    </p>
                  </div>
                )}

                {beneficiary.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t('beneficiary.address')}</label>
                    <p className="text-gray-900 flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                      <span>{beneficiary.address}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations sociales */}
            <Card className="border-2 border-emerald-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <CardTitle className="text-xl flex items-center">
                  <Users className="w-6 h-6 mr-3" />
                  {language === 'ar' ? 'المعلومات الاجتماعية' : 'Informations sociales'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {beneficiary.familySituation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t('general.familySituation')}</label>
                    <p className="text-gray-900 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {beneficiary.familySituation}
                    </p>
                  </div>
                )}
                
                {beneficiary.professionalSituation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t('general.professionalSituation')}</label>
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
            <Card className="border-2 border-violet-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-violet-500 to-violet-600 text-white">
                <CardTitle className="text-xl flex items-center">
                  <Info className="w-6 h-6 mr-3" />
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
                <CardTitle className="text-xl text-blue-900">{t('beneficiary.documents')}</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">Aucune donnée disponible</p>
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
              <CardTitle className="text-xl text-blue-900">{t('beneficiary.accommodation')}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">Aucune donnée disponible</p>
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
                <p className="text-gray-600 text-lg mb-2">Aucune donnée disponible</p>
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
