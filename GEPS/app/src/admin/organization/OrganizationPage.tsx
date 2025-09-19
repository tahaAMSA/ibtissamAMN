import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getCurrentOrganization, updateOrganization } from 'wasp/client/operations';
import { ProtectedRoute } from '../../client/components/ProtectedComponent';
import { Card, CardContent, CardHeader, CardTitle } from '../../client/components/ui/card';
import { Button } from '../../client/components/ui/button';
import { Input } from '../../client/components/ui/input';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Upload,
  Save,
  AlertCircle,
  CheckCircle,
  FileImage
} from 'lucide-react';
import { useAuth } from 'wasp/client/auth';

interface OrganizationForm {
  name: string;
  description: string;
  adminEmail: string;
  phone: string;
  address: string;
  website: string;
  logo: string;
}

export default function OrganizationPage() {
  const { data: user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Récupérer les données de l'organisation
  const { data: organization, isLoading, error } = useQuery(getCurrentOrganization);

  const [formData, setFormData] = useState<OrganizationForm>({
    name: '',
    description: '',
    adminEmail: '',
    phone: '',
    address: '',
    website: '',
    logo: ''
  });

  // Mettre à jour le formulaire quand les données arrivent
  React.useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        description: organization.description || '',
        adminEmail: organization.adminEmail || '',
        phone: organization.phone || '',
        address: organization.address || '',
        website: organization.website || '',
        logo: organization.logo || ''
      });
    }
  }, [organization]);

  const handleInputChange = (field: keyof OrganizationForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!organization) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await updateOrganization({
        id: organization.id,
        ...formData
      });
      
      setSaveMessage({ 
        type: 'success', 
        text: 'Informations de l\'organisation mises à jour avec succès !' 
      });
      setIsEditing(false);
      
      // Effacer le message après 3 secondes
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveMessage({ 
        type: 'error', 
        text: 'Erreur lors de la sauvegarde. Veuillez réessayer.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        description: organization.description || '',
        adminEmail: organization.adminEmail || '',
        phone: organization.phone || '',
        address: organization.address || '',
        website: organization.website || '',
        logo: organization.logo || ''
      });
    }
    setIsEditing(false);
    setSaveMessage(null);
  };

  if (isLoading) {
    return (
      <ProtectedRoute module="SYSTEM">
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des informations de l'organisation...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute module="SYSTEM">
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Erreur lors du chargement des informations</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!organization) {
    return (
      <ProtectedRoute module="SYSTEM">
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune organisation trouvée</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute module="SYSTEM">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  Gestion de l'Organisation
                </h1>
                <p className="text-gray-600 mt-2">
                  Configurez les informations de votre organisation
                </p>
              </div>
              <div className="flex gap-3">
                {!isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCancel}
                      variant="outline"
                    >
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Sauvegarder
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message de confirmation */}
          {saveMessage && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              saveMessage.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {saveMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {saveMessage.text}
            </div>
          )}

          {/* Informations principales */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Informations Générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'organisation *
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nom de votre organisation"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{organization.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email administrateur *
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                      placeholder="admin@exemple.com"
                      required
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-900">{organization.adminEmail}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description de votre organisation"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700">{organization.description || 'Aucune description'}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                Informations de Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+33 1 23 45 67 89"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-900">{organization.phone || 'Non renseigné'}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site web
                  </label>
                  {isEditing ? (
                    <Input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://votre-site.com"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      {organization.website ? (
                        <a 
                          href={organization.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {organization.website}
                        </a>
                      ) : (
                        <p className="text-gray-900">Non renseigné</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                {isEditing ? (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Adresse complète de votre organisation"
                    rows={2}
                  />
                ) : (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <p className="text-gray-700">{organization.address || 'Non renseignée'}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Logo et branding */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="w-5 h-5 text-purple-600" />
                Logo et Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL du logo
                  </label>
                  <Input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => handleInputChange('logo', e.target.value)}
                    placeholder="https://exemple.com/logo.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Entrez l'URL de votre logo (format recommandé: PNG ou SVG)
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {organization.logo ? (
                    <div className="flex items-center gap-4">
                      <img 
                        src={organization.logo} 
                        alt="Logo de l'organisation" 
                        className="w-16 h-16 object-contain border border-gray-200 rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">Logo configuré</p>
                        <p className="text-sm text-gray-500">
                          <a 
                            href={organization.logo} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Voir le logo
                          </a>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <FileImage className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Aucun logo configuré</p>
                        <p className="text-sm text-gray-500">Ajoutez un logo pour votre organisation</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
