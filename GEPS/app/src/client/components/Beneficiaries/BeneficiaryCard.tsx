import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../cn';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Home,
  Users,
  UserCheck
} from 'lucide-react';
import type { Beneficiary } from 'wasp/entities';
import { usePermissions } from '../../hooks/usePermissions';

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
  onEdit: (beneficiary: Beneficiary) => void;
  onDelete: (id: string) => void;
  onAssign?: (beneficiary: Beneficiary) => void;
  language: 'fr' | 'ar';
  className?: string;
}

export default function BeneficiaryCard({
  beneficiary,
  onEdit,
  onDelete,
  onAssign,
  language,
  className
}: BeneficiaryCardProps) {
  const isRTL = language === 'ar';
  const { hasPermission } = usePermissions();

  const t = {
    age: language === 'ar' ? 'العمر' : 'Âge',
    male: language === 'ar' ? 'ذكر' : 'Homme',
    female: language === 'ar' ? 'أنثى' : 'Femme',
    view: language === 'ar' ? 'عرض' : 'Voir',
    edit: language === 'ar' ? 'تحرير' : 'Modifier',
    delete: language === 'ar' ? 'حذف' : 'Supprimer',
    assign: language === 'ar' ? 'تعيين' : 'Assigner',
    documents: language === 'ar' ? 'الوثائق' : 'Documents',
    accommodation: language === 'ar' ? 'الإيواء' : 'Hébergement',
    years: language === 'ar' ? 'سنة' : 'ans',
    woman: language === 'ar' ? 'امرأة' : 'Femme',
    child: language === 'ar' ? 'طفل' : 'Enfant'
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

  const getBeneficiaryType = (beneficiary: any) => {
    // Si le champ beneficiaryType existe, l'utiliser
    if (beneficiary.beneficiaryType) {
      return beneficiary.beneficiaryType;
    }
    // Sinon, détecter basé sur l'âge
    const age = calculateAge(beneficiary.dateOfBirth);
    return age < 18 ? 'ENFANT' : 'FEMME';
  };

  const getBeneficiaryTypeLabel = (type: string) => {
    return type === 'ENFANT' ? t.child : t.woman;
  };

  return (
    <TooltipProvider>
      <Card className={cn(
        'transition-all duration-200 hover:shadow-xl border-2 border-blue-100 hover:border-pink-300 group bg-gradient-to-br from-white to-blue-50/30 hover:from-blue-50/50 hover:to-pink-50/50',
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 ring-2 ring-blue-200 group-hover:ring-pink-300 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-pink-100 text-blue-700 font-semibold">
                  {getInitials(beneficiary.firstName, beneficiary.lastName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-blue-700 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                  {beneficiary.firstName} {beneficiary.lastName}
                </h3>
                <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
                  {/* Badge du type de bénéficiaire - PRINCIPAL */}
                  <Badge 
                    variant={getBeneficiaryType(beneficiary) === 'ENFANT' ? 'warning' : 'info'}
                    className="text-xs font-semibold"
                  >
                    {getBeneficiaryTypeLabel(getBeneficiaryType(beneficiary))}
                  </Badge>
                  
                  <Badge 
                    variant={beneficiary.gender === 'Female' ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {beneficiary.gender === 'Male' ? t.male : t.female}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {calculateAge(beneficiary.dateOfBirth)} {t.years}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 hover:text-blue-700"
                    asChild
                  >
                    <Link to={`/beneficiaries/${beneficiary.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.view}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-pink-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 hover:text-pink-700"
                    onClick={() => onEdit(beneficiary)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.edit}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => onDelete(beneficiary.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.delete}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="space-y-3">
            {beneficiary.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span>{beneficiary.phone}</span>
              </div>
            )}

            {beneficiary.address && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate">{beneficiary.address}</span>
              </div>
            )}

            {(beneficiary.familySituation || beneficiary.professionalSituation) && (
              <div className="pt-2 border-t border-gray-100">
                {beneficiary.familySituation && (
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-medium">Famille:</span> {beneficiary.familySituation}
                  </p>
                )}
                {beneficiary.professionalSituation && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Profession:</span> {beneficiary.professionalSituation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions pour directeurs/coordinateurs */}
          {(hasPermission('BENEFICIARIES', 'ASSIGN') && onAssign && beneficiary.status !== 'EN_SUIVI') && (
            <div className="pt-3 border-t border-gray-100 mt-4">
              <div className="flex items-center justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAssign(beneficiary);
                        }}
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white px-4 py-2 text-xs shadow-md hover:shadow-lg transition-all"
                      >
                        <UserCheck className="w-3 h-3 mr-1" />
                        {t.assign}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{language === 'ar' ? 'تعيين إلى مساعدة اجتماعية' : 'Assigner à une assistante sociale'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}

          {/* Footer avec stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <FileText className="w-3 h-3 mr-1" />
                <span>0 {t.documents}</span>
              </div>
              <div className="flex items-center">
                <Home className="w-3 h-3 mr-1" />
                <span>0 {t.accommodation}</span>
              </div>
            </div>
            
            <Badge variant="success" className="text-xs">
              Actif
            </Badge>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
