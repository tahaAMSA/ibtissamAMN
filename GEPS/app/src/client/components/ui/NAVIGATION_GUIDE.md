# Guide du système de navigation GEPS

## Vue d'ensemble

Le système de navigation GEPS offre une expérience utilisateur fluide avec :
- Bouton retour intelligent dans le header
- Breadcrumb navigation sur toutes les pages
- Navigation SPA sans rafraîchissement
- Support RTL (arabe/français)
- Sidebar persistante

## Composants disponibles

### 1. Header avec navigation intégrée (`Header.tsx`)

Le header inclut automatiquement :
- **Bouton retour** : Visible sur toutes les pages sauf le dashboard
- **Breadcrumb navigation** : Chemin de navigation complet
- **Vraies notifications** : Remplace les fausses notifications
- **Support multilingue** : FR/AR avec support RTL

### 2. BackButton (`BackButton.tsx`)

Composant autonome pour bouton retour :

```tsx
import BackButton from '../client/components/ui/BackButton';

// Usage basique
<BackButton />

// Avec texte et chemin de fallback personnalisé
<BackButton fallbackPath="/custom-page">
  Retour personnalisé
</BackButton>

// Différents styles
<BackButton variant="outline" size="sm" />
```

### 3. Breadcrumb (`Breadcrumb.tsx`)

Navigation breadcrumb réutilisable :

```tsx
import Breadcrumb from '../client/components/ui/Breadcrumb';

// Usage basique
<Breadcrumb />

// Avec langue et limite d'éléments
<Breadcrumb language="ar" maxItems={3} />
```

## Utilisation dans les pages

### Exemple d'implémentation complète

```tsx
import React from 'react';
import BackButton from '../client/components/ui/BackButton';
import Breadcrumb from '../client/components/ui/Breadcrumb';
import { useI18n } from '../translations/useI18n';

const MyPage: React.FC = () => {
  const { language, isRTL } = useI18n();
  
  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Breadcrumb language={language as 'fr' | 'ar'} />
        <BackButton fallbackPath="/dashboard">
          {language === 'ar' ? 'العودة' : 'Retour'}
        </BackButton>
      </div>

      {/* Contenu de la page */}
      <div>
        Contenu principal...
      </div>
    </div>
  );
};
```

## Configuration des routes

### Ajouter une nouvelle route au breadcrumb

Modifiez le `pathMap` dans `Header.tsx` et `Breadcrumb.tsx` :

```tsx
const pathMap = {
  // Nouvelles routes
  '/ma-nouvelle-page': { 
    fr: 'Ma nouvelle page', 
    ar: 'صفحتي الجديدة', 
    parent: '/dashboard' 
  },
  '/sous-page/:id': { 
    fr: 'Détail sous-page', 
    ar: 'تفاصيل الصفحة الفرعية', 
    parent: '/ma-nouvelle-page' 
  }
};
```

### Routes dynamiques

Les routes avec paramètres sont automatiquement gérées :

```tsx
// Gestion automatique pour /beneficiaries/:id
if (currentPath.startsWith('/beneficiaries/') && currentPath !== '/beneficiaries') {
  pageInfo = { 
    fr: 'Détail bénéficiaire', 
    ar: 'تفاصيل المستفيد', 
    parent: '/beneficiaries' 
  };
}
```

## Fonctionnalités

### Navigation intelligente
- **Historique du navigateur** : Utilise `navigate(-1)` quand possible
- **Fallback path** : Retour au dashboard si pas d'historique
- **SPA complète** : Pas de rafraîchissement de page

### Support multilingue
- **Français/Arabe** : Labels traduits automatiquement
- **RTL Support** : Interface adaptée pour l'arabe
- **Icons contextuels** : Icônes Home pour le dashboard

### Intégration sidebar
- **Persistance** : La sidebar reste ouverte/fermée selon l'état
- **Responsive** : Adaptation mobile/desktop
- **Cohérence** : Navigation harmonisée entre header et sidebar

## Notifications

Les vraies notifications remplacent les mock données :
- **Source de données** : `useNotifications()` hook
- **Temps réel** : Mise à jour automatique toutes les 30s
- **Navigation** : Clic pour aller vers `/notifications`
- **Badge compteur** : Nombre de notifications non lues

## Bonnes pratiques

1. **Toujours inclure** breadcrumb et bouton retour dans les nouvelles pages
2. **Définir le parent** approprié pour chaque route
3. **Tester la navigation** dans les deux langues
4. **Vérifier le responsive** sur mobile
5. **Documenter** les nouvelles routes ajoutées

## Troubleshooting

### Le breadcrumb ne s'affiche pas
- Vérifiez que la route est définie dans `pathMap`
- Assurez-vous que `parent` est correctement configuré

### Le bouton retour ne fonctionne pas
- Vérifiez l'historique du navigateur
- Configurez un `fallbackPath` approprié

### Navigation ne fonctionne pas en SPA
- Utilisez `useNavigate` de React Router
- Évitez `window.location.href` sauf pour la déconnexion
