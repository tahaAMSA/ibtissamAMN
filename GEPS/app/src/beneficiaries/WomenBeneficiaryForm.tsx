import React, { useState } from 'react';
import { createBeneficiary, updateBeneficiary } from 'wasp/client/operations';
import { 
  Save, 
  X, 
  User, 
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
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Info,
  Camera,
  Mic,
  Eye,
  EyeOff
} from 'lucide-react';

interface ViolenceDetails {
  contexte?: string;
  frequence?: string;
  lieu?: string;
  duree?: string;
  effets?: string;
  actes?: string[];
  moyens?: string[];
}

interface AgresseurInfo {
  relation?: string;
  identite?: string;
  age?: number;
  dateNaissance?: string;
  nationalite?: string;
  cni?: string;
  statutMatrimonial?: string;
  sante?: string;
  education?: string;
  profession?: string;
  contexteResidence?: string;
  adresse?: string;
  telephone?: string;
  etatLorsFaits?: string;
  consommation?: string;
  facteurs?: string;
}

interface WomenBeneficiaryFormData {
  // Informations basiques
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  
  // Informations entretien
  intervenanteName: string;
  interviewDuration: string;
  
  // Historique avec le centre
  dejabeneficie: boolean;
  dateBeneficePrecedent: string;
  numDossierPrecedent: string;
  declarationViolenceCellule: string[];
  
  // Identité détaillée
  nomComplet: string;
  age: number;
  nationalite: string;
  cni: string;
  statut: string;
  
  // Dossier
  numDossier: string;
  annee: number;
  dateOuverture: string;
  statutDossier: string;
  
  // Motifs de la visite
  motifs: string[];
  
  // Canal de connaissance
  canaux: string[];
  
  // Origine de l'orientation
  sourcesOrientation: string[];
  
  // Profil personnel détaillé
  trancheAge: string;
  ageMariage: number;
  nbEnfants: number;
  dureeMariageCourant: string;
  mariagePrecedent: boolean;
  statutMatrimonial: string;
  logement: string;
  sante: string[];
  education: string;
  profession: string;
  
  // Violences
  violencePhysique: ViolenceDetails;
  violencePsychologique: ViolenceDetails;
  violenceSexuelle: ViolenceDetails;
  violenceEconomique: ViolenceDetails;
  violenceElectronique: ViolenceDetails;
  
  // Informations sur l'agresseur
  agresseurInfo: AgresseurInfo;
  
  // Description et documents
  description: string;
  rapport: string;
  piecesJointes: string[];
  
  // Services et suivi
  proceduresJuridiques: any;
  proceduresAdministratives: any;
  hebergement: boolean;
  priseEnChargeDistance: boolean;
  orientationInterne: string[];
  orientationExterne: string[];
  satisfaction: string;
  resultatFinal: string;
}

interface WomenBeneficiaryFormProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiary?: any;
  onSuccess: () => void;
}

