import { UserRole } from '@prisma/client';
import type { User } from 'wasp/entities';

// Types pour les permissions
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
  | 'SYSTEM';

export type PermissionAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'ASSIGN' | 'ORIENT';

// Alias pour compatibilité avec les importations
export type PermModuleType = PermissionModule;
export type PermActionType = PermissionAction;

export interface Permission {
  module: PermissionModule;
  action: PermissionAction;
  ownRecordsOnly?: boolean;
}

// Matrice des permissions par rôle
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
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
    // Vue d'ensemble, rapports, validations importantes
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'BENEFICIARIES', action: 'UPDATE' },
    { module: 'BENEFICIARIES', action: 'ORIENT' },
    { module: 'BENEFICIARIES', action: 'ASSIGN' },
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
  ],

  AGENT_ACCUEIL: [
    // Premier contact, saisie de base
    { module: 'BENEFICIARIES', action: 'CREATE' },
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'DOCUMENTS', action: 'CREATE' },
    { module: 'DOCUMENTS', action: 'READ' },
    { module: 'ACCOMMODATION', action: 'CREATE' },
    { module: 'ACCOMMODATION', action: 'READ' },
    { module: 'MEALS', action: 'CREATE' },
    { module: 'MEALS', action: 'READ' },
    { module: 'ACTIVITIES', action: 'CREATE' },
    { module: 'ACTIVITIES', action: 'READ' },
    { module: 'RESOURCES', action: 'CREATE' },
    { module: 'RESOURCES', action: 'READ' },
  ],

  COORDINATEUR: [
    // Coordination entre services
    { module: 'BENEFICIARIES', action: 'CREATE' },
    { module: 'BENEFICIARIES', action: 'READ' },
    { module: 'BENEFICIARIES', action: 'UPDATE' },
    { module: 'BENEFICIARIES', action: 'ORIENT' },
    { module: 'BENEFICIARIES', action: 'ASSIGN' },
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
  ],

  ASSISTANTE_SOCIALE: [
    // Suivi social principal, accès complet aux dossiers
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
  ],

  TRAVAILLEUR_SOCIAL: [
    // Interventions sociales
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
    // Accompagnement juridique
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
    // Gestion hébergement et repas
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
    // Programmes éducatifs et formations
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
    // Activités et projets entrepreneuriaux
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
    // Gestion budget et finances
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
    // Inventaire et ressources
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
    // Gestion documentaire
    { module: 'DOCUMENTS', action: 'CREATE' },
    { module: 'DOCUMENTS', action: 'READ' },
    { module: 'DOCUMENTS', action: 'UPDATE' },
    { module: 'DOCUMENTS', action: 'DELETE' },
    { module: 'BENEFICIARIES', action: 'READ' },
  ],

  OBSERVATEUR: [
    // Lecture seule pour stagiaires/superviseurs
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
 * Vérifie si un utilisateur a une permission spécifique
 */
export function hasPermission(
  user: User,
  module: PermissionModule,
  action: PermissionAction,
  resourceUserId?: string
): boolean {
  // Vérifier d'abord si l'utilisateur est approuvé
  if (user.status !== 'APPROVED' && !user.isAdmin) {
    return false;
  }

  // Vérifier si l'utilisateur a un rôle assigné
  if (user.role === 'PENDING_ROLE' && !user.isAdmin) {
    return false;
  }

  // Admin a tous les droits
  if (user.isAdmin || user.role === 'ADMIN') {
    return true;
  }

  // Vérifier les permissions du rôle
  const rolePermissions = ROLE_PERMISSIONS[user.role];
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
}

/**
 * Vérifie si un utilisateur peut accéder à un module complet
 */
export function canAccessModule(user: User, module: PermissionModule): boolean {
  if (user.isAdmin || user.role === 'ADMIN') {
    return true;
  }

  const rolePermissions = ROLE_PERMISSIONS[user.role];
  return rolePermissions?.some(p => p.module === module) || false;
}

/**
 * Obtient toutes les permissions d'un utilisateur
 */
export function getUserPermissions(user: User): Permission[] {
  if (user.isAdmin || user.role === 'ADMIN') {
    return ROLE_PERMISSIONS.ADMIN;
  }

  return ROLE_PERMISSIONS[user.role] || [];
}

/**
 * Middleware de vérification des permissions
 */
export function requirePermission(
  module: PermissionModule,
  action: PermissionAction
) {
  return (user: User, resourceUserId?: string) => {
    if (!hasPermission(user, module, action, resourceUserId)) {
      throw new Error(`Permission refusée: ${action} sur ${module}`);
    }
  };
}

/**
 * Filtre les données selon les permissions de l'utilisateur
 */
export function filterByPermissions<T>(
  user: User,
  data: T[],
  module: PermissionModule
): T[] {
  if (user.isAdmin || user.role === 'ADMIN') {
    return data;
  }

  // Vérifier si l'utilisateur peut voir toutes les données du module
  if (hasPermission(user, module, 'READ')) {
    const permission = ROLE_PERMISSIONS[user.role]?.find(
      p => p.module === module && p.action === 'READ'
    );
    
    // Pour l'instant, on retourne toutes les données si l'utilisateur a la permission de lecture
    // TODO: Implémenter le filtrage par utilisateur pour les permissions spécifiques
    
    return data;
  }

  return [];
}
