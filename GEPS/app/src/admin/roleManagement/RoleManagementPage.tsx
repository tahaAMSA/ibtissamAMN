import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  addPermission,
  removePermission
} from 'wasp/client/operations';
import { Role, Permission, User } from 'wasp/entities';
import { PermissionModule, PermissionAction } from '../../server/permissions';
import { Card, CardContent, CardHeader, CardTitle } from '../../client/components/ui/card';
import { Button } from '../../client/components/ui/button';
import { Badge } from '../../client/components/ui/badge';
import { Input } from '../../client/components/ui/input';
import { Plus, Edit, Trash2, Shield, Users, Settings } from 'lucide-react';
import { ProtectedRoute } from '../../client/components/ProtectedComponent';

// Type étendu pour les rôles avec relations
interface RoleWithRelations extends Role {
  permissions?: Permission[];
  users?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>[];
}

// Constantes pour les modules et actions disponibles
const AVAILABLE_MODULES: PermissionModule[] = [
  'BENEFICIARIES', 'DOCUMENTS', 'INTERVENTIONS', 'ACCOMMODATION',
  'MEALS', 'RESOURCES', 'EDUCATION', 'ACTIVITIES', 'TRAINING',
  'PROJECTS', 'BUDGET', 'USERS', 'SYSTEM'
];

const AVAILABLE_ACTIONS: PermissionAction[] = [
  'CREATE', 'READ', 'UPDATE', 'DELETE', 'ASSIGN', 'ORIENT'
];

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

