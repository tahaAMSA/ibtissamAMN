import React, { useState, useCallback, useMemo } from 'react';
import { createBeneficiary, updateBeneficiary } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import { useI18n } from '../translations/useI18n';
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
  Baby,
  UserCheck
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
  
  // Sections 4-5: Informations sur les parents
  mereNomComplet: string;
  mereCni: string;
  mereTelephone: string;
  mereDateNaissance: string;
  mereNiveauEtude: string;
  mereActivite: string;
  mereConsommation: string[];
  mereAntecedents: boolean;
  
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
  
  // Section 8: Agresseurs
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

// Composants optimisés définis à l'extérieur pour éviter les re-créations
const InputField = React.memo(({ 
  label, 
  required = false, 
  children, 
  id 
}: { 
  label: string; 
  required?: boolean; 
  children: React.ReactNode; 
  id?: string; 
}) => {
  const fieldId = useMemo(() => id || `field-${label.replace(/\s+/g, '-').toLowerCase()}`, [id, label]);
  
  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {React.cloneElement(children as React.ReactElement, { 
        id: fieldId, 
        name: fieldId,
        className: `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${(children as React.ReactElement).props.className || ''}`
      })}
    </div>
  );
});

const CheckboxGroup = React.memo(({ 
  label, 
  options, 
  field, 
  formData, 
  handleCheckboxChange, 
  isRTL 
}: { 
  label: string; 
  options: { value: string; label: string }[]; 
  field: keyof ChildProtectionFormData;
  formData: ChildProtectionFormData;
  handleCheckboxChange: (field: keyof ChildProtectionFormData, value: string, checked: boolean) => void;
  isRTL: boolean;
}) => {
  const fieldValue = useMemo(() => 
    Array.isArray(formData[field]) ? formData[field] as string[] : [], 
    [formData, field]
  );
  
  return (
    <div className="space-y-3">
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-3">{label}</legend>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {options.map((option) => {
            const inputId = `${field}-${option.value}`;
            return (
              <label 
                key={option.value} 
                htmlFor={inputId} 
                className="flex items-center text-sm p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  id={inputId}
                  name={field}
                  value={option.value}
                  checked={fieldValue.includes(option.value)}
                  onChange={(e) => handleCheckboxChange(field, option.value, e.target.checked)}
                  className={`${isRTL ? 'ml-2' : 'mr-2'} rounded border-gray-300 text-blue-600 focus:ring-blue-500`}
                />
                <span className="flex-1">{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
});

const ViolenceCheckboxGroup = React.memo(({ 
  label, 
  options, 
  subField, 
  formData, 
  setFormData, 
  isRTL 
}: { 
  label: string; 
  options: { value: string; label: string }[]; 
  subField: keyof ViolenceInfo;
  formData: ChildProtectionFormData;
  setFormData: React.Dispatch<React.SetStateAction<ChildProtectionFormData>>;
  isRTL: boolean;
}) => {
  const fieldValue = useMemo(() => 
    Array.isArray(formData.violenceInfo[subField]) ? formData.violenceInfo[subField] as string[] : [], 
    [formData.violenceInfo, subField]
  );
  
  const handleViolenceCheckboxChange = useCallback((value: string, checked: boolean) => {
    const currentArray = fieldValue;
    setFormData(prev => ({
      ...prev,
      violenceInfo: {
        ...prev.violenceInfo,
        [subField]: checked 
          ? [...currentArray, value]
          : currentArray.filter(item => item !== value)
      }
    }));
  }, [fieldValue, setFormData, subField]);
  
  return (
    <div className="space-y-3">
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-3">{label}</legend>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {options.map((option) => {
            const inputId = `violenceInfo-${subField}-${option.value}`;
            return (
              <label 
                key={option.value} 
                htmlFor={inputId} 
                className="flex items-center text-sm p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  id={inputId}
                  name={`violenceInfo.${subField}`}
                  value={option.value}
                  checked={fieldValue.includes(option.value)}
                  onChange={(e) => handleViolenceCheckboxChange(option.value, e.target.checked)}
                  className={`${isRTL ? 'ml-2' : 'mr-2'} rounded border-gray-300 text-blue-600 focus:ring-blue-500`}
                />
                <span className="flex-1">{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
});

const ChildProtectionForm: React.FC<ChildProtectionFormProps> = ({
  isOpen,
  onClose,
  beneficiary,
  onSuccess
}) => {
  const { data: user } = useAuth();
  const { t, lang: language, isRTL, dir } = useI18n(user as any);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [formData, setFormData] = useState<ChildProtectionFormData>({
    // Initialisation optimisée avec valeurs par défaut
    responsableDossier: beneficiary?.responsableDossier || '',
    dejaBeneficie: beneficiary?.dejaBeneficie || false,
    numDossierPrecedent: beneficiary?.numDossierPrecedent || '',
    numDossier: beneficiary?.numDossier || '',
    dateReception: beneficiary?.dateReception ? 
      (typeof beneficiary.dateReception === 'string' ? beneficiary.dateReception.split('T')[0] : new Date(beneficiary.dateReception).toISOString().split('T')[0]) 
      : new Date().toISOString().split('T')[0],
    heureReception: beneficiary?.heureReception || '',
    sourceOrientation: beneficiary?.sourceOrientation || [],
    accompagnateur: beneficiary?.accompagnateur || '',
    motifContact: beneficiary?.motifContact || [],
    
    prenom: beneficiary?.firstName || '',
    nom: beneficiary?.lastName || '',
    dateNaissance: beneficiary?.dateOfBirth ? 
      (typeof beneficiary.dateOfBirth === 'string' ? beneficiary.dateOfBirth.split('T')[0] : new Date(beneficiary.dateOfBirth).toISOString().split('T')[0]) 
      : '',
    adresse: beneficiary?.address || '',
    province: beneficiary?.province || '',
    commune: beneficiary?.commune || '',
    quartier: beneficiary?.quartier || '',
    telephone: beneficiary?.phone || '',
    age: beneficiary?.age?.toString() || '',
    sexe: beneficiary?.gender || '',
    statutScolaire: beneficiary?.statutScolaire || '',
    niveauScolaire: beneficiary?.niveauScolaire || '',
    etatSante: beneficiary?.etatSante || [],
    antecedentsJudiciaires: beneficiary?.antecedentsJudiciaires || false,
    infractions: beneficiary?.infractions || '',
    consommation: beneficiary?.consommation || [],
    
    accompagnateurIdentite: beneficiary?.accompagnateurIdentite || '',
    accompagnateurCni: beneficiary?.accompagnateurCni || '',
    accompagnateurTelephone: beneficiary?.accompagnateurTelephone || '',
    lienParental: beneficiary?.lienParental || '',
    
    mereNomComplet: beneficiary?.mereNomComplet || '',
    mereCni: beneficiary?.mereCni || '',
    mereTelephone: beneficiary?.mereTelephone || '',
    mereDateNaissance: beneficiary?.mereDateNaissance ? 
      (typeof beneficiary.mereDateNaissance === 'string' ? beneficiary.mereDateNaissance.split('T')[0] : new Date(beneficiary.mereDateNaissance).toISOString().split('T')[0]) 
      : '',
    mereNiveauEtude: beneficiary?.mereNiveauEtude || '',
    mereActivite: beneficiary?.mereActivite || '',
    mereConsommation: beneficiary?.mereConsommation || [],
    mereAntecedents: beneficiary?.mereAntecedents || false,
    
    pereNomComplet: beneficiary?.pereNomComplet || '',
    pereCni: beneficiary?.pereCni || '',
    pereTelephone: beneficiary?.pereTelephone || '',
    pereDateNaissance: beneficiary?.pereDateNaissance ? 
      (typeof beneficiary.pereDateNaissance === 'string' ? beneficiary.pereDateNaissance.split('T')[0] : new Date(beneficiary.pereDateNaissance).toISOString().split('T')[0]) 
      : '',
    pereNiveauEtude: beneficiary?.pereNiveauEtude || '',
    pereActivite: beneficiary?.pereActivite || '',
    pereConsommation: beneficiary?.pereConsommation || [],
    pereAntecedents: beneficiary?.pereAntecedents || false,
    
    logement: beneficiary?.logement || '',
    typeHabitat: beneficiary?.typeHabitat || '',
    nbFreres: beneficiary?.nbFreres || '',
    situationFamiliale: beneficiary?.situationFamiliale || '',
    revenu: beneficiary?.revenu || '',
    
    violenceInfo: beneficiary?.violenceInfo || {
      types: [],
      date: '',
      frequence: '',
      moyens: [],
      lieu: '',
      lienAgresseur: '',
      description: ''
    },
    
    agresseur1: beneficiary?.agresseur1 || {},
    agresseur2: beneficiary?.agresseur2 || {},
    agresseur3: beneficiary?.agresseur3 || {},
    
    recitEnfant: beneficiary?.recitEnfant || '',
    demandesEnfant: beneficiary?.demandesEnfant || '',
    demandesFamille: beneficiary?.demandesFamille || '',
    descriptionGlobale: beneficiary?.descriptionGlobale || ''
  });

  // Traductions mémorisées pour la performance
  const translations = useMemo(() => ({
    title: language === 'ar' ? 'استمارة ضحايا العنف – وحدة حماية الطفولة' : 'Fiche Victimes de Violence - Unité Protection de l\'Enfance',
    save: language === 'ar' ? 'حفظ' : 'Enregistrer',
    cancel: language === 'ar' ? 'إلغاء' : 'Annuler',
    previous: language === 'ar' ? 'السابق' : 'Précédent',
    next: language === 'ar' ? 'التالي' : 'Suivant',
    step: language === 'ar' ? 'الخطوة' : 'Étape',
    of: language === 'ar' ? 'من' : 'sur',
    select: language === 'ar' ? 'اختر...' : 'Sélectionner...',
    yes: language === 'ar' ? 'نعم' : 'Oui',
    no: language === 'ar' ? 'لا' : 'Non',
    saving: language === 'ar' ? 'جاري الحفظ...' : 'Enregistrement...',
    
    // Sections
    dossierInfo: language === 'ar' ? 'معلومات حول الملف' : 'Informations sur le dossier',
    childInfo: language === 'ar' ? 'معلومات حول الطفل' : 'Informations sur l\'enfant',
    accompagnateurInfo: language === 'ar' ? 'معلومات حول المرافق' : 'Informations sur l\'accompagnateur',
    violenceInfo: language === 'ar' ? 'معلومات حول العنف' : 'Informations sur la violence',
    description: language === 'ar' ? 'وصف شامل للحالة' : 'Description complète du cas'
  }), [language]);

  const stepTitles = useMemo(() => [
    { title: translations.dossierInfo, icon: FileText, color: 'bg-blue-500' },
    { title: translations.childInfo, icon: Baby, color: 'bg-blue-600' },
    { title: translations.accompagnateurInfo, icon: UserCheck, color: 'bg-blue-700' },
    { title: translations.violenceInfo, icon: Shield, color: 'bg-blue-800' },
    { title: translations.description, icon: ClipboardList, color: 'bg-blue-900' }
  ], [translations]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitData = {
        firstName: formData.prenom,
        lastName: formData.nom,
        dateOfBirth: formData.dateNaissance,
        gender: formData.sexe,
        beneficiaryType: 'ENFANT' as const, // Protection de l'enfant = ENFANT
        phone: formData.telephone,
        address: formData.adresse,
        familySituation: formData.situationFamiliale || 'Unknown',
        professionalSituation: 'Child',
        emergencyContact: formData.accompagnateurIdentite,
        emergencyPhone: formData.accompagnateurTelephone,
        nationalId: formData.accompagnateurCni,
        birthPlace: formData.province,
        maritalStatus: 'Single',
        numberOfChildren: 0,
        monthlyIncome: parseInt(formData.revenu) || 0,
        educationLevel: formData.niveauScolaire || 'Unknown',
        healthConditions: formData.etatSante.join(', '),
        notes: formData.descriptionGlobale
      };

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
      alert(language === 'ar' ? 'خطأ في الحفظ' : 'Erreur de sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, beneficiary, language, onSuccess, onClose]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps, completedSteps]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleStepClick = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const handleCheckboxChange = useCallback((field: keyof ChildProtectionFormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = Array.isArray(prev[field]) ? prev[field] as string[] : [];
      return {
        ...prev,
        [field]: checked 
          ? [...currentArray, value]
          : currentArray.filter(item => item !== value)
      };
    });
  }, []);

  if (!isOpen) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-500 rounded-full text-white mr-4">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{translations.dossierInfo}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'معلومات أساسية حول الملف' : 'Informations de base sur le dossier'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <InputField label={language === 'ar' ? 'مسؤول الملف' : 'Responsable du dossier'} required>
                  <input
                    type="text"
                    required
                    value={formData.responsableDossier}
                    onChange={(e) => setFormData(prev => ({ ...prev, responsableDossier: e.target.value }))}
                    placeholder={language === 'ar' ? 'أدخل اسم المسؤول' : 'Entrez le nom du responsable'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'رقم الملف' : 'Numéro de dossier'}>
                  <input
                    type="text"
                    value={formData.numDossier}
                    onChange={(e) => setFormData(prev => ({ ...prev, numDossier: e.target.value }))}
                    placeholder={language === 'ar' ? 'سيتم إنشاؤه تلقائياً' : 'Sera généré automatiquement'}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'تاريخ الاستقبال' : 'Date de réception'} required>
                  <input
                    type="date"
                    required
                    value={formData.dateReception}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateReception: e.target.value }))}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'وقت الاستقبال' : 'Heure de réception'}>
                  <input
                    type="time"
                    value={formData.heureReception}
                    onChange={(e) => setFormData(prev => ({ ...prev, heureReception: e.target.value }))}
                  />
                </InputField>
              </div>

              <div className="mt-6">
                <CheckboxGroup
                  label={language === 'ar' ? 'الجهات التي أحالت الملف' : 'Sources d\'orientation'}
                  field="sourceOrientation"
                  formData={formData}
                  handleCheckboxChange={handleCheckboxChange}
                  isRTL={isRTL}
                  options={[
                    { value: 'tribunal', label: language === 'ar' ? 'المحكمة' : 'Tribunal' },
                    { value: 'police', label: language === 'ar' ? 'الشرطة' : 'Police' },
                    { value: 'gendarmerie', label: language === 'ar' ? 'الدرك الملكي' : 'Gendarmerie' },
                    { value: 'ecole', label: language === 'ar' ? 'المدرسة' : 'École' },
                    { value: 'hopital', label: language === 'ar' ? 'المستشفى' : 'Hôpital' },
                    { value: 'famille', label: language === 'ar' ? 'العائلة' : 'Famille' }
                  ]}
                />
              </div>

              <div className="mt-6">
                <CheckboxGroup
                  label={language === 'ar' ? 'سبب الاتصال بالمركز' : 'Motif de contact'}
                  field="motifContact"
                  formData={formData}
                  handleCheckboxChange={handleCheckboxChange}
                  isRTL={isRTL}
                  options={[
                    { value: 'violence_physique', label: language === 'ar' ? 'عنف جسدي' : 'Violence physique' },
                    { value: 'violence_sexuelle', label: language === 'ar' ? 'عنف جنسي' : 'Violence sexuelle' },
                    { value: 'violence_psychologique', label: language === 'ar' ? 'عنف نفسي' : 'Violence psychologique' },
                    { value: 'negligence', label: language === 'ar' ? 'إهمال' : 'Négligence' },
                    { value: 'aide_juridique', label: language === 'ar' ? 'مساعدة قانونية' : 'Aide juridique' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-600 rounded-full text-white mr-4">
                  <Baby className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{translations.childInfo}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'معلومات شخصية عن الطفل' : 'Informations personnelles sur l\'enfant'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <InputField label={language === 'ar' ? 'الاسم الأول' : 'Prénom'} required>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'اسم العائلة' : 'Nom de famille'} required>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'تاريخ الميلاد' : 'Date de naissance'} required>
                  <input
                    type="date"
                    required
                    value={formData.dateNaissance}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateNaissance: e.target.value }))}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'الجنس' : 'Sexe'} required>
                  <select
                    required
                    value={formData.sexe}
                    onChange={(e) => setFormData(prev => ({ ...prev, sexe: e.target.value }))}
                  >
                    <option value="">{translations.select}</option>
                    <option value="Male">{language === 'ar' ? 'ذكر' : 'Masculin'}</option>
                    <option value="Female">{language === 'ar' ? 'أنثى' : 'Féminin'}</option>
                  </select>
                </InputField>

                <InputField label={language === 'ar' ? 'العمر' : 'Âge'}>
                  <input
                    type="number"
                    min="0"
                    max="18"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'الهاتف' : 'Téléphone'}>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                    placeholder="+212 6XX XXX XXX"
                  />
                </InputField>

                <div className="lg:col-span-2 xl:col-span-3">
                  <InputField label={language === 'ar' ? 'العنوان' : 'Adresse'}>
                    <textarea
                      value={formData.adresse}
                      onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                      rows={3}
                      className="resize-none"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </InputField>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <CheckboxGroup
                  label={language === 'ar' ? 'الوضعية الصحية' : 'État de santé'}
                  field="etatSante"
                  formData={formData}
                  handleCheckboxChange={handleCheckboxChange}
                  isRTL={isRTL}
                  options={[
                    { value: 'normal', label: language === 'ar' ? 'عادي' : 'Normal' },
                    { value: 'maladie_chronique', label: language === 'ar' ? 'مرض مزمن' : 'Maladie chronique' },
                    { value: 'handicap', label: language === 'ar' ? 'إعاقة' : 'Handicap' },
                    { value: 'malnutrition', label: language === 'ar' ? 'سوء التغذية' : 'Malnutrition' }
                  ]}
                />

                <CheckboxGroup
                  label={language === 'ar' ? 'تعاطي الطفل' : 'Consommation'}
                  field="consommation"
                  formData={formData}
                  handleCheckboxChange={handleCheckboxChange}
                  isRTL={isRTL}
                  options={[
                    { value: 'rien', label: language === 'ar' ? 'لا شيء' : 'Rien' },
                    { value: 'tabac', label: language === 'ar' ? 'التبغ' : 'Tabac' },
                    { value: 'alcool', label: language === 'ar' ? 'الكحول' : 'Alcool' },
                    { value: 'drogues', label: language === 'ar' ? 'المخدرات' : 'Drogues' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-700 rounded-full text-white mr-4">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{translations.accompagnateurInfo}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'معلومات الشخص المرافق' : 'Informations sur la personne accompagnante'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InputField label={language === 'ar' ? 'هوية المرافق' : 'Identité de l\'accompagnateur'} required>
                  <input
                    type="text"
                    required
                    value={formData.accompagnateurIdentite}
                    onChange={(e) => setFormData(prev => ({ ...prev, accompagnateurIdentite: e.target.value }))}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'بطاقة الهوية' : 'Carte d\'identité'}>
                  <input
                    type="text"
                    value={formData.accompagnateurCni}
                    onChange={(e) => setFormData(prev => ({ ...prev, accompagnateurCni: e.target.value }))}
                    placeholder="AB123456"
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'رقم الهاتف' : 'Numéro de téléphone'}>
                  <input
                    type="tel"
                    value={formData.accompagnateurTelephone}
                    onChange={(e) => setFormData(prev => ({ ...prev, accompagnateurTelephone: e.target.value }))}
                    placeholder="+212 6XX XXX XXX"
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'علاقة القرابة' : 'Lien de parenté'} required>
                  <select
                    required
                    value={formData.lienParental}
                    onChange={(e) => setFormData(prev => ({ ...prev, lienParental: e.target.value }))}
                  >
                    <option value="">{translations.select}</option>
                    <option value="mere">{language === 'ar' ? 'الأم' : 'Mère'}</option>
                    <option value="pere">{language === 'ar' ? 'الأب' : 'Père'}</option>
                    <option value="grand_mere">{language === 'ar' ? 'الجدة' : 'Grand-mère'}</option>
                    <option value="grand_pere">{language === 'ar' ? 'الجد' : 'Grand-père'}</option>
                    <option value="oncle">{language === 'ar' ? 'العم/الخال' : 'Oncle'}</option>
                    <option value="tante">{language === 'ar' ? 'العمة/الخالة' : 'Tante'}</option>
                    <option value="tuteur">{language === 'ar' ? 'الوصي' : 'Tuteur'}</option>
                    <option value="autre">{language === 'ar' ? 'أخرى' : 'Autre'}</option>
                  </select>
                </InputField>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-800 rounded-full text-white mr-4">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{translations.violenceInfo}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'معلومات حول العنف المتعرض له' : 'Informations sur la violence subie'}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <InputField label={language === 'ar' ? 'تاريخ العنف' : 'Date de la violence'}>
                  <input
                    type="date"
                    value={formData.violenceInfo.date || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      violenceInfo: { ...prev.violenceInfo, date: e.target.value }
                    }))}
                  />
                </InputField>

                <ViolenceCheckboxGroup
                  label={language === 'ar' ? 'أنواع العنف' : 'Types de violence'}
                  subField="types"
                  formData={formData}
                  setFormData={setFormData}
                  isRTL={isRTL}
                  options={[
                    { value: 'physique', label: language === 'ar' ? 'عنف جسدي' : 'Violence physique' },
                    { value: 'psychologique', label: language === 'ar' ? 'عنف نفسي' : 'Violence psychologique' },
                    { value: 'sexuelle', label: language === 'ar' ? 'عنف جنسي' : 'Violence sexuelle' },
                    { value: 'negligence', label: language === 'ar' ? 'إهمال' : 'Négligence' }
                  ]}
                />

                <InputField label={language === 'ar' ? 'مكان العنف' : 'Lieu de la violence'}>
                  <select
                    value={formData.violenceInfo.lieu || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      violenceInfo: { ...prev.violenceInfo, lieu: e.target.value }
                    }))}
                  >
                    <option value="">{translations.select}</option>
                    <option value="domicile">{language === 'ar' ? 'المنزل' : 'Domicile'}</option>
                    <option value="ecole">{language === 'ar' ? 'المدرسة' : 'École'}</option>
                    <option value="rue">{language === 'ar' ? 'الشارع' : 'Rue'}</option>
                    <option value="autre">{language === 'ar' ? 'مكان آخر' : 'Autre lieu'}</option>
                  </select>
                </InputField>

                <InputField label={language === 'ar' ? 'وصف مختصر للحادثة' : 'Description brève de l\'incident'}>
                  <textarea
                    value={formData.violenceInfo.description || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      violenceInfo: { ...prev.violenceInfo, description: e.target.value }
                    }))}
                    rows={4}
                    className="resize-none"
                    placeholder={language === 'ar' ? 'اكتب وصفاً موجزاً...' : 'Écrivez une description brève...'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-900 rounded-full text-white mr-4">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{translations.description}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'وصف شامل للحالة' : 'Description complète du cas'}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <InputField label={language === 'ar' ? 'حكاية الطفل' : 'Récit de l\'enfant'}>
                  <textarea
                    value={formData.recitEnfant}
                    onChange={(e) => setFormData(prev => ({ ...prev, recitEnfant: e.target.value }))}
                    rows={6}
                    className="resize-none"
                    placeholder={language === 'ar' ? 'اكتب ما حكاه الطفل...' : 'Écrivez le récit de l\'enfant...'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'طلبات الطفل' : 'Demandes de l\'enfant'}>
                  <textarea
                    value={formData.demandesEnfant}
                    onChange={(e) => setFormData(prev => ({ ...prev, demandesEnfant: e.target.value }))}
                    rows={4}
                    className="resize-none"
                    placeholder={language === 'ar' ? 'ما يطلبه الطفل...' : 'Ce que demande l\'enfant...'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'طلبات العائلة' : 'Demandes de la famille'}>
                  <textarea
                    value={formData.demandesFamille}
                    onChange={(e) => setFormData(prev => ({ ...prev, demandesFamille: e.target.value }))}
                    rows={4}
                    className="resize-none"
                    placeholder={language === 'ar' ? 'ما تطلبه العائلة...' : 'Ce que demande la famille...'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'الوصف العام للحالة' : 'Description globale du cas'}>
                  <textarea
                    value={formData.descriptionGlobale}
                    onChange={(e) => setFormData(prev => ({ ...prev, descriptionGlobale: e.target.value }))}
                    rows={6}
                    className="resize-none"
                    placeholder={language === 'ar' ? 'وصف شامل للحالة والتوصيات...' : 'Description complète du cas et recommandations...'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-screen overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-xl font-bold">{translations.title}</h2>
              <div className="flex items-center mt-2 text-blue-100">
                <span className="text-sm">
                  {translations.step} {currentStep} {translations.of} {totalSteps}: {stepTitles[currentStep - 1].title}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 transition-all duration-500 ease-out"
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
              {translations.previous}
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
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {translations.saving}
                    </>
                  ) : (
                    <>
                      <Save className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {translations.save}
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg"
                >
                  {translations.next}
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