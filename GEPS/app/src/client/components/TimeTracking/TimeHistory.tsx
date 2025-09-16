import React, { useState, useMemo } from 'react';
import { Clock, Calendar, User, FileText, Filter, Download } from 'lucide-react';
import { useQuery } from 'wasp/client/operations';
import { getTimeSessionHistory } from 'wasp/client/operations';
import { formatDuration } from '../../hooks/useTimeTracking';
import { Button, Card, Badge, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui';

interface TimeHistoryProps {
  beneficiaryId?: string;
  userId?: string;
  showFilters?: boolean;
  defaultLimit?: number;
  className?: string;
}

export function TimeHistory({
  beneficiaryId,
  userId,
  showFilters = true,
  defaultLimit = 50,
  className = ''
}: TimeHistoryProps) {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    limit: defaultLimit
  });

  const { 
    data: sessions, 
    isLoading, 
    error,
    refetch 
  } = useQuery(
    getTimeSessionHistory,
    {
      beneficiaryId,
      userId,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      limit: filters.limit
    }
  );

  const statsComputed = useMemo(() => {
    if (!sessions) return null;

    const completedSessions = sessions.filter(s => !s.isActive && s.durationMinutes);
    const totalTime = completedSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    const avgTime = completedSessions.length > 0 ? Math.round(totalTime / completedSessions.length) : 0;

    return {
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      activeSessions: sessions.filter(s => s.isActive).length,
      totalTime,
      avgTime
    };
  }, [sessions]);

  const exportToCSV = () => {
    if (!sessions) return;

    const headers = ['Date', 'Agent', 'Bénéficiaire', 'Type d\'activité', 'Durée (min)', 'Notes', 'Statut'];
    const rows = sessions.map(session => [
      new Date(session.createdAt).toLocaleDateString(),
      'Agent', // Nous afficherons l'ID utilisateur plus tard
      'Bénéficiaire', // Nous afficherons l'ID bénéficiaire plus tard  
      session.activityType,
      session.durationMinutes || 'En cours',
      session.notes || '',
      session.isActive ? 'En cours' : 'Terminé'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell)}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historique-temps-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card className="p-8">
          <div className="text-center text-gray-500">
            Chargement de l'historique...
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card className="p-8">
          <div className="text-center text-red-500">
            Erreur lors du chargement de l'historique
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec statistiques */}
      {statsComputed && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Historique des temps de travail
            </h2>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Clock className="w-4 h-4" />
                <span>Actualiser</span>
              </Button>
              
              {sessions && sessions.length > 0 && (
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter CSV</span>
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {statsComputed.totalSessions}
              </div>
              <div className="text-xs text-gray-600">Sessions totales</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statsComputed.completedSessions}
              </div>
              <div className="text-xs text-gray-600">Terminées</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {statsComputed.activeSessions}
              </div>
              <div className="text-xs text-gray-600">En cours</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatDuration(statsComputed.totalTime)}
              </div>
              <div className="text-xs text-gray-600">Temps total</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {formatDuration(statsComputed.avgTime)}
              </div>
              <div className="text-xs text-gray-600">Durée moyenne</div>
            </div>
          </div>
        </Card>
      )}

      {/* Filtres */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Filtres</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Limite
              </label>
              <Select
                value={filters.limit.toString()}
                onValueChange={(value) => setFilters(prev => ({ ...prev, limit: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 sessions</SelectItem>
                  <SelectItem value="50">50 sessions</SelectItem>
                  <SelectItem value="100">100 sessions</SelectItem>
                  <SelectItem value="200">200 sessions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={() => setFilters({ startDate: '', endDate: '', limit: defaultLimit })}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Liste des sessions */}
      <Card className="overflow-hidden">
        {sessions && sessions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {sessions.map((session) => (
              <div key={session.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                        <span className="text-gray-400">•</span>
                        <span>{new Date(session.startTime).toLocaleTimeString()}</span>
                        {session.endTime && (
                          <>
                            <span className="text-gray-400">→</span>
                            <span>{new Date(session.endTime).toLocaleTimeString()}</span>
                          </>
                        )}
                      </div>
                      
                      <Badge
                        variant={session.isActive ? "default" : "secondary"}
                        className={session.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {session.isActive ? "En cours" : "Terminé"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          Agent #{session.userId.slice(-6)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          Bénéficiaire #{session.beneficiaryId.slice(-6)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {session.activityType}
                        </Badge>
                      </div>
                    </div>
                    
                    {session.notes && (
                      <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Notes:</strong> {session.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-lg font-semibold text-gray-900">
                      {session.durationMinutes 
                        ? formatDuration(session.durationMinutes)
                        : session.isActive 
                          ? "En cours..."
                          : "N/A"
                      }
                    </div>
                    {session.isActive && (
                      <div className="text-xs text-green-600">
                        Session active
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune session trouvée</p>
            <p className="text-sm">Les sessions apparaîtront ici une fois démarrées</p>
          </div>
        )}
      </Card>
    </div>
  );
}
