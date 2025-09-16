import React from 'react';
import { useI18n } from '../../translations/useI18n';
import { type Language } from '../../translations';

interface GEPSFooterProps {
  user?: { lang?: Language };
}

export default function GEPSFooter({ user }: GEPSFooterProps) {
  const { t, dir } = useI18n(user);

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-6">
              <img 
                src="/public/logo-GEPS.png" 
                alt="GEPS Logo" 
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 mb-4 max-w-md text-lg leading-relaxed">
              {t('landing.footer.description')}
            </p>
            <p className="text-gray-400 mb-6 max-w-md text-sm leading-relaxed">
              GEPS est un produit de <span className="text-blue-400 font-semibold">Pulseware</span>, l'éditeur de logiciels de Team'Doc, TrialMatch, PulseWare AI, ALPES et d'autres solutions dans la e-santé.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/teamdoc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform group"
                aria-label="Suivez PulseWare sur LinkedIn"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://pulsecare-ai.pulseware.fr/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform group"
                aria-label="Découvrez PulseCare.ai"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              Liens rapides
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-gray-300 hover:text-pink-400 transition-colors text-lg hover:translate-x-1 transform inline-block">
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-300 hover:text-pink-400 transition-colors text-lg hover:translate-x-1 transform inline-block">
                  {t('nav.features')}
                </a>
              </li>
              <li>
                <a href="#security" className="text-gray-300 hover:text-pink-400 transition-colors text-lg hover:translate-x-1 transform inline-block">
                  {t('nav.security')}
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-300 hover:text-pink-400 transition-colors text-lg hover:translate-x-1 transform inline-block">
                  {t('auth.login')}
                </a>
              </li>
            </ul>
          </div>

          {/* Écosystème Pulseware */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              Écosystème Pulseware
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="https://pulsecare-ai.pulseware.fr/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-400 transition-colors text-lg hover:translate-x-1 transform inline-block">
                  Team'Doc
                </a>
              </li>
              <li>
                <a href="https://pulsecare-ai.pulseware.fr/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-400 transition-colors text-lg hover:translate-x-1 transform inline-block">
                  TrialMatch
                </a>
              </li>
              <li>
                <a href="https://pulsecare-ai.pulseware.fr/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-400 transition-colors text-lg hover:translate-x-1 transform inline-block">
                  PulseWare AI
                </a>
              </li>
              <li>
                <a href="https://pulsecare-ai.pulseware.fr/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-400 transition-colors text-lg hover:translate-x-1 transform inline-block">
                  ALPES
                </a>
              </li>
            </ul>
          </div>

          {/* Contact et légal */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              Informations
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/contact" className="text-gray-300 hover:text-pink-400 transition-colors text-lg hover:translate-x-1 transform inline-block">
                  {t('landing.footer.contact')}
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-pink-400 transition-colors text-lg hover:translate-x-1 transform inline-block">
                  {t('landing.footer.privacy')}
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-pink-400 transition-colors text-lg hover:translate-x-1 transform inline-block">
                  {t('landing.footer.terms')}
                </a>
              </li>
              <li>
                <a href="/support" className="text-gray-300 hover:text-pink-400 transition-colors text-lg hover:translate-x-1 transform inline-block">
                  Support technique
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-lg">
              {t('landing.footer.copyright')}
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-lg">Établissements de Protection Sociale</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">En ligne</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-blue-600 via-pink-600 to-blue-600"></div>
      </div>
    </footer>
  );
} 