export default function RoleManagementPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleWithRelations | null>(null);
  const [showPermissionForm, setShowPermissionForm] = useState<string | null>(null);
  
  const [roleForm, setRoleForm] = useState({ name: '', description: '' });
  const [permissionForm, setPermissionForm] = useState({
    module: '' as PermissionModule,
    action: '' as PermissionAction,
    ownRecordsOnly: false
  });

  // Récupérer les rôles
  const { data: roles, isLoading, error } = useQuery(getRoles);
  const rolesWithRelations = roles as RoleWithRelations[] | undefined;

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.name.trim()) return;

    try {
      await createRole({
        name: roleForm.name.trim(),
        description: roleForm.description.trim() || undefined
      });
      setShowCreateForm(false);
      setRoleForm({ name: '', description: '' });
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la création du rôle:', error);
      alert('Erreur lors de la création du rôle');
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole || !roleForm.name.trim()) return;

    try {
      await updateRole({
        id: editingRole.id,
        name: roleForm.name.trim(),
        description: roleForm.description.trim() || undefined
      });
      setEditingRole(null);
      setRoleForm({ name: '', description: '' });
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      alert('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) return;

    try {
      await deleteRole({ id: roleId });
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la suppression du rôle:', error);
      alert('Erreur lors de la suppression du rôle');
    }
  };

  const handleAddPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPermissionForm || !permissionForm.module || !permissionForm.action) return;

    try {
      await addPermission({
        roleId: showPermissionForm,
        module: permissionForm.module,
        action: permissionForm.action,
        ownRecordsOnly: permissionForm.ownRecordsOnly
      });
      setShowPermissionForm(null);
      setPermissionForm({ module: '' as PermissionModule, action: '' as PermissionAction, ownRecordsOnly: false });
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la permission:', error);
      alert('Erreur lors de l\'ajout de la permission');
    }
  };

  const handleRemovePermission = async (permissionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette permission ?')) return;

    try {
      await removePermission({ id: permissionId });
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la suppression de la permission:', error);
      alert('Erreur lors de la suppression de la permission');
    }
  };

  const startEdit = (role: RoleWithRelations) => {
    setEditingRole(role);
    setRoleForm({ name: role.name, description: role.description || '' });
  };

  if (isLoading) {
    return (
      <ProtectedRoute module="SYSTEM">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des rôles...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute module="SYSTEM">
        <div className="text-center text-red-600 p-8">
          <p>Erreur lors du chargement des rôles: {error.message}</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute module="SYSTEM">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Rôles et Permissions</h1>
            <p className="text-gray-600 mt-2">Administrez les rôles et leurs permissions associées</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Rôle
          </Button>
        </div>

        {/* Formulaire de création/modification */}
        {(showCreateForm || editingRole) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingRole ? 'Modifier le rôle' : 'Créer un nouveau rôle'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingRole ? handleUpdateRole : handleCreateRole} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du rôle *</label>
                  <Input
                    value={roleForm.name}
                    onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Responsable Formation"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={roleForm.description}
                    onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description du rôle et de ses responsabilités"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={!roleForm.name.trim()}>
                    {editingRole ? 'Sauvegarder' : 'Créer'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingRole(null);
                      setRoleForm({ name: '', description: '' });
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Liste des rôles */}
        <div className="grid gap-6">
          {rolesWithRelations && rolesWithRelations.length > 0 ? (
            rolesWithRelations.map((role) => (
              <Card key={role.id} className="w-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        {role.name}
                        {!role.isActive && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                            Inactif
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">{role.description || 'Aucune description'}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPermissionForm(role.id)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Permission
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(role)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Statistiques */}
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {role.users?.length || 0} utilisateur(s)
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        {role.permissions?.length || 0} permission(s)
                      </div>
                    </div>

                    {/* Permissions */}
                    {role.permissions && role.permissions.length > 0 ? (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Permissions accordées:</h4>
                        <div className="space-y-2">
                          {role.permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {MODULE_LABELS[permission.module as PermissionModule]}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                  {ACTION_LABELS[permission.action as PermissionAction]}
                                </span>
                                {permission.ownRecordsOnly && (
                                  <Badge variant="secondary" className="text-xs">
                                    Propres enregistrements uniquement
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePermission(permission.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">Aucune permission accordée</p>
                    )}

                    {/* Utilisateurs assignés */}
                    {role.users && role.users.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Utilisateurs assignés:</h4>
                        <div className="flex flex-wrap gap-2">
                          {role.users.map((user) => (
                            <Badge key={user.id} variant="outline">
                              {user.firstName} {user.lastName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Formulaire d'ajout de permission */}
                    {showPermissionForm === role.id && (
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Ajouter une permission</h4>
                        <form onSubmit={handleAddPermission} className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                              <select 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={permissionForm.module} 
                                onChange={(e) => setPermissionForm(prev => ({ ...prev, module: e.target.value as PermissionModule }))}
                                required
                              >
                                <option value="">Sélectionnez un module</option>
                                {AVAILABLE_MODULES.map((module) => (
                                  <option key={module} value={module}>
                                    {MODULE_LABELS[module]}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                              <select 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={permissionForm.action} 
                                onChange={(e) => setPermissionForm(prev => ({ ...prev, action: e.target.value as PermissionAction }))}
                                required
                              >
                                <option value="">Sélectionnez une action</option>
                                {AVAILABLE_ACTIONS.map((action) => (
                                  <option key={action} value={action}>
                                    {ACTION_LABELS[action]}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="own-records-only"
                              checked={permissionForm.ownRecordsOnly}
                              onChange={(e) => setPermissionForm(prev => ({ ...prev, ownRecordsOnly: e.target.checked }))}
                            />
                            <label htmlFor="own-records-only" className="text-sm">
                              Limiter aux propres enregistrements uniquement
                            </label>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              type="submit" 
                              size="sm"
                              disabled={!permissionForm.module || !permissionForm.action}
                            >
                              Ajouter
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setShowPermissionForm(null);
                                setPermissionForm({ module: '' as PermissionModule, action: '' as PermissionAction, ownRecordsOnly: false });
                              }}
                            >
                              Annuler
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rôle configuré</h3>
                <p className="text-gray-600 mb-4">Commencez par créer votre premier rôle personnalisé</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un rôle
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}