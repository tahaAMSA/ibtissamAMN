import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getAllUsers, approveUser, rejectUser } from 'wasp/client/operations';
import { usePermissions } from '../client/hooks/usePermissions';
import { ProtectedRoute } from '../client/components/ProtectedComponent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../client/components/ui/card';
import { Button } from '../client/components/ui/button';
import { Badge } from '../client/components/ui/badge';
import { Input } from '../client/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../client/components/ui/select';
import { 
  Users, 
  Shield, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  Settings
} from 'lucide-react';
import { UserRole } from '@prisma/client';

export default function AdminPage() {
  const { getRoleLabel } = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [showInactive, setShowInactive] = useState(false);

  // Fonction utilitaire pour obtenir le label d'un rôle spécifique
  const getUserRoleLabel = (role: string, language: 'fr' | 'ar' = 'fr'): string => {
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

    return roleLabels[role as keyof typeof roleLabels]?.[language] || role;
  };

  // Récupérer tous les utilisateurs
  const { data: users, isLoading, error } = useQuery(getAllUsers);
  const allUsers = users || [];

  // Filtrer les utilisateurs
  const filteredUsers = allUsers.filter((user: any) => {
    const matchesSearch = !searchTerm || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
    const matchesActive = showInactive || user.isActive;

    return matchesSearch && matchesRole && matchesActive;
  });

  const getRoleBadgeColor = (role: UserRole | string) => {
    const colors: Record<string, string> = {
      'PENDING_ROLE': 'bg-gray-100 text-gray-600',
      'ADMIN': 'bg-red-100 text-red-800',
      'DIRECTEUR': 'bg-purple-100 text-purple-800',
      'AGENT_ACCUEIL': 'bg-blue-100 text-blue-800',
      'COORDINATEUR': 'bg-indigo-100 text-indigo-800',
      'ASSISTANTE_SOCIALE': 'bg-green-100 text-green-800',
      'TRAVAILLEUR_SOCIAL': 'bg-emerald-100 text-emerald-800',
      'CONSEILLER_JURIDIQUE': 'bg-amber-100 text-amber-800',
      'RESPONSABLE_HEBERGEMENT': 'bg-orange-100 text-orange-800',
      'RESPONSABLE_EDUCATION': 'bg-cyan-100 text-cyan-800',
      'RESPONSABLE_ACTIVITES': 'bg-teal-100 text-teal-800',
      'COMPTABLE': 'bg-yellow-100 text-yellow-800',
      'GESTIONNAIRE_RESSOURCES': 'bg-lime-100 text-lime-800',
      'DOCUMENTALISTE': 'bg-violet-100 text-violet-800',
      'OBSERVATEUR': 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR');
  };

  // Fonction pour approuver un utilisateur
  const handleApproveUser = async (userId: string, role: string) => {
    try {
      await approveUser({ userId, role });
      // Rafraîchir la liste
      window.location.reload(); // TODO: Optimiser avec invalidateQuery
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      alert('Erreur lors de l\'approbation de l\'utilisateur');
    }
  };

  // Fonction pour rejeter un utilisateur
  const handleRejectUser = async (userId: string, reason?: string) => {
    try {
      await rejectUser({ userId, reason });
      // Rafraîchir la liste
      window.location.reload(); // TODO: Optimiser avec invalidateQuery
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      alert('Erreur lors du rejet de l\'utilisateur');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return <Badge className="bg-orange-100 text-orange-800">En attente</Badge>;
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      case 'SUSPENDED':
        return <Badge className="bg-gray-100 text-gray-800">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Rôles disponibles pour l'assignation (exclut PENDING_ROLE)
  const assignableRoles = [
    'ADMIN', 'DIRECTEUR', 'AGENT_ACCUEIL', 'COORDINATEUR',
    'ASSISTANTE_SOCIALE', 'TRAVAILLEUR_SOCIAL', 'CONSEILLER_JURIDIQUE',
    'RESPONSABLE_HEBERGEMENT', 'RESPONSABLE_EDUCATION', 'RESPONSABLE_ACTIVITES',
    'COMPTABLE', 'GESTIONNAIRE_RESSOURCES', 'DOCUMENTALISTE', 'OBSERVATEUR'
  ];

  // Tous les rôles pour le filtrage (inclut PENDING_ROLE)
  const allRoles = [
    'PENDING_ROLE', ...assignableRoles
  ];

  if (isLoading) {
    return (
      <ProtectedRoute module="USERS">
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des utilisateurs...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute module="USERS">
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erreur lors du chargement des utilisateurs</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute module="USERS">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  Administration
                </h1>
                <p className="text-gray-600 mt-2">
                  Gestion des utilisateurs, rôles et permissions
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/admin/roles'}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Gestion des Rôles
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel utilisateur
                </Button>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                    <p className="text-3xl font-bold text-gray-900">{allUsers.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">En Attente</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {allUsers.filter((u: any) => u.status === 'PENDING_APPROVAL').length}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approuvés</p>
                    <p className="text-3xl font-bold text-green-600">
                      {allUsers.filter((u: any) => u.status === 'APPROVED').length}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Administrateurs</p>
                    <p className="text-3xl font-bold text-red-600">
                      {allUsers.filter((u: any) => u.isAdmin).length}
                    </p>
                  </div>
                  <Settings className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtres de recherche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par nom ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrer par rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tous les rôles</SelectItem>
                    {allRoles.map(role => (
                      <SelectItem key={role} value={role}>
                        {(() => {
                          const roleLabels = {
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
                            OBSERVATEUR: 'Observateur',
                          };
                          return roleLabels[role as keyof typeof roleLabels] || role;
                        })()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={showInactive ? "default" : "outline"}
                  onClick={() => setShowInactive(!showInactive)}
                  className="w-full md:w-auto"
                >
                  {showInactive ? 'Masquer inactifs' : 'Voir inactifs'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des utilisateurs */}
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Gérez les comptes utilisateurs et leurs permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-semibold">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          {user.isAdmin && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              Admin
                            </Badge>
                          )}
                          {!user.isActive && (
                            <Badge variant="outline" className="text-xs">
                              Inactif
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {getUserRoleLabel(user.role, 'fr')}
                          </Badge>
                          {getStatusBadge(user.status)}
                          <span className="text-xs text-gray-500">
                            Créé le: {formatDate(user.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {user.status === 'PENDING_APPROVAL' && (
                        <>
                          <Select onValueChange={(role) => handleApproveUser(user.id, role)}>
                            <SelectTrigger className="w-auto">
                              <SelectValue placeholder="Approuver comme..." />
                            </SelectTrigger>
                            <SelectContent>
                              {assignableRoles.map(role => (
                                <SelectItem key={role} value={role}>
                                  {(() => {
                                    const roleLabels = {
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
                                      OBSERVATEUR: 'Observateur',
                                    };
                                    return roleLabels[role as keyof typeof roleLabels] || role;
                                  })()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              const reason = prompt('Raison du rejet (optionnel):');
                              handleRejectUser(user.id, reason || undefined);
                            }}
                          >
                            Rejeter
                          </Button>
                        </>
                      )}
                      {user.status === 'APPROVED' && (
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun utilisateur trouvé</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
