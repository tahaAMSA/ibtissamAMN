import { ReactNode } from 'react';

interface AuthPageLayoutProps {
  children: ReactNode;
  showSplitView?: boolean;
  imageContent?: ReactNode;
}

export function AuthPageLayout({ children, showSplitView = false, imageContent }: AuthPageLayoutProps) {
  if (showSplitView) {
    return (
      <div className="min-h-screen flex">
        {/* Section formulaire - Gauche */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
          <div className="w-full max-w-md lg:max-w-xl xl:max-w-2xl">
            {children}
          </div>
        </div>

        {/* Section image - Droite */}
        <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
          {/* Formes géométriques décoratives */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-40 h-40 bg-white/20 rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-pink-300/30 rounded-full mix-blend-overlay filter blur-lg animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-20 left-40 w-36 h-36 bg-blue-300/30 rounded-full mix-blend-overlay filter blur-xl animate-pulse animation-delay-4000"></div>
          </div>

          <div className="relative z-10 flex items-center justify-center w-full text-white p-12">
            {imageContent || (
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-bold">
                    Bienvenue sur
                  </h2>
                  <div className="text-6xl lg:text-7xl font-black bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    GEPS
                  </div>
                  <p className="text-xl lg:text-2xl text-blue-100 max-w-md">
                    Plateforme de gestion sociale moderne pour les établissements de protection sociale
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm text-blue-100">Bénéficiaires</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm text-blue-100">Disponible</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Layout classique pour les autres pages
  return (
    <div className='flex min-h-screen flex-col justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white/80 backdrop-blur-sm py-8 px-4 shadow-2xl ring-1 ring-blue-200/20 rounded-2xl sm:px-10 border border-blue-100/30'>
          <div className='-mt-8'>
            { children }
          </div>
        </div>
      </div>
    </div>
  );
}
