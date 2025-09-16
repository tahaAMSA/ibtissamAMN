import { useAuth } from 'wasp/client/auth';
import { UserRole } from '@prisma/client';

// Types pour les permissions (côté client)
export type PermissionModule = 
  | 'BENEFICIARIES'
  | 'DOCUMENTS' 
  | 'INTERVENTIONS'
  | 'ACCOMMODATION'
  | 'MEALS'
  | 'RESOURCES'
  | 'EDUCATION'
  | 'ACTIVITIES'
  | 'TRAINING'
  | 'PROJECTS'
  | 'BUDGET'
  | 'USERS'
  | 'SYSTEM'
  | 'NOTIFICATIONS';

export type PermissionAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'ASSIGN' | 'ORIENT';

interface Permission {
  module: PermissionModule;
  action: PermissionAction;
  ownRecordsOnly?: boolean;
  conditions?: {
    beneficiaryStatus?: string[];
    fieldAccess?: 'LIMITED' | 'FULL';
  };
}

// Matrice des permissions par rôle (dupliquée côté client pour performance)
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  PENDING_ROLE: [
    // Aucune permission - utilisateur en attente d'assignation de rôle
  ],

  ADMIN: [
    // Accès complet à tout
    { module: 'BENEFICIARIES', action: 'CREATE' },
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'BENEFICIARIES', action: 'UPDATE' },
    { module: 'BENEFICIARIES', action: 'DELETE' },
    { module: 'DOCUMENTS', action: 'CREATE' },
    { module: 'DOCUMENTS', action: 'READ' },
    { module: 'DOCUMENTS', action: 'UPDATE' },
    { module: 'DOCUMENTS', action: 'DELETE' },
    { module: 'INTERVENTIONS', action: 'CREATE' },
    { module: 'INTERVENTIONS', action: 'READ' },
    { module: 'INTERVENTIONS', action: 'UPDATE' },
    { module: 'INTERVENTIONS', action: 'DELETE' },
    { module: 'ACCOMMODATION', action: 'CREATE' },
    { module: 'ACCOMMODATION', action: 'READ' },
    { module: 'ACCOMMODATION', action: 'UPDATE' },
    { module: 'ACCOMMODATION', action: 'DELETE' },
    { module: 'MEALS', action: 'CREATE' },
    { module: 'MEALS', action: 'READ' },
    { module: 'MEALS', action: 'UPDATE' },
    { module: 'MEALS', action: 'DELETE' },
    { module: 'RESOURCES', action: 'CREATE' },
    { module: 'RESOURCES', action: 'READ' },
    { module: 'RESOURCES', action: 'UPDATE' },
    { module: 'RESOURCES', action: 'DELETE' },
    { module: 'EDUCATION', action: 'CREATE' },
    { module: 'EDUCATION', action: 'READ' },
    { module: 'EDUCATION', action: 'UPDATE' },
    { module: 'EDUCATION', action: 'DELETE' },
    { module: 'ACTIVITIES', action: 'CREATE' },
    { module: 'ACTIVITIES', action: 'READ' },
    { module: 'ACTIVITIES', action: 'UPDATE' },
    { module: 'ACTIVITIES', action: 'DELETE' },
    { module: 'TRAINING', action: 'CREATE' },
    { module: 'TRAINING', action: 'READ' },
    { module: 'TRAINING', action: 'UPDATE' },
    { module: 'TRAINING', action: 'DELETE' },
    { module: 'PROJECTS', action: 'CREATE' },
    { module: 'PROJECTS', action: 'READ' },
    { module: 'PROJECTS', action: 'UPDATE' },
    { module: 'PROJECTS', action: 'DELETE' },
    { module: 'BUDGET', action: 'CREATE' },
    { module: 'BUDGET', action: 'READ' },
    { module: 'BUDGET', action: 'UPDATE' },
    { module: 'BUDGET', action: 'DELETE' },
    { module: 'USERS', action: 'CREATE' },
    { module: 'USERS', action: 'READ' },
    { module: 'USERS', action: 'UPDATE' },
    { module: 'USERS', action: 'DELETE' },
    { module: 'SYSTEM', action: 'CREATE' },
    { module: 'SYSTEM', action: 'READ' },
    { module: 'SYSTEM', action: 'UPDATE' },
    { module: 'SYSTEM', action: 'DELETE' },
  ],

  DIRECTEUR: [
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'BENEFICIARIES', action: 'UPDATE' },
    { module: 'BENEFICIARIES', action: 'ORIENT' }, // Peut orienter vers assistante sociale
    { module: 'BENEFICIARIES', action: 'ASSIGN' }, // Peut assigner directement
    { module: 'DOCUMENTS', action: 'READ' },
    { module: 'DOCUMENTS', action: 'UPDATE' },
    { module: 'INTERVENTIONS', action: 'READ' },
    { module: 'INTERVENTIONS', action: 'UPDATE' },
    { module: 'ACCOMMODATION', action: 'READ' },
    { module: 'ACCOMMODATION', action: 'UPDATE' },
    { module: 'MEALS', action: 'READ' },
    { module: 'MEALS', action: 'UPDATE' },
    { module: 'RESOURCES', action: 'READ' },
    { module: 'RESOURCES', action: 'UPDATE' },
    { module: 'EDUCATION', action: 'READ' },
    { module: 'EDUCATION', action: 'UPDATE' },
    { module: 'ACTIVITIES', action: 'READ' },
    { module: 'ACTIVITIES', action: 'UPDATE' },
    { module: 'TRAINING', action: 'READ' },
    { module: 'TRAINING', action: 'UPDATE' },
    { module: 'PROJECTS', action: 'READ' },
    { module: 'PROJECTS', action: 'UPDATE' },
    { module: 'BUDGET', action: 'READ' },
    { module: 'BUDGET', action: 'UPDATE' },
    { module: 'USERS', action: 'READ' },
    { module: 'SYSTEM', action: 'READ' },
    // Notifications
    { module: 'NOTIFICATIONS', action: 'CREATE' },
    { module: 'NOTIFICATIONS', action: 'READ' },
    { module: 'NOTIFICATIONS', action: 'UPDATE' },
  ],

  AGENT_ACCUEIL: [
    // Accès limité pour créer le premier contact avec informations basiques
    { 
      module: 'BENEFICIARIES', 
      action: 'CREATE',
      conditions: { fieldAccess: 'LIMITED' }
    },
    { 
      module: 'BENEFICIARIES', 
      action: 'READ',
      conditions: { 
        beneficiaryStatus: ['EN_ATTENTE_ACCUEIL'],
        fieldAccess: 'LIMITED'
      }
    },
    { 
      module: 'BENEFICIARIES', 
      action: 'UPDATE',
      conditions: { 
        beneficiaryStatus: ['EN_ATTENTE_ACCUEIL'],
        fieldAccess: 'LIMITED'
      }
    },
    // Peut scanner et créer des documents de base
    { module: 'DOCUMENTS', action: 'CREATE' },
    { module: 'DOCUMENTS', action: 'READ', ownRecordsOnly: true },
    // Notifications en lecture seulement
    { module: 'NOTIFICATIONS', action: 'READ' },
  ],

  COORDINATEUR: [
    { module: 'BENEFICIARIES', action: 'CREATE' },
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'BENEFICIARIES', action: 'UPDATE' },
    { module: 'BENEFICIARIES', action: 'ORIENT' }, // Peut orienter
    { module: 'BENEFICIARIES', action: 'ASSIGN' }, // Peut assigner directement
    { module: 'DOCUMENTS', action: 'CREATE' },
    { module: 'DOCUMENTS', action: 'READ' },
    { module: 'DOCUMENTS', action: 'UPDATE' },
    { module: 'INTERVENTIONS', action: 'READ' },
    { module: 'INTERVENTIONS', action: 'UPDATE' },
    { module: 'ACCOMMODATION', action: 'READ' },
    { module: 'ACCOMMODATION', action: 'UPDATE' },
    { module: 'MEALS', action: 'READ' },
    { module: 'MEALS', action: 'UPDATE' },
    { module: 'RESOURCES', action: 'READ' },
    { module: 'RESOURCES', action: 'UPDATE' },
    { module: 'EDUCATION', action: 'READ' },
    { module: 'EDUCATION', action: 'UPDATE' },
    { module: 'ACTIVITIES', action: 'READ' },
    { module: 'ACTIVITIES', action: 'UPDATE' },
    { module: 'TRAINING', action: 'READ' },
    { module: 'TRAINING', action: 'UPDATE' },
    { module: 'PROJECTS', action: 'READ' },
    { module: 'PROJECTS', action: 'UPDATE' },
    // Notifications
    { module: 'NOTIFICATIONS', action: 'CREATE' },
    { module: 'NOTIFICATIONS', action: 'READ' },
    { module: 'NOTIFICATIONS', action: 'UPDATE' },
  ],

  ASSISTANTE_SOCIALE: [
    { module: 'BENEFICIARIES', action: 'CREATE' },
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'BENEFICIARIES', action: 'UPDATE' },
    { module: 'BENEFICIARIES', action: 'DELETE' },
    { module: 'DOCUMENTS', action: 'CREATE' },
    { module: 'DOCUMENTS', action: 'READ' },
    { module: 'DOCUMENTS', action: 'UPDATE' },
    { module: 'DOCUMENTS', action: 'DELETE' },
    { module: 'INTERVENTIONS', action: 'CREATE' },
    { module: 'INTERVENTIONS', action: 'READ' },
    { module: 'INTERVENTIONS', action: 'UPDATE' },
    { module: 'INTERVENTIONS', action: 'DELETE' },
    { module: 'ACCOMMODATION', action: 'READ' },
    { module: 'ACCOMMODATION', action: 'UPDATE' },
    { module: 'MEALS', action: 'READ' },
    { module: 'MEALS', action: 'UPDATE' },
    { module: 'EDUCATION', action: 'READ' },
    { module: 'EDUCATION', action: 'UPDATE' },
    { module: 'ACTIVITIES', action: 'READ' },
    { module: 'ACTIVITIES', action: 'UPDATE' },
    { module: 'TRAINING', action: 'READ' },
    { module: 'TRAINING', action: 'UPDATE' },
    { module: 'PROJECTS', action: 'READ' },
    { module: 'PROJECTS', action: 'UPDATE' },
    { module: 'BUDGET', action: 'READ' },
    // Notifications
    { module: 'NOTIFICATIONS', action: 'READ' },
    { module: 'NOTIFICATIONS', action: 'UPDATE' },
  ],

  TRAVAILLEUR_SOCIAL: [
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'BENEFICIARIES', action: 'UPDATE' },
    { module: 'DOCUMENTS', action: 'READ' },
    { module: 'DOCUMENTS', action: 'UPDATE' },
    { module: 'INTERVENTIONS', action: 'CREATE' },
    { module: 'INTERVENTIONS', action: 'READ' },
    { module: 'INTERVENTIONS', action: 'UPDATE' },
    { module: 'INTERVENTIONS', action: 'DELETE', ownRecordsOnly: true },
    { module: 'ACTIVITIES', action: 'READ' },
    { module: 'ACTIVITIES', action: 'UPDATE' },
    { module: 'TRAINING', action: 'READ' },
  ],

  CONSEILLER_JURIDIQUE: [
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'BENEFICIARIES', action: 'UPDATE' },
    { module: 'DOCUMENTS', action: 'CREATE' },
    { module: 'DOCUMENTS', action: 'READ' },
    { module: 'DOCUMENTS', action: 'UPDATE' },
    { module: 'INTERVENTIONS', action: 'CREATE' },
    { module: 'INTERVENTIONS', action: 'READ' },
    { module: 'INTERVENTIONS', action: 'UPDATE' },
  ],

  RESPONSABLE_HEBERGEMENT: [
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'ACCOMMODATION', action: 'CREATE' },
    { module: 'ACCOMMODATION', action: 'READ' },
    { module: 'ACCOMMODATION', action: 'UPDATE' },
    { module: 'ACCOMMODATION', action: 'DELETE' },
    { module: 'MEALS', action: 'CREATE' },
    { module: 'MEALS', action: 'READ' },
    { module: 'MEALS', action: 'UPDATE' },
    { module: 'MEALS', action: 'DELETE' },
    { module: 'RESOURCES', action: 'READ' },
    { module: 'RESOURCES', action: 'UPDATE' },
    { module: 'DOCUMENTS', action: 'READ' },
    { module: 'BUDGET', action: 'READ' },
  ],

  RESPONSABLE_EDUCATION: [
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'EDUCATION', action: 'CREATE' },
    { module: 'EDUCATION', action: 'READ' },
    { module: 'EDUCATION', action: 'UPDATE' },
    { module: 'EDUCATION', action: 'DELETE' },
    { module: 'TRAINING', action: 'CREATE' },
    { module: 'TRAINING', action: 'READ' },
    { module: 'TRAINING', action: 'UPDATE' },
    { module: 'TRAINING', action: 'DELETE' },
    { module: 'DOCUMENTS', action: 'READ' },
    { module: 'RESOURCES', action: 'READ' },
    { module: 'BUDGET', action: 'READ' },
  ],

  RESPONSABLE_ACTIVITES: [
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'ACTIVITIES', action: 'CREATE' },
    { module: 'ACTIVITIES', action: 'READ' },
    { module: 'ACTIVITIES', action: 'UPDATE' },
    { module: 'ACTIVITIES', action: 'DELETE' },
    { module: 'PROJECTS', action: 'CREATE' },
    { module: 'PROJECTS', action: 'READ' },
    { module: 'PROJECTS', action: 'UPDATE' },
    { module: 'PROJECTS', action: 'DELETE' },
    { module: 'TRAINING', action: 'READ' },
    { module: 'RESOURCES', action: 'READ' },
    { module: 'BUDGET', action: 'READ' },
  ],

  COMPTABLE: [
    { module: 'BUDGET', action: 'CREATE' },
    { module: 'BUDGET', action: 'READ' },
    { module: 'BUDGET', action: 'UPDATE' },
    { module: 'BUDGET', action: 'DELETE' },
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'RESOURCES', action: 'READ' },
    { module: 'RESOURCES', action: 'UPDATE' },
    { module: 'DOCUMENTS', action: 'READ' },
  ],

  GESTIONNAIRE_RESSOURCES: [
    { module: 'RESOURCES', action: 'CREATE' },
    { module: 'RESOURCES', action: 'READ' },
    { module: 'RESOURCES', action: 'UPDATE' },
    { module: 'RESOURCES', action: 'DELETE' },
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'ACCOMMODATION', action: 'READ' },
    { module: 'MEALS', action: 'READ' },
    { module: 'BUDGET', action: 'READ' },
    { module: 'DOCUMENTS', action: 'READ' },
  ],

  DOCUMENTALISTE: [
    { module: 'DOCUMENTS', action: 'CREATE' },
    { module: 'DOCUMENTS', action: 'READ' },
    { module: 'DOCUMENTS', action: 'UPDATE' },
    { module: 'DOCUMENTS', action: 'DELETE' },
    { module: 'BENEFICIARIES', action: 'READ' },
  ],

  OBSERVATEUR: [
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'DOCUMENTS', action: 'READ' },
    { module: 'INTERVENTIONS', action: 'READ' },
    { module: 'ACCOMMODATION', action: 'READ' },
    { module: 'MEALS', action: 'READ' },
    { module: 'RESOURCES', action: 'READ' },
    { module: 'EDUCATION', action: 'READ' },
    { module: 'ACTIVITIES', action: 'READ' },
    { module: 'TRAINING', action: 'READ' },
    { module: 'PROJECTS', action: 'READ' },
    { module: 'BUDGET', action: 'READ' },
  ],
};

