import { translations, type Language, type DatabaseLanguage, type Translations } from './index';

// Réexporter les types pour qu'ils soient disponibles
export type { Language, DatabaseLanguage } from './index';

/**
 * Fonction de traduction principale
 * @param key - Clé de traduction
 * @param lang - Langue (par défaut: 'fr')
 * @returns Texte traduit
 */
export function t(key: string, lang: Language = 'fr'): string {
  const translation = translations[key];
  
  if (!translation) {
    console.warn(`Traduction manquante pour la clé: ${key}`);
    return key;
  }
  
  return translation[lang] || translation.fr;
}

/**
 * Convertit une langue de la base de données vers le format frontend
 * @param dbLang - Langue depuis la base de données
 * @returns Langue pour le frontend
 */
export function convertDatabaseLanguage(dbLang?: DatabaseLanguage): Language {
  if (!dbLang) return 'fr';
  return dbLang.toLowerCase() as Language;
}

/**
 * Convertit une langue du frontend vers le format base de données
 * @param lang - Langue frontend
 * @returns Langue pour la base de données
 */
export function convertToDatabase(lang: Language): DatabaseLanguage {
  return lang.toUpperCase() as DatabaseLanguage;
}

/**
 * Hook pour obtenir la langue de l'utilisateur
 * @param user - Utilisateur avec propriété preferredLanguage optionnelle
 * @returns Langue de l'utilisateur (par défaut: 'fr')
 */
export function getUserLanguage(user?: { preferredLanguage?: DatabaseLanguage }): Language {
  return convertDatabaseLanguage(user?.preferredLanguage);
}

/**
 * Vérifie si la langue nécessite RTL
 * @param lang - Langue
 * @returns true si RTL requis
 */
export function isRTL(lang: Language): boolean {
  return lang === 'ar';
}

/**
 * Obtient la direction du texte selon la langue
 * @param lang - Langue
 * @returns 'ltr' ou 'rtl'
 */
export function getTextDirection(lang: Language): 'ltr' | 'rtl' {
  return isRTL(lang) ? 'rtl' : 'ltr';
}

/**
 * Obtient toutes les traductions disponibles
 * @returns Objet avec toutes les traductions
 */
export function getAllTranslations(): Translations {
  return translations;
}

/**
 * Obtient les traductions pour une langue spécifique
 * @param lang - Langue
 * @returns Objet avec les traductions pour la langue spécifiée
 */
export function getTranslationsForLanguage(lang: Language): Record<string, string> {
  const result: Record<string, string> = {};
  
  Object.entries(translations).forEach(([key, translation]) => {
    result[key] = translation[lang] || translation.fr;
  });
  
  return result;
}

/**
 * Vérifie si une clé de traduction existe
 * @param key - Clé de traduction
 * @returns true si la clé existe
 */
export function hasTranslation(key: string): boolean {
  return key in translations;
}

/**
 * Obtient la liste de toutes les clés de traduction
 * @returns Tableau des clés de traduction
 */
export function getTranslationKeys(): string[] {
  return Object.keys(translations);
}

/**
 * Obtient les traductions par catégorie
 * @param prefix - Préfixe de la catégorie (ex: 'nav.', 'action.')
 * @returns Objet avec les traductions de la catégorie
 */
export function getTranslationsByCategory(prefix: string): Record<string, { fr: string; ar: string }> {
  const result: Record<string, { fr: string; ar: string }> = {};
  
  Object.entries(translations).forEach(([key, translation]) => {
    if (key.startsWith(prefix)) {
      result[key] = translation;
    }
  });
  
  return result;
} 