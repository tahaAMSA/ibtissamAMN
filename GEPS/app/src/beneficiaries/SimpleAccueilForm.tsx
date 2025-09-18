import React, { useState } from 'react';
import { createBeneficiary } from 'wasp/client/operations';
import { Button } from '../client/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../client/components/ui/card';
import { Input } from '../client/components/ui/input';
import { Alert, AlertDescription } from '../client/components/ui/alert';
import { UserCheck, Upload, Save, X } from 'lucide-react';

interface SimpleAccueilFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  visitReason: string;
  visitReasonOther: string;
  beneficiaryType: 'FEMME' | 'ENFANT';
}

const SimpleAccueilForm: React.FC<SimpleAccueilFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    visitReason: '',
    visitReasonOther: '',
    beneficiaryType: 'FEMME'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');

  // Motifs de visite avec traductions
  const visitReasons = {
    VIOLENCE_CONJUGALE: { fr: 'Violence conjugale', ar: 'العنف الزوجي' },
    VIOLENCE_FAMILIALE: { fr: 'Violence familiale', ar: 'العنف الأسري' },
    AGRESSION_SEXUELLE: { fr: 'Agression sexuelle', ar: 'الاعتداء الجنسي' },
    HARCELEMENT: { fr: 'Harcèlement', ar: 'التحرش' },
    DISCRIMINATION: { fr: 'Discrimination', ar: 'التمييز' },
    PROBLEMES_FAMILIAUX: { fr: 'Problèmes familiaux', ar: 'مشاكل عائلية' },
    SOUTIEN_PSYCHOLOGIQUE: { fr: 'Soutien psychologique', ar: 'الدعم النفسي' },
    AIDE_JURIDIQUE: { fr: 'Aide juridique', ar: 'المساعدة القانونية' },
    HEBERGEMENT_URGENCE: { fr: 'Hébergement d\'urgence', ar: 'إيواء طارئ' },
    AIDE_FINANCIERE: { fr: 'Aide financière', ar: 'المساعدة المالية' },
    ORIENTATION_PROFESSIONNELLE: { fr: 'Orientation professionnelle', ar: 'التوجيه المهني' },
    FORMATION: { fr: 'Formation', ar: 'التدريب' },
    SOINS_MEDICAUX: { fr: 'Soins médicaux', ar: 'الرعاية الطبية' },
    PROTECTION_ENFANT: { fr: 'Protection de l\'enfant', ar: 'حماية الطفل' },
    ACCOMPAGNEMENT_SOCIAL: { fr: 'Accompagnement social', ar: 'المرافقة الاجتماعية' },
    INFORMATION_DROITS: { fr: 'Information sur les droits', ar: 'معلومات حول الحقوق' },
    AUTRE: { fr: 'Autre', ar: 'أخرى' }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-déterminer le type basé sur la date de naissance
    if (field === 'dateOfBirth' && value) {
      const birthDate = new Date(value);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      setFormData(prev => ({
        ...prev,
        beneficiaryType: age < 18 ? 'ENFANT' : 'FEMME'
      }));
    }
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier (images ou PDF)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (allowedTypes.includes(file.type)) {
        setDocument(file);
        setError(null);
      } else {
        setError('Seuls les fichiers image (JPEG, PNG) et PDF sont autorisés');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation simple
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.dateOfBirth || !formData.gender || !formData.visitReason) {
      setError(language === 'fr' ? 'Veuillez remplir tous les champs obligatoires' : 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // Validation du champ "Autre" si sélectionné
    if (formData.visitReason === 'AUTRE' && !formData.visitReasonOther.trim()) {
      setError(language === 'fr' ? 'Veuillez préciser le motif' : 'يرجى تحديد السبب');
      return;
    }

    setIsSubmitting(true);

    try {
      await createBeneficiary({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        beneficiaryType: formData.beneficiaryType,
        visitReason: formData.visitReason === 'AUTRE' ? formData.visitReasonOther.trim() : formData.visitReason
      });

      // TODO: Gérer l'upload du document scanné ici
      // Cette fonctionnalité sera ajoutée avec le système de fichiers

      onSuccess();
    } catch (err: any) {
      console.error('Erreur lors de la création:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const t = {
    title: language === 'fr' ? 'Accueil - Nouveau Bénéficiaire' : 'الاستقبال - مستفيد جديد',
    subtitle: language === 'fr' ? 'Formulaire simplifié pour l\'enregistrement initial' : 'نموذج مبسط للتسجيل الأولي',
    firstName: language === 'fr' ? 'Prénom' : 'الاسم الأول',
    lastName: language === 'fr' ? 'Nom' : 'اللقب',
    gender: language === 'fr' ? 'Genre' : 'الجنس',
    female: language === 'fr' ? 'Féminin' : 'أنثى',
    male: language === 'fr' ? 'Masculin' : 'ذكر',
    select: language === 'fr' ? 'Sélectionner' : 'اختر',
    dateOfBirth: language === 'fr' ? 'Date de naissance' : 'تاريخ الميلاد',
    visitReason: language === 'fr' ? 'Motif de la visite' : 'سبب الزيارة',
    otherReason: language === 'fr' ? 'Précisez le motif' : 'حدد السبب',
    document: language === 'fr' ? 'Document scanné (optionnel)' : 'وثيقة ممسوحة (اختياري)',
    save: language === 'fr' ? 'Enregistrer' : 'حفظ',
    cancel: language === 'fr' ? 'Annuler' : 'إلغاء',
    saving: language === 'fr' ? 'Enregistrement...' : 'جاري الحفظ...',
    note: language === 'fr' ? 'Ce formulaire crée uniquement l\'enregistrement initial. La directrice ou coordinatrice sera notifiée pour orienter ce bénéficiaire vers une assistante sociale qui complétera le dossier.' : 'هذا النموذج ينشئ فقط التسجيل الأولي. سيتم إشعار المديرة أو المنسقة لتوجيه هذا المستفيد إلى مساعدة اجتماعية ستكمل الملف.'
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-3 text-white text-xl">
              <div className="p-2 bg-white/20 rounded-full">
                <UserCheck className="h-6 w-6" />
              </div>
              {t.title}
            </CardTitle>
            <p className="text-green-100 mt-2">
              {t.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-green-700"
            >
              {language === 'fr' ? 'العربية' : 'Français'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t.firstName} <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder={t.firstName}
                required
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t.lastName} <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder={t.lastName}
                required
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t.gender} <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <option value="">{t.select}</option>
                <option value="Féminin">{t.female}</option>
                <option value="Masculin">{t.male}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t.dateOfBirth} <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Type déterminé automatiquement */}
          <div className="bg-gray-50 p-3 rounded-md">
            <label className="block text-sm font-medium mb-1">Type de bénéficiaire</label>
            <div className="text-sm text-gray-600">
              {formData.beneficiaryType === 'ENFANT' ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Enfant (moins de 18 ans)
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Femme (18 ans et plus)
                </span>
              )}
            </div>
          </div>

          {/* Motif de la visite */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t.visitReason} <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.visitReason}
              onChange={(e) => handleInputChange('visitReason', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              <option value="">{t.select}</option>
              {Object.entries(visitReasons).map(([key, value]) => (
                <option key={key} value={key}>
                  {value[language]}
                </option>
              ))}
            </select>
          </div>

          {/* Champ "Autre" si sélectionné */}
          {formData.visitReason === 'AUTRE' && (
            <div>
              <label className="block text-sm font-medium mb-1">
                {t.otherReason} <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.visitReasonOther}
                onChange={(e) => handleInputChange('visitReasonOther', e.target.value)}
                placeholder={t.otherReason}
                required
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          )}

          {/* Upload de document */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t.document}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2">
                  <label className="cursor-pointer">
                    <span className="text-sm text-blue-600 hover:text-blue-500">
                      Cliquez pour sélectionner un fichier
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleDocumentUpload}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG ou PDF (max 10MB)
                  </p>
                </div>
              </div>
              {document && (
                <div className="mt-2 text-sm text-green-600">
                  Fichier sélectionné: {document.name}
                </div>
              )}
            </div>
          </div>

          {/* Note d'information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <strong>{language === 'fr' ? 'Note :' : 'ملاحظة:'}</strong> {t.note}
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t.saving}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t.save}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              {t.cancel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleAccueilForm;
