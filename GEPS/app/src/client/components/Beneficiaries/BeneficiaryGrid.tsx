import React from 'react';
import type { Beneficiary } from 'wasp/entities';
import { Users, Heart, Shield, Eye, Edit, Calendar, Phone, MapPin } from 'lucide-react';
import { useAuth } from 'wasp/client/auth';
import { useI18n } from '../../../translations/useI18n';

interface BeneficiaryGridProps {
  beneficiaries: Beneficiary[];
  onEdit?: (beneficiary: Beneficiary) => void;
  onView?: (beneficiary: Beneficiary) => void;
  isLoading?: boolean;
}

const BeneficiaryGrid: React.FC<BeneficiaryGridProps> = ({
  beneficiaries,
  onEdit,
  onView,
  isLoading = false
}) => {
  const { data: user } = useAuth();
  const { t, lang: language, isRTL, dir } = useI18n(user as any);
  
  // Calculer l'âge à partir de la date de naissance
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

  const isChildBeneficiary = (beneficiary: Beneficiary) => {
    // Priorité 1: Utiliser le champ beneficiaryType s'il existe
    if ((beneficiary as any).beneficiaryType) {
      return (beneficiary as any).beneficiaryType === 'ENFANT';
    }
    
    // Priorité 2: Calculer basé sur l'âge si dateOfBirth existe
    if (beneficiary.dateOfBirth) {
      try {
        const age = calculateAge(beneficiary.dateOfBirth);
        return age < 18;
      } catch (error) {
        console.error('Erreur calcul âge pour:', beneficiary.firstName, error);
      }
    }
    
    // Par défaut: considérer comme femme (adulte)
    return false;
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border-2 border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!beneficiaries || beneficiaries.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <Users className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('beneficiary.none.found')}
        </h3>
        <p className="text-gray-500">
          {t('beneficiary.add.first')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      
      {beneficiaries.map((beneficiary: Beneficiary) => {
        const isChild = isChildBeneficiary(beneficiary);
        const age = calculateAge(beneficiary.dateOfBirth);
        
        return (
          <div 
            key={beneficiary.id} 
            className={`bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-200 overflow-hidden ${
              isChild 
                ? 'border-orange-200 hover:border-orange-300' 
                : 'border-pink-200 hover:border-pink-300'
            }`}
          >
            {/* Header de la carte */}
            <div className={`${
              isChild 
                ? 'bg-orange-500' 
                : 'bg-pink-500'
            } text-white p-4`}>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-semibold">
                  {beneficiary.firstName?.charAt(0)}{beneficiary.lastName?.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate text-lg">
                    {beneficiary.firstName} {beneficiary.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
                    <span>{age} {language === 'ar' ? 'سنة' : 'ans'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {isChild ? (
                        <><Shield className="w-3 h-3" /> {language === 'ar' ? 'طفل' : 'Enfant'}</>
                      ) : (
                        <><Heart className="w-3 h-3" /> {language === 'ar' ? 'امرأة' : 'Femme'}</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu de la carte */}
            <div className="p-4 space-y-3">
              {/* Informations de contact */}
              {beneficiary.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{beneficiary.phone}</span>
                </div>
              )}
              
              {beneficiary.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{beneficiary.address}</span>
                </div>
              )}

              {/* Section statut */}
              <div className="pt-2">
                <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  (beneficiary as any).status === 'EN_SUIVI' 
                    ? 'bg-green-100 text-green-800'
                    : (beneficiary as any).status === 'EN_ATTENTE_ORIENTATION'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    (beneficiary as any).status === 'EN_SUIVI' 
                      ? 'bg-green-500'
                      : (beneficiary as any).status === 'EN_ATTENTE_ORIENTATION'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`}></div>
                  {(beneficiary as any).status === 'EN_SUIVI' 
                    ? (language === 'ar' ? 'قيد المتابعة' : 'En suivi')
                    : (beneficiary as any).status === 'EN_ATTENTE_ORIENTATION'
                    ? (language === 'ar' ? 'في انتظار التوجيه' : 'À orienter')
                    : (language === 'ar' ? 'نشط' : 'Actif')
                  }
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 flex gap-2 border-t border-gray-100">
              {onView && (
                <button 
                  onClick={() => onView(beneficiary)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isChild
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-pink-500 text-white hover:bg-pink-600'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  {language === 'ar' ? 'عرض' : 'Voir'}
                </button>
              )}
              {onEdit && (
                <button 
                  onClick={() => onEdit(beneficiary)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  {language === 'ar' ? 'تحرير' : 'Modifier'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BeneficiaryGrid;
