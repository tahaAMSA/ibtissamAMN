import { useQuery } from 'wasp/client/operations';
import { getUnreadNotifications } from 'wasp/client/operations';
import { usePermissions } from './usePermissions';

export function useNotifications() {
  const { hasPermission } = usePermissions();
  
  // Récupérer les notifications non lues
  const { 
    data: notifications, 
    isLoading, 
    error, 
    refetch 
  } = useQuery(
    getUnreadNotifications, 
    undefined, 
    {
      enabled: hasPermission('NOTIFICATIONS', 'READ'),
      refetchInterval: 30000, // Refetch toutes les 30 secondes
      refetchOnWindowFocus: true
    }
  );

  const unreadCount = notifications?.length || 0;
  const hasUnreadNotifications = unreadCount > 0;

  // Notifications d'arrivée de bénéficiaires
  const arrivalNotifications = notifications?.filter(n => n.type === 'BENEFICIARY_ARRIVAL') || [];
  
  // Notifications d'orientation
  const orientationNotifications = notifications?.filter(n => n.type === 'ORIENTATION_REQUEST') || [];

  return {
    notifications: notifications || [],
    unreadCount,
    hasUnreadNotifications,
    arrivalNotifications,
    orientationNotifications,
    isLoading,
    error,
    refetch
  };
}
