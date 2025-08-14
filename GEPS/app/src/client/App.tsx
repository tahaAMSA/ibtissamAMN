import './Main.css';
import CookieConsentBanner from './components/cookie-consent/Banner';
import React, { useMemo, useEffect, useState } from 'react';
import { routes } from 'wasp/client/router';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from 'wasp/client/auth';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Home, 
  Utensils, 
  Package, 
  GraduationCap, 
  Activity, 
  BookOpen, 
  Lightbulb, 
  DollarSign,
  Menu,
  X,
  Settings,
  LogOut,
  Globe
} from 'lucide-react';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  labelAr: string;
  path: string;
}

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export default function App() {
  const location = useLocation();
  const { data: user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');

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
           location.pathname.startsWith('/budget');
  }, [location]);

  const isRTL = language === 'ar';

  const menuItems: MenuItem[] = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Tableau de bord",
      labelAr: "لوحة التحكم",
      path: "/dashboard"
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Bénéficiaires",
      labelAr: "المستفيدون",
      path: "/beneficiaries"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Documents",
      labelAr: "الوثائق",
      path: "/documents"
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Interventions Sociales",
      labelAr: "التدخلات الاجتماعية",
      path: "/interventions"
    },
    {
      icon: <Home className="w-5 h-5" />,
      label: "Hébergement",
      labelAr: "الإيواء",
      path: "/accommodation"
    },
    {
      icon: <Utensils className="w-5 h-5" />,
      label: "Repas",
      labelAr: "الوجبات",
      path: "/meals"
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "Ressources",
      labelAr: "الموارد",
      path: "/resources"
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      label: "Éducation",
      labelAr: "التعليم",
      path: "/education"
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Activités",
      labelAr: "الأنشطة",
      path: "/activities"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Formations",
      labelAr: "التدريبات",
      path: "/training"
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      label: "Projets Entrepreneuriaux",
      labelAr: "المشاريع الريادية",
      path: "/projects"
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "Budget",
      labelAr: "الميزانية",
      path: "/budget"
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleLanguage = () => {
    setLanguage(lang => lang === 'fr' ? 'ar' : 'fr');
  };

  const getLabel = (item: MenuItem) => {
    return language === 'ar' ? item.labelAr : item.label;
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      'ADMIN': { fr: 'Administrateur', ar: 'مدير' },
      'SOCIAL_WORKER': { fr: 'Travailleur Social', ar: 'عامل اجتماعي' },
      'MEDICAL': { fr: 'Personnel Médical', ar: 'طاقم طبي' },
      'EDUCATIONAL': { fr: 'Personnel Éducatif', ar: 'طاقم تعليمي' },
      'TECHNICAL': { fr: 'Personnel Technique', ar: 'طاقم تقني' },
      'FINANCIAL': { fr: 'Personnel Financier', ar: 'طاقم مالي' }
    };
    return roles[role as keyof typeof roles]?.[language] || role;
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

  if (isGEPSApp && user) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Sidebar */}
        <div className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'} lg:translate-x-0`}>
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 bg-yellow-500 text-black">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">
                {language === 'ar' ? 'مؤسسة ابتسامة العصرة' : 'GEPS - Complexe Ibtissama'}
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-yellow-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-semibold">
                  {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName || 'Utilisateur'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {getRoleLabel(user?.role || 'SOCIAL_WORKER')}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-yellow-500 text-black'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className={`${isRTL ? 'ml-3' : 'mr-3'}`}>{item.icon}</span>
                {getLabel(item)}
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Globe className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              {language === 'ar' ? 'Français' : 'العربية'}
            </button>
            <Link
              to="/account"
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              {language === 'ar' ? 'الإعدادات' : 'Paramètres'}
            </Link>
            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              {language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
            </button>
          </div>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className={`transition-all duration-300 ease-in-out ${isRTL ? 'lg:pr-64' : 'lg:pl-64'}`}>
          {/* Top bar */}
          <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex-1" />
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {language === 'ar' ? 'مرحباً بك' : 'Bienvenue'}, {user?.firstName || 'Utilisateur'}
                </span>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="p-4 lg:p-6 min-h-screen">
            <Outlet />
          </main>
        </div>
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
