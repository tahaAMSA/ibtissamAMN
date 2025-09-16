# Système de Processus d'Accueil et Notifications

## 🎯 Vue d'ensemble

Ce système automatise le processus d'accueil des bénéficiaires avec un workflow en 3 étapes et des notifications en temps réel.

## 📋 Processus étape par étape

### 1. **Agent d'Accueil (AGENT_ACCUEIL)**
- **Interface** : Formulaire simplifié bilingue (FR/AR)
- **Champs obligatoires** :
  - Nom et prénom
  - Genre et date de naissance  
  - Motif de visite (liste prédéfinie)
  - Document scanné (optionnel)
- **Action** : Création automatique d'une notification pour directeurs/coordinateurs
- **Statut bénéficiaire** : `EN_ATTENTE_ORIENTATION`

### 2. **Directeur/Coordinateur (DIRECTEUR/COORDINATEUR)**
- **Notification reçue** : "Nouvelle arrivée" avec détails du bénéficiaire
- **Interface** : Page `/notifications` avec liste des notifications
- **Action** : Orienter le bénéficiaire vers une assistante sociale
- **Fonctionnalités** :
  - Voir la liste des assistantes sociales disponibles
  - Ajouter une raison d'orientation
  - Notification automatique à l'assistante sociale sélectionnée
- **Statut bénéficiaire** : `ORIENTE`

### 3. **Assistante Sociale (ASSISTANTE_SOCIALE)**
- **Notification reçue** : "Nouvelle orientation" avec détails et raison
- **Interface** : Accès complet au formulaire détaillé du bénéficiaire
- **Action** : Compléter le dossier complet
- **Statut bénéficiaire** : `EN_SUIVI` → `TERMINE`

## 🔔 Système de Notifications

### Notifications Web
- **Badge de notification** dans la barre de navigation
- **Compteur en temps réel** des notifications non lues
- **Actualisation automatique** toutes les 30 secondes
- **Notifications toast** en haut à droite pour les nouvelles notifications

### Types de notifications
1. **BENEFICIARY_ARRIVAL** : Nouvelle arrivée (Agent → Directeur/Coordinateur)
2. **ORIENTATION_REQUEST** : Orientation (Directeur/Coordinateur → Assistante Sociale)

## 🎛️ Permissions et Rôles

### AGENT_ACCUEIL
- ✅ Créer bénéficiaire (formulaire simplifié)
- ✅ Voir ses propres enregistrements
- ❌ Voir formulaire complet
- ❌ Orienter bénéficiaires

### DIRECTEUR/COORDINATEUR  
- ✅ Recevoir notifications d'arrivée
- ✅ Orienter vers assistantes sociales
- ✅ Voir tous les bénéficiaires
- ✅ Accès page notifications

### ASSISTANTE_SOCIALE
- ✅ Recevoir notifications d'orientation
- ✅ Accès complet au formulaire détaillé
- ✅ Modifier et compléter les dossiers
- ✅ Gestion complète des bénéficiaires

## 🌐 Support Multilingue

- **Formulaire d'accueil** : Français ⟷ Arabe
- **Bouton de basculement** de langue
- **Direction RTL** automatique pour l'arabe
- **Motifs de visite** traduits dans les deux langues

## 📊 Motifs de Visite Prédéfinis

1. Violence conjugale / العنف الزوجي
2. Violence familiale / العنف الأسري
3. Agression sexuelle / الاعتداء الجنسي
4. Harcèlement / التحرش
5. Discrimination / التمييز
6. Problèmes familiaux / مشاكل عائلية
7. Soutien psychologique / الدعم النفسي
8. Aide juridique / المساعدة القانونية
9. Hébergement d'urgence / إيواء طارئ
10. Aide financière / المساعدة المالية
11. Orientation professionnelle / التوجيه المهني
12. Formation / التدريب
13. Soins médicaux / الرعاية الطبية
14. Protection de l'enfant / حماية الطفل
15. Accompagnement social / المرافقة الاجتماعية
16. Information sur les droits / معلومات حول الحقوق
17. Autre / أخرى (avec champ de précision)

## 🔧 Composants Techniques

### Frontend
- `SimpleAccueilForm.tsx` - Formulaire d'accueil simplifié
- `NotificationsPage.tsx` - Interface de gestion des notifications
- `NotificationBadge.tsx` - Badge dans la navigation
- `NotificationToast.tsx` - Notifications en temps réel
- `useNotifications.ts` - Hook pour les notifications

### Backend
- `notifications/operations.ts` - Logique métier des notifications
- Nouveaux enums dans `schema.prisma` : `MotifVisite`, `BeneficiaryStatus`, `NotificationType`
- Modèle `Notification` avec relations

### Permissions
- Permissions étendues dans `usePermissions.ts`
- Nouvelles actions : `ORIENT`, module `NOTIFICATIONS`
- Contrôle d'accès granulaire par rôle

## 🚀 Utilisation

1. **Déployer les migrations** : `wasp db migrate-dev`
2. **Créer des utilisateurs** avec les rôles appropriés
3. **Tester le workflow** :
   - Agent d'accueil crée un bénéficiaire
   - Directeur reçoit notification et oriente
   - Assistante sociale reçoit notification et complète le dossier

Le système est maintenant prêt et respecte parfaitement le processus d'accueil souhaité ! 🎯
