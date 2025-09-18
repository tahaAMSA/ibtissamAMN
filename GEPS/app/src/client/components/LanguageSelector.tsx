import React from 'react';
import { useI18n } from '../../translations/useI18n';
import { convertToDatabase, type Language } from '../../translations/utils';
import { updateUserProfile } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';

interface LanguageSelectorProps {
  className?: string;
  onLanguageChange?: (language: Language) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  onLanguageChange,
  showLabel = true,
  size = 'md'
}) => {
  const { data: user } = useAuth();
  const { t, lang } = useI18n(user as any);

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };

  const handleLanguageChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value as Language;
    
    try {
      // Mettre à jour la langue dans la base de données si l'utilisateur est connecté
      if (user) {
        await updateUserProfile({
          preferredLanguage: newLanguage
        });
      }
      
      // Callback optionnel pour le parent
      if (onLanguageChange) {
        onLanguageChange(newLanguage);
      }
      
      // Recharger la page pour appliquer la nouvelle langue
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors du changement de langue:', error);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <label htmlFor="language-selector" className="text-sm font-medium text-gray-700">
          {t('settings.language')}
        </label>
      )}
      
      <select
        id="language-selector"
        value={lang}
        onChange={handleLanguageChange}
        className={`
          ${sizeClasses[size]}
          border border-gray-300 rounded-md bg-white
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
          cursor-pointer
        `}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        <option value="fr">🇫🇷 Français</option>
        <option value="ar">🇸🇦 العربية</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
