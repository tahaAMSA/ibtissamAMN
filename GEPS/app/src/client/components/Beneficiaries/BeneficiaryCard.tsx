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
  UserCheck,
  Heart,
  Shield
} from 'lucide-react';
import type { Beneficiary } from 'wasp/entities';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from 'wasp/client/auth';
import { useI18n } from '../../../translations/useI18n';

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
  onEdit: (beneficiary: Beneficiary) => void;
  onDelete: (id: string) => void;
  onAssign?: (beneficiary: Beneficiary) => void;
  className?: string;
}

export default function BeneficiaryCard({
  beneficiary,
  onEdit,
  onDelete,
  onAssign,
  className
}: BeneficiaryCardProps) {
  const { data: user } = useAuth();
  const { t, lang: language, isRTL, dir } = useI18n(user as any);
  const { hasPermission } = usePermissions();

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
    return type === 'ENFANT' ? t('beneficiary.child') : t('beneficiary.woman');
  };

  const isChildBeneficiary = (beneficiary: any) => {
    return getBeneficiaryType(beneficiary) === 'ENFANT';
  };

  return (
    <TooltipProvider>
      <Card className={cn(
        'transition-all duration-300 hover:shadow-2xl border-2 group relative overflow-hidden',
        isChildBeneficiary(beneficiary) 
          ? 'border-orange-200 hover:border-orange-400 bg-gradient-to-br from-white to-orange-50/30 hover:from-orange-50/50 hover:to-orange-100/50' 
          : 'border-pink-200 hover:border-pink-400 bg-gradient-to-br from-white to-pink-50/30 hover:from-pink-50/50 hover:to-pink-100/50',
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar className={cn(
                "h-14 w-14 ring-2 transition-all", 
                isChildBeneficiary(beneficiary) 
                  ? "ring-orange-200 group-hover:ring-orange-400" 
                  : "ring-pink-200 group-hover:ring-pink-400"
              )}>
                <AvatarFallback className={cn(
                  "font-semibold text-lg",
                  isChildBeneficiary(beneficiary) 
                    ? "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700" 
                    : "bg-gradient-to-br from-pink-100 to-pink-200 text-pink-700"
                )}>
                  {getInitials(beneficiary.firstName, beneficiary.lastName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className={cn(
                  "text-xl font-bold mb-2 transition-all",
                  isChildBeneficiary(beneficiary) 
                    ? "text-orange-800 group-hover:text-orange-900" 
                    : "text-pink-800 group-hover:text-pink-900"
                )}>
                  {beneficiary.firstName} {beneficiary.lastName}
                </h3>
                <div className="flex items-center space-x-2 mt-1 flex-wrap gap-2">
                  {/* Badge du type de bénéficiaire - PRINCIPAL avec icône */}
                  <Badge className={cn(
                    "text-sm font-bold px-3 py-1 flex items-center gap-1",
                    isChildBeneficiary(beneficiary) 
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white" 
                      : "bg-gradient-to-r from-pink-500 to-pink-600 text-white"
                  )}>
                    {isChildBeneficiary(beneficiary) ? <Shield className="w-3 h-3" /> : <Heart className="w-3 h-3" />}
                    {getBeneficiaryTypeLabel(getBeneficiaryType(beneficiary))}
                  </Badge>
                  
                  <Badge 
                    variant={beneficiary.gender === 'Female' ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {beneficiary.gender === 'Male' ? t('beneficiary.male') : t('beneficiary.female')}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {calculateAge(beneficiary.dateOfBirth)} {t('beneficiary.years')}
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
                    className={cn(
                      "h-9 w-9 transition-all",
                      isChildBeneficiary(beneficiary) 
                        ? "text-orange-600 hover:bg-orange-100 hover:text-orange-700" 
                        : "text-pink-600 hover:bg-pink-100 hover:text-pink-700"
                    )}
                    asChild
                  >
                    <Link to={`/beneficiaries/${beneficiary.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('beneficiary.view')}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-9 w-9 transition-all",
                      isChildBeneficiary(beneficiary) 
                        ? "text-orange-600 hover:bg-orange-100 hover:text-orange-700" 
                        : "text-pink-600 hover:bg-pink-100 hover:text-pink-700"
                    )}
                    onClick={() => onEdit(beneficiary)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('action.edit')}</p>
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
                  <p>{t('action.delete')}</p>
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
                    <span className="font-medium">{t('general.familySituation')}:</span> {beneficiary.familySituation}
                  </p>
                )}
                {beneficiary.professionalSituation && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">{t('general.professionalSituation')}:</span> {beneficiary.professionalSituation}
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
                        className={cn(
                          "text-white px-4 py-2 text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2",
                          isChildBeneficiary(beneficiary) 
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700" 
                            : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                        )}
                      >
                        {isChildBeneficiary(beneficiary) ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                        {t('beneficiary.assign')}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('assignment.assignTo')}</p>
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
                <span>0 {t('beneficiary.documents')}</span>
              </div>
              <div className="flex items-center">
                <Home className="w-3 h-3 mr-1" />
                <span>0 {t('beneficiary.accommodation')}</span>
              </div>
            </div>
            
            <Badge variant="success" className="text-xs">
              {t('beneficiary.active')}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
