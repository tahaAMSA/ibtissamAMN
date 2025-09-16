# Système d'Internationalisation (i18n)

Ce dossier contient toutes les traductions et le système d'internationalisation pour l'application.

## 📁 Structure

```
translations/
├── index.ts          # Traductions centralisées (source unique)
├── utils.ts          # Fonctions utilitaires (t, isRTL, etc.)
├── useI18n.ts        # Hook React pour l'i18n
├── BeneficiaryExample.tsx  # Exemple d'utilisation
└── README.md         # Documentation
```

## 🎯 Utilisation

### 1. Import simple
```typescript
import { t } from '@src/translations/utils';

// Utilisation directe
const texte = t('beneficiary.new', 'fr'); // "Nouveau bénéficiaire"
const texteAr = t('beneficiary.new', 'ar'); // "مستفيد جديد"
```

### 2. Hook React
```typescript
import { useI18n } from '@src/translations/useI18n';

function MonComposant({ user }) {
  const { t, isRTL, dir } = useI18n(user);
  
  return (
    <div dir={dir}>
      <h1>{t('beneficiary.new')}</h1>
      <button>{t('action.save')}</button>
    </div>
  );
}
```

### 3. Wrapper global
```typescript
import { I18nWrapper } from '@src/translations/BeneficiaryExample';

function App({ user }) {
  return (
    <I18nWrapper user={user}>
      {/* Tous vos composants ici */}
    </I18nWrapper>
  );
}
```

## 📝 Ajouter de nouvelles traductions

1. **Ouvrir** `src/translations/index.ts`
2. **Ajouter** dans l'objet `translations` :
```typescript
'ma.nouvelle.cle': {
  fr: 'Mon texte en français',
  ar: 'نصي باللغة العربية'
}
```
3. **Utiliser** : `t('ma.nouvelle.cle')`

## 🏷️ Conventions de nommage

- **Navigation** : `nav.home`, `nav.account`
- **Actions** : `action.save`, `action.delete`
- **Bénéficiaires** : `beneficiary.new`, `beneficiary.name`
- **Messages** : `message.success`, `message.error`
- **Formulaires** : `form.required`, `form.invalid.email`
- **Pages** : `page.dashboard`, `page.beneficiaries`

## 🌐 Langues supportées

- **Français (fr)** : Langue par défaut
- **Arabe (ar)** : Support RTL automatique

## 🔧 Fonctions disponibles

- `t(key, lang)` : Traduit une clé
- `isRTL(lang)` : Vérifie si RTL requis
- `getTextDirection(lang)` : Retourne 'ltr' ou 'rtl'
- `getUserLanguage(user)` : Obtient la langue de l'utilisateur
- `hasTranslation(key)` : Vérifie si une clé existe
- `getTranslationKeys()` : Liste toutes les clés
- `getTranslationsByCategory(prefix)` : Traductions par catégorie

## ⚡ Performance

- **Hook optimisé** : Utilise `useMemo` pour éviter les re-calculs
- **Fallback intelligent** : Retourne la clé si traduction manquante
- **Warnings console** : Aide au développement 