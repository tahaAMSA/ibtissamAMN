import React from 'react';
import { useAuth } from 'wasp/client/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../client/components/ui/card';
import { Button } from '../client/components/ui/button';
import { Badge } from '../client/components/ui/badge';
import { 
  Clock, 
  Shield, 
  Mail, 
  User, 
  LogOut,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { logout } from 'wasp/client/auth';

export default function PendingApprovalPage() {
  const { data: user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return {
          icon: <Clock className="w-8 h-8 text-orange-500" />,
          title: 'En attente d\'approbation',
          description: 'Votre compte est en cours de validation par un administrateur',
          color: 'bg-orange-50 border-orange-200',
          badgeColor: 'bg-orange-100 text-orange-800'
        };
      case 'REJECTED':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
          title: 'Compte rejeté',
          description: 'Votre demande d\'accès a été refusée',
          color: 'bg-red-50 border-red-200',
          badgeColor: 'bg-red-100 text-red-800'
        };
      case 'SUSPENDED':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-gray-500" />,
          title: 'Compte suspendu',
          description: 'Votre compte a été temporairement suspendu',
          color: 'bg-gray-50 border-gray-200',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
      default:
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
          title: 'Compte approuvé',
          description: 'Votre compte est actif',
          color: 'bg-green-50 border-green-200',
          badgeColor: 'bg-green-100 text-green-800'
        };
    }
  };

  const statusInfo = getStatusInfo(user?.status || 'PENDING_APPROVAL');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">GEPS</h1>
          <p className="text-gray-600">Système de Gestion des Prestations Sociales</p>
        </div>

        {/* Status Card */}
        <Card className={`${statusInfo.color} border-2 mb-6`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {statusInfo.icon}
            </div>
            <CardTitle className="text-xl text-gray-900">
              {statusInfo.title}
            </CardTitle>
            <CardDescription className="text-gray-700">
              {statusInfo.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* User Info */}
              <div className="bg-white/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">Utilisateur</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                    <p className="text-sm text-gray-600">Email de contact</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-500" />
                  <div>
                    <Badge className={statusInfo.badgeColor}>
                      {user?.status || 'EN_ATTENTE'}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">Statut du compte</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {user?.status === 'PENDING_APPROVAL' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Que faire maintenant ?
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Un administrateur examinera votre demande</li>
                    <li>• Il vous assignera un rôle approprié</li>
                    <li>• Vous recevrez un email une fois approuvé</li>
                    <li>• Cela peut prendre 24-48 heures</li>
                  </ul>
                </div>
              )}

              {user?.role === 'PENDING_ROLE' && user?.status === 'APPROVED' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    En attente d'assignation de rôle
                  </h4>
                  <p className="text-sm text-orange-800">
                    Votre compte a été approuvé mais aucun rôle ne vous a encore été assigné. 
                    Contactez un administrateur pour finaliser votre accès.
                  </p>
                </div>
              )}

              {user?.status === 'REJECTED' && user?.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">
                    Raison du refus :
                  </h4>
                  <p className="text-sm text-red-800">{user.rejectionReason}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4">
                {user?.status === 'PENDING_APPROVAL' && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      Nous vous contacterons par email dès que votre compte sera approuvé.
                    </p>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="text-center text-sm text-gray-600">
          <p>Des questions ? Contactez-nous :</p>
          <a href="mailto:admin@geps.ma" className="text-blue-600 hover:underline">
            admin@geps.ma
          </a>
        </div>
      </div>
    </div>
  );
}