const WomenBeneficiaryForm: React.FC<WomenBeneficiaryFormProps> = ({
  isOpen,
  onClose,
  beneficiary,
  onSuccess
}) => {
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 12;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [formData, setFormData] = useState<WomenBeneficiaryFormData>({
    firstName: beneficiary?.firstName || '',
    lastName: beneficiary?.lastName || '',
    dateOfBirth: beneficiary?.dateOfBirth ? beneficiary.dateOfBirth.split('T')[0] : '',
    phone: beneficiary?.phone || '',
    address: beneficiary?.address || '',
    
    intervenanteName: beneficiary?.intervenanteName || '',
    interviewDuration: beneficiary?.interviewDuration || '',
    
    dejabeneficie: beneficiary?.dejabeneficie || false,
    dateBeneficePrecedent: beneficiary?.dateBeneficePrecedent ? beneficiary.dateBeneficePrecedent.split('T')[0] : '',
    numDossierPrecedent: beneficiary?.numDossierPrecedent || '',
    declarationViolenceCellule: beneficiary?.declarationViolenceCellule || [],
    
    nomComplet: beneficiary?.nomComplet || '',
    age: beneficiary?.age || 0,
    nationalite: beneficiary?.nationalite || 'Marocaine',
    cni: beneficiary?.cni || '',
    statut: beneficiary?.statut || '',
    
    numDossier: beneficiary?.numDossier || '',
    annee: beneficiary?.annee || new Date().getFullYear(),
    dateOuverture: beneficiary?.dateOuverture ? beneficiary.dateOuverture.split('T')[0] : new Date().toISOString().split('T')[0],
    statutDossier: beneficiary?.statutDossier || '',
    
    motifs: beneficiary?.motifs || [],
    canaux: beneficiary?.canaux || [],
    sourcesOrientation: beneficiary?.sourcesOrientation || [],
    
    trancheAge: beneficiary?.trancheAge || '',
    ageMariage: beneficiary?.ageMariage || 0,
    nbEnfants: beneficiary?.nbEnfants || 0,
    dureeMariageCourant: beneficiary?.dureeMariageCourant || '',
    mariagePrecedent: beneficiary?.mariagePrecedent || false,
    statutMatrimonial: beneficiary?.statutMatrimonial || '',
    logement: beneficiary?.logement || '',
    sante: beneficiary?.sante || [],
    education: beneficiary?.education || '',
    profession: beneficiary?.profession || '',
    
    violencePhysique: beneficiary?.violencePhysique || {},
    violencePsychologique: beneficiary?.violencePsychologique || {},
    violenceSexuelle: beneficiary?.violenceSexuelle || {},
    violenceEconomique: beneficiary?.violenceEconomique || {},
    violenceElectronique: beneficiary?.violenceElectronique || {},
    
    agresseurInfo: beneficiary?.agresseurInfo || {},
    
    description: beneficiary?.description || '',
    rapport: beneficiary?.rapport || '',
    piecesJointes: beneficiary?.piecesJointes || [],
    
    proceduresJuridiques: beneficiary?.proceduresJuridiques || {},
    proceduresAdministratives: beneficiary?.proceduresAdministratives || {},
    hebergement: beneficiary?.hebergement || false,
    priseEnChargeDistance: beneficiary?.priseEnChargeDistance || false,
    orientationInterne: beneficiary?.orientationInterne || [],
    orientationExterne: beneficiary?.orientationExterne || [],
    satisfaction: beneficiary?.satisfaction || '',
    resultatFinal: beneficiary?.resultatFinal || ''
  });

  const isRTL = language === 'ar';

  // Traductions complètes
  const t = {
    title: language === 'ar' ? 'فيش المستفيدة - النساء' : 'Fiche Bénéficiaire - Femmes',
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
    optional: language === 'ar' ? 'اختياري' : 'Optionnel',
    
    // Sections
    entretienInfo: language === 'ar' ? 'معلومات حول الاستماع' : 'Informations sur l\'entretien',
    historiqueInfo: language === 'ar' ? 'الاستفادة السابقة' : 'Historique avec le centre',
    identiteInfo: language === 'ar' ? 'الهوية' : 'Identité',
    dossierInfo: language === 'ar' ? 'الملف' : 'Dossier',
    motifsVisite: language === 'ar' ? 'أسباب الزيارة' : 'Motifs de la visite',
    canalConnaissance: language === 'ar' ? 'كيفية التعرف على المركز' : 'Canal de connaissance',
    origineOrientation: language === 'ar' ? 'الجهات التي أحالت' : 'Origine de l\'orientation',
    profilPersonnel: language === 'ar' ? 'المعلومات الشخصية' : 'Profil personnel',
    violences: language === 'ar' ? 'أنواع العنف' : 'Violences',
    agresseurInfos: language === 'ar' ? 'معلومات عن المعتدي' : 'Informations sur l\'agresseur',
    descriptionDocuments: language === 'ar' ? 'وصف الحالة والوثائق' : 'Description et documents',
    servicesSuivi: language === 'ar' ? 'الخدمات المطلوبة والمتابعة' : 'Services demandés et suivi',
    
    // Champs communs
    firstName: language === 'ar' ? 'الاسم الأول' : 'Prénom',
    lastName: language === 'ar' ? 'اسم العائلة' : 'Nom de famille',
    fullName: language === 'ar' ? 'الاسم الكامل' : 'Nom complet',
    age: language === 'ar' ? 'السن' : 'Âge',
    dateOfBirth: language === 'ar' ? 'تاريخ الميلاد' : 'Date de naissance',
    nationality: language === 'ar' ? 'الجنسية' : 'Nationalité',
    cni: language === 'ar' ? 'بطاقة الهوية' : 'N° Carte d\'identité',
    status: language === 'ar' ? 'الوضعية' : 'Statut',
    phone: language === 'ar' ? 'الهاتف' : 'Téléphone',
    address: language === 'ar' ? 'العنوان' : 'Adresse',
    
    // Étape 1
    intervenanteName: language === 'ar' ? 'اسم المستمعة' : 'Nom de l\'intervenante',
    duration: language === 'ar' ? 'المدة الزمنية' : 'Durée',
    
    // Étape 2
    alreadyBenefited: language === 'ar' ? 'هل سبق لها أن استفادت من خدمات الفضاء؟' : 'A-t-elle déjà bénéficié des services du centre ?',
    previousDate: language === 'ar' ? 'التاريخ' : 'Date',
    previousFileNumber: language === 'ar' ? 'رقم الملف السابق' : 'N° dossier précédent',
    violenceDeclaration: language === 'ar' ? 'هل سبق التبليغ عن العنف لإحدى الخلايا' : 'Déclaration de violence à une cellule',
    
    // Messages
    saving: language === 'ar' ? 'جاري الحفظ...' : 'Enregistrement...',
    completed: language === 'ar' ? 'مكتملة' : 'Terminée',
    current: language === 'ar' ? 'الحالية' : 'Actuelle',
    pending: language === 'ar' ? 'في الانتظار' : 'En attente',
  };

  const stepTitles = [
    { title: t.entretienInfo, icon: Mic, color: 'bg-blue-500' },
    { title: t.historiqueInfo, icon: FileText, color: 'bg-green-500' },
    { title: t.identiteInfo, icon: User, color: 'bg-purple-500' },
    { title: t.dossierInfo, icon: ClipboardList, color: 'bg-orange-500' },
    { title: t.motifsVisite, icon: Info, color: 'bg-pink-500' },
    { title: t.canalConnaissance, icon: Users, color: 'bg-indigo-500' },
    { title: t.origineOrientation, icon: MapPin, color: 'bg-teal-500' },
    { title: t.profilPersonnel, icon: Heart, color: 'bg-red-500' },
    { title: t.violences, icon: Shield, color: 'bg-gray-700' },
    { title: t.agresseurInfos, icon: AlertTriangle, color: 'bg-yellow-600' },
    { title: t.descriptionDocuments, icon: Camera, color: 'bg-cyan-500' },
    { title: t.servicesSuivi, icon: CheckCircle, color: 'bg-emerald-500' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: 'Female',
        phone: formData.phone,
        address: formData.address,
        familySituation: formData.statutMatrimonial || 'Unknown',
        professionalSituation: formData.profession || 'Unknown',
        emergencyContact: formData.intervenanteName,
        emergencyPhone: formData.phone,
        nationalId: formData.cni,
        birthPlace: formData.nationalite,
        maritalStatus: formData.statutMatrimonial || 'Single',
        numberOfChildren: formData.nbEnfants || 0,
        monthlyIncome: 0,
        educationLevel: formData.education || 'Unknown',
        healthConditions: formData.sante.join(', '),
        notes: formData.description
      };

      console.log('Données à sauvegarder:', submitData);

      if (beneficiary) {
        await updateBeneficiary({
          id: beneficiary.id,
          ...submitData
        });
      } else {
        await createBeneficiary(submitData);
      }
      
      alert(language === 'ar' ? 'تم الحفظ بنجاح!' : 'Sauvegarde réussie !');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert(language === 'ar' ? 'خطأ في الحفظ: ' + error : 'Erreur de sauvegarde: ' + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      // Marquer l'étape actuelle comme complétée
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const handleCheckboxChange = (field: keyof WomenBeneficiaryFormData, value: string, checked: boolean) => {
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

  const InputField = ({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );

  const CheckboxGroup = ({ label, options, field }: { label: string; options: { value: string; label: string }[]; field: keyof WomenBeneficiaryFormData }) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center text-sm p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={(formData[field] as string[]).includes(option.value)}
              onChange={(e) => handleCheckboxChange(field, option.value, e.target.checked)}
              className={`${isRTL ? 'ml-2' : 'mr-2'} rounded border-gray-300 text-blue-600 focus:ring-blue-500`}
            />
            <span className="flex-1">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-500 rounded-full text-white mr-4">
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{t.entretienInfo}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'معلومات أساسية حول جلسة الاستماع' : 'Informations de base sur la session d\'écoute'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InputField label={t.intervenanteName} required>
                  <input
                    type="text"
                    required
                    value={formData.intervenanteName}
                    onChange={(e) => setFormData({ ...formData, intervenanteName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={language === 'ar' ? 'أدخل اسم المستمعة' : 'Entrez le nom de l\'intervenante'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={t.duration}>
                  <select
                    value={formData.interviewDuration}
                    onChange={(e) => setFormData({ ...formData, interviewDuration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">{t.select}</option>
                    <option value="15min">15 {language === 'ar' ? 'دقيقة' : 'minutes'}</option>
                    <option value="30min">30 {language === 'ar' ? 'دقيقة' : 'minutes'}</option>
                    <option value="45min">45 {language === 'ar' ? 'دقيقة' : 'minutes'}</option>
                    <option value="1h">1 {language === 'ar' ? 'ساعة' : 'heure'}</option>
                    <option value="1h30">1h30</option>
                    <option value="2h">2 {language === 'ar' ? 'ساعات' : 'heures'}</option>
                  </select>
                </InputField>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InputField label={t.firstName} required>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={t.lastName} required>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-500 rounded-full text-white mr-4">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{t.historiqueInfo}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'تاريخ الاستفادة من خدمات المركز' : 'Historique d\'utilisation des services du centre'}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    {t.alreadyBenefited}
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="dejabeneficie"
                        checked={formData.dejabeneficie === true}
                        onChange={() => setFormData({ ...formData, dejabeneficie: true })}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium text-gray-700`}>{t.yes}</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="dejabeneficie"
                        checked={formData.dejabeneficie === false}
                        onChange={() => setFormData({ ...formData, dejabeneficie: false })}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium text-gray-700`}>{t.no}</span>
                    </label>
                  </div>
                </div>

                {formData.dejabeneficie && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InputField label={t.previousDate}>
                      <input
                        type="date"
                        value={formData.dateBeneficePrecedent}
                        onChange={(e) => setFormData({ ...formData, dateBeneficePrecedent: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </InputField>

                    <InputField label={t.previousFileNumber}>
                      <input
                        type="text"
                        value={formData.numDossierPrecedent}
                        onChange={(e) => setFormData({ ...formData, numDossierPrecedent: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder={language === 'ar' ? 'مثال: 2023-001' : 'Ex: 2023-001'}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </InputField>
                  </div>
                )}

                <CheckboxGroup
                  label={t.violenceDeclaration}
                  field="declarationViolenceCellule"
                  options={[
                    { value: 'hospital', label: language === 'ar' ? 'مستشفى' : 'Hôpital' },
                    { value: 'tribunal', label: language === 'ar' ? 'محكمة' : 'Tribunal' },
                    { value: 'police', label: language === 'ar' ? 'الشرطة' : 'Police' },
                    { value: 'gendarmerie', label: language === 'ar' ? 'الدرك' : 'Gendarmerie' },
                    { value: 'association', label: language === 'ar' ? 'جمعية' : 'Association' },
                    { value: 'autre', label: language === 'ar' ? 'أخرى' : 'Autre' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-500 rounded-full text-white mr-4">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{t.identiteInfo}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'معلومات الهوية الشخصية' : 'Informations d\'identité personnelle'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <InputField label={t.fullName} required>
                  <input
                    type="text"
                    required
                    value={formData.nomComplet}
                    onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={t.age} required>
                  <input
                    type="number"
                    required
                    min="0"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </InputField>

                <InputField label={t.dateOfBirth} required>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </InputField>

                <InputField label={t.nationality}>
                  <input
                    type="text"
                    value={formData.nationalite}
                    onChange={(e) => setFormData({ ...formData, nationalite: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={t.cni}>
                  <input
                    type="text"
                    value={formData.cni}
                    onChange={(e) => setFormData({ ...formData, cni: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder={language === 'ar' ? 'مثال: AB123456' : 'Ex: AB123456'}
                  />
                </InputField>

                <InputField label={t.status}>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">{t.select}</option>
                    <option value="RESIDENTE">{language === 'ar' ? 'مقيمة' : 'Résidente'}</option>
                    <option value="MIGRANTE">{language === 'ar' ? 'مهاجرة' : 'Migrante'}</option>
                    <option value="TOURISTE">{language === 'ar' ? 'سائحة' : 'Touriste'}</option>
                    <option value="REFUGIEE">{language === 'ar' ? 'لاجئة' : 'Réfugiée'}</option>
                    <option value="EN_TRANSIT">{language === 'ar' ? 'عابرة' : 'En transit'}</option>
                    <option value="AUTRE">{language === 'ar' ? 'أخرى' : 'Autre'}</option>
                  </select>
                </InputField>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InputField label={t.phone}>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder={language === 'ar' ? '+212 6XX XXX XXX' : '+212 6XX XXX XXX'}
                  />
                </InputField>

                <InputField label={t.address}>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-orange-500 rounded-full text-white mr-4">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{t.dossierInfo}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'معلومات الملف الإداري' : 'Informations du dossier administratif'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <InputField label={language === 'ar' ? 'رقم الملف' : 'Numéro de dossier'}>
                  <input
                    type="text"
                    value={formData.numDossier}
                    onChange={(e) => setFormData({ ...formData, numDossier: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder={language === 'ar' ? 'سيتم توليده تلقائياً' : 'Sera généré automatiquement'}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'السنة' : 'Année'}>
                  <input
                    type="number"
                    value={formData.annee}
                    onChange={(e) => setFormData({ ...formData, annee: parseInt(e.target.value) || new Date().getFullYear() })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    min="2020"
                    max="2030"
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'تاريخ الفتح' : 'Date d\'ouverture'}>
                  <input
                    type="date"
                    value={formData.dateOuverture}
                    onChange={(e) => setFormData({ ...formData, dateOuverture: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </InputField>

                <div className="lg:col-span-2 xl:col-span-3">
                  <InputField label={language === 'ar' ? 'وضعية الملف' : 'Statut du dossier'}>
                    <select
                      value={formData.statutDossier}
                      onChange={(e) => setFormData({ ...formData, statutDossier: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                      <option value="">{t.select}</option>
                      <option value="PREMIERES_ETAPES">{language === 'ar' ? 'مراحل أولية' : 'Premières étapes'}</option>
                      <option value="MI_PARCOURS">{language === 'ar' ? 'نصف مرحلة الإنجاز' : 'Mi-parcours'}</option>
                      <option value="AVANCEE">{language === 'ar' ? 'إنجاز متقدم' : 'Avancée'}</option>
                      <option value="TRES_AVANCEE">{language === 'ar' ? 'إنجاز جد متقدم' : 'Très avancée'}</option>
                      <option value="TERMINEE">{language === 'ar' ? 'إنجاز تام' : 'Terminée'}</option>
                    </select>
                  </InputField>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-pink-500 rounded-full text-white mr-4">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{t.motifsVisite}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'أسباب زيارة المركز' : 'Raisons de la visite au centre'}</p>
                </div>
              </div>
              
              <CheckboxGroup
                label={language === 'ar' ? 'الأسباب (يمكن اختيار عدة خيارات)' : 'Motifs (plusieurs choix possibles)'}
                field="motifs"
                options={[
                  { value: 'demande_infos', label: language === 'ar' ? 'طلب معلومات' : 'Demande d\'informations' },
                  { value: 'aide_administrative', label: language === 'ar' ? 'مساعدة إدارية' : 'Aide administrative' },
                  { value: 'aide_juridique', label: language === 'ar' ? 'مساعدة قانونية' : 'Aide juridique' },
                  { value: 'prise_en_charge_distance', label: language === 'ar' ? 'التكفل عن بعد' : 'Prise en charge à distance' },
                  { value: 'mediation', label: language === 'ar' ? 'الوساطة' : 'Médiation' },
                  { value: 'hebergement', label: language === 'ar' ? 'الإيواء' : 'Hébergement' },
                  { value: 'soutien_psychologique', label: language === 'ar' ? 'الدعم النفسي' : 'Soutien psychologique' },
                  { value: 'aide_emploi', label: language === 'ar' ? 'مساعدة للحصول على عمل' : 'Aide à l\'emploi' },
                  { value: 'autre', label: language === 'ar' ? 'أخرى' : 'Autre' }
                ]}
              />

              {formData.motifs.includes('autre') && (
                <div className="mt-6">
                  <InputField label={language === 'ar' ? 'حدد الأسباب الأخرى' : 'Précisez les autres motifs'}>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                      placeholder={language === 'ar' ? 'اكتب الأسباب الأخرى...' : 'Décrivez les autres motifs...'}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </InputField>
                </div>
              )}
            </div>
          </div>
        );

      // Ajouter les autres étapes (6-12) ici...
      default:
        return (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {language === 'ar' ? 'هذه الخطوة قيد التطوير' : 'Cette étape est en développement'}
              </h3>
              <p className="text-gray-500 text-sm">
                {language === 'ar' ? 'سيتم إضافة المزيد من الحقول قريباً' : 'Plus de champs seront ajoutés prochainement'}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-screen overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{t.title}</h2>
              <div className="flex items-center mt-2 text-pink-100">
                <span className="text-sm">
                  {t.step} {currentStep} {t.of} {totalSteps}: {stepTitles[currentStep - 1].title}
                </span>
                <div className="ml-4 flex items-center">
                  {completedSteps.includes(currentStep) && (
                    <CheckCircle className="w-4 h-4 mr-1" />
                  )}
                  <span className="text-xs">
                    {completedSteps.includes(currentStep) ? t.completed : t.current}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    language === 'fr' ? 'bg-white text-pink-600' : 'bg-pink-400 text-white hover:bg-pink-300'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    language === 'ar' ? 'bg-white text-pink-600' : 'bg-pink-400 text-white hover:bg-pink-300'
                  }`}
                >
                  AR
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-pink-400 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-2 relative">
          <div 
            className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Navigation */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {stepTitles.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = completedSteps.includes(stepNumber);
              const isCurrent = currentStep === stepNumber;
              const StepIcon = step.icon;
              
              return (
                <button
                  key={stepNumber}
                  onClick={() => handleStepClick(stepNumber)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isCurrent
                      ? 'bg-pink-100 text-pink-700 border-2 border-pink-300'
                      : isCompleted
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                    isCurrent ? 'bg-pink-500 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-3 h-3" />
                    )}
                  </div>
                  <span className="hidden lg:block">{step.title}</span>
                  <span className="lg:hidden">{stepNumber}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            {renderStep()}
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                currentStep === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm'
              }`}
            >
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t.previous}
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {currentStep} / {totalSteps}
              </span>
              
              {currentStep === totalSteps ? (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {t.saving}
                    </>
                  ) : (
                    <>
                      <Save className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t.save}
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200 font-medium shadow-lg"
                >
                  {t.next}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WomenBeneficiaryForm;