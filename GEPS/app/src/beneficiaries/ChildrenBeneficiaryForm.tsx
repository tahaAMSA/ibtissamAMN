import React, { useState } from 'react';
import { createBeneficiary, updateBeneficiary } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import { useI18n } from '../translations/useI18n';
import { 
  Save, 
  X, 
  Baby, 
  Calendar, 
  MapPin, 
  Phone, 
  FileText, 
  Users, 
  Heart,
  Shield,
  Home,
  Briefcase,
  BookOpen,
  ClipboardList,
  School
} from 'lucide-react';

interface ChildrenBeneficiaryFormData {
  // Informations basiques
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  
  // Informations familiales
  parentName: string;
  parentPhone: string;
  emergencyContact: string;
  familyAddress: string;
  
  // Informations scolaires
  schoolName: string;
  schoolLevel: string;
  academicYear: string;
  schoolAddress: string;
  hasSchoolDifficulties: boolean;
  schoolDifficulties: string;
  
  // Informations médicales
  healthConditions: string;
  allergies: string;
  medications: string;
  doctorName: string;
  doctorPhone: string;
  
  // Situation familiale
  parentsMaritalStatus: string;
  numberOfSiblings: number;
  birthOrder: number;
  livesWithBothParents: boolean;
  guardianInfo: string;
  
  // Besoins et services
  servicesRequested: string[];
  specialNeeds: string;
  behavioralIssues: string;
  socialIntegration: string;
  
  // Suivi psychologique
  needsPsychologicalSupport: boolean;
  psychologicalHistory: string;
  currentTherapy: boolean;
  therapistInfo: string;
  
  // Activités et loisirs
  hobbies: string[];
  sportsActivities: string[];
  culturalActivities: string[];
  preferredActivities: string;
  
  // Situation économique familiale
  familyIncome: string;
  parentsProfession: string;
  financialSupport: boolean;
  
  // Notes et observations
  generalNotes: string;
  socialWorkerObservations: string;
  followUpPlan: string;
}

interface ChildrenBeneficiaryFormProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiary?: any;
  onSuccess: () => void;
}

