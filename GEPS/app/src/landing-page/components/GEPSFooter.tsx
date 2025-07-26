import React from 'react';
import { useI18n } from '../../translations/useI18n';
import { type Language } from '../../translations';

interface GEPSFooterProps {
  user?: { lang?: Language };
}

export default function GEPSFooter({ user }: GEPSFooterProps) {
  const { t, dir } = useI18n(user);

  return (
    <footer className="bg-gray-900 text-white" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="ml-3 text-xl font-bold">GEPS</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Plateforme de gestion sociale tout-en-un pour le Complexe Ibtissama. 
              Optimisez le suivi des bénéficiaires et améliorez l'efficacité de vos services sociaux.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {t('nav.features')}
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {t('auth.login')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact et légal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {t('landing.footer.contact')}
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {t('landing.footer.privacy')}
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {t('landing.footer.terms')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {t('landing.footer.copyright')}
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Complexe Ibtissama</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 