import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { assignBeneficiary, getAssistantesSociales } from 'wasp/client/operations';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { UserCheck, X, AlertTriangle, CheckCircle, Heart, Shield, User } from 'lucide-react';
import { useAuth } from 'wasp/client/auth';
import { useI18n } from '../../../translations/useI18n';

interface AssignmentModalProps {
  beneficiary: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  beneficiary,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { data: user } = useAuth();
  const { t, lang: language, isRTL, dir } = useI18n(user as any);
  
  const [selectedAssistante, setSelectedAssistante] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Récupérer la liste des assistantes sociales
  const { data: assistantesSociales, isLoading: loadingAssistantes } = useQuery(getAssistantesSociales);

  const handleAssign = async () => {
    if (!selectedAssistante) {
      setError(t('assignment.pleaseSelect'));
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
    const statusMap: { [key: string]: string } = {
      'EN_ATTENTE_ACCUEIL': 'status.waitingReception',
      'EN_ATTENTE_ORIENTATION': 'status.waitingOrientation',
      'ORIENTE': 'status.oriented',
      'EN_SUIVI': 'status.inSupport'
    };
    return statusMap[status] ? t(statusMap[status]) : status;
  };

  const isChildBeneficiary = (beneficiary: any) => {
    const age = calculateAge(beneficiary.dateOfBirth);
    return age < 18;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`} dir={dir}>
        {/* Header avec gradient selon le type */}
        <div className={`flex items-center justify-between p-6 border-b-2 rounded-t-2xl ${
          isChildBeneficiary(beneficiary) 
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-300' 
            : 'bg-gradient-to-r from-pink-500 to-pink-600 border-pink-300'
        } text-white`}>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            {isChildBeneficiary(beneficiary) ? <Shield className="h-6 w-6" /> : <Heart className="h-6 w-6" />}
            {t('assignment.title')}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations du bénéficiaire améliorées */}
          <Card className={`border-2 shadow-lg ${
            isChildBeneficiary(beneficiary) ? 'border-orange-200 bg-orange-50/50' : 'border-pink-200 bg-pink-50/50'
          }`}>
            <CardHeader className={`${
              isChildBeneficiary(beneficiary) 
                ? 'bg-gradient-to-r from-orange-100 to-orange-200' 
                : 'bg-gradient-to-r from-pink-100 to-pink-200'
            }`}>
              <CardTitle className={`text-xl flex items-center gap-2 ${
                isChildBeneficiary(beneficiary) ? 'text-orange-800' : 'text-pink-800'
              }`}>
                <User className="w-5 h-5" />
                {t('assignment.beneficiaryInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t('general.fullName')}
                  </label>
                  <p className={`text-xl font-bold ${
                    isChildBeneficiary(beneficiary) ? 'text-orange-800' : 'text-pink-800'
                  }`}>
                    {beneficiary.firstName} {beneficiary.lastName}
                  </p>
                  <Badge className={`${
                    isChildBeneficiary(beneficiary) 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-pink-500 text-white'
                  } flex items-center gap-1 w-fit`}>
                    {isChildBeneficiary(beneficiary) ? <Shield className="w-3 h-3" /> : <Heart className="w-3 h-3" />}
                    {isChildBeneficiary(beneficiary) ? t('lifecycle.protectionChild') : t('lifecycle.supportWomen')}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t('beneficiary.age')}
                  </label>
                  <p className="text-xl font-bold text-gray-900">
                    {calculateAge(beneficiary.dateOfBirth)} {t('beneficiary.years')}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t('assignment.currentStatus')}
                  </label>
                  <Badge className={getStatusColor(beneficiary.status)}>
                    {getStatusLabel(beneficiary.status)}
                  </Badge>
                </div>
                {beneficiary.visitReason && (
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {t('general.visitReason')}
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{beneficiary.visitReason}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sélection de l'assistante sociale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('assignment.selectAssistant')} *
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
                  {t('assignment.choose')}
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
                <AlertDescription>{t('assignment.noAssistants')}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Raison de l'assignation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('assignment.reason')}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder={t('assignment.reasonPlaceholder')}
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
                {t('assignment.success')}
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
              {t('action.cancel')}
            </Button>
            <Button
              onClick={handleAssign}
              disabled={isSubmitting || !selectedAssistante || loadingAssistantes}
              className={`${
                isChildBeneficiary(beneficiary) 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' 
                  : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
              } text-white shadow-lg hover:shadow-xl transition-all duration-200`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('assignment.assigning')}
                </>
              ) : (
                <>
                  {isChildBeneficiary(beneficiary) ? <Shield className="h-4 w-4 mr-2" /> : <Heart className="h-4 w-4 mr-2" />}
                  {t('assignment.assign')}
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
