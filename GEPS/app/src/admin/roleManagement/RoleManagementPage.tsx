import React from 'react';
import { ROLE_PERMISSIONS, PermissionModule, PermissionAction } from '../../server/permissions';
import { Card, CardContent, CardHeader, CardTitle } from '../../client/components/ui/card';
import { Badge } from '../../client/components/ui/badge';
import { Shield, Info } from 'lucide-react';
import { ProtectedRoute } from '../../client/components/ProtectedComponent';
import { UserRole } from '@prisma/client';

// Types pour l'affichage des rôles système
interface SystemRole {
  role: UserRole;
  label: string;
  description: string;
  permissions: {
    module: PermissionModule;
    action: PermissionAction;
    ownRecordsOnly?: boolean;
  }[];
}

// Labels pour l'affichage
const MODULE_LABELS: Record<PermissionModule, string> = {
  'BENEFICIARIES': 'Bénéficiaires', 'DOCUMENTS': 'Documents',
  'INTERVENTIONS': 'Interventions', 'ACCOMMODATION': 'Hébergement',
  'MEALS': 'Repas', 'RESOURCES': 'Ressources', 'EDUCATION': 'Éducation',
  'ACTIVITIES': 'Activités', 'TRAINING': 'Formation', 'PROJECTS': 'Projets',
  'BUDGET': 'Budget', 'USERS': 'Utilisateurs', 'SYSTEM': 'Système'
};

const ACTION_LABELS: Record<PermissionAction, string> = {
  'CREATE': 'Créer', 'READ': 'Lire', 'UPDATE': 'Modifier',
  'DELETE': 'Supprimer', 'ASSIGN': 'Assigner', 'ORIENT': 'Orienter'
};

// Descriptions des rôles système
const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  PENDING_ROLE: 'Utilisateur en attente d\'assignation de rôle',
  ADMIN: 'Accès complet à toutes les fonctionnalités du système',
  DIRECTEUR: 'Vue d\'ensemble, rapports et validations importantes',
  AGENT_ACCUEIL: 'Premier contact avec les bénéficiaires, saisie de base',
  COORDINATEUR: 'Coordination entre services et orientation des bénéficiaires',
  ASSISTANTE_SOCIALE: 'Suivi social principal, accès complet aux dossiers',
  TRAVAILLEUR_SOCIAL: 'Interventions sociales et accompagnement',
  CONSEILLER_JURIDIQUE: 'Accompagnement juridique des bénéficiaires',
  RESPONSABLE_HEBERGEMENT: 'Gestion de l\'hébergement et des repas',
  RESPONSABLE_EDUCATION: 'Programmes éducatifs et formations',
  RESPONSABLE_ACTIVITES: 'Activités et projets entrepreneuriaux',
  COMPTABLE: 'Gestion du budget et des finances',
  GESTIONNAIRE_RESSOURCES: 'Inventaire et gestion des ressources',
  DOCUMENTALISTE: 'Gestion documentaire et archives',
  OBSERVATEUR: 'Lecture seule pour stagiaires et superviseurs'
};

const ROLE_LABELS: Record<UserRole, string> = {
  PENDING_ROLE: 'En attente de rôle',
  ADMIN: 'Administrateur',
  DIRECTEUR: 'Directeur',
  AGENT_ACCUEIL: 'Agent d\'Accueil',
  COORDINATEUR: 'Coordinateur',
  ASSISTANTE_SOCIALE: 'Assistante Sociale',
  TRAVAILLEUR_SOCIAL: 'Travailleur Social',
  CONSEILLER_JURIDIQUE: 'Conseiller Juridique',
  RESPONSABLE_HEBERGEMENT: 'Responsable Hébergement',
  RESPONSABLE_EDUCATION: 'Responsable Éducation',
  RESPONSABLE_ACTIVITES: 'Responsable Activités',
  COMPTABLE: 'Comptable',
  GESTIONNAIRE_RESSOURCES: 'Gestionnaire Ressources',
  DOCUMENTALISTE: 'Documentaliste',
  OBSERVATEUR: 'Observateur'
};

export default function RoleManagementPage() {
  // Convertir les permissions du système en format d'affichage
  const systemRoles: SystemRole[] = Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
    role: role as UserRole,
    label: ROLE_LABELS[role as UserRole],
    description: ROLE_DESCRIPTIONS[role as UserRole],
    permissions: permissions
  }));

  return (
    <ProtectedRoute module="USERS">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Rôles et Permissions Système</h1>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-blue-800 font-medium">Information</p>
                <p className="text-blue-700 text-sm mt-1">
                  Cette page affiche les rôles système prédéfinis et leurs permissions. 
                  Ces rôles sont configurés dans le code et ne peuvent pas être modifiés via l'interface.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des rôles système */}
        <div className="grid gap-6">
          {systemRoles.map((roleData) => (
            <Card key={roleData.role} className="w-full">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-grow">
                    <CardTitle className="text-xl text-gray-900">
                      {roleData.label}
                      {roleData.role === 'PENDING_ROLE' && (
                        <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">
                          Temporaire
                        </Badge>
                      )}
                      {roleData.role === 'ADMIN' && (
                        <Badge variant="default" className="ml-2 bg-red-100 text-red-700">
                          Système
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-gray-600 mt-2">{roleData.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Statistiques */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      {roleData.permissions.length} permission(s)
                    </div>
                  </div>

                  {/* Permissions */}
                  {roleData.permissions.length > 0 ? (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Permissions accordées :</h4>
                      <div className="grid gap-2 max-h-64 overflow-y-auto">
                        {roleData.permissions.map((permission, index) => (
                          <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                            <Badge variant="outline" className="text-sm">
                              {MODULE_LABELS[permission.module]}
                            </Badge>
                            <span className="text-sm text-gray-700 font-medium">
                              {ACTION_LABELS[permission.action]}
                            </span>
                            {permission.ownRecordsOnly && (
                              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                                Propres enregistrements uniquement
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm italic">Aucune permission accordée</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}