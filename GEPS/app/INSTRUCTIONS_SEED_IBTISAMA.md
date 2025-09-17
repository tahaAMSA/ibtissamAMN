# 🌱 Instructions de Seeding - Organisation Ibtisama

## 📋 Vue d'ensemble

Ce guide vous explique comment utiliser le seed `seedIbtisamaOrg` pour créer une organisation de test complète avec tous les types d'utilisateurs et de bénéficiaires nécessaires pour développer l'application GEPS.

## 🚀 Comment utiliser le seed

### 1. Vérifier la configuration

Le seed est déjà configuré dans `main.wasp`. Vous pouvez voir les seeds disponibles :

```wasp
db: {
  seeds: [
    import { seedMockUsers } from "@src/server/scripts/dbSeeds",
    import { seedIbtisamaOrg } from "@src/server/scripts/seedIbtisamaOrg",
  ]
}
```

### 2. Exécuter le seed

#### Option A: Choisir interactivement
```bash
wasp db seed
```
Puis sélectionner `seedIbtisamaOrg` dans la liste.

#### Option B: Exécuter directement
```bash
wasp db seed seedIbtisamaOrg
```

### 3. Résultat attendu

Le seed créera :
- ✅ 1 organisation "Ibtisama"
- ✅ 14 utilisateurs avec tous les rôles (admin, directeur, assistantes sociales, etc.)
- ✅ 7 bénéficiaires avec différents statuts et profils
- ✅ 6 types de ressources
- ✅ 3 activités planifiées
- ✅ 4 budgets par module
- ✅ 2 notifications de test

## 🔑 Comptes de test

Consultez le fichier `SEED_CREDENTIALS_IBTISAMA.md` pour voir tous les comptes disponibles.

### Accès rapide (exemples):
- **Admin**: `admin@ibtisama.ma` / `admin123`
- **Directeur**: `directeur@ibtisama.ma` / `directeur123`
- **Agent d'accueil**: `accueil1@ibtisama.ma` / `accueil123`
- **Assistante sociale**: `assistante1@ibtisama.ma` / `assistante123`

## 🔄 Réinitialisation

Si vous voulez repartir à zéro :

```bash
# Réinitialiser la base de données
wasp db reset

# Relancer le seed
wasp db seed seedIbtisamaOrg
```

## 🧪 Scénarios de test recommandés

### 1. Test du workflow d'accueil
1. Se connecter comme **Agent d'Accueil** (`accueil1@ibtisama.ma`)
2. Aller sur `/beneficiaries`
3. Créer un nouveau bénéficiaire
4. Observer que le statut est "EN_ATTENTE_ACCUEIL"

### 2. Test du processus d'orientation
1. Se connecter comme **Coordinateur** (`coordinateur@ibtisama.ma`)
2. Aller sur `/beneficiaries`
3. Sélectionner un bénéficiaire "EN_ATTENTE_ORIENTATION"
4. L'orienter vers une assistante sociale

### 3. Test du suivi social
1. Se connecter comme **Assistante Sociale** (`assistante1@ibtisama.ma`)
2. Voir les bénéficiaires qui vous sont assignés
3. Démarrer une session de suivi
4. Mettre à jour le dossier

### 4. Test des notifications
1. Se connecter comme **Coordinateur**
2. Aller sur `/notifications`
3. Voir les notifications de nouveaux arrivants

## 📊 Données réalistes

Le seed contient des données réalistes pour le contexte marocain :
- Noms et prénoms en arabe et français
- Adresses de Casablanca
- Numéros de téléphone marocains
- Motifs de visite typiques
- Situations familiales variées

## ⚠️ Important

- Ces données sont uniquement pour le développement
- Ne jamais utiliser ces mots de passe en production
- Le fichier `SEED_CREDENTIALS_IBTISAMA.md` doit être supprimé avant le déploiement

## 🆘 Dépannage

### Erreur "Organization already exists"
```bash
wasp db reset
wasp db seed seedIbtisamaOrg
```

### Erreur de migration
```bash
wasp db migrate-dev "reset migrations"
wasp db seed seedIbtisamaOrg
```

### Problème d'authentification
Vérifiez que :
- L'email est exact (pas d'espaces)
- Le mot de passe est exact (sensible à la casse)
- La base de données a été seedée récemment

## 📞 Support

En cas de problème, vérifiez :
1. Les logs du serveur Wasp
2. La console du navigateur
3. Les fichiers de seed pour les données exactes

---

**Date de création** : 16 septembre 2025  
**Version de Wasp** : ^0.17.0
