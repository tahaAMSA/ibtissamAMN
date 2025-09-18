import React, { useState } from 'react';
import { useI18n } from '../translations/useI18n';
import { type Language, type DatabaseLanguage } from '../translations';
import Header from './components/Header';
import GEPSHero from './components/GEPSHero';
import GEPSFeatures from './components/GEPSFeatures';
import GEPSStatistics from './components/GEPSStatistics';
import GEPSSecurity from './components/GEPSSecurity';
import GEPSFooter from './components/GEPSFooter';

export default function GEPSLandingPage() {
  // État pour la langue de l'utilisateur (en réalité, cela viendrait du contexte d'auth)
  const [userLang, setUserLang] = useState<Language>('fr');
  
  // Utilisation du hook d'internationalisation
  const { dir } = useI18n({ preferredLanguage: userLang.toUpperCase() as DatabaseLanguage });

  // Fonction pour changer la langue
  const handleLanguageChange = (lang: Language) => {
    setUserLang(lang);
  };

  // Objet utilisateur simulé
  const user = { preferredLanguage: userLang.toUpperCase() as DatabaseLanguage };

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      {/* Header avec navigation et sélecteur de langue */}
      <Header user={user} onLanguageChange={handleLanguageChange} />
      
      {/* Section Hero */}
      <GEPSHero user={user} />
      
      {/* Section Fonctionnalités */}
      <GEPSFeatures user={user} />
      
      {/* Section Statistiques */}
      <GEPSStatistics user={user} />
      
      {/* Section Sécurité et accessibilité */}
      <GEPSSecurity user={user} />
      
      {/* Footer */}
      <GEPSFooter user={user} />
    </div>
  );
} 