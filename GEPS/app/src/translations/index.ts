// Types pour l'internationalisation
export type Language = 'fr' | 'ar';

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
  'beneficiary.active': {
    fr: 'Actif',
    ar: 'نشط'
  },
  'beneficiary.inactive': {
    fr: 'Inactif',
    ar: 'غير نشط'
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
    fr: 'Gérez efficacement le suivi social au sein du Complexe Ibtissama',
    ar: 'إدارة فعالة للمتابعة الاجتماعية في مجمع ابتسامة'
  },
  'landing.hero.subtitle': {
    fr: 'Plateforme de gestion sociale tout-en-un pour optimiser le suivi des bénéficiaires, l\'hébergement, la restauration et les services sociaux',
    ar: 'منصة إدارة اجتماعية شاملة لتحسين متابعة المستفيدين والإيواء والطعام والخدمات الاجتماعية'
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
  }
}; 