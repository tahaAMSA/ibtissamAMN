import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { login } from 'wasp/client/auth';
import { AuthPageLayout } from './AuthPageLayout';
import { Card, CardContent, Button, Separator, Badge, Input, Label } from '../client/components/ui';
import { ChevronRight, Shield, Users, BarChart3, LogIn, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (error: unknown) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

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
              Gestion Sociale
            </h2>
            <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Modernisée
            </div>
            <p className="text-lg lg:text-xl text-blue-100 max-w-lg mx-auto leading-relaxed">
              Optimisez le suivi des bénéficiaires et améliorez l'efficacité de vos services sociaux
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 pt-8 max-w-sm mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold">500+ Bénéficiaires</div>
                  <div className="text-sm text-blue-100">Gestion centralisée</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold">Sécurisé</div>
                  <div className="text-sm text-blue-100">Protection des données</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold">Analytics</div>
                  <div className="text-sm text-blue-100">Suivi en temps réel</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        {/* En-tête */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              Connexion
            </Badge>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Bon retour !
          </h1>
          <p className="text-gray-600 text-lg">
            Connectez-vous à votre espace GEPS
          </p>
        </div>

        {/* Formulaire dans une carte moderne */}
        <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">Erreur: {error.message}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Entrez votre adresse email"
                      className="pl-10 transition-all focus:ring-blue-500 hover:border-pink-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Entrez votre mot de passe"
                      className="pl-10 transition-all focus:ring-blue-500 hover:border-pink-300"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="w-4 h-4 mr-2" />
                    Se connecter
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Liens et actions */}
        <div className="space-y-4">
          <Separator className="bg-gray-200" />
          
          <div className="flex flex-col space-y-3">
            <Button 
              variant="ghost" 
              className="justify-between p-3 h-auto text-left hover:bg-blue-50 group"
              asChild
            >
              <WaspRouterLink to={routes.SignupRoute.to}>
                <div>
                  <div className="font-medium text-gray-900">Créer un compte</div>
                  <div className="text-sm text-gray-500">Rejoindre la plateforme GEPS</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </WaspRouterLink>
            </Button>

            <Button 
              variant="ghost" 
              className="justify-between p-3 h-auto text-left hover:bg-pink-50 group"
              asChild
            >
              <WaspRouterLink to={routes.RequestPasswordResetRoute.to}>
                <div>
                  <div className="font-medium text-gray-900">Mot de passe oublié ?</div>
                  <div className="text-sm text-gray-500">Réinitialiser votre accès</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-pink-600 transition-colors" />
              </WaspRouterLink>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          En vous connectant, vous acceptez nos{' '}
          <a href="#" className="text-blue-600 hover:text-pink-600 transition-colors">
            conditions d'utilisation
          </a>
        </div>
      </div>
    </AuthPageLayout>
  );
}