const ChildrenBeneficiaryForm: React.FC<ChildrenBeneficiaryFormProps> = ({
  isOpen,
  onClose,
  beneficiary,
  onSuccess
}) => {
  const { data: user } = useAuth();
  const { t, lang: language, isRTL, dir } = useI18n(user as any);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  
  const [formData, setFormData] = useState<ChildrenBeneficiaryFormData>({
    firstName: beneficiary?.firstName || '',
    lastName: beneficiary?.lastName || '',
    dateOfBirth: beneficiary?.dateOfBirth ? beneficiary.dateOfBirth.split('T')[0] : '',
    gender: beneficiary?.gender || '',
    
    parentName: beneficiary?.parentName || '',
    parentPhone: beneficiary?.parentPhone || '',
    emergencyContact: beneficiary?.emergencyContact || '',
    familyAddress: beneficiary?.familyAddress || '',
    
    schoolName: beneficiary?.schoolName || '',
    schoolLevel: beneficiary?.schoolLevel || '',
    academicYear: beneficiary?.academicYear || '',
    schoolAddress: beneficiary?.schoolAddress || '',
    hasSchoolDifficulties: beneficiary?.hasSchoolDifficulties || false,
    schoolDifficulties: beneficiary?.schoolDifficulties || '',
    
    healthConditions: beneficiary?.healthConditions || '',
    allergies: beneficiary?.allergies || '',
    medications: beneficiary?.medications || '',
    doctorName: beneficiary?.doctorName || '',
    doctorPhone: beneficiary?.doctorPhone || '',
    
    parentsMaritalStatus: beneficiary?.parentsMaritalStatus || '',
    numberOfSiblings: beneficiary?.numberOfSiblings || 0,
    birthOrder: beneficiary?.birthOrder || 1,
    livesWithBothParents: beneficiary?.livesWithBothParents || true,
    guardianInfo: beneficiary?.guardianInfo || '',
    
    servicesRequested: beneficiary?.servicesRequested || [],
    specialNeeds: beneficiary?.specialNeeds || '',
    behavioralIssues: beneficiary?.behavioralIssues || '',
    socialIntegration: beneficiary?.socialIntegration || '',
    
    needsPsychologicalSupport: beneficiary?.needsPsychologicalSupport || false,
    psychologicalHistory: beneficiary?.psychologicalHistory || '',
    currentTherapy: beneficiary?.currentTherapy || false,
    therapistInfo: beneficiary?.therapistInfo || '',
    
    hobbies: beneficiary?.hobbies || [],
    sportsActivities: beneficiary?.sportsActivities || [],
    culturalActivities: beneficiary?.culturalActivities || [],
    preferredActivities: beneficiary?.preferredActivities || '',
    
    familyIncome: beneficiary?.familyIncome || '',
    parentsProfession: beneficiary?.parentsProfession || '',
    financialSupport: beneficiary?.financialSupport || false,
    
    generalNotes: beneficiary?.generalNotes || '',
    socialWorkerObservations: beneficiary?.socialWorkerObservations || '',
    followUpPlan: beneficiary?.followUpPlan || ''
  });

  // Traductions
  const translations = {
    title: language === 'ar' ? 'فيش المستفيد - الأطفال' : 'Fiche Bénéficiaire - Enfants',
    save: language === 'ar' ? 'حفظ' : 'Enregistrer',
    cancel: language === 'ar' ? 'إلغاء' : 'Annuler',
    previous: language === 'ar' ? 'السابق' : 'Précédent',
    next: language === 'ar' ? 'التالي' : 'Suivant',
    step: language === 'ar' ? 'الخطوة' : 'Étape',
    of: language === 'ar' ? 'من' : 'sur',
    required: language === 'ar' ? 'مطلوب' : 'Requis',
    yes: language === 'ar' ? 'نعم' : 'Oui',
    no: language === 'ar' ? 'لا' : 'Non',
    select: language === 'ar' ? 'اختر...' : 'Sélectionner...',
    
    // Sections
    basicInfo: language === 'ar' ? 'المعلومات الأساسية' : 'Informations de base',
    familyInfo: language === 'ar' ? 'المعلومات العائلية' : 'Informations familiales',
    schoolInfo: language === 'ar' ? 'المعلومات المدرسية' : 'Informations scolaires',
    healthInfo: language === 'ar' ? 'المعلومات الصحية' : 'Informations médicales',
    familySituation: language === 'ar' ? 'الوضع العائلي' : 'Situation familiale',
    servicesNeeds: language === 'ar' ? 'الخدمات والاحتياجات' : 'Services et besoins',
    psychologicalSupport: language === 'ar' ? 'الدعم النفسي' : 'Suivi psychologique',
    activitiesAndNotes: language === 'ar' ? 'الأنشطة والملاحظات' : 'Activités et notes',
    
    // Champs
    firstName: language === 'ar' ? 'الاسم الأول' : 'Prénom',
    lastName: language === 'ar' ? 'اسم العائلة' : 'Nom de famille',
    dateOfBirth: language === 'ar' ? 'تاريخ الميلاد' : 'Date de naissance',
    gender: language === 'ar' ? 'الجنس' : 'Genre',
    male: language === 'ar' ? 'ذكر' : 'Garçon',
    female: language === 'ar' ? 'أنثى' : 'Fille',
    
    parentName: language === 'ar' ? 'اسم الوالد/الوالدة' : 'Nom du parent/tuteur',
    parentPhone: language === 'ar' ? 'هاتف الوالد/الوالدة' : 'Téléphone du parent',
    emergencyContact: language === 'ar' ? 'جهة الاتصال في حالة الطوارئ' : 'Contact d\'urgence',
    familyAddress: language === 'ar' ? 'عنوان العائلة' : 'Adresse familiale',
    
    schoolName: language === 'ar' ? 'اسم المدرسة' : 'Nom de l\'école',
    schoolLevel: language === 'ar' ? 'المستوى الدراسي' : 'Niveau scolaire',
    academicYear: language === 'ar' ? 'السنة الدراسية' : 'Année académique',
    schoolAddress: language === 'ar' ? 'عنوان المدرسة' : 'Adresse de l\'école',
    hasSchoolDifficulties: language === 'ar' ? 'هل يواجه صعوبات مدرسية؟' : 'A-t-il des difficultés scolaires ?',
    schoolDifficulties: language === 'ar' ? 'تفاصيل الصعوبات المدرسية' : 'Détails des difficultés scolaires',
    
    healthConditions: language === 'ar' ? 'الحالات الصحية' : 'Conditions de santé',
    allergies: language === 'ar' ? 'الحساسية' : 'Allergies',
    medications: language === 'ar' ? 'الأدوية' : 'Médicaments',
    doctorName: language === 'ar' ? 'اسم الطبيب' : 'Nom du médecin',
    doctorPhone: language === 'ar' ? 'هاتف الطبيب' : 'Téléphone du médecin'
  };

  const stepTitles = [
    translations.basicInfo,
    translations.familyInfo,
    translations.schoolInfo,
    translations.healthInfo,
    translations.familySituation,
    translations.servicesNeeds,
    translations.psychologicalSupport,
    translations.activitiesAndNotes
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        beneficiaryType: 'ENFANT' as const, // Formulaire enfant = ENFANT
        phone: formData.parentPhone,
        address: formData.familyAddress,
        familySituation: formData.parentsMaritalStatus,
        professionalSituation: 'Student',
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.parentPhone,
        nationalId: '',
        birthPlace: '',
        maritalStatus: 'Single',
        numberOfChildren: 0,
        monthlyIncome: 0,
        educationLevel: formData.schoolLevel,
        healthConditions: formData.healthConditions,
        notes: formData.generalNotes
      };

      if (beneficiary) {
        await updateBeneficiary({
          id: beneficiary.id,
          ...submitData
        });
      } else {
        await createBeneficiary(submitData);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCheckboxChange = (field: keyof ChildrenBeneficiaryFormData, value: string, checked: boolean) => {
    const currentArray = formData[field] as string[];
    if (checked) {
      setFormData({
        ...formData,
        [field]: [...currentArray, value]
      });
    } else {
      setFormData({
        ...formData,
        [field]: currentArray.filter(item => item !== value)
      });
    }
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Baby className={`w-5 h-5 text-blue-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <h3 className="text-lg font-semibold text-gray-800">{translations.basicInfo}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.firstName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.lastName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.dateOfBirth} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.gender} *
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{translations.select}</option>
                    <option value="Male">{translations.male}</option>
                    <option value="Female">{translations.female}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Users className={`w-5 h-5 text-blue-700 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <h3 className="text-lg font-semibold text-gray-800">{translations.familyInfo}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.parentName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.parentPhone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.emergencyContact}
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.familyAddress} *
                  </label>
                  <textarea
                    required
                    value={formData.familyAddress}
                    onChange={(e) => setFormData({ ...formData, familyAddress: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-sky-100 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <School className={`w-5 h-5 text-sky-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <h3 className="text-lg font-semibold text-gray-800">{translations.schoolInfo}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.schoolName}
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.schoolLevel}
                  </label>
                  <select
                    value={formData.schoolLevel}
                    onChange={(e) => setFormData({ ...formData, schoolLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{translations.select}</option>
                    <option value="Maternelle">{language === 'ar' ? 'التحضيري' : 'Maternelle'}</option>
                    <option value="CP">{language === 'ar' ? 'السنة الأولى' : 'CP'}</option>
                    <option value="CE1">{language === 'ar' ? 'السنة الثانية' : 'CE1'}</option>
                    <option value="CE2">{language === 'ar' ? 'السنة الثالثة' : 'CE2'}</option>
                    <option value="CM1">{language === 'ar' ? 'السنة الرابعة' : 'CM1'}</option>
                    <option value="CM2">{language === 'ar' ? 'السنة الخامسة' : 'CM2'}</option>
                    <option value="6ème">{language === 'ar' ? 'السنة السادسة' : '6ème'}</option>
                    <option value="5ème">{language === 'ar' ? 'السنة السابعة' : '5ème'}</option>
                    <option value="4ème">{language === 'ar' ? 'السنة الثامنة' : '4ème'}</option>
                    <option value="3ème">{language === 'ar' ? 'السنة التاسعة' : '3ème'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.academicYear}
                  </label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="2023-2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.schoolAddress}
                  </label>
                  <input
                    type="text"
                    value={formData.schoolAddress}
                    onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.hasSchoolDifficulties}
                  </label>
                  <div className="flex space-x-4 mb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasSchoolDifficulties"
                        checked={formData.hasSchoolDifficulties === true}
                        onChange={() => setFormData({ ...formData, hasSchoolDifficulties: true })}
                        className="mr-2"
                      />
                      {translations.yes}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasSchoolDifficulties"
                        checked={formData.hasSchoolDifficulties === false}
                        onChange={() => setFormData({ ...formData, hasSchoolDifficulties: false })}
                        className="mr-2"
                      />
                      {translations.no}
                    </label>
                  </div>

                  {formData.hasSchoolDifficulties && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translations.schoolDifficulties}
                      </label>
                      <textarea
                        value={formData.schoolDifficulties}
                        onChange={(e) => setFormData({ ...formData, schoolDifficulties: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Heart className={`w-5 h-5 text-blue-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <h3 className="text-lg font-semibold text-gray-800">{translations.healthInfo}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.healthConditions}
                  </label>
                  <textarea
                    value={formData.healthConditions}
                    onChange={(e) => setFormData({ ...formData, healthConditions: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.allergies}
                  </label>
                  <textarea
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.medications}
                  </label>
                  <textarea
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.doctorName}
                  </label>
                  <input
                    type="text"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.doctorPhone}
                  </label>
                  <input
                    type="tel"
                    value={formData.doctorPhone}
                    onChange={(e) => setFormData({ ...formData, doctorPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      // Les autres étapes suivent le même modèle...
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {language === 'ar' ? 'هذه الخطوة قيد التطوير' : 'Cette étape est en développement'}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{translations.title}</h2>
            <p className="text-sm opacity-90">
              {translations.step} {currentStep} {translations.of} {totalSteps}: {stepTitles[currentStep - 1]}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-400 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-2">
          <div 
            className="bg-blue-500 h-2 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            {renderStep()}
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              currentStep === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {translations.previous}
          </button>

          <div className="flex space-x-2">
            {currentStep === totalSteps ? (
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {translations.save}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {translations.next}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildrenBeneficiaryForm;
