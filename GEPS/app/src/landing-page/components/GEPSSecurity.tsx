import React from 'react';
import { useI18n } from '../../translations/useI18n';
import { type Language } from '../../translations';

interface GEPSSecurityProps {
  user?: { lang?: Language };
}

export default function GEPSSecurity({ user }: GEPSSecurityProps) {
  const { t, dir } = useI18n(user);

  const securityFeatures = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: t('landing.security.encryption.title'),
      description: t('landing.security.encryption.description'),
      color: 'bg-green-500'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: t('landing.security.roles.title'),
      description: t('landing.security.roles.description'),
      color: 'bg-blue-500'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      title: t('landing.security.multilingual.title'),
      description: t('landing.security.multilingual.description'),
      color: 'bg-purple-500'
    }
  ];

  return (
    <section className="py-20 bg-white" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('landing.security.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Votre plateforme sécurisée et accessible pour une gestion optimale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className={`w-20 h-20 ${feature.color} rounded-full flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Section supplémentaire avec statistiques */}
        <div className="mt-20 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-2">100%</div>
              <div className="text-gray-700 font-medium">Sécurisé</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-2">24/7</div>
              <div className="text-gray-700 font-medium">Disponible</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-2">2</div>
              <div className="text-gray-700 font-medium">Langues</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 