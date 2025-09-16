import React from 'react';
import { Play, Pause, Clock } from 'lucide-react';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { Button, Card, Alert, AlertDescription } from '../ui';

interface TimeTrackerProps {
  beneficiaryId: string;
  beneficiaryName?: string;
  autoStart?: boolean;
  autoStop?: boolean;
  showStats?: boolean;
  className?: string;
}

export function TimeTracker({
  beneficiaryId,
  beneficiaryName = 'Bénéficiaire',
  autoStart = false,
  autoStop = false,
  showStats = false, // Désactivé par défaut maintenant
  className = ''
}: TimeTrackerProps) {
  const {
    isTracking,
    elapsedSeconds,
    error,
    startTracking,
    stopTracking,
    toggleTracking,
    formatElapsedTime,
    resetError,
    resetState
  } = useTimeTracking(beneficiaryId, autoStart, autoStop);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Erreur */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1">{error}</div>
            <Button variant="ghost" size="sm" onClick={resetError}>
              ×
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Chronométrage simple */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${isTracking ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Temps sur le dossier
              </h3>
              <p className="text-sm text-gray-600">
                {beneficiaryName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-3xl font-mono font-bold text-blue-600">
                {formatElapsedTime()}
              </div>
              <div className="text-xs text-gray-500">
                {isTracking ? 'En cours...' : 'Arrêté'}
              </div>
            </div>
            
            <Button
              onClick={toggleTracking}
              variant={isTracking ? "destructive" : "default"}
              className="flex items-center space-x-2"
            >
              {isTracking ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Arrêter</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Démarrer</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
