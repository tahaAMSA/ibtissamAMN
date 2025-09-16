import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { 
  getAllNotifications, 
  getUnreadNotifications,
  markNotificationAsRead,
  orientBeneficiary
} from 'wasp/client/operations';
import { usePermissions } from '../client/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '../client/components/ui/card';
import { Button } from '../client/components/ui/button';
import { Badge } from '../client/components/ui/badge';
import { Alert, AlertDescription } from '../client/components/ui/alert';
import { 
  Bell, 
  BellRing, 
  User, 
  Clock, 
  ArrowRight,
  Eye,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../client/cn';

interface OrientationModalProps {
  notification: any;
  onClose: () => void;
  onSuccess: () => void;
}

const OrientationModal: React.FC<OrientationModalProps> = ({ notification, onClose, onSuccess }) => {
  const [selectedAssistante, setSelectedAssistante] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer la liste des assistantes sociales (temporaire - liste statique)
  const assistantesSociales = [
    { id: '1', firstName: 'Fatima', lastName: 'Benali' },
    { id: '2', firstName: 'Aicha', lastName: 'Mansouri' },
    { id: '3', firstName: 'Khadija', lastName: 'El Amrani' }
  ];
  const loadingAssistantes = false;

  const handleOrient = async () => {
    if (!selectedAssistante) {
      setError('Veuillez sélectionner une assistante sociale');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await orientBeneficiary({
        beneficiaryId: notification.beneficiaryId,
        assignedToId: selectedAssistante,
        reason: reason.trim() || undefined
      });

      // Marquer la notification comme lue
      await markNotificationAsRead({ notificationId: notification.id });

      onSuccess();
    } catch (err: any) {
      console.error('Erreur lors de l\'orientation:', err);
      setError(err.message || 'Erreur lors de l\'orientation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Orienter le bénéficiaire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <p className="text-sm text-gray-600 mb-4">
              Bénéficiaire: {notification.beneficiary?.firstName} {notification.beneficiary?.lastName}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Assistante sociale <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedAssistante}
              onChange={(e) => setSelectedAssistante(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loadingAssistantes}
            >
              <option value="">
                {loadingAssistantes ? 'Chargement...' : 'Sélectionner une assistante sociale'}
              </option>
              {assistantesSociales?.map(assistante => (
                <option key={assistante.id} value={assistante.id}>
                  {assistante.firstName} {assistante.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Raison de l'orientation (optionnel)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Commentaires ou instructions particulières..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleOrient}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Orientation...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Orienter
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const NotificationsPage: React.FC = () => {
  const { hasPermission } = usePermissions();
  const [showAll, setShowAll] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const { data: allNotifications, refetch: refetchAll } = useQuery(getAllNotifications);
  const { data: unreadNotifications, refetch: refetchUnread } = useQuery(getUnreadNotifications);

  const notifications = showAll ? allNotifications : unreadNotifications;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead({ notificationId });
      refetchAll();
      refetchUnread();
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BENEFICIARY_ARRIVAL':
        return <User className="h-4 w-4" />;
      case 'ORIENTATION_REQUEST':
        return <ArrowRight className="h-4 w-4" />;
      case 'FORM_COMPLETION':
        return <UserCheck className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'BENEFICIARY_ARRIVAL':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ORIENTATION_REQUEST':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'FORM_COMPLETION':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const canOrient = hasPermission('BENEFICIARIES', 'ORIENT');

  if (!hasPermission('NOTIFICATIONS', 'READ')) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous n'avez pas les permissions pour voir les notifications.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BellRing className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">
              {unreadNotifications?.length || 0} notification(s) non lue(s)
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={showAll ? "outline" : "default"}
            onClick={() => setShowAll(false)}
            className="relative"
          >
            <Bell className="h-4 w-4 mr-2" />
            Non lues
            {unreadNotifications && unreadNotifications.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5"
              >
                {unreadNotifications.length}
              </Badge>
            )}
          </Button>
          <Button
            variant={showAll ? "default" : "outline"}
            onClick={() => setShowAll(true)}
          >
            Toutes
          </Button>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="space-y-3">
        {!notifications || notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune notification
              </h3>
              <p className="text-gray-600">
                {showAll 
                  ? "Vous n'avez aucune notification."
                  : "Vous n'avez aucune notification non lue."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification: any) => (
            <Card 
              key={notification.id}
              className={cn(
                "transition-all hover:shadow-md",
                notification.status === 'UNREAD' && "ring-2 ring-blue-200 bg-blue-50"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-2 rounded-lg border",
                    getNotificationColor(notification.type)
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      {notification.status === 'UNREAD' && (
                        <Badge variant="default" className="text-xs">
                          Nouveau
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(notification.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {notification.sender.firstName} {notification.sender.lastName}
                      </div>
                    </div>

                    {notification.beneficiary && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <strong>Bénéficiaire:</strong> {notification.beneficiary.firstName} {notification.beneficiary.lastName}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {notification.status === 'UNREAD' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Marquer lu
                      </Button>
                    )}

                    {notification.type === 'BENEFICIARY_ARRIVAL' && 
                     notification.beneficiaryId && 
                     canOrient && (
                      <Button
                        size="sm"
                        onClick={() => setSelectedNotification(notification)}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Orienter
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal d'orientation */}
      {selectedNotification && (
        <OrientationModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onSuccess={() => {
            setSelectedNotification(null);
            refetchAll();
            refetchUnread();
          }}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
