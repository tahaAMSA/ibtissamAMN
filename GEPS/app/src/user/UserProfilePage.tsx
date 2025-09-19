import React, { useState } from 'react';
import { useAuth } from 'wasp/client/auth';
import { updateUserProfile } from 'wasp/client/operations';
import type { User } from 'wasp/entities';
import { Gender, UserStatus } from '@prisma/client';
import { 
  User as UserIcon, 
  Edit3, 
  Save, 
  X, 
  Calendar, 
  Phone, 
  Mail, 
  Shield, 
  Globe,
  Check,
  AlertCircle
} from 'lucide-react';
import { RoleInfo } from '../client/components/ui/RoleInfo';
import { usePermissions } from '../client/hooks/usePermissions';
import LanguageSelector from '../client/components/LanguageSelector';
import { AvatarUploadComponent } from '../client/components/AvatarUpload';
import { Button } from '../client/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../client/components/ui/card';
import { Alert, AlertDescription } from '../client/components/ui/alert';
import { convertDatabaseLanguage, convertToDatabase, type Language } from '../translations/utils';

interface EditableUserData {
  firstName?: string | null;
  lastName?: string | null;
  firstNameAr?: string | null;
  lastNameAr?: string | null;
  gender?: Gender | null;
  phone?: string | null;
  dateOfBirth?: Date | null;
  avatar?: string | null;
  preferredLanguage?: Language;
}

