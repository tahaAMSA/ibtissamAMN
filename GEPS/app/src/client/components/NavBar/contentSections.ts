import type { NavigationItem } from '../NavBar/NavBar';
import { routes } from 'wasp/client/router';
import { BlogUrl, DocsUrl } from '../../../shared/common';

// Fonction pour créer les éléments de navigation avec traductions
export function createAppNavigationItems(t: (key: string) => string): NavigationItem[] {
  return [
    { name: t('nav.demo.app'), to: routes.DemoAppRoute.to },
    { name: t('nav.file.upload'), to: routes.FileUploadRoute.to },
    { name: t('nav.documentation'), to: DocsUrl },
    { name: t('nav.blog'), to: BlogUrl },
  ];
}

// Version par défaut (pour compatibilité)
export const appNavigationItems: NavigationItem[] = [
  { name: 'Application de démonstration', to: routes.DemoAppRoute.to },
  { name: 'Téléchargement de fichiers', to: routes.FileUploadRoute.to },
  { name: 'Documentation', to: DocsUrl },
  { name: 'Blog', to: BlogUrl },
];
