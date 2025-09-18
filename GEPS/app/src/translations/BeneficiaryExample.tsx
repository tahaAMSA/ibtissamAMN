import React, { useState } from 'react';
import { useI18n } from './useI18n';
import { type Language, type DatabaseLanguage } from './index';

// Type pour l'utilisateur avec propriété lang
interface User {
  id: string;
  email: string;
  preferredLanguage?: DatabaseLanguage;
}

// Exemple de composant utilisant l'internationalisation
export function BeneficiaryExample() {
  // Simulation d'un utilisateur (en réalité, cela viendrait de votre contexte d'auth)
  const [user, setUser] = useState<User>({
    id: '1',
    email: 'user@example.com',
    preferredLanguage: 'FR'
  });

  // Utilisation du hook d'internationalisation
  const { t, isRTL, dir } = useI18n(user);

  // Fonction pour changer la langue
  const changeLanguage = (newLang: Language) => {
    setUser(prev => ({ ...prev, preferredLanguage: newLang.toUpperCase() as DatabaseLanguage }));
  };

  return (
    <div 
      className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md"
      dir={dir}
    >
      {/* Sélecteur de langue */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => changeLanguage('fr')}
          className={`px-3 py-1 rounded ${
            user.preferredLanguage === 'FR' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Français
        </button>
        <button
          onClick={() => changeLanguage('ar')}
          className={`px-3 py-1 rounded ${
            user.preferredLanguage === 'AR' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          العربية
        </button>
      </div>

      {/* Contenu traduit */}
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {t('beneficiary.new')}
      </h1>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('beneficiary.name')}
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('beneficiary.name')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('beneficiary.email')}
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('beneficiary.email')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('beneficiary.phone')}
          </label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('beneficiary.phone')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('beneficiary.address')}
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('beneficiary.address')}
            rows={3}
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            {t('action.save')}
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            {t('action.cancel')}
          </button>
        </div>
      </form>

      {/* Message d'information */}
      <div className="mt-6 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          {isRTL 
            ? 'هذا النص يظهر من اليمين إلى اليسار باللغة العربية'
            : 'Ce texte s\'affiche de gauche à droite en français'
          }
        </p>
      </div>

      {/* Exemples d'autres traductions */}
      <div className="mt-6 space-y-2 text-sm text-gray-600">
        <p><strong>Navigation:</strong> {t('nav.home')} | {t('nav.account')} | {t('nav.dashboard')}</p>
        <p><strong>Actions:</strong> {t('action.add')} | {t('action.edit')} | {t('action.delete')} | {t('action.search')}</p>
        <p><strong>Messages:</strong> {t('message.success')} | {t('message.error')} | {t('message.loading')}</p>
        <p><strong>Statuts:</strong> {t('status.pending')} | {t('status.approved')} | {t('status.completed')}</p>
      </div>
    </div>
  );
}

// Composant wrapper pour appliquer les styles RTL au niveau global
export function I18nWrapper({ children, user }: { children: React.ReactNode; user?: User }) {
  const { dir } = useI18n(user);

  return (
    <div dir={dir} className={dir === 'rtl' ? 'font-arabic' : 'font-latin'}>
      {children}
    </div>
  );
} 