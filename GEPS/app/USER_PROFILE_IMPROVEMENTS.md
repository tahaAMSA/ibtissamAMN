# Améliorations du Profil Utilisateur - GEPS

Ce document détaille les améliorations apportées au système de profils utilisateur dans l'application GEPS.

## 🆕 Nouvelles Fonctionnalités

### 1. Informations Multilingues (Français/Arabe)
- **Prénom et Nom en français** : `firstName`, `lastName`
- **Prénom et Nom en arabe** : `firstNameAr`, `lastNameAr`
- Affichage intelligent qui combine les deux langues quand disponibles

### 2. Informations Personnelles Étendues
- **Sexe** : Enum `Gender` (HOMME, FEMME, AUTRE)
- **Avatar** : URL de l'image de profil
- **Date de naissance** : `dateOfBirth`
- **Téléphone** : Numéro de téléphone

### 3. Système d'Upload d'Avatar
- Upload d'images avec validation
- Prévisualisation en temps réel
- Support de multiples formats (JPEG, PNG, GIF, WebP)
- Limitation de taille (5MB par défaut)
- Avatar par défaut avec initiales

## 📁 Fichiers Modifiés

### Base de Données
- `app/schema.prisma` : Ajout des nouveaux champs utilisateur et enum Gender

### Authentification
- `app/src/auth/userSignupFields.ts` : Configuration des champs d'inscription
- `app/src/auth/SignupPage.tsx` : Formulaire d'inscription complet avec avatar

### Interface Utilisateur
- `app/src/user/AccountPage.tsx` : Page de profil améliorée
- `app/src/user/DropdownUser.tsx` : Menu utilisateur avec noms multilingues
- `app/src/user/EditProfilePage.tsx` : Nouveau formulaire d'édition de profil

### Composants Utilitaires
- `app/src/client/components/UserDisplay.tsx` : Composants d'affichage utilisateur
- `app/src/client/hooks/useAvatarUpload.ts` : Hook et composant d'upload d'avatar
- `app/src/client/components/index.ts` : Exports des nouveaux composants

### Scripts
- `app/src/server/scripts/updateUserProfiles.ts` : Script de migration des profils

## 🎨 Composants Disponibles

### UserDisplay
Composant pour afficher les informations utilisateur avec différentes variantes :
```tsx
<UserDisplay 
  user={user} 
  variant="compact" // "compact" | "full" | "avatar-only"
  showAvatar={true}
  showRole={false}
  language="both" // "fr" | "ar" | "both"
/>
```

### UserListDisplay
Affichage d'une liste d'utilisateurs :
```tsx
<UserListDisplay 
  users={users}
  maxDisplay={5}
  showAvatars={true}
  language="both"
/>
```

### AvatarUploadComponent
Composant d'upload d'avatar :
```tsx
<AvatarUploadComponent
  currentAvatar={user.avatar}
  onAvatarChange={(url) => setAvatar(url)}
  size="lg" // "sm" | "md" | "lg"
/>
```

## 🔧 Hooks Utilitaires

### useDisplayName
Hook pour obtenir le nom d'affichage d'un utilisateur :
```tsx
const displayName = useDisplayName(user, 'both');
```

### useAvatarUpload
Hook pour gérer l'upload d'avatar avec validation :
```tsx
const { uploading, preview, uploadAvatar, removePreview } = useAvatarUpload({
  maxSize: 5 * 1024 * 1024, // 5MB
  onSuccess: (url) => console.log('Avatar uploadé:', url),
  onError: (error) => console.error('Erreur:', error)
});
```

## 🌐 Support Multilingue

L'application supporte maintenant l'affichage des noms en français et en arabe :

- **Français uniquement** : Affiche le nom français
- **Arabe uniquement** : Affiche le nom arabe
- **Les deux langues** : Format "Nom Français (الاسم العربي)"
- **Aucun nom** : Fallback sur le nom d'utilisateur ou "Utilisateur"

## 📋 Migration Requise

Pour appliquer ces changements à la base de données :

```bash
wasp db migrate-dev "Add user profile fields"
```

## 🎯 Utilisation

### Inscription
Le formulaire d'inscription inclut maintenant :
- Upload d'avatar optionnel
- Noms en français et arabe
- Sélection du sexe
- Numéro de téléphone
- Date de naissance

### Profil Utilisateur
La page de profil affiche :
- Avatar avec fallback sur initiales
- Noms dans les deux langues
- Informations personnelles organisées en sections
- Rôle et permissions
- Statut du compte

### Affichage dans l'Application
Partout dans l'application, les utilisateurs sont maintenant affichés avec :
- Leur avatar ou initiales
- Leur nom complet (français/arabe selon contexte)
- Leur rôle si pertinent

## 🚀 Améliorations Futures Possibles

1. **Upload vers S3/Cloudinary** : Remplacer le système d'upload local
2. **Redimensionnement automatique** : Optimiser les images uploadées
3. **Préférences linguistiques** : Choix de la langue d'affichage par utilisateur
4. **Validation avancée** : Validation des noms arabes et français
5. **Export/Import** : Fonctionnalités d'export des profils
6. **Historique des modifications** : Traçabilité des changements de profil
