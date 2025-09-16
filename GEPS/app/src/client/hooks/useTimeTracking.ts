import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from 'wasp/client/auth';
import { useQuery } from 'wasp/client/operations';
import {
  startTimeSession,
  endTimeSession,
  getActiveTimeSession,
  getBeneficiaryTimeStats
} from 'wasp/client/operations';
import type { TimeSession } from 'wasp/entities';

interface TimeTrackingState {
  isTracking: boolean;
  startTime: Date | null;
  elapsedSeconds: number; // en secondes pour plus de précision
  error: string | null;
}

interface TimeTrackingActions {
  startTracking: () => void;
  stopTracking: () => void;
  toggleTracking: () => void;
  formatElapsedTime: () => string;
  resetError: () => void;
  resetState: () => void;
}

export interface UseTimeTrackingReturn extends TimeTrackingState, TimeTrackingActions {}

/**
 * Hook pour gérer le tracking automatique du temps passé sur un dossier de bénéficiaire
 * 
 * @param beneficiaryId - ID du bénéficiaire
 * @param autoStart - Démarrer automatiquement le tracking au montage du composant (défaut: true)
 * @param autoStop - Arrêter automatiquement le tracking au démontage du composant (défaut: true)
 */
export function useTimeTracking(
  beneficiaryId: string,
  autoStart: boolean = true,
  autoStop: boolean = true
): UseTimeTrackingReturn {
  const { data: user } = useAuth();
  const [state, setState] = useState<TimeTrackingState>({
    isTracking: false,
    startTime: null,
    elapsedSeconds: 0,
    error: null
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  // Plus de sessions côté serveur - chronométrage local uniquement

  // Démarrer le compteur de temps (en secondes)
  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const startTime = new Date();
    setState(prev => ({
      ...prev,
      startTime,
      elapsedSeconds: 0
    }));
    
    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.startTime) {
          const now = new Date();
          const elapsed = Math.floor((now.getTime() - prev.startTime.getTime()) / 1000);
          return { ...prev, elapsedSeconds: elapsed };
        }
        return prev;
      });
    }, 1000); // Mettre à jour chaque seconde
  }, []);

  // Arrêter le compteur de temps
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Démarrer le tracking (simple, sans serveur)
  const startTracking = useCallback(() => {
    if (state.isTracking) {
      console.log('Chronométrage déjà en cours');
      return;
    }

    setState(prev => ({
      ...prev,
      isTracking: true,
      error: null
    }));
    
    startTimer();
  }, [startTimer]);

  // Arrêter le tracking (simple)
  const stopTracking = useCallback(() => {
    if (!state.isTracking) {
      console.log('Aucun chronométrage en cours');
      return;
    }

    setState(prev => ({
      ...prev,
      isTracking: false,
      startTime: null,
      elapsedSeconds: 0,
      error: null
    }));
    
    stopTimer();
  }, [stopTimer]);

  // Basculer le tracking (démarrer si arrêté, arrêter si en cours)
  const toggleTracking = useCallback(() => {
    if (state.isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  }, [state.isTracking, startTracking, stopTracking]);

  // Formater le temps écoulé en mm:ss
  const formatElapsedTime = useCallback((): string => {
    const minutes = Math.floor(state.elapsedSeconds / 60);
    const seconds = state.elapsedSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [state.elapsedSeconds]);

  // Réinitialiser l'erreur
  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Réinitialiser complètement le chronométrage
  const resetState = useCallback(() => {
    setState({
      isTracking: false,
      startTime: null,
      elapsedSeconds: 0,
      error: null
    });
    stopTimer();
  }, [stopTimer]);

  // Nettoyage au démontage du composant
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);



  return {
    ...state,
    startTracking,
    stopTracking,
    toggleTracking,
    formatElapsedTime,
    resetError,
    resetState
  };
}

/**
 * Hook simplifié pour récupérer les statistiques de temps d'un bénéficiaire
 */
export function useBeneficiaryTimeStats(beneficiaryId: string) {
  const { data: user } = useAuth();
  
  const { 
    data: timeStats, 
    isLoading, 
    error,
    refetch 
  } = useQuery(
    getBeneficiaryTimeStats,
    { beneficiaryId },
    { enabled: !!user && !!beneficiaryId }
  );

  return {
    timeStats,
    isLoading,
    error,
    refetch
  };
}

/**
 * Utilitaire pour formater la durée en format lisible
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  let result = `${days}j`;
  if (remainingHours > 0) {
    result += ` ${remainingHours}h`;
  }
  if (remainingMinutes > 0) {
    result += ` ${remainingMinutes}min`;
  }
  
  return result;
}
