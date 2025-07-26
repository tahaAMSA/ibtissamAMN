import React, { useState } from 'react';
import { useI18n } from '../../translations/useI18n';
import { type Language } from '../../translations';

interface HeaderProps {
  user?: { lang?: Language };
  onLanguageChange?: (lang: Language) => void;
}

export default function Header({ user, onLanguageChange }: HeaderProps) {
  const { t, dir } = useI18n(user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    onLanguageChange?.(lang);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo GEPS */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">GEPS</span>
              </div>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-yellow-600 px-3 py-2 text-sm font-medium transition-colors">
              {t('nav.home')}
            </a>
            <a href="#features" className="text-gray-700 hover:text-yellow-600 px-3 py-2 text-sm font-medium transition-colors">
              {t('nav.features')}
            </a>
            <a href="/login" className="text-gray-700 hover:text-yellow-600 px-3 py-2 text-sm font-medium transition-colors">
              {t('auth.login')}
            </a>
          </nav>

          {/* Sélecteur de langue et menu mobile */}
          <div className="flex items-center space-x-4">
            {/* Sélecteur de langue */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  user?.lang === 'fr' || !user?.lang
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  user?.lang === 'ar'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                عربي
              </button>
            </div>

            {/* Bouton menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-yellow-600 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <a
                href="#home"
                className="text-gray-700 hover:text-yellow-600 block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </a>
              <a
                href="#features"
                className="text-gray-700 hover:text-yellow-600 block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.features')}
              </a>
              <a
                href="/login"
                className="text-gray-700 hover:text-yellow-600 block px-3 py-2 text-base font-medium transition-colors"
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