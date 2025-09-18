import React, { useState } from 'react';
import { useI18n } from '../../translations/useI18n';
import { type Language, type DatabaseLanguage } from '../../translations';

interface HeaderProps {
  user?: { preferredLanguage?: DatabaseLanguage };
  onLanguageChange?: (lang: Language) => void;
}

export default function Header({ user, onLanguageChange }: HeaderProps) {
  const { t, dir } = useI18n(user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    onLanguageChange?.(lang);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo GEPS */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <img 
                  src="/public/logo-GEPS.png" 
                  alt="GEPS Logo" 
                  className="h-12 w-auto"
                />
              </div>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105">
              {t('nav.home')}
            </a>
            <a href="#features" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105">
              {t('nav.features')}
            </a>
                <a href="#security" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105">
                  {t('nav.security')}
                </a>
            <a 
              href="/login" 
              className="bg-gradient-to-r from-blue-600 to-pink-600 text-white px-6 py-2 rounded-full font-medium hover:from-blue-700 hover:to-pink-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t('auth.login')}
            </a>
          </nav>

          {/* Sélecteur de langue et menu mobile */}
          <div className="flex items-center space-x-4">
            {/* Sélecteur de langue */}
            <div className="flex items-center bg-gray-50 rounded-full p-1">
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-200 ${
                  user?.preferredLanguage === 'FR' || !user?.preferredLanguage
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-200 ${
                  user?.preferredLanguage === 'AR'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white'
                }`}
              >
                عربي
              </button>
            </div>

            {/* Bouton menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-4 space-y-2 sm:px-3 border-t border-gray-100 bg-white/95 backdrop-blur-md">
              <a
                href="#home"
                className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 block px-3 py-3 rounded-lg text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </a>
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 block px-3 py-3 rounded-lg text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.features')}
              </a>
                  <a
                    href="#security"
                    className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 block px-3 py-3 rounded-lg text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.security')}
                  </a>
              <a
                href="/login"
                className="bg-gradient-to-r from-blue-600 to-pink-600 text-white block px-3 py-3 rounded-lg text-base font-medium text-center transition-all hover:from-blue-700 hover:to-pink-700"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('auth.login')}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 