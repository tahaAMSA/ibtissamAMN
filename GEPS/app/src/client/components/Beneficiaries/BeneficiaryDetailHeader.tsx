import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '../../cn';
import { ArrowLeft, Edit, Phone, MapPin, Calendar, Users, Heart, Shield } from 'lucide-react';
import type { Beneficiary } from 'wasp/entities';
import { useAuth } from 'wasp/client/auth';
import { useI18n } from '../../../translations/useI18n';

interface BeneficiaryDetailHeaderProps {
  beneficiary: Beneficiary;
  onEdit?: () => void;
  className?: string;
}

export default function BeneficiaryDetailHeader({
  beneficiary,
  onEdit,
  className
}: BeneficiaryDetailHeaderProps) {
  const { data: user } = useAuth();
  const { t, lang: language, isRTL, dir } = useI18n(user as any);

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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const isChildBeneficiary = (beneficiary: any) => {
    const age = calculateAge(beneficiary.dateOfBirth);
    return age < 18;
  };

  return (
    <Card className={cn(
      'border-2 shadow-2xl relative overflow-hidden',
      isChildBeneficiary(beneficiary) 
        ? 'border-orange-200 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700' 
        : 'border-pink-200 bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700',
      className
    )}>
      {/* Motifs décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-10 -right-8 w-16 h-16 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-4 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>
      
      <CardContent className="p-8 relative text-white">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/beneficiaries"
              className="p-3 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            
            <Avatar className="h-24 w-24 ring-4 ring-white/30 shadow-xl">
              <AvatarFallback className={`text-2xl font-bold ${
                isChildBeneficiary(beneficiary) 
                  ? 'bg-orange-200 text-orange-800' 
                  : 'bg-pink-200 text-pink-800'
              }`}>
                {getInitials(beneficiary.firstName, beneficiary.lastName)}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-3 mb-3">
                {isChildBeneficiary(beneficiary) ? (
                  <Shield className="w-8 h-8 text-white" />
                ) : (
                  <Heart className="w-8 h-8 text-white" />
                )}
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                  {beneficiary.firstName} {beneficiary.lastName}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <Badge 
                  className="bg-white/20 text-white border-white/30 text-sm backdrop-blur-sm"
                >
                  <Users className="w-4 h-4 mr-1" />
                    {beneficiary.gender === 'Male' ? t('beneficiary.male') : t('beneficiary.female')}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 text-sm backdrop-blur-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {calculateAge(beneficiary.dateOfBirth)} {t('beneficiary.years')}
                </Badge>
                <Badge className={`text-sm font-bold shadow-lg ${
                  isChildBeneficiary(beneficiary) 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-pink-600 text-white'
                }`}>
                  {isChildBeneficiary(beneficiary) ? t('lifecycle.protectionChild') : t('lifecycle.supportWomen')}
                </Badge>
              </div>
            </div>
          </div>

          {onEdit && (
            <Button
              onClick={onEdit}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 shadow-xl transition-all duration-200 hover:scale-105"
              size="lg"
            >
              <Edit className={cn('w-5 h-5', isRTL ? 'ml-2' : 'mr-2')} />
              {t('action.edit')}
            </Button>
          )}
        </div>

        {/* Informations de contact améliorées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {beneficiary.phone && (
            <div className="flex items-center space-x-4 p-5 bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
              <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">{t('beneficiary.phone')}</p>
                <p className="font-bold text-gray-900 text-lg">{beneficiary.phone}</p>
              </div>
            </div>
          )}

          {beneficiary.address && (
            <div className="flex items-center space-x-4 p-5 bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
              <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">{t('beneficiary.address')}</p>
                <p className="font-bold text-gray-900 text-lg truncate">{beneficiary.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Informations supplémentaires améliorées */}
        {(beneficiary.familySituation || beneficiary.professionalSituation) && (
          <div className="mt-8 pt-6 border-t border-white/30">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-6 h-6" />
              {t('beneficiary.personalInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {beneficiary.familySituation && (
                <div className="p-5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <p className="text-sm text-white/80 mb-2 font-medium">{t('general.familySituation')}</p>
                  <p className="text-white font-bold text-lg">{beneficiary.familySituation}</p>
                </div>
              )}
              {beneficiary.professionalSituation && (
                <div className="p-5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <p className="text-sm text-white/80 mb-2 font-medium">{t('general.professionalSituation')}</p>
                  <p className="text-white font-bold text-lg">{beneficiary.professionalSituation}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
