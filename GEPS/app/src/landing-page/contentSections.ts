import type { NavigationItem } from '../client/components/NavBar/NavBar';
import { DocsUrl, BlogUrl } from '../shared/common';

// Fonction pour créer les éléments de navigation avec traductions
export function createLandingPageNavigationItems(t: (key: string) => string): NavigationItem[] {
  return [
    { name: t('nav.features'), to: '#features' },
    { name: t('nav.documentation'), to: DocsUrl },
    { name: t('nav.blog'), to: BlogUrl },
  ];
}

// Version par défaut (pour compatibilité)
export const landingPageNavigationItems: NavigationItem[] = [
  { name: 'Fonctionnalités', to: '#features' },
  { name: 'Documentation', to: DocsUrl },
  { name: 'Blog', to: BlogUrl },
];
