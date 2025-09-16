import React, { useState, useCallback, useMemo } from 'react';
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
  field: keyof WomenBeneficiaryFormData;
  formData: WomenBeneficiaryFormData;
  handleCheckboxChange: (field: keyof WomenBeneficiaryFormData, value: string, checked: boolean) => void;
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
                className="flex items-center text-sm p-2 rounded-lg hover:bg-pink-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  id={inputId}
                  name={field}
                  value={option.value}
                  checked={fieldValue.includes(option.value)}
                  onChange={(e) => handleCheckboxChange(field, option.value, e.target.checked)}
                  className={`${isRTL ? 'ml-2' : 'mr-2'} rounded border-gray-300 text-pink-600 focus:ring-pink-500`}
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

const WomenBeneficiaryForm: React.FC<WomenBeneficiaryFormProps> = ({
  isOpen,
  onClose,
  beneficiary,
  onSuccess
}) => {
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [formData, setFormData] = useState<WomenBeneficiaryFormData>({
    firstName: beneficiary?.firstName || '',
    lastName: beneficiary?.lastName || '',
    dateOfBirth: beneficiary?.dateOfBirth ? 
      (typeof beneficiary.dateOfBirth === 'string' ? beneficiary.dateOfBirth.split('T')[0] : new Date(beneficiary.dateOfBirth).toISOString().split('T')[0]) 
      : '',
    phone: beneficiary?.phone || '',
    address: beneficiary?.address || '',
    
    intervenanteName: beneficiary?.intervenanteName || '',
    interviewDuration: beneficiary?.interviewDuration || '',
    
    dejabeneficie: beneficiary?.dejabeneficie || false,
    dateBeneficePrecedent: beneficiary?.dateBeneficePrecedent ? 
      (typeof beneficiary.dateBeneficePrecedent === 'string' ? beneficiary.dateBeneficePrecedent.split('T')[0] : new Date(beneficiary.dateBeneficePrecedent).toISOString().split('T')[0]) 
      : '',
    numDossierPrecedent: beneficiary?.numDossierPrecedent || '',
    declarationViolenceCellule: beneficiary?.declarationViolenceCellule || [],
    
    nomComplet: beneficiary?.nomComplet || '',
    age: beneficiary?.age || 0,
    nationalite: beneficiary?.nationalite || 'Marocaine',
    cni: beneficiary?.cni || '',
    statut: beneficiary?.statut || '',
    
    numDossier: beneficiary?.numDossier || '',
    annee: beneficiary?.annee || new Date().getFullYear(),
    dateOuverture: beneficiary?.dateOuverture ? 
      (typeof beneficiary.dateOuverture === 'string' ? beneficiary.dateOuverture.split('T')[0] : new Date(beneficiary.dateOuverture).toISOString().split('T')[0]) 
      : new Date().toISOString().split('T')[0],
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

  // Traductions mémorisées pour la performance
  const t = useMemo(() => ({
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
    saving: language === 'ar' ? 'جاري الحفظ...' : 'Enregistrement...',
    
    // Sections
    entretienInfo: language === 'ar' ? 'معلومات حول الاستماع' : 'Informations sur l\'entretien',
    historiqueInfo: language === 'ar' ? 'الاستفادة السابقة' : 'Historique avec le centre',
    identiteInfo: language === 'ar' ? 'الهوية' : 'Identité',
    motifsVisite: language === 'ar' ? 'أسباب الزيارة' : 'Motifs de la visite',
    profilPersonnel: language === 'ar' ? 'المعلومات الشخصية' : 'Profil personnel',
    descriptionDocuments: language === 'ar' ? 'وصف الحالة والوثائق' : 'Description et documents',
    
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
    violenceDeclaration: language === 'ar' ? 'هل سبق التبليغ عن العنف لإحدى الخلايا' : 'Déclaration de violence à une cellule'
  }), [language]);

  const stepTitles = useMemo(() => [
    { title: t.entretienInfo, icon: Mic, color: 'bg-pink-500' },
    { title: t.historiqueInfo, icon: FileText, color: 'bg-pink-600' },
    { title: t.identiteInfo, icon: User, color: 'bg-pink-700' },
    { title: t.motifsVisite, icon: Info, color: 'bg-pink-800' },
    { title: t.profilPersonnel, icon: Heart, color: 'bg-pink-900' },
    { title: t.descriptionDocuments, icon: Camera, color: 'bg-pink-950' }
  ], [t]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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

  const handleCheckboxChange = useCallback((field: keyof WomenBeneficiaryFormData, value: string, checked: boolean) => {
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
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-pink-500 rounded-full text-white mr-4">
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
                    onChange={(e) => setFormData(prev => ({ ...prev, intervenanteName: e.target.value }))}
                    placeholder={language === 'ar' ? 'أدخل اسم المستمعة' : 'Entrez le nom de l\'intervenante'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={t.duration}>
                  <select
                    value={formData.interviewDuration}
                    onChange={(e) => setFormData(prev => ({ ...prev, interviewDuration: e.target.value }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={t.lastName} required>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
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
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-pink-600 rounded-full text-white mr-4">
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
                        onChange={() => setFormData(prev => ({ ...prev, dejabeneficie: true }))}
                        className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                      />
                      <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium text-gray-700`}>{t.yes}</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="dejabeneficie"
                        checked={formData.dejabeneficie === false}
                        onChange={() => setFormData(prev => ({ ...prev, dejabeneficie: false }))}
                        className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300"
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
                        onChange={(e) => setFormData(prev => ({ ...prev, dateBeneficePrecedent: e.target.value }))}
                      />
                    </InputField>

                    <InputField label={t.previousFileNumber}>
                      <input
                        type="text"
                        value={formData.numDossierPrecedent}
                        onChange={(e) => setFormData(prev => ({ ...prev, numDossierPrecedent: e.target.value }))}
                        placeholder={language === 'ar' ? 'مثال: 2023-001' : 'Ex: 2023-001'}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </InputField>
                  </div>
                )}

                <CheckboxGroup
                  label={t.violenceDeclaration}
                  field="declarationViolenceCellule"
                  formData={formData}
                  handleCheckboxChange={handleCheckboxChange}
                  isRTL={isRTL}
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
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-pink-700 rounded-full text-white mr-4">
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
                    onChange={(e) => setFormData(prev => ({ ...prev, nomComplet: e.target.value }))}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={t.age} required>
                  <input
                    type="number"
                    required
                    min="18"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  />
                </InputField>

                <InputField label={t.dateOfBirth} required>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </InputField>

                <InputField label={t.nationality}>
                  <input
                    type="text"
                    value={formData.nationalite}
                    onChange={(e) => setFormData(prev => ({ ...prev, nationalite: e.target.value }))}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={t.cni}>
                  <input
                    type="text"
                    value={formData.cni}
                    onChange={(e) => setFormData(prev => ({ ...prev, cni: e.target.value }))}
                    placeholder={language === 'ar' ? 'مثال: AB123456' : 'Ex: AB123456'}
                  />
                </InputField>

                <InputField label={t.status}>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder={language === 'ar' ? '+212 6XX XXX XXX' : '+212 6XX XXX XXX'}
                  />
                </InputField>

                <InputField label={t.address}>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="resize-none"
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
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-pink-800 rounded-full text-white mr-4">
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
                formData={formData}
                handleCheckboxChange={handleCheckboxChange}
                isRTL={isRTL}
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
                      className="resize-none"
                      placeholder={language === 'ar' ? 'اكتب الأسباب الأخرى...' : 'Décrivez les autres motifs...'}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </InputField>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-pink-900 rounded-full text-white mr-4">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{t.profilPersonnel}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'معلومات شخصية مفصلة' : 'Informations personnelles détaillées'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InputField label={language === 'ar' ? 'الحالة المدنية' : 'Statut matrimonial'}>
                  <select
                    value={formData.statutMatrimonial}
                    onChange={(e) => setFormData(prev => ({ ...prev, statutMatrimonial: e.target.value }))}
                  >
                    <option value="">{t.select}</option>
                    <option value="Célibataire">{language === 'ar' ? 'عازبة' : 'Célibataire'}</option>
                    <option value="Mariée">{language === 'ar' ? 'متزوجة' : 'Mariée'}</option>
                    <option value="Divorcée">{language === 'ar' ? 'مطلقة' : 'Divorcée'}</option>
                    <option value="Veuve">{language === 'ar' ? 'أرملة' : 'Veuve'}</option>
                  </select>
                </InputField>

                <InputField label={language === 'ar' ? 'عدد الأطفال' : 'Nombre d\'enfants'}>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.nbEnfants}
                    onChange={(e) => setFormData(prev => ({ ...prev, nbEnfants: parseInt(e.target.value) || 0 }))}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'المستوى التعليمي' : 'Niveau d\'éducation'}>
                  <select
                    value={formData.education}
                    onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                  >
                    <option value="">{t.select}</option>
                    <option value="Analphabète">{language === 'ar' ? 'أمية' : 'Analphabète'}</option>
                    <option value="Primaire">{language === 'ar' ? 'ابتدائي' : 'Primaire'}</option>
                    <option value="Collège">{language === 'ar' ? 'إعدادي' : 'Collège'}</option>
                    <option value="Lycée">{language === 'ar' ? 'ثانوي' : 'Lycée'}</option>
                    <option value="Universitaire">{language === 'ar' ? 'جامعي' : 'Universitaire'}</option>
                  </select>
                </InputField>

                <InputField label={language === 'ar' ? 'المهنة' : 'Profession'}>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-pink-950 rounded-full text-white mr-4">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{t.descriptionDocuments}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'وصف الحالة والملاحظات' : 'Description du cas et observations'}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <InputField label={language === 'ar' ? 'وصف تفصيلي للحالة' : 'Description détaillée du cas'}>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="resize-none"
                    placeholder={language === 'ar' ? 'اكتب وصفاً مفصلاً للحالة...' : 'Écrivez une description détaillée du cas...'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </InputField>

                <InputField label={language === 'ar' ? 'ملاحظات إضافية' : 'Notes supplémentaires'}>
                  <textarea
                    value={formData.rapport}
                    onChange={(e) => setFormData(prev => ({ ...prev, rapport: e.target.value }))}
                    rows={4}
                    className="resize-none"
                    placeholder={language === 'ar' ? 'ملاحظات أو توصيات أخرى...' : 'Autres observations ou recommandations...'}
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
        <div className="bg-gradient-to-r from-pink-500 to-pink-700 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-xl font-bold">{t.title}</h2>
              <div className="flex items-center mt-2 text-pink-100">
                <span className="text-sm">
                  {t.step} {currentStep} {t.of} {totalSteps}: {stepTitles[currentStep - 1].title}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    language === 'fr' ? 'bg-white text-pink-600' : 'bg-pink-500 text-white hover:bg-pink-400'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    language === 'ar' ? 'bg-white text-pink-600' : 'bg-pink-500 text-white hover:bg-pink-400'
                  }`}
                >
                  AR
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-pink-500 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-2 relative">
          <div 
            className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 transition-all duration-500 ease-out"
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
                    isCurrent ? 'bg-pink-600 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
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
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg"
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