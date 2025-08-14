import React, { useState } from 'react';
import { createBeneficiary, updateBeneficiary } from 'wasp/client/operations';
import { 
  Save, 
  X, 
  Shield, 
  Calendar, 
  MapPin, 
  Phone, 
  FileText, 
  Users, 
  Heart,
  Home,
  Briefcase,
  BookOpen,
  ClipboardList,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Info,
  UserCheck,
  Baby,
  Eye,
  EyeOff
} from 'lucide-react';

interface ViolenceInfo {
  date?: string;
  types?: string[];
  frequence?: string;
  moyens?: string[];
  lieu?: string;
  lienAgresseur?: string;
  description?: string;
}

interface AgresseurInfo {
  nomComplet?: string;
  age?: number;
  adresse?: string;
  profession?: string;
  situationFamiliale?: string;
  niveauEtude?: string;
  sante?: string;
  consommation?: string[];
}

interface ChildProtectionFormData {
  // Section 1: Informations sur le dossier
  responsableDossier: string;
  dejaBeneficie: boolean;
  numDossierPrecedent: string;
  numDossier: string;
  dateReception: string;
  heureReception: string;
  sourceOrientation: string[];
  accompagnateur: string;
  motifContact: string[];
  
  // Section 2: Informations sur l'enfant
  prenom: string;
  nom: string;
  dateNaissance: string;
  adresse: string;
  province: string;
  commune: string;
  quartier: string;
  telephone: string;
  age: string;
  sexe: string;
  statutScolaire: string;
  niveauScolaire: string;
  etatSante: string[];
  antecedentsJudiciaires: boolean;
  infractions: string;
  consommation: string[];
  
  // Section 3: Informations sur l'accompagnateur
  accompagnateurIdentite: string;
  accompagnateurCni: string;
  accompagnateurTelephone: string;
  lienParental: string;
  
  // Section 4: Informations sur la mère
  mereNomComplet: string;
  mereCni: string;
  mereTelephone: string;
  mereDateNaissance: string;
  mereNiveauEtude: string;
  mereActivite: string;
  mereConsommation: string[];
  mereAntecedents: boolean;
  
  // Section 5: Informations sur le père
  pereNomComplet: string;
  pereCni: string;
  pereTelephone: string;
  pereDateNaissance: string;
  pereNiveauEtude: string;
  pereActivite: string;
  pereConsommation: string[];
  pereAntecedents: boolean;
  
  // Section 6: Situation sociale
  logement: string;
  typeHabitat: string;
  nbFreres: string;
  situationFamiliale: string;
  revenu: string;
  
  // Section 7: Violence
  violenceInfo: ViolenceInfo;
  
  // Section 8: Agresseurs (jusqu'à 3)
  agresseur1: AgresseurInfo;
  agresseur2: AgresseurInfo;
  agresseur3: AgresseurInfo;
  
  // Section 9: Description
  recitEnfant: string;
  demandesEnfant: string;
  demandesFamille: string;
  descriptionGlobale: string;
}

interface ChildProtectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiary?: any;
  onSuccess: () => void;
}

