import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { signup, login } from 'wasp/client/auth';
import { AuthPageLayout } from './AuthPageLayout';
import { useState } from 'react';
import { Card, CardContent, Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, Badge } from '../client/components/ui';
import { ChevronRight, UserPlus, Shield, Clock, CheckCircle, User, Lock, Mail, Building2 } from 'lucide-react';
import { AvatarUploadComponent } from '../client/components/AvatarUpload';
import { useNavigate } from 'react-router-dom';

interface SignupFormData {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  firstNameAr?: string;
  lastNameAr?: string;
  gender?: 'HOMME' | 'FEMME' | 'AUTRE';
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
}

interface SignupData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  firstNameAr: string;
  lastNameAr: string;
  gender: 'HOMME' | 'FEMME' | 'AUTRE';
  phone: string;
  dateOfBirth: Date | undefined;
  avatar: string;
  isAdmin: boolean;
  status: 'PENDING_APPROVAL' | 'APPROVED';
}

export function Signup() {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    firstNameAr: '',
    lastNameAr: '',
    gender: undefined,
    phone: '',
    dateOfBirth: '',
    avatar: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Préparer les données pour l'envoi - s'assurer que tous les champs requis sont présents
      const signupData: SignupData = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        firstNameAr: formData.firstNameAr || '',
        lastNameAr: formData.lastNameAr || '',
        gender: formData.gender || 'HOMME',
        phone: formData.phone || '',
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
        avatar: formData.avatar || '',
        isAdmin: false,
        status: 'PENDING_APPROVAL',
      };

      await signup(signupData);
      // Redirection automatique après inscription réussie
    } catch (err) {
      setError((err as Error).message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AuthPageLayout 
      showSplitView={true}
      imageContent={
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/logo-GEPS.png" 
                alt="GEPS Logo" 
                className="h-16 w-auto brightness-0 invert"
              />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold">
              Rejoignez
            </h2>
            <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              GEPS
            </div>
            <p className="text-lg lg:text-xl text-blue-100 max-w-lg mx-auto leading-relaxed">
              Intégrez la communauté des professionnels de la protection sociale
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 pt-8 max-w-sm mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold">Inscription Rapide</div>
                  <div className="text-sm text-blue-100">Processus simplifié</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold">Validation</div>
                  <div className="text-sm text-blue-100">Approbation rapide</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold">Accès Complet</div>
                  <div className="text-sm text-blue-100">Toutes les fonctionnalités</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6 w-full max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-pink-50 text-pink-700 border-pink-200">
              Inscription
            </Badge>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Créer un compte
          </h1>
          <p className="text-gray-600 text-lg">
            Rejoignez GEPS en quelques étapes
          </p>
        </div>
        
        {/* Formulaire dans une carte moderne */}
        <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Informations essentielles */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Adresse email *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 transition-all focus:ring-blue-500 hover:border-pink-300"
                        placeholder="votre.email@exemple.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Mot de passe *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 transition-all focus:ring-blue-500 hover:border-pink-300"
                        placeholder="Choisissez un mot de passe sécurisé"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Nom d'utilisateur *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="pl-10 transition-all focus:ring-blue-500 hover:border-pink-300"
                        placeholder="nom_utilisateur"
                      />
                    </div>
                  </div>

                </div>
              </div>

              <Separator />

              {/* Informations personnelles obligatoires */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations personnelles</h3>
                  <p className="text-sm text-gray-600">Tous les champs sont obligatoires</p>
                </div>

                {/* Avatar */}
                <div className="text-center">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Photo de profil
                  </Label>
                  <AvatarUploadComponent
                    currentAvatar={formData.avatar}
                    onAvatarChange={(url) => setFormData(prev => ({ ...prev, avatar: url || undefined }))}
                    size="md"
                    className="mx-auto"
                  />
                </div>

                {/* Noms en français */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      Prénom (Français) *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="transition-all focus:ring-blue-500 hover:border-pink-300"
                      placeholder="Jean"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Nom de famille (Français) *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="transition-all focus:ring-blue-500 hover:border-pink-300"
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                {/* Noms en arabe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstNameAr" className="text-sm font-medium text-gray-700">
                      الاسم الأول (العربية) *
                    </Label>
                    <Input
                      id="firstNameAr"
                      name="firstNameAr"
                      type="text"
                      value={formData.firstNameAr}
                      onChange={handleChange}
                      className="transition-all focus:ring-blue-500 hover:border-pink-300 text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastNameAr" className="text-sm font-medium text-gray-700">
                      اسم العائلة (العربية) *
                    </Label>
                    <Input
                      id="lastNameAr"
                      name="lastNameAr"
                      type="text"
                      value={formData.lastNameAr}
                      onChange={handleChange}
                      className="transition-all focus:ring-blue-500 hover:border-pink-300 text-right"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                      Sexe *
                    </Label>
                    <Select value={formData.gender || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value as any }))}>
                      <SelectTrigger className="transition-all focus:ring-blue-500 hover:border-pink-300">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOMME">Homme</SelectItem>
                        <SelectItem value="FEMME">Femme</SelectItem>
                        <SelectItem value="AUTRE">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Téléphone *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="transition-all focus:ring-blue-500 hover:border-pink-300"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                      Date de naissance *
                    </Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="transition-all focus:ring-blue-500 hover:border-pink-300"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création en cours...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Créer mon compte
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Liens et retour */}
        <div className="space-y-4">
          <Separator className="bg-gray-200" />
          
          <Button 
            variant="ghost" 
            className="w-full justify-between p-3 h-auto text-left hover:bg-blue-50 group"
            asChild
          >
            <WaspRouterLink to={routes.LoginRoute.to}>
              <div>
                <div className="font-medium text-gray-900">Déjà inscrit ?</div>
                <div className="text-sm text-gray-500">Connectez-vous à votre compte</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </WaspRouterLink>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          En créant un compte, vous acceptez nos{' '}
          <a href="#" className="text-blue-600 hover:text-pink-600 transition-colors">
            conditions d'utilisation
          </a>{' '}
          et notre{' '}
          <a href="#" className="text-blue-600 hover:text-pink-600 transition-colors">
            politique de confidentialité
          </a>
        </div>
      </div>
    </AuthPageLayout>
  );
}

export default Signup;
