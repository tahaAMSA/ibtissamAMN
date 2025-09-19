import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './button';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../cn';

interface BreadcrumbItem {
  path: string;
  title: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  className?: string;
  language?: 'fr' | 'ar';
  maxItems?: number;
}

export function Breadcrumb({ className, language = 'fr', maxItems = 4 }: BreadcrumbProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Mapping des chemins vers les titres
  const pathMap: Record<string, { fr: string; ar: string; parent?: string; icon?: React.ReactNode }> = {
    '/dashboard': { fr: 'Tableau de bord', ar: 'لوحة التحكم', icon: <Home className="w-4 h-4" /> },
    '/beneficiaries': { fr: 'Bénéficiaires', ar: 'المستفيدون', parent: '/dashboard' },
    '/documents': { fr: 'Documents', ar: 'الوثائق', parent: '/dashboard' },
    '/interventions': { fr: 'Interventions', ar: 'التدخلات', parent: '/dashboard' },
    '/accommodation': { fr: 'Hébergement', ar: 'الإيواء', parent: '/dashboard' },
    '/meals': { fr: 'Repas', ar: 'الوجبات', parent: '/dashboard' },
    '/resources': { fr: 'Ressources', ar: 'الموارد', parent: '/dashboard' },
    '/education': { fr: 'Éducation', ar: 'التعليم', parent: '/dashboard' },
    '/activities': { fr: 'Activités', ar: 'الأنشطة', parent: '/dashboard' },
    '/training': { fr: 'Formations', ar: 'التدريبات', parent: '/dashboard' },
    '/projects': { fr: 'Projets', ar: 'المشاريع', parent: '/dashboard' },
    '/budget': { fr: 'Budget', ar: 'الميزانية', parent: '/dashboard' },
    '/notifications': { fr: 'Notifications', ar: 'الإشعارات', parent: '/dashboard' },
    '/admin': { fr: 'Administration', ar: 'الإدارة', parent: '/dashboard' },
    '/time-tracking': { fr: 'Suivi du temps', ar: 'تتبع الوقت', parent: '/dashboard' },
    '/account': { fr: 'Mon compte', ar: 'حسابي', parent: '/dashboard' },
  };

  // Construire le breadcrumb
  const buildBreadcrumb = (path: string): BreadcrumbItem[] => {
    const currentPath = path;
    let pageInfo = pathMap[currentPath];
    
    // Gestion des routes dynamiques
    if (!pageInfo) {
      if (currentPath.startsWith('/beneficiaries/') && currentPath !== '/beneficiaries') {
        pageInfo = { 
          fr: 'Détail bénéficiaire', 
          ar: 'تفاصيل المستفيد', 
          parent: '/beneficiaries' 
        };
      }
    }

    if (!pageInfo) return [];
    
    const breadcrumb: BreadcrumbItem[] = [{
      path: currentPath,
      title: pageInfo[language],
      icon: pageInfo.icon
    }];
    
    if (pageInfo.parent && pageInfo.parent !== currentPath) {
      return [...buildBreadcrumb(pageInfo.parent), ...breadcrumb];
    }
    
    return breadcrumb;
  };

  const breadcrumb = buildBreadcrumb(location.pathname);

  // Limiter le nombre d'éléments affichés
  const displayBreadcrumb = breadcrumb.length > maxItems 
    ? [breadcrumb[0], { path: '', title: '...', icon: null }, ...breadcrumb.slice(-2)]
    : breadcrumb;

  const handleBreadcrumbClick = (path: string) => {
    if (path && path !== '') {
      navigate(path);
    }
  };

  if (breadcrumb.length <= 1) {
    return null;
  }

  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {displayBreadcrumb.map((crumb, index) => (
        <React.Fragment key={`${crumb.path}-${index}`}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBreadcrumbClick(crumb.path)}
            disabled={crumb.title === '...' || index === displayBreadcrumb.length - 1}
            className={cn(
              "h-6 px-2 text-sm font-medium transition-colors",
              index === displayBreadcrumb.length - 1
                ? "text-foreground bg-accent/50 cursor-default"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
              crumb.title === '...' && "cursor-default hover:bg-transparent"
            )}
          >
            {crumb.icon && index === 0 && (
              <span className="mr-1">{crumb.icon}</span>
            )}
            <span className="truncate max-w-[120px]">{crumb.title}</span>
          </Button>
        </React.Fragment>
      ))}
    </nav>
  );
}

export default Breadcrumb;