const ChildProtectionForm: React.FC<ChildProtectionFormProps> = ({
  isOpen,
  onClose,
  beneficiary,
  onSuccess
}) => {
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [formData, setFormData] = useState<ChildProtectionFormData>({
    // Initialisation avec des valeurs par défaut
    responsableDossier: '',
    dejaBeneficie: false,
    numDossierPrecedent: '',
    numDossier: '',
    dateReception: new Date().toISOString().split('T')[0],
    heureReception: '',
    sourceOrientation: [],
    accompagnateur: '',
    motifContact: [],
    
    prenom: '',
    nom: '',
    dateNaissance: '',
    adresse: '',
    province: '',
    commune: '',
    quartier: '',
    telephone: '',
    age: '',
    sexe: '',
    statutScolaire: '',
    niveauScolaire: '',
    etatSante: [],
    antecedentsJudiciaires: false,
    infractions: '',
    consommation: [],
    
    accompagnateurIdentite: '',
    accompagnateurCni: '',
    accompagnateurTelephone: '',
    lienParental: '',
    
    mereNomComplet: '',
    mereCni: '',
    mereTelephone: '',
    mereDateNaissance: '',
    mereNiveauEtude: '',
    mereActivite: '',
    mereConsommation: [],
    mereAntecedents: false,
    
    pereNomComplet: '',
    pereCni: '',
    pereTelephone: '',
    pereDateNaissance: '',
    pereNiveauEtude: '',
    pereActivite: '',
    pereConsommation: [],
    pereAntecedents: false,
    
    logement: '',
    typeHabitat: '',
    nbFreres: '',
    situationFamiliale: '',
    revenu: '',
    
    violenceInfo: {},
    agresseur1: {},
    agresseur2: {},
    agresseur3: {},
    
    recitEnfant: '',
    demandesEnfant: '',
    demandesFamille: '',
    descriptionGlobale: ''
  });

  const isRTL = language === 'ar';

  // Traductions
  const t = {
    title: language === 'ar' ? 'استمارة ضحايا العنف – وحدة حماية الطفولة' : 'Fiche Victimes de Violence - Unité Protection de l\'Enfance',
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
    dossierInfo: language === 'ar' ? 'معلومات حول الملف' : 'Informations sur le dossier',
    childInfo: language === 'ar' ? 'معلومات حول الطفل' : 'Informations sur l\'enfant',
    accompagnateurInfo: language === 'ar' ? 'معلومات حول المرافق' : 'Informations sur l\'accompagnateur',
    motherInfo: language === 'ar' ? 'معلومات حول الأم' : 'Informations sur la mère',
    fatherInfo: language === 'ar' ? 'معلومات حول الأب' : 'Informations sur le père',
    socialSituation: language === 'ar' ? 'الوضعية الاجتماعية للطفل' : 'Situation sociale de l\'enfant',
    violenceInfo: language === 'ar' ? 'معلومات حول العنف' : 'Informations sur la violence',
    agresseurInfo: language === 'ar' ? 'معلومات حول المعنف' : 'Informations sur l\'agresseur',
    description: language === 'ar' ? 'وصف' : 'Description',
    
    // Champs communs
    fullName: language === 'ar' ? 'الاسم الكامل' : 'Nom complet',
    firstName: language === 'ar' ? 'الاسم الشخصي' : 'Prénom',
    lastName: language === 'ar' ? 'الاسم العائلي' : 'Nom de famille',
    dateOfBirth: language === 'ar' ? 'تاريخ الازدياد' : 'Date de naissance',
    cni: language === 'ar' ? 'ر.ب.و' : 'N° CNI',
    phone: language === 'ar' ? 'الهاتف' : 'Téléphone',
    address: language === 'ar' ? 'العنوان' : 'Adresse',
    
    // Messages
    saving: language === 'ar' ? 'جاري الحفظ...' : 'Enregistrement...',
    completed: language === 'ar' ? 'مكتملة' : 'Terminée',
    current: language === 'ar' ? 'الحالية' : 'Actuelle',
    pending: language === 'ar' ? 'في الانتظار' : 'En attente',
  };

  const stepTitles = [
    { title: t.dossierInfo, icon: FileText, color: 'bg-blue-500' },
    { title: t.childInfo, icon: Baby, color: 'bg-green-500' },
    { title: t.accompagnateurInfo, icon: UserCheck, color: 'bg-purple-500' },
    { title: t.motherInfo, icon: Heart, color: 'bg-pink-500' },
    { title: t.fatherInfo, icon: Users, color: 'bg-indigo-500' },
    { title: t.socialSituation, icon: Home, color: 'bg-teal-500' },
    { title: t.violenceInfo, icon: Shield, color: 'bg-red-600' },
    { title: t.agresseurInfo, icon: AlertTriangle, color: 'bg-orange-600' },
    { title: t.description, icon: ClipboardList, color: 'bg-emerald-500' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitData = {
        firstName: formData.prenom,
        lastName: formData.nom,
        dateOfBirth: formData.dateNaissance,
        gender: formData.sexe === 'Masculin' ? 'Male' : 'Female',
        phone: formData.telephone || formData.accompagnateurTelephone,
        address: formData.adresse,
        familySituation: formData.situationFamiliale || 'Unknown',
        professionalSituation: 'Student',
        emergencyContact: formData.accompagnateurIdentite,
        emergencyPhone: formData.accompagnateurTelephone,
        nationalId: formData.accompagnateurCni || '',
        birthPlace: formData.province,
        maritalStatus: 'Single',
        numberOfChildren: 0,
        monthlyIncome: 0,
        educationLevel: formData.niveauScolaire || 'Unknown',
        healthConditions: formData.etatSante.join(', '),
        notes: formData.descriptionGlobale
      };

      console.log('Données enfant à sauvegarder:', submitData);

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

  const handleCheckboxChange = (field: keyof ChildProtectionFormData, value: string, checked: boolean) => {
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

  const CheckboxGroup = ({ label, options, field }: { label: string; options: { value: string; label: string }[]; field: keyof ChildProtectionFormData }) => (
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
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{t.dossierInfo}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'معلومات إدارية حول الملف' : 'Informations administratives du dossier'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <InputField label={language === 'ar' ? 'المشرف على الملف' : 'Responsable du dossier'} required>
                  <input
                    type="text"
                    required
                    value={formData.responsableDossier}
                    onChange={(e) => setFormData({ ...formData, responsableDossier: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'رقم الملف' : 'N° dossier'}>
                  <input
                    type="text"
                    value={formData.numDossier}
                    onChange={(e) => setFormData({ ...formData, numDossier: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={language === 'ar' ? 'سيتم توليده تلقائياً' : 'Sera généré automatiquement'}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'تاريخ استقبال الملف' : 'Date de réception'} required>
                  <input
                    type="date"
                    required
                    value={formData.dateReception}
                    onChange={(e) => setFormData({ ...formData, dateReception: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'الساعة' : 'Heure'}>
                  <input
                    type="time"
                    value={formData.heureReception}
                    onChange={(e) => setFormData({ ...formData, heureReception: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'مرافق' : 'Accompagnateur'}>
                  <input
                    type="text"
                    value={formData.accompagnateur}
                    onChange={(e) => setFormData({ ...formData, accompagnateur: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>
              </div>

              <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {language === 'ar' ? 'هل سبق الاستفادة من خدمات الوحدة' : 'A-t-il déjà bénéficié des services de l\'unité ?'}
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="dejaBeneficie"
                      checked={formData.dejaBeneficie === true}
                      onChange={() => setFormData({ ...formData, dejaBeneficie: true })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium text-gray-700`}>{t.yes}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="dejaBeneficie"
                      checked={formData.dejaBeneficie === false}
                      onChange={() => setFormData({ ...formData, dejaBeneficie: false })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium text-gray-700`}>{t.no}</span>
                  </label>
                </div>

                {formData.dejaBeneficie && (
                  <div className="mt-4">
                    <InputField label={language === 'ar' ? 'رقم الملف السابق' : 'N° dossier précédent'}>
                      <input
                        type="text"
                        value={formData.numDossierPrecedent}
                        onChange={(e) => setFormData({ ...formData, numDossierPrecedent: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </InputField>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <CheckboxGroup
                  label={language === 'ar' ? 'الجهات التي أحالت الملف' : 'Sources d\'orientation'}
                  field="sourceOrientation"
                  options={[
                    { value: 'tribunal', label: language === 'ar' ? 'المحكمة' : 'Tribunal' },
                    { value: 'societe_civile', label: language === 'ar' ? 'المجتمع المدني' : 'Société civile' },
                    { value: 'gendarmerie', label: language === 'ar' ? 'الدرك الملكي' : 'Gendarmerie' },
                    { value: 'etablissement_scolaire', label: language === 'ar' ? 'مؤسسة تعليمية' : 'Établissement scolaire' },
                    { value: 'seul', label: language === 'ar' ? 'لوحده' : 'Seul' },
                    { value: 'hopital', label: language === 'ar' ? 'المستشفى' : 'Hôpital' },
                    { value: 'institution_sociale', label: language === 'ar' ? 'مؤسسة الرعاية الاجتماعية' : 'Institution sociale' },
                    { value: 'police', label: language === 'ar' ? 'الشرطة' : 'Police' },
                    { value: 'educateur_unite', label: language === 'ar' ? 'مربي و . ح . ط' : 'Éducateur unité' }
                  ]}
                />
              </div>

              <div className="mt-6">
                <CheckboxGroup
                  label={language === 'ar' ? 'سبب الاتصال بالمركز' : 'Motif de contact'}
                  field="motifContact"
                  options={[
                    { value: 'violence_sexuelle', label: language === 'ar' ? 'عنف جنسي' : 'Violence sexuelle' },
                    { value: 'violence_physique', label: language === 'ar' ? 'عنف جسدي' : 'Violence physique' },
                    { value: 'violence_psychologique', label: language === 'ar' ? 'عنف نفسي' : 'Violence psychologique' },
                    { value: 'negligence', label: language === 'ar' ? 'اهمال' : 'Négligence' },
                    { value: 'prise_en_charge', label: language === 'ar' ? 'التكفل المؤسساتي' : 'Prise en charge institutionnelle' },
                    { value: 'conflit_loi', label: language === 'ar' ? 'وضعية مخالفة للقانون' : 'Situation en conflit avec la loi' },
                    { value: 'conseil_juridique', label: language === 'ar' ? 'استشارة قانونية' : 'Conseil juridique' }
                  ]}
                />
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
                  <Baby className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{t.childInfo}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'المعلومات الشخصية للطفل' : 'Informations personnelles de l\'enfant'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <InputField label={t.firstName} required>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={t.lastName} required>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={t.dateOfBirth} required>
                  <input
                    type="date"
                    required
                    value={formData.dateNaissance}
                    onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'السن' : 'Âge'}>
                  <select
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">{t.select}</option>
                    <option value="0-5">0-5 {language === 'ar' ? 'سنوات' : 'ans'}</option>
                    <option value="6-10">6-10 {language === 'ar' ? 'سنوات' : 'ans'}</option>
                    <option value="11-14">11-14 {language === 'ar' ? 'سنة' : 'ans'}</option>
                    <option value="15-18">15-18 {language === 'ar' ? 'سنة' : 'ans'}</option>
                  </select>
                </InputField>

                <InputField label={language === 'ar' ? 'الجنس' : 'Sexe'} required>
                  <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="sexe"
                        value="Masculin"
                        checked={formData.sexe === 'Masculin'}
                        onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium text-gray-700`}>
                        {language === 'ar' ? 'ذكر' : 'Masculin'}
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="sexe"
                        value="Féminin"
                        checked={formData.sexe === 'Féminin'}
                        onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium text-gray-700`}>
                        {language === 'ar' ? 'انثى' : 'Féminin'}
                      </span>
                    </label>
                  </div>
                </InputField>

                <div className="xl:col-span-3">
                  <InputField label={t.address}>
                    <textarea
                      value={formData.adresse}
                      onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </InputField>
                </div>

                <InputField label={language === 'ar' ? 'الإقليم' : 'Province'}>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'الجماعة' : 'Commune'}>
                  <input
                    type="text"
                    value={formData.commune}
                    onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'دوار أو حي' : 'Quartier / douar'}>
                  <input
                    type="text"
                    value={formData.quartier}
                    onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={t.phone}>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'وضعية التمدرس' : 'Statut scolaire'}>
                  <select
                    value={formData.statutScolaire}
                    onChange={(e) => setFormData({ ...formData, statutScolaire: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">{t.select}</option>
                    <option value="hors_age">{language === 'ar' ? 'دون سن التمدرس' : 'Hors âge scolaire'}</option>
                    <option value="scolarise">{language === 'ar' ? 'متمدرس' : 'Scolarisé'}</option>
                    <option value="descolarise">{language === 'ar' ? 'منقطع' : 'Déscolarisé'}</option>
                    <option value="non_scolarise">{language === 'ar' ? 'غير متمدرس' : 'Non scolarisé'}</option>
                  </select>
                </InputField>

                <InputField label={language === 'ar' ? 'مستوى التمدرس' : 'Niveau scolaire'}>
                  <select
                    value={formData.niveauScolaire}
                    onChange={(e) => setFormData({ ...formData, niveauScolaire: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">{t.select}</option>
                    <option value="aucun">{language === 'ar' ? 'لا شيء' : 'Aucun'}</option>
                    <option value="prescolaire">{language === 'ar' ? 'التعليم الأولى' : 'Préscolaire'}</option>
                    <option value="primaire">{language === 'ar' ? 'ابتدائي' : 'Primaire'}</option>
                    <option value="college">{language === 'ar' ? 'اعدادي' : 'Collège'}</option>
                    <option value="lycee">{language === 'ar' ? 'ثانوي' : 'Lycée'}</option>
                  </select>
                </InputField>
              </div>

              <div className="mt-6 space-y-6">
                <CheckboxGroup
                  label={language === 'ar' ? 'الوضعية الصحية' : 'État de santé'}
                  field="etatSante"
                  options={[
                    { value: 'maladie_chronique', label: language === 'ar' ? 'مرض مزمن' : 'Maladie chronique' },
                    { value: 'malade', label: language === 'ar' ? 'مريض' : 'Malade' },
                    { value: 'handicap', label: language === 'ar' ? 'ذوي اعاقة' : 'Handicap' },
                    { value: 'normal', label: language === 'ar' ? 'عادي' : 'Normal' }
                  ]}
                />

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    {language === 'ar' ? 'سوابق الطفل' : 'Antécédents judiciaires'}
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="antecedentsJudiciaires"
                        checked={formData.antecedentsJudiciaires === true}
                        onChange={() => setFormData({ ...formData, antecedentsJudiciaires: true })}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium text-gray-700`}>
                        {language === 'ar' ? 'قضائية' : 'Oui'}
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="antecedentsJudiciaires"
                        checked={formData.antecedentsJudiciaires === false}
                        onChange={() => setFormData({ ...formData, antecedentsJudiciaires: false })}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium text-gray-700`}>
                        {language === 'ar' ? 'ليس له أي سوابق' : 'Non'}
                      </span>
                    </label>
                  </div>

                  {formData.antecedentsJudiciaires && (
                    <div className="mt-4">
                      <InputField label={language === 'ar' ? 'المخالفات' : 'Infractions'}>
                        <select
                          value={formData.infractions}
                          onChange={(e) => setFormData({ ...formData, infractions: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        >
                          <option value="">{t.select}</option>
                          <option value="mineures">{language === 'ar' ? 'بسيطة' : 'Mineures'}</option>
                          <option value="graves">{language === 'ar' ? 'خطيرة' : 'Graves'}</option>
                          <option value="aucune">{language === 'ar' ? 'ليس له أي مخالفات' : 'Aucune'}</option>
                        </select>
                      </InputField>
                    </div>
                  )}
                </div>

                <CheckboxGroup
                  label={language === 'ar' ? 'تعاطي الطفل' : 'Consommation'}
                  field="consommation"
                  options={[
                    { value: 'rien', label: language === 'ar' ? 'لاشيء' : 'Rien' },
                    { value: 'alcool', label: language === 'ar' ? 'كحول' : 'Alcool' },
                    { value: 'tabac', label: language === 'ar' ? 'التذخين' : 'Tabac' },
                    { value: 'drogues', label: language === 'ar' ? 'مخدرات' : 'Drogues' },
                    { value: 'autres', label: language === 'ar' ? 'مواد أخرى' : 'Autres' }
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
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{t.accompagnateurInfo}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'معلومات الشخص المرافق للطفل' : 'Informations sur la personne accompagnant l\'enfant'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InputField label={language === 'ar' ? 'هوية المرافق' : 'Identité de l\'accompagnateur'} required>
                  <input
                    type="text"
                    required
                    value={formData.accompagnateurIdentite}
                    onChange={(e) => setFormData({ ...formData, accompagnateurIdentite: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={t.cni}>
                  <input
                    type="text"
                    value={formData.accompagnateurCni}
                    onChange={(e) => setFormData({ ...formData, accompagnateurCni: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </InputField>

                <InputField label={t.phone}>
                  <input
                    type="tel"
                    value={formData.accompagnateurTelephone}
                    onChange={(e) => setFormData({ ...formData, accompagnateurTelephone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'درجة القرابة' : 'Lien de parenté'} required>
                  <select
                    required
                    value={formData.lienParental}
                    onChange={(e) => setFormData({ ...formData, lienParental: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">{t.select}</option>
                    <option value="mere">{language === 'ar' ? 'أم' : 'Mère'}</option>
                    <option value="pere">{language === 'ar' ? 'أب' : 'Père'}</option>
                    <option value="frere">{language === 'ar' ? 'أخ' : 'Frère'}</option>
                    <option value="soeur">{language === 'ar' ? 'أخت' : 'Sœur'}</option>
                    <option value="voisin">{language === 'ar' ? 'جار' : 'Voisin'}</option>
                    <option value="oncle_paternel">{language === 'ar' ? 'عم' : 'Oncle paternel'}</option>
                    <option value="oncle_maternel">{language === 'ar' ? 'خال' : 'Oncle maternel'}</option>
                    <option value="educateur">{language === 'ar' ? 'مربي' : 'Éducateur'}</option>
                    <option value="ami">{language === 'ar' ? 'صديق' : 'Ami'}</option>
                    <option value="autre">{language === 'ar' ? 'آخر' : 'Autre'}</option>
                  </select>
                </InputField>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-pink-500 rounded-full text-white mr-4">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{t.motherInfo}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'معلومات شاملة حول الأم' : 'Informations complètes sur la mère'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <InputField label={t.fullName}>
                  <input
                    type="text"
                    value={formData.mereNomComplet}
                    onChange={(e) => setFormData({ ...formData, mereNomComplet: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={t.cni}>
                  <input
                    type="text"
                    value={formData.mereCni}
                    onChange={(e) => setFormData({ ...formData, mereCni: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </InputField>

                <InputField label={t.phone}>
                  <input
                    type="tel"
                    value={formData.mereTelephone}
                    onChange={(e) => setFormData({ ...formData, mereTelephone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </InputField>

                <InputField label={t.dateOfBirth}>
                  <input
                    type="date"
                    value={formData.mereDateNaissance}
                    onChange={(e) => setFormData({ ...formData, mereDateNaissance: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'المستوى التعليمي' : 'Niveau d\'étude'}>
                  <select
                    value={formData.mereNiveauEtude}
                    onChange={(e) => setFormData({ ...formData, mereNiveauEtude: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  >
                    <option value="">{t.select}</option>
                    <option value="analphabete">{language === 'ar' ? 'أمية' : 'Analphabète'}</option>
                    <option value="coranique">{language === 'ar' ? 'الكتاب' : 'Coranique'}</option>
                    <option value="primaire">{language === 'ar' ? 'ابتدائي' : 'Primaire'}</option>
                    <option value="college">{language === 'ar' ? 'اعدادي' : 'Collège'}</option>
                    <option value="lycee">{language === 'ar' ? 'ثانوي' : 'Lycée'}</option>
                    <option value="superieur">{language === 'ar' ? 'عالي' : 'Supérieur'}</option>
                  </select>
                </InputField>

                <InputField label={language === 'ar' ? 'النشاط المهني' : 'Activité professionnelle'}>
                  <select
                    value={formData.mereActivite}
                    onChange={(e) => setFormData({ ...formData, mereActivite: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  >
                    <option value="">{t.select}</option>
                    <option value="sans_emploi">{language === 'ar' ? 'بدون' : 'Sans emploi'}</option>
                    <option value="fonctionnaire">{language === 'ar' ? 'موظفة' : 'Fonctionnaire'}</option>
                    <option value="profession_liberale">{language === 'ar' ? 'مهنة حرة' : 'Profession libérale'}</option>
                    <option value="employee">{language === 'ar' ? 'مستخدمة' : 'Employée'}</option>
                  </select>
                </InputField>
              </div>

              <div className="mt-6 space-y-6">
                <CheckboxGroup
                  label={language === 'ar' ? 'تعاطي الأم' : 'Consommation de la mère'}
                  field="mereConsommation"
                  options={[
                    { value: 'rien', label: language === 'ar' ? 'لاشيء' : 'Rien' },
                    { value: 'alcool', label: language === 'ar' ? 'كحول' : 'Alcool' },
                    { value: 'drogues', label: language === 'ar' ? 'مخدرات' : 'Drogues' },
                    { value: 'tabac', label: language === 'ar' ? 'التذخين' : 'Tabac' },
                    { value: 'autre', label: language === 'ar' ? 'آخر' : 'Autre' }
                  ]}
                />

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    {language === 'ar' ? 'سوابق الأم' : 'Antécédents judiciaires de la mère'}
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="mereAntecedents"
                        checked={formData.mereAntecedents === true}
                        onChange={() => setFormData({ ...formData, mereAntecedents: true })}
                        className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                      />
                      <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium text-gray-700`}>
                        {language === 'ar' ? 'قضائية' : 'Oui'}
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="mereAntecedents"
                        checked={formData.mereAntecedents === false}
                        onChange={() => setFormData({ ...formData, mereAntecedents: false })}
                        className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                      />
                      <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium text-gray-700`}>
                        {language === 'ar' ? 'ليس له أي سوابق' : 'Non'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-xl font-bold">{t.title}</h2>
              <div className="flex items-center mt-2 text-blue-100">
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
                    language === 'fr' ? 'bg-white text-blue-600' : 'bg-blue-400 text-white hover:bg-blue-300'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    language === 'ar' ? 'bg-white text-blue-600' : 'bg-blue-400 text-white hover:bg-blue-300'
                  }`}
                >
                  AR
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-2 relative">
          <div 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 transition-all duration-500 ease-out"
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
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : isCompleted
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                    isCurrent ? 'bg-blue-600 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
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
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
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

export default ChildProtectionForm;
