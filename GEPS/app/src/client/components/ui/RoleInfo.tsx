import React from 'react';
import { UserRole } from '@prisma/client';
import { Badge } from './badge';
import { Card, CardContent } from './card';
import { 
  Shield, 
  Users, 
  UserCog, 
  Briefcase, 
  Heart, 
  Scale, 
  Home, 
  GraduationCap, 
  Activity, 
  Calculator, 
  Package, 
  FileText,
  Eye,
  Crown
} from 'lucide-react';

interface RoleInfoProps {
  role: UserRole;
  language?: 'fr' | 'ar';
  variant?: 'compact' | 'detailed' | 'badge-only';
  className?: string;
}

interface RoleDetails {
  label: { fr: string; ar: string };
  description: { fr: string; ar: string };
  responsibilities: { fr: string[]; ar: string[] };
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const ROLE_DETAILS: Record<UserRole, RoleDetails> = {
  PENDING_ROLE: {
    label: { fr: 'En attente de rôle', ar: 'في انتظار الدور' },
    description: { fr: 'Utilisateur en attente d\'assignation de rôle', ar: 'مستخدم في انتظار تعيين الدور' },
    responsibilities: { fr: ['Accès limité en attente d\'approbation'], ar: ['وصول محدود في انتظار الموافقة'] },
    icon: <Eye className="w-4 h-4" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  ADMIN: {
    label: { fr: 'Administrateur', ar: 'مدير النظام' },
    description: { fr: 'Gestion complète du système et supervision générale', ar: 'إدارة كاملة للنظام والإشراف العام' },
    responsibilities: { 
      fr: ['Gestion des utilisateurs et des rôles', 'Configuration du système', 'Supervision générale', 'Accès à tous les modules'],
      ar: ['إدارة المستخدمين والأدوار', 'تكوين النظام', 'الإشراف العام', 'الوصول إلى جميع الوحدات']
    },
    icon: <Crown className="w-4 h-4" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  DIRECTEUR: {
    label: { fr: 'Directeur', ar: 'مدير' },
    description: { fr: 'Direction stratégique et supervision de l\'ensemble des opérations', ar: 'التوجيه الاستراتيجي والإشراف على جميع العمليات' },
    responsibilities: { 
      fr: ['Supervision stratégique', 'Prise de décisions importantes', 'Coordination des équipes', 'Suivi des objectifs'],
      ar: ['الإشراف الاستراتيجي', 'اتخاذ القرارات المهمة', 'تنسيق الفرق', 'متابعة الأهداف']
    },
    icon: <Shield className="w-4 h-4" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  AGENT_ACCUEIL: {
    label: { fr: 'Agent d\'Accueil', ar: 'عامل استقبال' },
    description: { fr: 'Premier contact et accompagnement initial des bénéficiaires', ar: 'الاتصال الأول والمرافقة الأولية للمستفيدين' },
    responsibilities: { 
      fr: ['Accueil des bénéficiaires', 'Création des dossiers', 'Orientation initiale', 'Gestion de l\'hébergement'],
      ar: ['استقبال المستفيدين', 'إنشاء الملفات', 'التوجيه الأولي', 'إدارة الإيواء']
    },
    icon: <Users className="w-4 h-4" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  COORDINATEUR: {
    label: { fr: 'Coordinateur', ar: 'منسق' },
    description: { fr: 'Coordination des services et suivi des parcours bénéficiaires', ar: 'تنسيق الخدمات ومتابعة مسارات المستفيدين' },
    responsibilities: { 
      fr: ['Coordination des équipes', 'Planification des activités', 'Suivi des parcours', 'Reporting'],
      ar: ['تنسيق الفرق', 'تخطيط الأنشطة', 'متابعة المسارات', 'التقارير']
    },
    icon: <UserCog className="w-4 h-4" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  ASSISTANTE_SOCIALE: {
    label: { fr: 'Assistante Sociale', ar: 'مساعدة اجتماعية' },
    description: { fr: 'Accompagnement social et intervention auprès des bénéficiaires', ar: 'المرافقة الاجتماعية والتدخل مع المستفيدين' },
    responsibilities: { 
      fr: ['Entretiens individuels', 'Interventions sociales', 'Suivi psychosocial', 'Orientation vers les services'],
      ar: ['المقابلات الفردية', 'التدخلات الاجتماعية', 'المتابعة النفسية الاجتماعية', 'التوجيه للخدمات']
    },
    icon: <Heart className="w-4 h-4" />,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  TRAVAILLEUR_SOCIAL: {
    label: { fr: 'Travailleur Social', ar: 'عامل اجتماعي' },
    description: { fr: 'Intervention sociale de terrain et accompagnement spécialisé', ar: 'التدخل الاجتماعي الميداني والمرافقة المتخصصة' },
    responsibilities: { 
      fr: ['Interventions de terrain', 'Accompagnement spécialisé', 'Médiation sociale', 'Suivi individuel'],
      ar: ['التدخلات الميدانية', 'المرافقة المتخصصة', 'الوساطة الاجتماعية', 'المتابعة الفردية']
    },
    icon: <Briefcase className="w-4 h-4" />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100'
  },
  CONSEILLER_JURIDIQUE: {
    label: { fr: 'Conseiller Juridique', ar: 'مستشار قانوني' },
    description: { fr: 'Conseil et accompagnement juridique des bénéficiaires', ar: 'الاستشارة والمرافقة القانونية للمستفيدين' },
    responsibilities: { 
      fr: ['Consultations juridiques', 'Accompagnement procédures', 'Rédaction documents', 'Médiation juridique'],
      ar: ['الاستشارات القانونية', 'مرافقة الإجراءات', 'صياغة الوثائق', 'الوساطة القانونية']
    },
    icon: <Scale className="w-4 h-4" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100'
  },
  RESPONSABLE_HEBERGEMENT: {
    label: { fr: 'Responsable Hébergement', ar: 'مسؤول الإيواء' },
    description: { fr: 'Gestion de l\'hébergement et des espaces de vie', ar: 'إدارة الإيواء ومساحات المعيشة' },
    responsibilities: { 
      fr: ['Gestion des chambres', 'Planification des repas', 'Maintenance des locaux', 'Sécurité des résidentes'],
      ar: ['إدارة الغرف', 'تخطيط الوجبات', 'صيانة المباني', 'أمان النزيلات']
    },
    icon: <Home className="w-4 h-4" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  RESPONSABLE_EDUCATION: {
    label: { fr: 'Responsable Éducation', ar: 'مسؤول التعليم' },
    description: { fr: 'Coordination des programmes éducatifs et formations', ar: 'تنسيق البرامج التعليمية والتدريبات' },
    responsibilities: { 
      fr: ['Programmes éducatifs', 'Suivi scolaire', 'Formations professionnelles', 'Partenariats éducatifs'],
      ar: ['البرامج التعليمية', 'المتابعة المدرسية', 'التدريب المهني', 'الشراكات التعليمية']
    },
    icon: <GraduationCap className="w-4 h-4" />,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100'
  },
  RESPONSABLE_ACTIVITES: {
    label: { fr: 'Responsable Activités', ar: 'مسؤول الأنشطة' },
    description: { fr: 'Organisation des activités sociales et projets entrepreneuriaux', ar: 'تنظيم الأنشطة الاجتماعية والمشاريع الريادية' },
    responsibilities: { 
      fr: ['Activités sociales', 'Projets entrepreneuriaux', 'Animation de groupes', 'Événements'],
      ar: ['الأنشطة الاجتماعية', 'المشاريع الريادية', 'تنشيط المجموعات', 'الفعاليات']
    },
    icon: <Activity className="w-4 h-4" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  COMPTABLE: {
    label: { fr: 'Comptable', ar: 'محاسب' },
    description: { fr: 'Gestion financière et budgétaire de l\'organisation', ar: 'الإدارة المالية والميزانية للمنظمة' },
    responsibilities: { 
      fr: ['Gestion budgétaire', 'Comptabilité générale', 'Reporting financier', 'Contrôle des dépenses'],
      ar: ['إدارة الميزانية', 'المحاسبة العامة', 'التقارير المالية', 'مراقبة النفقات']
    },
    icon: <Calculator className="w-4 h-4" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  },
  GESTIONNAIRE_RESSOURCES: {
    label: { fr: 'Gestionnaire Ressources', ar: 'مدير الموارد' },
    description: { fr: 'Gestion des ressources matérielles et logistique', ar: 'إدارة الموارد المادية واللوجستيات' },
    responsibilities: { 
      fr: ['Gestion des stocks', 'Approvisionnement', 'Distribution ressources', 'Inventaire'],
      ar: ['إدارة المخزون', 'التموين', 'توزيع الموارد', 'الجرد']
    },
    icon: <Package className="w-4 h-4" />,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100'
  },
  DOCUMENTALISTE: {
    label: { fr: 'Documentaliste', ar: 'أمين الوثائق' },
    description: { fr: 'Gestion documentaire et archivage des dossiers', ar: 'إدارة الوثائق وأرشفة الملفات' },
    responsibilities: { 
      fr: ['Archivage des dossiers', 'Gestion documentaire', 'Classement', 'Recherche documents'],
      ar: ['أرشفة الملفات', 'إدارة الوثائق', 'التصنيف', 'البحث في الوثائق']
    },
    icon: <FileText className="w-4 h-4" />,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100'
  },
  OBSERVATEUR: {
    label: { fr: 'Observateur', ar: 'مراقب' },
    description: { fr: 'Consultation et observation des données sans modification', ar: 'الاستشارة ومراقبة البيانات دون تعديل' },
    responsibilities: { 
      fr: ['Consultation des données', 'Observation', 'Reporting lecture seule', 'Suivi général'],
      ar: ['استشارة البيانات', 'المراقبة', 'تقارير القراءة فقط', 'المتابعة العامة']
    },
    icon: <Eye className="w-4 h-4" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  }
};

export function RoleInfo({ role, language = 'fr', variant = 'compact', className = '' }: RoleInfoProps) {
  const roleDetails = ROLE_DETAILS[role];
  
  if (!roleDetails) {
    return null;
  }

  const label = roleDetails.label[language];
  const description = roleDetails.description[language];
  const responsibilities = roleDetails.responsibilities[language];

  if (variant === 'badge-only') {
    return (
      <Badge className={`${roleDetails.bgColor} ${roleDetails.color} border-0 ${className}`}>
        {roleDetails.icon}
        <span className="ml-1">{label}</span>
      </Badge>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className={`p-1.5 rounded-md ${roleDetails.bgColor}`}>
          <div className={roleDetails.color}>
            {roleDetails.icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {label}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {description}
          </p>
        </div>
      </div>
    );
  }

  // variant === 'detailed'
  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${roleDetails.bgColor}`}>
            <div className={roleDetails.color}>
              {roleDetails.icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {label}
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              {description}
            </p>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700">
                {language === 'ar' ? 'المسؤوليات:' : 'Responsabilités:'}
              </p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                {responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-1">•</span>
                    {responsibility}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function getRoleDetails(role: UserRole, language: 'fr' | 'ar' = 'fr') {
  const roleDetails = ROLE_DETAILS[role];
  if (!roleDetails) return null;
  
  return {
    label: roleDetails.label[language],
    description: roleDetails.description[language],
    responsibilities: roleDetails.responsibilities[language],
    icon: roleDetails.icon,
    color: roleDetails.color,
    bgColor: roleDetails.bgColor
  };
}
