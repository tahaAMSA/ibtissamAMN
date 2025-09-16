import React, { useEffect, useState } from 'react';
import { X, User, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useNotifications } from '../hooks/useNotifications';
import { markNotificationAsRead } from 'wasp/client/operations';
import { cn } from '../cn';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: Date;
}

const NotificationToast: React.FC = () => {
  const { notifications, refetch } = useNotifications();
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);

  // Détecter les nouvelles notifications
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const latestNotification = notifications[0];
      
      // Si c'est une nouvelle notification (différente de la dernière affichée)
      if (latestNotification.id !== lastNotificationId) {
        const newToast: ToastNotification = {
          id: latestNotification.id,
          title: latestNotification.title,
          message: latestNotification.message,
          type: latestNotification.type,
          timestamp: new Date(latestNotification.createdAt)
        };

        setToasts(prev => [newToast, ...prev.slice(0, 2)]); // Garder max 3 toasts
        setLastNotificationId(latestNotification.id);

        // Auto-remove après 10 secondes
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== newToast.id));
        }, 10000);
      }
    }
  }, [notifications, lastNotificationId]);

  const handleDismiss = async (toastId: string) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
    
    try {
      await markNotificationAsRead({ notificationId: toastId });
      refetch();
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'BENEFICIARY_ARRIVAL':
        return <User className="h-5 w-5 text-blue-600" />;
      case 'ORIENTATION_REQUEST':
        return <User className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getToastColor = (type: string) => {
    switch (type) {
      case 'BENEFICIARY_ARRIVAL':
        return 'border-l-blue-500 bg-blue-50';
      case 'ORIENTATION_REQUEST':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <Card
          key={toast.id}
          className={cn(
            "w-96 shadow-lg border-l-4 animate-in slide-in-from-right-full duration-300",
            getToastColor(toast.type),
            index > 0 && "opacity-75"
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {getToastIcon(toast.type)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {toast.title}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleDismiss(toast.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-700 mb-2">
                  {toast.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {toast.type === 'BENEFICIARY_ARRIVAL' ? 'Nouvelle arrivée' : 'Orientation'}
                  </Badge>
                  
                  <span className="text-xs text-gray-500">
                    {new Intl.DateTimeFormat('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(toast.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationToast;