/**
 * Hook pour vérifier les permissions d'un utilisateur
 */
export function usePermissions() {
  const { data: user } = useAuth();

  /**
   * Vérifie si l'utilisateur actuel a une permission spécifique
   */
  const hasPermission = (
    module: PermissionModule,
    action: PermissionAction,
    resourceUserId?: string
  ): boolean => {
    if (!user) return false;

    // Vérifier si l'utilisateur a un rôle assigné
    if (user.role === 'PENDING_ROLE' && !user.isAdmin) {
      return false;
    }

    // Admin a tous les droits
    if (user.isAdmin || user.role === 'ADMIN') {
      return true;
    }

    // Vérifier les permissions du rôle
    const rolePermissions = ROLE_PERMISSIONS[user.role as UserRole];
    if (!rolePermissions) {
      return false;
    }

    // Trouver la permission correspondante
    const permission = rolePermissions.find(
      p => p.module === module && p.action === action
    );

    if (!permission) {
      return false;
    }

    // Vérifier si la permission est limitée aux propres enregistrements
    if (permission.ownRecordsOnly && resourceUserId && resourceUserId !== user.id) {
      return false;
    }

    return true;
  };

  /**
   * Vérifie si l'utilisateur peut accéder à un module complet
   */
  const canAccessModule = (module: PermissionModule): boolean => {
    if (!user) return false;

    if (user.isAdmin || user.role === 'ADMIN') {
      return true;
    }

    const rolePermissions = ROLE_PERMISSIONS[user.role as UserRole];
    return rolePermissions?.some(p => p.module === module) || false;
  };

  /**
   * Obtient toutes les permissions de l'utilisateur
   */
  const getUserPermissions = (): Permission[] => {
    if (!user) return [];

    if (user.isAdmin || user.role === 'ADMIN') {
      return ROLE_PERMISSIONS.ADMIN;
    }

    return ROLE_PERMISSIONS[user.role as UserRole] || [];
  };

  /**
   * Vérifie si l'utilisateur peut voir un module dans la navigation
   */
  const canViewInNavigation = (module: PermissionModule): boolean => {
    return canAccessModule(module);
  };

  /**
   * Obtient le label du rôle en français/arabe
   */
  const getRoleLabel = (language: 'fr' | 'ar' = 'fr'): string => {
    if (!user) return '';

    const roleLabels = {
      PENDING_ROLE: { fr: 'En attente de rôle', ar: 'في انتظار الدور' },
      ADMIN: { fr: 'Administrateur', ar: 'مدير' },
      DIRECTEUR: { fr: 'Directeur', ar: 'مدير' },
      AGENT_ACCUEIL: { fr: 'Agent d\'Accueil', ar: 'عامل استقبال' },
      COORDINATEUR: { fr: 'Coordinateur', ar: 'منسق' },
      ASSISTANTE_SOCIALE: { fr: 'Assistante Sociale', ar: 'مساعدة اجتماعية' },
      TRAVAILLEUR_SOCIAL: { fr: 'Travailleur Social', ar: 'عامل اجتماعي' },
      CONSEILLER_JURIDIQUE: { fr: 'Conseiller Juridique', ar: 'مستشار قانوني' },
      RESPONSABLE_HEBERGEMENT: { fr: 'Responsable Hébergement', ar: 'مسؤول الإيواء' },
      RESPONSABLE_EDUCATION: { fr: 'Responsable Éducation', ar: 'مسؤول التعليم' },
      RESPONSABLE_ACTIVITES: { fr: 'Responsable Activités', ar: 'مسؤول الأنشطة' },
      COMPTABLE: { fr: 'Comptable', ar: 'محاسب' },
      GESTIONNAIRE_RESSOURCES: { fr: 'Gestionnaire Ressources', ar: 'مدير الموارد' },
      DOCUMENTALISTE: { fr: 'Documentaliste', ar: 'أمين الوثائق' },
      OBSERVATEUR: { fr: 'Observateur', ar: 'مراقب' },
    };

    return roleLabels[user.role as UserRole]?.[language] || user.role;
  };

  return {
    user,
    hasPermission,
    canAccessModule,
    canViewInNavigation,
    getUserPermissions,
    getRoleLabel,
    isAdmin: user?.isAdmin || user?.role === 'ADMIN',
    isAuthenticated: !!user,
  };
}

/**
 * Hook pour protéger des composants selon les permissions
 */
export function useRequirePermission(
  module: PermissionModule,
  action: PermissionAction,
  resourceUserId?: string
) {
  const { hasPermission } = usePermissions();
  
  const canAccess = hasPermission(module, action, resourceUserId);
  
  return {
    canAccess,
    hasPermission: canAccess,
  };
}
