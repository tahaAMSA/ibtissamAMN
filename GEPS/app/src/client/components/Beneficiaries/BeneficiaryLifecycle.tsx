import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { User, UserCheck, ArrowRight, Clock, CheckCircle, Heart, Shield } from 'lucide-react';
import { cn } from '../../cn';

interface BeneficiaryLifecycleProps {
  beneficiary: any;
  language?: 'fr' | 'ar';
}

const BeneficiaryLifecycle: React.FC<BeneficiaryLifecycleProps> = ({ 
  beneficiary, 
  language = 'fr' 
}) => {
  const isRTL = language === 'ar';

  const t = {
    title: language === 'fr' ? 'Cycle de vie du dossier' : 'دورة حياة الملف',
    reception: language === 'fr' ? 'Accueil' : 'الاستقبال',
    orientation: language === 'fr' ? 'Orientation' : 'التوجيه',
    assignment: language === 'fr' ? 'Assignation' : 'التعيين',
    processing: language === 'fr' ? 'Traitement' : 'المعالجة',
    by: language === 'fr' ? 'Par' : 'بواسطة',
    on: language === 'fr' ? 'Le' : 'في',
    reason: language === 'fr' ? 'Raison' : 'السبب',
    status: language === 'fr' ? 'Statut' : 'الحالة',
    pending: language === 'fr' ? 'En attente' : 'في الانتظار',
    completed: language === 'fr' ? 'Terminé' : 'مكتمل',
    inProgress: language === 'fr' ? 'En cours' : 'قيد التنفيذ'
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
      case 'TERMINE':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      'EN_ATTENTE_ACCUEIL': { fr: 'En attente d\'accueil', ar: 'في انتظار الاستقبال' },
      'EN_ATTENTE_ORIENTATION': { fr: 'En attente d\'orientation', ar: 'في انتظار التوجيه' },
      'ORIENTE': { fr: 'Orienté', ar: 'موجه' },
      'EN_SUIVI': { fr: 'En suivi', ar: 'تحت المتابعة' },
      'TERMINE': { fr: 'Terminé', ar: 'مكتمل' }
    };
    return statusLabels[status as keyof typeof statusLabels]?.[language] || status;
  };

  const formatDate = (date: string | Date) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'ar-SA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
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

  const isChildBeneficiary = (beneficiary: any) => {
    const age = calculateAge(beneficiary.dateOfBirth);
    return age < 18;
  };

  const steps = [
    {
      id: 'reception',
      title: t.reception,
      icon: <User className="h-4 w-4" />,
      user: beneficiary.createdBy,
      date: beneficiary.createdAt,
      completed: true,
      description: language === 'fr' ? 'Enregistrement initial' : 'التسجيل الأولي'
    },
    {
      id: 'orientation',
      title: t.orientation,
      icon: <ArrowRight className="h-4 w-4" />,
      user: beneficiary.orientedBy,
      date: beneficiary.orientedAt,
      completed: !!beneficiary.orientedBy,
      description: beneficiary.orientationReason || (language === 'fr' ? 'En attente d\'orientation' : 'في انتظار التوجيه')
    },
    {
      id: 'assignment',
      title: t.assignment,
      icon: <UserCheck className="h-4 w-4" />,
      user: beneficiary.assignedTo,
      date: beneficiary.assignedAt,
      completed: !!beneficiary.assignedTo,
      description: language === 'fr' ? 'Assigné à une assistante sociale' : 'مُعين لمساعدة اجتماعية'
    }
  ];

  return (
    <Card className={cn(
      "border-2 shadow-lg",
      isChildBeneficiary(beneficiary) ? "border-orange-200 bg-orange-50/30" : "border-pink-200 bg-pink-50/30",
      { "rtl": isRTL }
    )}>
      <CardHeader className={`${
        isChildBeneficiary(beneficiary) 
          ? 'bg-gradient-to-r from-orange-100 to-orange-200' 
          : 'bg-gradient-to-r from-pink-100 to-pink-200'
      }`}>
        <CardTitle className={`flex items-center gap-3 text-xl ${
          isChildBeneficiary(beneficiary) ? 'text-orange-800' : 'text-pink-800'
        }`}>
          {isChildBeneficiary(beneficiary) ? <Shield className="h-6 w-6" /> : <Heart className="h-6 w-6" />}
          <Clock className="h-5 w-5" />
          {t.title}
        </CardTitle>
        <div className="flex items-center gap-3">
          <Badge className={cn("border-2 px-3 py-1 font-semibold", getStatusColor(beneficiary.status))}>
            {getStatusLabel(beneficiary.status)}
          </Badge>
          <Badge className={`${
            isChildBeneficiary(beneficiary) 
              ? 'bg-orange-500 text-white' 
              : 'bg-pink-500 text-white'
          } px-3 py-1`}>
            {isChildBeneficiary(beneficiary) ? 'Protection Enfance' : 'Accompagnement Femmes'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4">
              {/* Icône et ligne de connexion */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  "p-3 rounded-full border-2 shadow-md",
                  step.completed 
                    ? isChildBeneficiary(beneficiary)
                      ? "bg-orange-100 border-orange-500 text-orange-700" 
                      : "bg-pink-100 border-pink-500 text-pink-700"
                    : "bg-gray-100 border-gray-300 text-gray-500"
                )}>
                  {step.completed ? <CheckCircle className="h-5 w-5" /> : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-1 h-10 mt-2 rounded-full",
                    step.completed 
                      ? isChildBeneficiary(beneficiary)
                        ? "bg-orange-500" 
                        : "bg-pink-500"
                      : "bg-gray-300"
                  )} />
                )}
              </div>

              {/* Contenu de l'étape */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={cn(
                    "font-medium",
                    step.completed ? "text-gray-900" : "text-gray-500"
                  )}>
                    {step.title}
                  </h4>
                  {step.date && (
                    <span className="text-xs text-gray-500">
                      {formatDate(step.date)}
                    </span>
                  )}
                </div>

                {step.user && (
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">{t.by}:</span> {step.user.firstName} {step.user.lastName}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {step.user.role}
                    </Badge>
                  </div>
                )}

                <p className="text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BeneficiaryLifecycle;