export default function UserProfilePage() {
  const { data: user, isLoading } = useAuth();
  const { getRoleLabel } = usePermissions();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<EditableUserData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    firstNameAr: user?.firstNameAr || '',
    lastNameAr: user?.lastNameAr || '',
    gender: user?.gender || null,
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || null,
    avatar: user?.avatar || '',
    preferredLanguage: convertDatabaseLanguage((user as any)?.preferredLanguage)
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        firstNameAr: user.firstNameAr || '',
        lastNameAr: user.lastNameAr || '',
        gender: user.gender || null,
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || null,
        avatar: user.avatar || '',
        preferredLanguage: convertDatabaseLanguage((user as any)?.preferredLanguage)
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Impossible de charger les informations utilisateur.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserProfile({
        firstName: formData.firstName?.trim() || null,
        lastName: formData.lastName?.trim() || null,
        firstNameAr: formData.firstNameAr?.trim() || null,
        lastNameAr: formData.lastNameAr?.trim() || null,
        gender: formData.gender,
        phone: formData.phone?.trim() || null,
        dateOfBirth: formData.dateOfBirth,
        avatar: formData.avatar?.trim() || null,
        preferredLanguage: formData.preferredLanguage
      });
      
      setIsEditing(false);
      setSuccess('Profil mis à jour avec succès !');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      firstNameAr: user.firstNameAr || '',
      lastNameAr: user.lastNameAr || '',
      gender: user.gender || null,
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || null,
      avatar: user.avatar || '',
      preferredLanguage: convertDatabaseLanguage((user as any)?.preferredLanguage)
    });
    setIsEditing(false);
    setError(null);
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenderLabel = (gender: Gender | null) => {
    switch (gender) {
      case 'HOMME': return 'Homme';
      case 'FEMME': return 'Femme';
      case 'AUTRE': return 'Autre';
      default: return 'Non défini';
    }
  };

  const getLanguageLabel = (language: Language) => {
    switch (language) {
      case 'fr': return '🇫🇷 Français';
      case 'ar': return '🇸🇦 العربية';
      default: return '🇫🇷 Français';
    }
  };

  const getStatusLabel = (status: any) => {
    switch (status) {
      case 'PENDING_APPROVAL': return { label: 'En attente d\'approbation', color: 'bg-yellow-100 text-yellow-800' };
      case 'APPROVED': return { label: 'Approuvé', color: 'bg-green-100 text-green-800' };
      case 'REJECTED': return { label: 'Rejeté', color: 'bg-red-100 text-red-800' };
      case 'SUSPENDED': return { label: 'Suspendu', color: 'bg-gray-100 text-gray-800' };
      default: return { label: 'Inconnu', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getDisplayName = () => {
    const frenchName = [user.firstName, user.lastName].filter(Boolean).join(' ');
    const arabicName = [user.firstNameAr, user.lastNameAr].filter(Boolean).join(' ');
    
    if (frenchName && arabicName) {
      return `${frenchName} (${arabicName})`;
    }
    return frenchName || arabicName || user.username || 'Utilisateur';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Messages d'état */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* En-tête avec avatar et actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {isEditing ? (
                  <AvatarUploadComponent
                    currentAvatar={formData.avatar || ''}
                    onAvatarChange={(url) => setFormData(prev => ({ ...prev, avatar: url || '' }))}
                    size="lg"
                  />
                ) : (
                  <>
                    {user.avatar ? (
                      <img
                        className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-lg"
                        src={user.avatar}
                        alt={`Avatar de ${getDisplayName()}`}
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-4 ring-white shadow-lg">
                        <span className="text-2xl font-bold text-white">
                          {getDisplayName().charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getDisplayName()}
                </CardTitle>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {getRoleLabel('fr')}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    getStatusLabel((user as any).status).color
                  }`}>
                    {getStatusLabel((user as any).status).label}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSave}
                    size="sm"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  size="sm"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5" />
              <span>Informations personnelles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Noms français */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Prénom (Français)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Prénom"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {user.firstName || 'Non défini'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Nom (Français)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Nom"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {user.lastName || 'Non défini'}
                  </p>
                )}
              </div>
            </div>

            {/* Noms arabes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  الاسم الأول (العربية)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.firstNameAr || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstNameAr: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-right"
                    placeholder="الاسم الأول"
                    dir="rtl"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white text-right" dir="rtl">
                    {user.firstNameAr || 'غير محدد'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  اسم العائلة (العربية)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.lastNameAr || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastNameAr: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-right"
                    placeholder="اسم العائلة"
                    dir="rtl"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white text-right" dir="rtl">
                    {user.lastNameAr || 'غير محدد'}
                  </p>
                )}
              </div>
            </div>

            {/* Sexe et date de naissance */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Sexe
                </label>
                {isEditing ? (
                  <select
                    value={formData.gender || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as Gender || null }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="HOMME">Homme</option>
                    <option value="FEMME">Femme</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {getGenderLabel(user.gender)}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date de naissance
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      dateOfBirth: e.target.value ? new Date(e.target.value) : null 
                    }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(user.dateOfBirth)}
                  </p>
                )}
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Téléphone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Numéro de téléphone"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {user.phone || 'Non défini'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informations du compte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Informations du compte</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Adresse email
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {user.email || 'Non définie'}
              </p>
            </div>

            {/* Nom d'utilisateur */}
            {user.username && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Nom d'utilisateur
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {user.username}
                </p>
              </div>
            )}

            {/* Rôle */}
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Rôle et responsabilités
              </label>
              <div className="mt-2">
                <RoleInfo 
                  role={user.role as any} 
                  language="fr" 
                  variant="detailed"
                  className="max-w-md"
                />
              </div>
            </div>

            {/* Langue préférée */}
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Langue préférée
              </label>
              {isEditing ? (
                <select
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredLanguage: e.target.value as Language }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="ar">🇸🇦 العربية</option>
                </select>
              ) : (
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-sm text-gray-900 dark:text-white flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    {getLanguageLabel(convertDatabaseLanguage((user as any).preferredLanguage))}
                  </p>
                  <LanguageSelector 
                    showLabel={false} 
                    size="sm"
                  />
                </div>
              )}
            </div>

            {/* Dates importantes */}
            <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Membre depuis
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {formatDate(user.createdAt)}
                </p>
              </div>
              
              {(user as any).approvedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Approuvé le
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDate((user as any).approvedAt)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
