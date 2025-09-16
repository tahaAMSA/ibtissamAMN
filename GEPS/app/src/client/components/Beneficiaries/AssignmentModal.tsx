import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { assignBeneficiary, getAssistantesSociales } from 'wasp/client/operations';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { UserCheck, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface AssignmentModalProps {
  beneficiary: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language?: 'fr' | 'ar';
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  beneficiary,
  isOpen,
  onClose,
  onSuccess,
  language = 'fr'
}) => {
  const [selectedAssistante, setSelectedAssistante] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isRTL = language === 'ar';

  const t = {
    title: language === 'fr' ? 'Assigner le dossier' : 'تعيين الملف',
    beneficiaryInfo: language === 'fr' ? 'Informations du bénéficiaire' : 'معلومات المستفيد',
    selectAssistant: language === 'fr' ? 'Sélectionner une assistante sociale' : 'اختر مساعدة اجتماعية',
    assignmentReason: language === 'fr' ? 'Raison de l\'assignation (optionnel)' : 'سبب التعيين (اختياري)',
    assign: language === 'fr' ? 'Assigner' : 'تعيين',
    cancel: language === 'fr' ? 'Annuler' : 'إلغاء',
    assigning: language === 'fr' ? 'Assignation...' : 'جاري التعيين...',
    pleaseSelect: language === 'fr' ? 'Veuillez sélectionner une assistante sociale' : 'يرجى اختيار مساعدة اجتماعية',
    successMessage: language === 'fr' ? 'Dossier assigné avec succès !' : 'تم تعيين الملف بنجاح!',
    currentStatus: language === 'fr' ? 'Statut actuel' : 'الحالة الحالية',
    age: language === 'fr' ? 'ans' : 'سنة',
    noAssistants: language === 'fr' ? 'Aucune assistante sociale disponible' : 'لا توجد مساعدات اجتماعيات متاحات'
  };

  // Récupérer la liste des assistantes sociales
  const { data: assistantesSociales, isLoading: loadingAssistantes } = useQuery(getAssistantesSociales);

  const handleAssign = async () => {
    if (!selectedAssistante) {
      setError(t.pleaseSelect);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await assignBeneficiary({
        beneficiaryId: beneficiary.id,
        assignedToId: selectedAssistante,
        reason: reason.trim() || undefined
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'assignation');
    } finally {
      setIsSubmitting(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE_ACCUEIL':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'EN_ATTENTE_ORIENTATION':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ORIENTE':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'EN_SUIVI':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      'EN_ATTENTE_ACCUEIL': { fr: 'En attente d\'accueil', ar: 'في انتظار الاستقبال' },
      'EN_ATTENTE_ORIENTATION': { fr: 'En attente d\'orientation', ar: 'في انتظار التوجيه' },
      'ORIENTE': { fr: 'Orienté', ar: 'موجه' },
      'EN_SUIVI': { fr: 'En suivi', ar: 'تحت المتابعة' }
    };
    return statusLabels[status as keyof typeof statusLabels]?.[language] || status;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            {t.title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations du bénéficiaire */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.beneficiaryInfo}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {language === 'fr' ? 'Nom complet' : 'الاسم الكامل'}
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {beneficiary.firstName} {beneficiary.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {language === 'fr' ? 'Âge' : 'العمر'}
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {calculateAge(beneficiary.dateOfBirth)} {t.age}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t.currentStatus}
                  </label>
                  <Badge className={getStatusColor(beneficiary.status)}>
                    {getStatusLabel(beneficiary.status)}
                  </Badge>
                </div>
                {beneficiary.visitReason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {language === 'fr' ? 'Motif de visite' : 'سبب الزيارة'}
                    </label>
                    <p className="text-gray-900">{beneficiary.visitReason}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sélection de l'assistante sociale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.selectAssistant} *
            </label>
            {loadingAssistantes ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : assistantesSociales && assistantesSociales.length > 0 ? (
              <select
                value={selectedAssistante}
                onChange={(e) => setSelectedAssistante(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              >
                <option value="">
                  {language === 'fr' ? 'Choisir une assistante sociale...' : 'اختر مساعدة اجتماعية...'}
                </option>
                {assistantesSociales.map((assistante: any) => (
                  <option key={assistante.id} value={assistante.id}>
                    {assistante.firstName} {assistante.lastName}
                  </option>
                ))}
              </select>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{t.noAssistants}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Raison de l'assignation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.assignmentReason}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder={language === 'fr' ? 'Pourquoi assigner ce dossier à cette assistante sociale ?' : 'لماذا تعين هذا الملف لهذه المساعدة الاجتماعية؟'}
              disabled={isSubmitting}
            />
          </div>

          {/* Messages d'erreur et de succès */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                {t.successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Boutons d'action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleAssign}
              disabled={isSubmitting || !selectedAssistante || loadingAssistantes}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t.assigning}
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  {t.assign}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;
