import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '../../cn';
import { ArrowLeft, Edit, Phone, MapPin, Calendar, Users } from 'lucide-react';
import type { Beneficiary } from 'wasp/entities';

interface BeneficiaryDetailHeaderProps {
  beneficiary: Beneficiary;
  language: 'fr' | 'ar';
  onEdit?: () => void;
  className?: string;
}

export default function BeneficiaryDetailHeader({
  beneficiary,
  language,
  onEdit,
  className
}: BeneficiaryDetailHeaderProps) {
  const isRTL = language === 'ar';

  const t = {
    back: language === 'ar' ? 'رجوع' : 'Retour',
    edit: language === 'ar' ? 'تحرير' : 'Modifier',
    male: language === 'ar' ? 'ذكر' : 'Homme',
    female: language === 'ar' ? 'أنثى' : 'Femme',
    age: language === 'ar' ? 'العمر' : 'Âge',
    years: language === 'ar' ? 'سنة' : 'ans',
    personalInfo: language === 'ar' ? 'المعلومات الشخصية' : 'Informations personnelles'
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className={cn('border-2 border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-50', className)}>
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/beneficiaries"
              className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600" />
            </Link>
            
            <Avatar className="h-20 w-20 ring-4 ring-blue-200">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-bold">
                {getInitials(beneficiary.firstName, beneficiary.lastName)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                {beneficiary.firstName} {beneficiary.lastName}
              </h1>
              <div className="flex items-center space-x-3">
                <Badge 
                  variant={beneficiary.gender === 'Female' ? 'secondary' : 'info'}
                  className="text-sm"
                >
                  <Users className="w-4 h-4 mr-1" />
                  {beneficiary.gender === 'Male' ? t.male : t.female}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {calculateAge(beneficiary.dateOfBirth)} {t.years}
                </Badge>
              </div>
            </div>
          </div>

          {onEdit && (
            <Button
              onClick={onEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Edit className={cn('w-4 h-4', isRTL ? 'ml-2' : 'mr-2')} />
              {t.edit}
            </Button>
          )}
        </div>

        {/* Informations de contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {beneficiary.phone && (
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-blue-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-semibold text-gray-900">{beneficiary.phone}</p>
              </div>
            </div>
          )}

          {beneficiary.address && (
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-blue-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Adresse</p>
                <p className="font-semibold text-gray-900 truncate">{beneficiary.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Informations supplémentaires */}
        {(beneficiary.familySituation || beneficiary.professionalSituation) && (
          <div className="mt-6 pt-6 border-t border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">{t.personalInfo}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {beneficiary.familySituation && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Situation familiale</p>
                  <p className="text-gray-900 font-medium">{beneficiary.familySituation}</p>
                </div>
              )}
              {beneficiary.professionalSituation && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Situation professionnelle</p>
                  <p className="text-gray-900 font-medium">{beneficiary.professionalSituation}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
