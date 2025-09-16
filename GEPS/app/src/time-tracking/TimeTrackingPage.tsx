import React, { useState } from 'react';
import { useAuth } from 'wasp/client/auth';
import { useQuery } from 'wasp/client/operations';
import { getAllBeneficiaries } from 'wasp/client/operations';
import { Clock, TrendingUp, Users, Calendar, Filter, Download, Eye } from 'lucide-react';
import { TimeHistory } from '../client/components/TimeTracking';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  Input, 
  Badge 
} from '../client/components/ui';
import { formatDuration } from '../client/hooks/useTimeTracking';

export default function TimeTrackingPage() {
  const { data: user } = useAuth();
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Récupérer la liste des bénéficiaires pour le filtre
  const { data: beneficiaries } = useQuery(getAllBeneficiaries, {});

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Accès requis
          </h2>
          <p className="text-gray-600">
            Veuillez vous connecter pour accéder au suivi du temps.
          </p>
        </div>
      </div>
    );
  }

  const resetFilters = () => {
    setSelectedBeneficiary('');
    setSelectedUser('');
    setDateRange({ startDate: '', endDate: '' });
  };

  const isAdmin = user.role === 'ADMIN' || user.role === 'DIRECTEUR';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Clock className="w-8 h-8 mr-3 text-blue-600" />
                Suivi du Temps de Travail
              </h1>
              <p className="text-gray-600 mt-2">
                Historique détaillé du temps passé sur les dossiers des bénéficiaires
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Résumé rapide */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mes Sessions</p>
                  <p className="text-2xl font-bold text-blue-600">-</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mon Temps Total</p>
                  <p className="text-2xl font-bold text-green-600">-</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bénéficiaires Suivis</p>
                  <p className="text-2xl font-bold text-purple-600">-</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cette Semaine</p>
                  <p className="text-2xl font-bold text-orange-600">-</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtres Avancés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Filtre par bénéficiaire */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bénéficiaire
                  </label>
                  <Select value={selectedBeneficiary} onValueChange={setSelectedBeneficiary}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les bénéficiaires" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les bénéficiaires</SelectItem>
                      {beneficiaries?.map((beneficiary) => (
                        <SelectItem key={beneficiary.id} value={beneficiary.id}>
                          {beneficiary.firstName} {beneficiary.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtre par utilisateur (admin seulement) */}
                {isAdmin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agent
                    </label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les agents" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous les agents</SelectItem>
                        <SelectItem value={user.id}>Moi-même</SelectItem>
                        {/* Note: Ici on pourrait ajouter une requête pour récupérer tous les utilisateurs */}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Filtre par date de début */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <Input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                {/* Filtre par date de fin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <Input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button onClick={resetFilters} variant="outline" size="sm">
                  Réinitialiser
                </Button>
                <Button onClick={() => setShowFilters(false)} size="sm">
                  Appliquer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message d'information */}
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">
                  À propos du suivi du temps
                </h3>
                <p className="text-sm text-blue-800">
                  Le système de suivi du temps enregistre automatiquement le temps passé par chaque agent 
                  sur les dossiers des bénéficiaires. Les sessions démarrent automatiquement lors de 
                  l'accès à un dossier et se terminent lors de la fermeture ou du changement de dossier.
                  {!isAdmin && (
                    <span className="block mt-1">
                      <strong>Note:</strong> Vous ne pouvez voir que vos propres sessions de travail.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Historique des sessions */}
        <TimeHistory
          beneficiaryId={selectedBeneficiary || undefined}
          userId={isAdmin ? (selectedUser || undefined) : user.id}
          showFilters={false} // On gère les filtres nous-mêmes
          defaultLimit={100}
        />
      </div>
    </div>
  );
}
