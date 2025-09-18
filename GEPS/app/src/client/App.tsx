import './Main.css';
import CookieConsentBanner from './components/cookie-consent/Banner';
import React, { useMemo, useEffect, useState } from 'react';
import { routes } from 'wasp/client/router';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from 'wasp/client/auth';
import { getUserLanguage, convertDatabaseLanguage, type Language } from '../translations/utils';

import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import { ApprovalGuard } from './components/ApprovalGuard';
import NotificationToast from './components/NotificationToast';

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export default function App() {
  const location = useLocation();
  const { data: user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState<Language>('fr');
  const [isMobile, setIsMobile] = useState(false);

  // Synchroniser la langue avec les préférences utilisateur
  useEffect(() => {
    if (user && (user as any).preferredLanguage) {
      const userLang = getUserLanguage(user as any);
      setLanguage(userLang);
    }
  }, [user]);

  // Détection de la taille d'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Correspond au breakpoint lg de Tailwind
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isGEPSApp = useMemo(() => {
    return location.pathname.startsWith('/dashboard') || 
           location.pathname.startsWith('/beneficiaries') ||
           location.pathname.startsWith('/documents') ||
           location.pathname.startsWith('/interventions') ||
           location.pathname.startsWith('/accommodation') ||
           location.pathname.startsWith('/meals') ||
           location.pathname.startsWith('/resources') ||
           location.pathname.startsWith('/education') ||
           location.pathname.startsWith('/activities') ||
           location.pathname.startsWith('/training') ||
           location.pathname.startsWith('/projects') ||
           location.pathname.startsWith('/budget') ||
           location.pathname.startsWith('/notifications') ||
           location.pathname.startsWith('/admin');
  }, [location]);

  const isPendingApproval = location.pathname === '/pending-approval';

  const isRTL = language === 'ar';

  const toggleLanguage = () => {
    // Cette fonction n'est plus nécessaire car la langue est gérée par LanguageSelector
    // qui met à jour directement la base de données
    setLanguage(lang => lang === 'fr' ? 'ar' : 'fr');
  };

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  // Fermer automatiquement la sidebar sur mobile lors de la navigation
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Gérer l'état de la sidebar selon la taille d'écran
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(false); // Toujours étendue sur mobile quand ouverte
    }
  }, [isMobile]);

  if (isGEPSApp && user) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Sidebar */}
        <Sidebar
          user={user}
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          language={language}
          onToggleLanguage={toggleLanguage}
          isRTL={isRTL}
        />

        {/* Mobile overlay */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
            style={{ backdropFilter: 'blur(2px)' }}
          />
        )}

        {/* Main content avec support responsive complet */}
        <div className={`min-h-screen transition-all duration-300 ease-in-out ${
          isRTL 
            ? (sidebarCollapsed ? 'lg:mr-16' : 'lg:mr-72') 
            : (sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72')
        }`}>
          {/* Header moderne */}
          <Header
            user={user}
            onMenuClick={() => setSidebarOpen(true)}
            language={language}
            isRTL={isRTL}
            onSearch={(query) => {
              // Ici on peut implémenter la logique de recherche dans les bénéficiaires
              console.log('Recherche bénéficiaires:', query);
            }}
          />

          {/* Page content avec conteneur responsive */}
          <main className="p-4 lg:p-6 bg-gradient-to-br from-blue-50/30 to-white min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-none relative">
              <Outlet />
            </div>
          </main>
        </div>
        
        {/* Notifications toast pour les utilisateurs connectés */}
        {user && <NotificationToast />}
        
        <CookieConsentBanner />
      </div>
    );
  }

  return (
    <>
      <div className='min-h-screen dark:text-white dark:bg-boxdark-2'>
        <Outlet />
      </div>
      <CookieConsentBanner />
    </>
  );
}
