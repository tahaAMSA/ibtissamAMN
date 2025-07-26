import { useMemo } from 'react';
import { t, getUserLanguage, isRTL, getTextDirection } from './utils';
import { type Language } from './index';

/**
 * Hook React pour l'internationalisation
 * @param user - Utilisateur avec propriété lang optionnelle
 * @returns Objet avec fonctions et propriétés d'i18n
 */
export function useI18n(user?: { lang?: Language }) {
  const userLang = getUserLanguage(user);
  const isRTLMode = isRTL(userLang);
  const textDirection = getTextDirection(userLang);

  const i18n = useMemo(() => ({
    // Fonction de traduction
    t: (key: string) => t(key, userLang),
    
    // Propriétés de langue
    lang: userLang,
    isRTL: isRTLMode,
    dir: textDirection,
    
    // Fonctions utilitaires
    getUserLanguage: () => userLang,
    getTextDirection: () => textDirection,
  }), [userLang, isRTLMode, textDirection]);

  return i18n;
} 