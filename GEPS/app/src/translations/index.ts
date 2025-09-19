// Types pour l'internationalisation
export type Language = 'fr' | 'ar';
export type DatabaseLanguage = 'FR' | 'AR';

export interface Translations {
  [key: string]: {
    fr: string;
    ar: string;
  };
}

// ========================================
// TRADUCTIONS CENTRALISÉES
// ========================================

export const translations: Translations = {
  // ========================================
  // NAVIGATION
  // ========================================
  'nav.home': {
    fr: 'Accueil',
    ar: 'الرئيسية'
  },
  'nav.account': {
    fr: 'Mon compte',
    ar: 'حسابي'
  },
  
  // ========================================
  // DASHBOARD
  // ========================================
  'dashboard.title': {
    fr: 'Tableau de Bord - GEPS',
    ar: 'لوحة التحكم - GEPS'
  },
  'dashboard.welcome': {
    fr: 'Bienvenue dans le système de gestion GEPS',
    ar: 'مرحباً بك في نظام إدارة GEPS'
  },
  'dashboard.overview': {
    fr: 'Vue d\'ensemble',
    ar: 'نظرة عامة'
  },
  'dashboard.quickActions': {
    fr: 'Actions rapides',
    ar: 'إجراءات سريعة'
  },
  'dashboard.recentActivity': {
    fr: 'Activité récente',
    ar: 'النشاط الأخير'
  },
  'dashboard.alerts': {
    fr: 'Alertes',
    ar: 'التنبيهات'
  },
  'dashboard.reports': {
    fr: 'Rapports',
    ar: 'التقارير'
  },
  'dashboard.statistics': {
    fr: 'Statistiques',
    ar: 'الإحصائيات'
  },
  'dashboard.monthlyEvolution': {
    fr: 'Évolution mensuelle',
    ar: 'التطور الشهري'
  },
  'dashboard.monthlyEvolutionDesc': {
    fr: 'Tendances des activités GEPS sur 6 mois',
    ar: 'اتجاهات أنشطة GEPS على مدى 6 أشهر'
  },
  'dashboard.expenseDistribution': {
    fr: 'Répartition des dépenses',
    ar: 'توزيع النفقات'
  },
  
  // Périodes
  'period.today': {
    fr: 'Aujourd\'hui',
    ar: 'اليوم'
  },
  'period.week': {
    fr: 'Cette semaine',
    ar: 'هذا الأسبوع'
  },
  'period.month': {
    fr: 'Ce mois',
    ar: 'هذا الشهر'
  },
  'period.year': {
    fr: 'Cette année',
    ar: 'هذا العام'
  },
  
  // Stats du dashboard
  'stats.totalBeneficiaries': {
    fr: 'Total bénéficiaires',
    ar: 'إجمالي المستفيدين'
  },
  'stats.activeBeneficiaries': {
    fr: 'Bénéficiaires actifs',
    ar: 'المستفيدون النشطون'
  },
  'stats.totalDocuments': {
    fr: 'Total documents',
    ar: 'إجمالي الوثائق'
  },
  'stats.activeStays': {
    fr: 'Séjours actifs',
    ar: 'الإقامات النشطة'
  },
  'stats.pendingInterventions': {
    fr: 'Interventions en attente',
    ar: 'التدخلات المعلقة'
  },
  'stats.completedActivities': {
    fr: 'Activités terminées',
    ar: 'الأنشطة المكتملة'
  },
  'stats.monthlyBudget': {
    fr: 'Budget mensuel',
    ar: 'ميزانية الشهر'
  },
  'stats.monthlyExpenses': {
    fr: 'Dépenses mensuelles',
    ar: 'مصروفات الشهر'
  },
  'stats.availableBudget': {
    fr: 'Budget disponible',
    ar: 'الميزانية المتاحة'
  },
  
  // Actions du dashboard
  'dashboard.action.addBeneficiary': {
    fr: 'Ajouter bénéficiaire',
    ar: 'إضافة مستفيد'
  },
  'dashboard.action.createDocument': {
    fr: 'Créer document',
    ar: 'إنشاء وثيقة'
  },
  'dashboard.action.scheduleIntervention': {
    fr: 'Programmer intervention',
    ar: 'جدولة تدخل'
  },
  'dashboard.action.manageAccommodation': {
    fr: 'Gérer hébergement',
    ar: 'إدارة الإيواء'
  },
  'dashboard.action.addActivity': {
    fr: 'Ajouter activité',
    ar: 'إضافة نشاط'
  },
  'dashboard.action.manageBudget': {
    fr: 'Gérer budget',
    ar: 'إدارة الميزانية'
  },
  'nav.logout': {
    fr: 'Déconnexion',
    ar: 'تسجيل الخروج'
  },
  'nav.dashboard': {
    fr: 'Tableau de bord',
    ar: 'لوحة التحكم'
  },
  'nav.settings': {
    fr: 'Paramètres',
    ar: 'الإعدادات'
  },
  'nav.features': {
    fr: 'Fonctionnalités',
    ar: 'الميزات'
  },
  'nav.demo.app': {
    fr: 'Application de démonstration',
    ar: 'تطبيق تجريبي'
  },
  'nav.file.upload': {
    fr: 'Téléchargement de fichiers',
    ar: 'رفع الملفات'
  },
  'nav.documentation': {
    fr: 'Documentation',
    ar: 'الوثائق'
  },
  'nav.blog': {
    fr: 'Blog',
    ar: 'المدونة'
  },
  'nav.app.name': {
    fr: 'GEPS',
    ar: 'GEPS'
  },
  'nav.login': {
    fr: 'Connexion',
    ar: 'تسجيل الدخول'
  },

  // ========================================
  // ACTIONS COMMUNES
  // ========================================
  'action.save': {
    fr: 'Enregistrer',
    ar: 'حفظ'
  },
  'action.cancel': {
    fr: 'Annuler',
    ar: 'إلغاء'
  },
  'action.delete': {
    fr: 'Supprimer',
    ar: 'حذف'
  },
  'action.edit': {
    fr: 'Modifier',
    ar: 'تعديل'
  },
  'action.add': {
    fr: 'Ajouter',
    ar: 'إضافة'
  },
  'action.create': {
    fr: 'Créer',
    ar: 'إنشاء'
  },
  'action.update': {
    fr: 'Mettre à jour',
    ar: 'تحديث'
  },
  'action.search': {
    fr: 'Rechercher',
    ar: 'بحث'
  },
  'action.filter': {
    fr: 'Filtrer',
    ar: 'تصفية'
  },
  'action.export': {
    fr: 'Exporter',
    ar: 'تصدير'
  },
  'action.import': {
    fr: 'Importer',
    ar: 'استيراد'
  },

  // ========================================
  // BÉNÉFICIAIRES
  // ========================================
  'beneficiary.new': {
    fr: 'Nouveau bénéficiaire',
    ar: 'مستفيد جديد'
  },
  'beneficiary.list': {
    fr: 'Liste des bénéficiaires',
    ar: 'قائمة المستفيدين'
  },
  'beneficiary.details': {
    fr: 'Détails du bénéficiaire',
    ar: 'تفاصيل المستفيد'
  },
  'beneficiary.name': {
    fr: 'Nom du bénéficiaire',
    ar: 'اسم المستفيد'
  },
  'beneficiary.phone': {
    fr: 'Téléphone',
    ar: 'الهاتف'
  },
  'beneficiary.email': {
    fr: 'Email',
    ar: 'البريد الإلكتروني'
  },
  'beneficiary.address': {
    fr: 'Adresse',
    ar: 'العنوان'
  },
  'beneficiary.birthdate': {
    fr: 'Date de naissance',
    ar: 'تاريخ الميلاد'
  },
  'beneficiary.status': {
    fr: 'Statut',
    ar: 'الحالة'
  },
  'beneficiary.inactive': {
    fr: 'Inactif',
    ar: 'غير نشط'
  },
  'beneficiary.none.found': {
    fr: 'Aucun bénéficiaire trouvé',
    ar: 'لا توجد مستفيدات'
  },
  'beneficiary.add.first': {
    fr: 'Commencez par ajouter votre premier bénéficiaire',
    ar: 'ابدأ بإضافة أول مستفيد'
  },
  'beneficiary.protection.child': {
    fr: 'Protection de l\'enfance',
    ar: 'حماية الأطفال'
  },
  'beneficiary.protection.child.desc': {
    fr: 'Enfants victimes de violence ou en situation de danger',
    ar: 'الأطفال ضحايا العنف أو في وضعيات خطر'
  },
  'beneficiary.search.placeholder': {
    fr: 'Rechercher par nom, téléphone ou adresse...',
    ar: 'البحث باسم، هاتف أو عنوان...'
  },
  'beneficiary.filter.allTypes': {
    fr: 'Tous types',
    ar: 'جميع الأنواع'
  },
  'beneficiary.filter.women': {
    fr: '👩 Femmes',
    ar: '👩 النساء'
  },
  'beneficiary.filter.children': {
    fr: '🧒 Enfants',
    ar: '🧒 الأطفال'
  },
  'beneficiary.confirmDelete': {
    fr: 'Êtes-vous sûr de vouloir supprimer ce bénéficiaire ?',
    ar: 'هل أنت متأكد من حذف هذا المستفيد؟'
  },

  // ========================================
  // BENEFICIAIRES - COMPOSANTS DÉTAILLÉS
  // ========================================
  
  // AssignmentModal
  'assignment.title': {
    fr: 'Assigner le dossier',
    ar: 'تعيين الملف'
  },
  'assignment.beneficiaryInfo': {
    fr: 'Informations du bénéficiaire',
    ar: 'معلومات المستفيد'
  },
  'assignment.selectAssistant': {
    fr: 'Sélectionner une assistante sociale',
    ar: 'اختر مساعدة اجتماعية'
  },
  'assignment.reason': {
    fr: 'Raison de l\'assignation (optionnel)',
    ar: 'سبب التعيين (اختياري)'
  },
  'assignment.assign': {
    fr: 'Assigner',
    ar: 'تعيين'
  },
  'assignment.assigning': {
    fr: 'Assignation...',
    ar: 'جاري التعيين...'
  },
  'assignment.pleaseSelect': {
    fr: 'Veuillez sélectionner une assistante sociale',
    ar: 'يرجى اختيار مساعدة اجتماعية'
  },
  'assignment.success': {
    fr: 'Dossier assigné avec succès !',
    ar: 'تم تعيين الملف بنجاح!'
  },
  'assignment.currentStatus': {
    fr: 'Statut actuel',
    ar: 'الحالة الحالية'
  },
  'assignment.noAssistants': {
    fr: 'Aucune assistante sociale disponible',
    ar: 'لا توجد مساعدات اجتماعيات متاحات'
  },
  'assignment.choose': {
    fr: 'Choisir une assistante sociale...',
    ar: 'اختر مساعدة اجتماعية...'
  },
  'assignment.reasonPlaceholder': {
    fr: 'Pourquoi assigner ce dossier à cette assistante sociale ?',
    ar: 'لماذا تعين هذا الملف لهذه المساعدة الاجتماعية؟'
  },
  'assignment.assignTo': {
    fr: 'Assigner à une assistante sociale',
    ar: 'تعيين إلى مساعدة اجتماعية'
  },

  // BeneficiaryCard
  'beneficiary.age': {
    fr: 'Âge',
    ar: 'العمر'
  },
  'beneficiary.male': {
    fr: 'Homme',
    ar: 'ذكر'
  },
  'beneficiary.female': {
    fr: 'Femme',
    ar: 'أنثى'
  },
  'beneficiary.view': {
    fr: 'Voir',
    ar: 'عرض'
  },
  'beneficiary.assign': {
    fr: 'Assigner',
    ar: 'تعيين'
  },
  'beneficiary.documents': {
    fr: 'Documents',
    ar: 'الوثائق'
  },
  'beneficiary.accommodation': {
    fr: 'Hébergement',
    ar: 'الإيواء'
  },
  'beneficiary.years': {
    fr: 'ans',
    ar: 'سنة'
  },
  'beneficiary.woman': {
    fr: 'Femme',
    ar: 'امرأة'
  },
  'beneficiary.child': {
    fr: 'Enfant',
    ar: 'طفل'
  },
  'beneficiary.active': {
    fr: 'Actif',
    ar: 'نشط'
  },

  // BeneficiaryDetailHeader
  'beneficiary.back': {
    fr: 'Retour',
    ar: 'رجوع'
  },
  'beneficiary.personalInfo': {
    fr: 'Informations personnelles',
    ar: 'المعلومات الشخصية'
  },

  // BeneficiaryFilters
  'filters.search': {
    fr: 'Rechercher...',
    ar: 'البحث...'
  },
  'filters.filter': {
    fr: 'Filtrer',
    ar: 'تصفية'
  },
  'filters.clearFilters': {
    fr: 'Effacer les filtres',
    ar: 'مسح المرشحات'
  },
  'filters.all': {
    fr: 'Tous',
    ar: 'الكل'
  },
  'filters.beneficiaryType': {
    fr: 'Type de bénéficiaire',
    ar: 'نوع المستفيد'
  },
  'filters.women': {
    fr: 'Femmes',
    ar: 'النساء'
  },
  'filters.children': {
    fr: 'Enfants',
    ar: 'الأطفال'
  },
  'filters.gender': {
    fr: 'Genre',
    ar: 'الجنس'
  },
  'filters.ageRange': {
    fr: 'Tranche d\'âge',
    ar: 'الفئة العمرية'
  },
  'filters.city': {
    fr: 'Ville',
    ar: 'المدينة'
  },
  'filters.status': {
    fr: 'Statut',
    ar: 'الحالة'
  },
  'filters.results': {
    fr: 'résultats',
    ar: 'نتيجة'
  },
  'filters.showing': {
    fr: 'Affichage de',
    ar: 'عرض'
  },
  'filters.childrenAge': {
    fr: 'Enfants (0-17)',
    ar: 'أطفال (0-17)'
  },
  'filters.adults': {
    fr: 'Adultes (18-64)',
    ar: 'بالغون (18-64)'
  },
  'filters.seniors': {
    fr: 'Seniors (65+)',
    ar: 'كبار السن (65+)'
  },
  'filters.casablanca': {
    fr: 'Casablanca',
    ar: 'الدار البيضاء'
  },
  'filters.rabat': {
    fr: 'Rabat',
    ar: 'الرباط'
  },
  'filters.marrakech': {
    fr: 'Marrakech',
    ar: 'مراكش'
  },
  'filters.fes': {
    fr: 'Fès',
    ar: 'فاس'
  },
  'filters.filtersActive': {
    fr: 'filtres actifs',
    ar: 'مرشح نشط'
  },
  'filters.beneficiariesTitle': {
    fr: 'Filtrer les bénéficiaires',
    ar: 'تصفية المستفيدين'
  },

  // BeneficiaryHeader
  'beneficiary.management': {
    fr: 'Gestion des Bénéficiaires',
    ar: 'إدارة المستفيدين'
  },
  'beneficiary.managementSubtitle': {
    fr: 'Gestion complète des dossiers bénéficiaires et services fournis',
    ar: 'إدارة شاملة لملفات المستفيدين والخدمات المقدمة'
  },
  'beneficiary.addWoman': {
    fr: 'Fiche bénéficiaire détaillée',
    ar: 'فيش مستفيدة مفصلة'
  },
  'beneficiary.addChildProtection': {
    fr: 'Unité Protection Enfance',
    ar: 'وحدة حماية الطفولة'
  },
  'beneficiary.addSimpleAccueil': {
    fr: 'Enregistrement Accueil',
    ar: 'تسجيل الاستقبال'
  },
  'beneficiary.totalBeneficiaries': {
    fr: 'Total bénéficiaires',
    ar: 'إجمالي المستفيدين'
  },
  'beneficiary.activeBeneficiaries': {
    fr: 'Bénéficiaires actifs',
    ar: 'المستفيدون النشطون'
  },
  'beneficiary.newThisMonth': {
    fr: 'Nouveaux ce mois',
    ar: 'جديد هذا الشهر'
  },
  'beneficiary.integratedSystem': {
    fr: 'Système de gestion intégré',
    ar: 'نظام إدارة شامل'
  },
  'beneficiary.reception': {
    fr: 'استقبال',
    ar: 'Accueil'
  },
  'beneficiary.women18Plus': {
    fr: 'Femmes 18+',
    ar: 'نساء 18+'
  },
  'beneficiary.children0to17': {
    fr: 'Enfants 0-17',
    ar: 'أطفال 0-17'
  },

  // BeneficiaryLifecycle
  'lifecycle.title': {
    fr: 'Cycle de vie du dossier',
    ar: 'دورة حياة الملف'
  },
  'lifecycle.reception': {
    fr: 'Accueil',
    ar: 'الاستقبال'
  },
  'lifecycle.orientation': {
    fr: 'Orientation',
    ar: 'التوجيه'
  },
  'lifecycle.assignment': {
    fr: 'Assignation',
    ar: 'التعيين'
  },
  'lifecycle.processing': {
    fr: 'Traitement',
    ar: 'المعالجة'
  },
  'lifecycle.by': {
    fr: 'Par',
    ar: 'بواسطة'
  },
  'lifecycle.on': {
    fr: 'Le',
    ar: 'في'
  },
  'lifecycle.reason': {
    fr: 'Raison',
    ar: 'السبب'
  },
  'lifecycle.pending': {
    fr: 'En attente',
    ar: 'في الانتظار'
  },
  'lifecycle.completed': {
    fr: 'Terminé',
    ar: 'مكتمل'
  },
  'lifecycle.inProgress': {
    fr: 'En cours',
    ar: 'قيد التنفيذ'
  },
  'lifecycle.initialRegistration': {
    fr: 'Enregistrement initial',
    ar: 'التسجيل الأولي'
  },
  'lifecycle.pendingOrientation': {
    fr: 'En attente d\'orientation',
    ar: 'في انتظار التوجيه'
  },
  'lifecycle.assignedToSocialWorker': {
    fr: 'Assigné à une assistante sociale',
    ar: 'مُعين لمساعدة اجتماعية'
  },
  'lifecycle.protectionChild': {
    fr: 'Protection Enfance',
    ar: 'حماية الطفولة'
  },
  'lifecycle.supportWomen': {
    fr: 'Accompagnement Femmes',
    ar: 'مرافقة النساء'
  },

  // Status labels
  'status.waitingReception': {
    fr: 'En attente d\'accueil',
    ar: 'في انتظار الاستقبال'
  },
  'status.waitingOrientation': {
    fr: 'En attente d\'orientation',
    ar: 'في انتظار التوجيه'
  },
  'status.oriented': {
    fr: 'Orienté',
    ar: 'موجه'
  },
  'status.inSupport': {
    fr: 'En suivi',
    ar: 'تحت المتابعة'
  },
  'status.finished': {
    fr: 'Terminé',
    ar: 'مكتمل'
  },

  // BeneficiaryStats
  'stats.title': {
    fr: 'Statistiques',
    ar: 'الإحصائيات'
  },
  'stats.activities': {
    fr: 'Activités',
    ar: 'الأنشطة'
  },
  'stats.projects': {
    fr: 'Projets',
    ar: 'المشاريع'
  },
  'stats.education': {
    fr: 'Éducation',
    ar: 'التعليم'
  },
  'stats.interventions': {
    fr: 'Interventions',
    ar: 'التدخلات'
  },

  // DashboardPanel
  'dashboard.women': {
    fr: 'Femmes',
    ar: 'النساء'
  },
  'dashboard.children': {
    fr: 'Enfants',
    ar: 'الأطفال'
  },
  'dashboard.pendingOrientation': {
    fr: 'En attente d\'orientation',
    ar: 'في انتظار التوجيه'
  },
  'dashboard.activeSupport': {
    fr: 'En suivi actif',
    ar: 'في المتابعة'
  },
  'dashboard.thisMonth': {
    fr: 'Ce mois-ci',
    ar: 'هذا الشهر'
  },
  'dashboard.womenSupport': {
    fr: 'Accompagnement femmes',
    ar: 'دعم النساء'
  },
  'dashboard.childProtection': {
    fr: 'Protection enfance',
    ar: 'حماية الطفولة'
  },
  'dashboard.orientationNeeded': {
    fr: 'Nécessite orientation',
    ar: 'تحتاج توجيه'
  },
  'dashboard.newArrivals': {
    fr: 'Nouvelles arrivées',
    ar: 'وافدون جدد'
  },
  'dashboard.pendingOrientationAlert': {
    fr: 'bénéficiaire en attente d\'orientation',
    ar: 'مستفيد في انتظار التوجيه'
  },
  'dashboard.pendingOrientationAlertPlural': {
    fr: 'bénéficiaires en attente d\'orientation',
    ar: 'مستفيد في انتظار التوجيه'
  },
  'dashboard.orientationInstruction': {
    fr: 'Ils doivent être orientés vers les assistantes sociales appropriées',
    ar: 'يجب توجيههم إلى المساعدات الاجتماعيات المناسبات'
  },
  'dashboard.orientationModeActive': {
    fr: 'Mode orientation actif',
    ar: 'وضع التوجيه النشط'
  },
  'dashboard.orientationModeDescription': {
    fr: 'Seuls les bénéficiaires nécessitant une orientation sont affichés',
    ar: 'يتم عرض المستفيدين الذين يحتاجون إلى توجيه فقط'
  },

  // Général pour les composants
  'general.name': {
    fr: 'Nom',
    ar: 'الاسم'
  },
  'general.firstName': {
    fr: 'Prénom',
    ar: 'الاسم الأول'
  },
  'general.lastName': {
    fr: 'Nom de famille',
    ar: 'اسم العائلة'
  },
  'general.fullName': {
    fr: 'Nom complet',
    ar: 'الاسم الكامل'
  },
  'general.phone': {
    fr: 'Téléphone',
    ar: 'الهاتف'
  },
  'general.address': {
    fr: 'Adresse',
    ar: 'العنوان'
  },
  'general.visitReason': {
    fr: 'Motif de visite',
    ar: 'سبب الزيارة'
  },
  'general.familySituation': {
    fr: 'Situation familiale',
    ar: 'الوضعية العائلية'
  },
  'general.professionalSituation': {
    fr: 'Situation professionnelle',
    ar: 'الوضعية المهنية'
  },

  // ========================================
  // FORMULAIRES
  // ========================================
  'form.required': {
    fr: 'Ce champ est requis',
    ar: 'هذا الحقل مطلوب'
  },
  'form.invalid.email': {
    fr: 'Email invalide',
    ar: 'بريد إلكتروني غير صحيح'
  },
  'form.invalid.phone': {
    fr: 'Numéro de téléphone invalide',
    ar: 'رقم هاتف غير صحيح'
  },
  'form.invalid.password': {
    fr: 'Mot de passe invalide',
    ar: 'كلمة مرور غير صحيحة'
  },
  'form.password.confirm': {
    fr: 'Confirmer le mot de passe',
    ar: 'تأكيد كلمة المرور'
  },
  'form.password.mismatch': {
    fr: 'Les mots de passe ne correspondent pas',
    ar: 'كلمات المرور غير متطابقة'
  },

  // ========================================
  // MESSAGES
  // ========================================
  'message.success': {
    fr: 'Opération réussie',
    ar: 'تمت العملية بنجاح'
  },
  'message.error': {
    fr: 'Une erreur est survenue',
    ar: 'حدث خطأ'
  },
  'message.loading': {
    fr: 'Chargement...',
    ar: 'جاري التحميل...'
  },
  'message.no.data': {
    fr: 'Aucune donnée disponible',
    ar: 'لا توجد بيانات متاحة'
  },
  'message.confirm.delete': {
    fr: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    ar: 'هل أنت متأكد من حذف هذا العنصر؟'
  },
  'message.saved': {
    fr: 'Enregistré avec succès',
    ar: 'تم الحفظ بنجاح'
  },
  'message.updated': {
    fr: 'Mis à jour avec succès',
    ar: 'تم التحديث بنجاح'
  },
  'message.deleted': {
    fr: 'Supprimé avec succès',
    ar: 'تم الحذف بنجاح'
  },

  // ========================================
  // AUTHENTIFICATION
  // ========================================
  'auth.login': {
    fr: 'Connexion',
    ar: 'تسجيل الدخول'
  },
  'auth.signup': {
    fr: 'Inscription',
    ar: 'التسجيل'
  },
  'auth.logout': {
    fr: 'Déconnexion',
    ar: 'تسجيل الخروج'
  },
  'auth.email': {
    fr: 'Email',
    ar: 'البريد الإلكتروني'
  },
  'auth.password': {
    fr: 'Mot de passe',
    ar: 'كلمة المرور'
  },
  'auth.confirm.password': {
    fr: 'Confirmer le mot de passe',
    ar: 'تأكيد كلمة المرور'
  },
  'auth.forgot.password': {
    fr: 'Mot de passe oublié ?',
    ar: 'نسيت كلمة المرور؟'
  },
  'auth.reset.password': {
    fr: 'Réinitialiser le mot de passe',
    ar: 'إعادة تعيين كلمة المرور'
  },
  'auth.remember.me': {
    fr: 'Se souvenir de moi',
    ar: 'تذكرني'
  },
  'auth.login.success': {
    fr: 'Connexion réussie',
    ar: 'تم تسجيل الدخول بنجاح'
  },
  'auth.logout.success': {
    fr: 'Déconnexion réussie',
    ar: 'تم تسجيل الخروج بنجاح'
  },

  // ========================================
  // PARAMÈTRES
  // ========================================
  'settings.language': {
    fr: 'Langue',
    ar: 'اللغة'
  },
  'settings.language.fr': {
    fr: 'Français',
    ar: 'الفرنسية'
  },
  'settings.language.ar': {
    fr: 'العربية',
    ar: 'العربية'
  },
  'settings.profile': {
    fr: 'Profil',
    ar: 'الملف الشخصي'
  },
  'settings.notifications': {
    fr: 'Notifications',
    ar: 'الإشعارات'
  },
  'settings.security': {
    fr: 'Sécurité',
    ar: 'الأمان'
  },
  'settings.theme': {
    fr: 'Thème',
    ar: 'المظهر'
  },
  'settings.theme.light': {
    fr: 'Clair',
    ar: 'فاتح'
  },
  'settings.theme.dark': {
    fr: 'Sombre',
    ar: 'داكن'
  },

  // ========================================
  // FICHIERS
  // ========================================
  'file.upload': {
    fr: 'Télécharger un fichier',
    ar: 'رفع ملف'
  },
  'file.download': {
    fr: 'Télécharger',
    ar: 'تحميل'
  },
  'file.delete': {
    fr: 'Supprimer le fichier',
    ar: 'حذف الملف'
  },
  'file.rename': {
    fr: 'Renommer le fichier',
    ar: 'إعادة تسمية الملف'
  },
  'file.size': {
    fr: 'Taille du fichier',
    ar: 'حجم الملف'
  },
  'file.type': {
    fr: 'Type de fichier',
    ar: 'نوع الملف'
  },
  'file.date.uploaded': {
    fr: 'Date de téléchargement',
    ar: 'تاريخ الرفع'
  },
  'file.select': {
    fr: 'Sélectionner un fichier',
    ar: 'اختيار ملف'
  },
  'file.drag.drop': {
    fr: 'Glissez-déposez un fichier ici',
    ar: 'اسحب وأفلت ملف هنا'
  },

  // ========================================
  // PAGES
  // ========================================
  'page.demo.app': {
    fr: 'Application de démonstration',
    ar: 'تطبيق تجريبي'
  },
  'page.landing': {
    fr: 'Page d\'accueil',
    ar: 'الصفحة الرئيسية'
  },
  'page.dashboard': {
    fr: 'Tableau de bord',
    ar: 'لوحة التحكم'
  },
  'page.beneficiaries': {
    fr: 'Bénéficiaires',
    ar: 'المستفيدون'
  },
  'page.reports': {
    fr: 'Rapports',
    ar: 'التقارير'
  },
  'page.analytics': {
    fr: 'Analyses',
    ar: 'التحليلات'
  },

  // ========================================
  // TABLEAUX ET LISTES
  // ========================================
  'table.no.results': {
    fr: 'Aucun résultat trouvé',
    ar: 'لم يتم العثور على نتائج'
  },
  'table.loading': {
    fr: 'Chargement des données...',
    ar: 'جاري تحميل البيانات...'
  },
  'table.rows.per.page': {
    fr: 'Lignes par page',
    ar: 'صفوف في الصفحة'
  },
  'table.of': {
    fr: 'sur',
    ar: 'من'
  },
  'table.previous': {
    fr: 'Précédent',
    ar: 'السابق'
  },
  'table.next': {
    fr: 'Suivant',
    ar: 'التالي'
  },
  'table.first': {
    fr: 'Premier',
    ar: 'الأول'
  },
  'table.last': {
    fr: 'Dernier',
    ar: 'الأخير'
  },

  // ========================================
  // MODALES ET POPUPS
  // ========================================
  'modal.close': {
    fr: 'Fermer',
    ar: 'إغلاق'
  },
  'modal.confirm': {
    fr: 'Confirmer',
    ar: 'تأكيد'
  },
  'modal.yes': {
    fr: 'Oui',
    ar: 'نعم'
  },
  'modal.no': {
    fr: 'Non',
    ar: 'لا'
  },
  'modal.ok': {
    fr: 'OK',
    ar: 'موافق'
  },

  // ========================================
  // ERREURS
  // ========================================
  'error.network': {
    fr: 'Erreur de connexion réseau',
    ar: 'خطأ في الاتصال بالشبكة'
  },
  'error.server': {
    fr: 'Erreur du serveur',
    ar: 'خطأ في الخادم'
  },
  'error.unauthorized': {
    fr: 'Non autorisé',
    ar: 'غير مصرح'
  },
  'error.forbidden': {
    fr: 'Accès interdit',
    ar: 'الوصول ممنوع'
  },
  'error.not.found': {
    fr: 'Page non trouvée',
    ar: 'الصفحة غير موجودة'
  },
  'error.validation': {
    fr: 'Erreur de validation',
    ar: 'خطأ في التحقق'
  },

  // ========================================
  // DATES ET HEURES
  // ========================================
  'date.today': {
    fr: 'Aujourd\'hui',
    ar: 'اليوم'
  },
  'date.yesterday': {
    fr: 'Hier',
    ar: 'أمس'
  },
  'date.tomorrow': {
    fr: 'Demain',
    ar: 'غداً'
  },
  'date.this.week': {
    fr: 'Cette semaine',
    ar: 'هذا الأسبوع'
  },
  'date.last.week': {
    fr: 'La semaine dernière',
    ar: 'الأسبوع الماضي'
  },
  'date.this.month': {
    fr: 'Ce mois',
    ar: 'هذا الشهر'
  },
  'date.last.month': {
    fr: 'Le mois dernier',
    ar: 'الشهر الماضي'
  },

  // ========================================
  // STATUTS
  // ========================================
  'status.pending': {
    fr: 'En attente',
    ar: 'في الانتظار'
  },
  'status.approved': {
    fr: 'Approuvé',
    ar: 'موافق عليه'
  },
  'status.rejected': {
    fr: 'Rejeté',
    ar: 'مرفوض'
  },
  'status.completed': {
    fr: 'Terminé',
    ar: 'مكتمل'
  },
  'status.in.progress': {
    fr: 'En cours',
    ar: 'قيد التنفيذ'
  },
  'status.cancelled': {
    fr: 'Annulé',
    ar: 'ملغي'
  },

  // ========================================
  // LANDING PAGE GEPS
  // ========================================
  'landing.hero.title': {
    fr: 'Gérez efficacement vos établissements de protection sociale',
    ar: 'إدارة فعالة لمؤسسات الحماية الاجتماعية'
  },
  'landing.hero.subtitle': {
    fr: 'Plateforme de gestion sociale tout-en-un pour optimiser le suivi des bénéficiaires, l\'hébergement, la restauration et les services sociaux dans tous vos établissements',
    ar: 'منصة إدارة اجتماعية شاملة لتحسين متابعة المستفيدين والإيواء والطعام والخدمات الاجتماعية في جميع مؤسساتكم'
  },
  'landing.hero.cta': {
    fr: 'Accéder à la plateforme',
    ar: 'الوصول إلى المنصة'
  },
  'landing.features.beneficiaries.title': {
    fr: 'Gestion des bénéficiaires',
    ar: 'إدارة المستفيدين'
  },
  'landing.features.beneficiaries.description': {
    fr: 'Suivi complet des profils, dossiers et informations personnelles',
    ar: 'متابعة شاملة للملفات الشخصية والسجلات والمعلومات الشخصية'
  },
  'landing.features.housing.title': {
    fr: 'Hébergement & Restauration',
    ar: 'الإيواء والطعام'
  },
  'landing.features.housing.description': {
    fr: 'Gestion des chambres, repas et services d\'accueil',
    ar: 'إدارة الغرف والوجبات وخدمات الاستقبال'
  },
  'landing.features.social.title': {
    fr: 'Dossiers sociaux et médicaux',
    ar: 'الملفات الاجتماعية والطبية'
  },
  'landing.features.social.description': {
    fr: 'Suivi médical, accompagnement social et évaluations',
    ar: 'المتابعة الطبية والدعم الاجتماعي والتقييمات'
  },
  'landing.features.education.title': {
    fr: 'Scolarité et activités',
    ar: 'التعليم والأنشطة'
  },
  'landing.features.education.description': {
    fr: 'Gestion scolaire, activités éducatives et suivi des progrès',
    ar: 'إدارة التعليم والأنشطة التعليمية ومتابعة التقدم'
  },
  'landing.features.budget.title': {
    fr: 'Suivi budgétaire et indicateurs',
    ar: 'المتابعة المالية والمؤشرات'
  },
  'landing.features.budget.description': {
    fr: 'Gestion financière, rapports et indicateurs de performance',
    ar: 'الإدارة المالية والتقارير ومؤشرات الأداء'
  },
  'landing.security.title': {
    fr: 'Sécurité et accessibilité',
    ar: 'الأمان وإمكانية الوصول'
  },
  'landing.security.encryption.title': {
    fr: 'Chiffrement des données',
    ar: 'تشفير البيانات'
  },
  'landing.security.encryption.description': {
    fr: 'Protection avancée de vos données sensibles',
    ar: 'حماية متقدمة لبياناتك الحساسة'
  },
  'landing.security.roles.title': {
    fr: 'Accès par rôle',
    ar: 'الوصول حسب الدور'
  },
  'landing.security.roles.description': {
    fr: 'Contrôle d\'accès granulaire selon les responsabilités',
    ar: 'التحكم في الوصول التفصيلي حسب المسؤوليات'
  },
  'landing.security.multilingual.title': {
    fr: 'Interface multilingue',
    ar: 'واجهة متعددة اللغات'
  },
  'landing.security.multilingual.description': {
    fr: 'Support complet français et arabe avec RTL',
    ar: 'دعم كامل للفرنسية والعربية مع RTL'
  },
  'landing.footer.copyright': {
    fr: '© 2025 GEPS. Tous droits réservés.',
    ar: '© 2025 GEPS. جميع الحقوق محفوظة.'
  },
  'landing.footer.contact': {
    fr: 'Contact',
    ar: 'اتصل بنا'
  },
  'landing.footer.privacy': {
    fr: 'Confidentialité',
    ar: 'الخصوصية'
  },
  'landing.footer.terms': {
    fr: 'Conditions d\'utilisation',
    ar: 'شروط الاستخدام'
  },

  // ========================================
  // LANDING PAGE - TEXTES SUPPLÉMENTAIRES
  // ========================================
  'landing.hero.badge': {
    fr: 'Système de gestion sociale moderne',
    ar: 'نظام إدارة اجتماعية حديث'
  },
  'landing.hero.discover': {
    fr: 'Découvrir les fonctionnalités',
    ar: 'اكتشف الميزات'
  },
  'landing.hero.centralized.title': {
    fr: 'Gestion centralisée',
    ar: 'إدارة مركزية'
  },
  'landing.hero.centralized.description': {
    fr: 'Tous les établissements de protection sociale en un seul endroit',
    ar: 'جميع مؤسسات الحماية الاجتماعية في مكان واحد'
  },
  'landing.hero.realtime.title': {
    fr: 'Suivi en temps réel',
    ar: 'متابعة في الوقت الفعلي'
  },
  'landing.hero.realtime.description': {
    fr: 'Informations actualisées instantanément pour tous vos bénéficiaires',
    ar: 'معلومات محدثة فورياً لجميع المستفيدين'
  },
  'landing.hero.security.title': {
    fr: 'Sécurité garantie',
    ar: 'أمان مضمون'
  },
  'landing.hero.security.description': {
    fr: 'Protection avancée des données sensibles de vos établissements',
    ar: 'حماية متقدمة للبيانات الحساسة لمؤسساتكم'
  },
  'landing.features.badge': {
    fr: 'Fonctionnalités complètes',
    ar: 'ميزات شاملة'
  },
  'landing.features.subtitle': {
    fr: 'Une plateforme complète pour gérer tous les aspects du suivi social dans vos établissements de protection sociale',
    ar: 'منصة شاملة لإدارة جميع جوانب المتابعة الاجتماعية في مؤسسات الحماية الاجتماعية'
  },
  'nav.security': {
    fr: 'Sécurité',
    ar: 'الأمان'
  },
  'landing.stats.badge': {
    fr: 'Performance et impact',
    ar: 'الأداء والتأثير'
  },
  'landing.security.badge': {
    fr: 'Sécurité et conformité',
    ar: 'الأمان والامتثال'
  },
  'landing.footer.description': {
    fr: 'Plateforme de gestion sociale tout-en-un pour les établissements de protection sociale. Optimisez le suivi des bénéficiaires et améliorez l\'efficacité de vos services sociaux.',
    ar: 'منصة إدارة اجتماعية شاملة لمؤسسات الحماية الاجتماعية. تحسين متابعة المستفيدين وتحسين كفاءة الخدمات الاجتماعية.'
  },
  'landing.stats.title': {
    fr: 'Impact et Efficacité',
    ar: 'التأثير والكفاءة'
  },
  'landing.stats.subtitle': {
    fr: 'Découvrez l\'impact de GEPS sur la gestion des établissements de protection sociale.',
    ar: 'اكتشف تأثير GEPS على إدارة مؤسسات الحماية الاجتماعية.'
  },
  'landing.stats.cta.title': {
    fr: 'Prêt à transformer votre gestion sociale ?',
    ar: 'مستعد لتحويل إدارتك الاجتماعية؟'
  },
  'landing.stats.cta.button': {
    fr: 'Demander une démo',
    ar: 'طلب عرض توضيحي'
  },

  // ========================================
  // GÉNÉRAL
  // ========================================
  'general.yes': {
    fr: 'Oui',
    ar: 'نعم'
  },
  'general.no': {
    fr: 'Non',
    ar: 'لا'
  },
  'general.optional': {
    fr: 'Optionnel',
    ar: 'اختياري'
  },
  'general.required': {
    fr: 'Requis',
    ar: 'مطلوب'
  },
  'general.all': {
    fr: 'Tous',
    ar: 'الكل'
  },
  'general.none': {
    fr: 'Aucun',
    ar: 'لا شيء'
  },
  'general.select': {
    fr: 'Sélectionner',
    ar: 'اختيار'
  },
  'general.clear': {
    fr: 'Effacer',
    ar: 'مسح'
  },
  'general.refresh': {
    fr: 'Actualiser',
    ar: 'تحديث'
  },
  'general.back': {
    fr: 'Retour',
    ar: 'رجوع'
  },
  'general.forward': {
    fr: 'Suivant',
    ar: 'التالي'
  },
  'general.submit': {
    fr: 'Soumettre',
    ar: 'إرسال'
  },
  'general.reset': {
    fr: 'Réinitialiser',
    ar: 'إعادة تعيين'
  },

  // ========================================
  // SIDEBAR NAVIGATION
  // ========================================
  'sidebar.navigation.main': {
    fr: 'Principal',
    ar: 'الرئيسية'
  },
  'sidebar.navigation.administration': {
    fr: 'Administration',
    ar: 'الإدارة'
  },
  'sidebar.group.services': {
    fr: 'Services & Ressources',
    ar: 'الخدمات والموارد'
  },
  'sidebar.group.support': {
    fr: 'Accompagnement',
    ar: 'المرافقة'
  },
  'sidebar.group.development': {
    fr: 'Développement',
    ar: 'التطوير'
  },
  'sidebar.group.management': {
    fr: 'Gestion',
    ar: 'الإدارة'
  },
  'sidebar.nav.dashboard': {
    fr: 'Tableau de bord',
    ar: 'لوحة التحكم'
  },
  'sidebar.nav.beneficiaries': {
    fr: 'Bénéficiaires',
    ar: 'المستفيدون'
  },
  'sidebar.nav.notifications': {
    fr: 'Notifications',
    ar: 'الإشعارات'
  },
  'sidebar.nav.accommodation': {
    fr: 'Hébergement',
    ar: 'الإيواء'
  },
  'sidebar.nav.meals': {
    fr: 'Repas',
    ar: 'الوجبات'
  },
  'sidebar.nav.resources': {
    fr: 'Ressources',
    ar: 'الموارد'
  },
  'sidebar.nav.documents': {
    fr: 'Documents',
    ar: 'الوثائق'
  },
  'sidebar.nav.interventions': {
    fr: 'Interventions',
    ar: 'التدخلات'
  },
  'sidebar.nav.education': {
    fr: 'Éducation',
    ar: 'التعليم'
  },
  'sidebar.nav.training': {
    fr: 'Formations',
    ar: 'التدريبات'
  },
  'sidebar.nav.activities': {
    fr: 'Activités',
    ar: 'الأنشطة'
  },
  'sidebar.nav.projects': {
    fr: 'Projets',
    ar: 'المشاريع'
  },
  'sidebar.nav.budget': {
    fr: 'Budget',
    ar: 'الميزانية'
  },
  'sidebar.nav.timeTracking': {
    fr: 'Suivi du temps',
    ar: 'تتبع الوقت'
  },
  'sidebar.nav.administration': {
    fr: 'Administration',
    ar: 'الإدارة'
  },
  'sidebar.language.switch': {
    fr: 'Changer vers العربية',
    ar: 'تغيير إلى Français'
  },
  'sidebar.language.current.fr': {
    fr: 'FR',
    ar: 'FR'
  },
  'sidebar.language.current.ar': {
    fr: 'عر',
    ar: 'عر'
  },
  'sidebar.tooltip.switchLanguage': {
    fr: 'Changer vers l\'arabe',
    ar: 'تغيير إلى الفرنسية'
  },
  'sidebar.tooltip.settings': {
    fr: 'Paramètres',
    ar: 'الإعدادات'
  },
  'sidebar.tooltip.logout': {
    fr: 'Déconnexion',
    ar: 'تسجيل الخروج'
  }
}; 