import React, { memo, useMemo, useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../cn';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button, buttonVariants } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { RoleInfo } from '../ui/RoleInfo';
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
  Settings,
  LogOut,
  Globe,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  Bell,
  ChevronDown,
  Menu
} from 'lucide-react';
import { UserRole } from '@prisma/client';
import { usePermissions, PermissionModule } from '../../hooks/usePermissions';
import type { User } from 'wasp/entities';
import { logout } from 'wasp/client/auth';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  labelAr: string;
  path: string;
  module: PermissionModule;
}

interface SidebarProps {
  user?: User;
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
  language: 'fr' | 'ar';
  onToggleLanguage: () => void;
  isRTL: boolean;
}

// Mémorisation des icônes pour éviter les re-renders
const iconMap = {
  home: <Home className="w-4 h-4" />,
  users: <Users className="w-4 h-4" />,
  fileText: <FileText className="w-4 h-4" />,
  messageSquare: <MessageSquare className="w-4 h-4" />,
  utensils: <Utensils className="w-4 h-4" />,
  package: <Package className="w-4 h-4" />,
  graduationCap: <GraduationCap className="w-4 h-4" />,
  activity: <Activity className="w-4 h-4" />,
  bookOpen: <BookOpen className="w-4 h-4" />,
  lightbulb: <Lightbulb className="w-4 h-4" />,
  dollarSign: <DollarSign className="w-4 h-4" />,
  clock: <Clock className="w-4 h-4" />,
  shield: <Shield className="w-4 h-4" />,
  bell: <Bell className="w-4 h-4" />,
};

// Structure de navigation moderne et simplifiée
interface NavGroup {
  id: string;
  label: string;
  labelAr: string;
  items: MenuItem[];
}

// Navigation principale - éléments essentiels toujours visibles
const primaryNavItems: MenuItem[] = [
  {
    icon: iconMap.home,
    label: "Tableau de bord",
    labelAr: "لوحة التحكم",
    path: "/dashboard",
    module: "SYSTEM"
  },
  {
    icon: iconMap.users,
    label: "Bénéficiaires",
    labelAr: "المستفيدون",
    path: "/beneficiaries",
    module: "BENEFICIARIES"
  },
  {
    icon: iconMap.bell,
    label: "Notifications",
    labelAr: "الإشعارات",
    path: "/notifications",
    module: "NOTIFICATIONS"
  }
];

// Navigation secondaire - groupées par domaine
const navGroups: NavGroup[] = [
  {
    id: "services",
    label: "Services & Ressources",
    labelAr: "الخدمات والموارد",
    items: [
      {
        icon: iconMap.home,
        label: "Hébergement",
        labelAr: "الإيواء",
        path: "/accommodation",
        module: "ACCOMMODATION"
      },
      {
        icon: iconMap.utensils,
        label: "Repas",
        labelAr: "الوجبات",
        path: "/meals",
        module: "MEALS"
      },
      {
        icon: iconMap.package,
        label: "Ressources",
        labelAr: "الموارد",
        path: "/resources",
        module: "RESOURCES"
      }
    ]
  },
  {
    id: "support",
    label: "Accompagnement",
    labelAr: "المرافقة",
    items: [
      {
        icon: iconMap.fileText,
        label: "Documents",
        labelAr: "الوثائق",
        path: "/documents",
        module: "DOCUMENTS"
      },
      {
        icon: iconMap.messageSquare,
        label: "Interventions",
        labelAr: "التدخلات",
        path: "/interventions",
        module: "INTERVENTIONS"
      }
    ]
  },
  {
    id: "development",
    label: "Développement",
    labelAr: "التطوير",
    items: [
      {
        icon: iconMap.graduationCap,
        label: "Éducation",
        labelAr: "التعليم",
        path: "/education",
        module: "EDUCATION"
      },
      {
        icon: iconMap.bookOpen,
        label: "Formations",
        labelAr: "التدريبات",
        path: "/training",
        module: "TRAINING"
      },
      {
        icon: iconMap.activity,
        label: "Activités",
        labelAr: "الأنشطة",
        path: "/activities",
        module: "ACTIVITIES"
      },
      {
        icon: iconMap.lightbulb,
        label: "Projets",
        labelAr: "المشاريع",
        path: "/projects",
        module: "PROJECTS"
      }
    ]
  },
  {
    id: "management",
    label: "Gestion",
    labelAr: "الإدارة",
    items: [
      {
        icon: iconMap.dollarSign,
        label: "Budget",
        labelAr: "الميزانية",
        path: "/budget",
        module: "BUDGET"
      },
      {
        icon: iconMap.clock,
        label: "Suivi du temps",
        labelAr: "تتبع الوقت",
        path: "/time-tracking",
        module: "SYSTEM"
      }
    ]
  }
];

// Composant moderne pour les éléments de navigation
const NavItem = memo(({ 
  item, 
  isActive, 
  isRTL, 
  language, 
  variant = 'default',
  onClose 
}: {
  item: MenuItem;
  isActive: boolean;
  isRTL: boolean;
  language: 'fr' | 'ar';
  variant?: 'default' | 'primary' | 'secondary';
  onClose: () => void;
}) => {
  const getLabel = useCallback((item: MenuItem) => {
    return language === 'ar' ? item.labelAr : item.label;
  }, [language]);

  const handleClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const baseStyles = "w-full justify-start transition-all duration-200 ease-in-out group";
  const variantStyles = {
    primary: "h-11 text-sm font-medium",
    default: "h-9 text-sm",
    secondary: "h-8 text-xs ml-4"
  };

  const activeStyles = isActive 
    ? "bg-gradient-to-r from-blue-50 to-pink-50 text-blue-700 border-r-2 border-blue-600 shadow-sm" 
    : "text-muted-foreground hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-pink-50/50 hover:text-blue-600";

  return (
    <Button
      variant="ghost"
      className={cn(baseStyles, variantStyles[variant], activeStyles)}
      asChild
    >
      <Link to={item.path} onClick={handleClick}>
        <span className={cn(
          "shrink-0 transition-colors group-hover:text-current", 
          isRTL ? "ml-3" : "mr-3"
        )}>
          {item.icon}
        </span>
        <span className="truncate font-medium">{getLabel(item)}</span>
        {isActive && (
          <div className={cn(
            "ml-auto w-1.5 h-1.5 rounded-full bg-blue-600",
            isRTL && "mr-auto ml-0"
          )} />
        )}
      </Link>
    </Button>
  );
});

NavItem.displayName = 'NavItem';

// Composant moderne pour les groupes de navigation
const NavGroup = memo(({
  group,
  isRTL,
  language,
  onClose,
  canViewInNavigation,
  isActive
}: {
  group: NavGroup;
  isRTL: boolean;
  language: 'fr' | 'ar';
  onClose: () => void;
  canViewInNavigation: (module: PermissionModule) => boolean;
  isActive: (path: string) => boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getGroupLabel = useCallback((group: NavGroup) => {
    return language === 'ar' ? group.labelAr : group.label;
  }, [language]);

  // Filtrer les éléments selon les permissions
  const visibleItems = useMemo(() => 
    group.items.filter(item => 
      item.module === 'SYSTEM' || canViewInNavigation(item.module)
    ), [group.items, canViewInNavigation]
  );

  // Ne pas afficher le groupe si aucun élément n'est visible
  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-between h-8 px-3 text-xs font-medium text-muted-foreground hover:text-foreground group",
          isRTL && "flex-row-reverse"
        )}
      >
        <span className="uppercase tracking-wider">{getGroupLabel(group)}</span>
        <ChevronDown className={cn(
          "w-3 h-3 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </Button>
      
      {isOpen && (
        <div className="space-y-0.5 pl-2">
          {visibleItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              isActive={isActive(item.path)}
              isRTL={isRTL}
              language={language}
              variant="secondary"
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
});

NavGroup.displayName = 'NavGroup';

// Composant moderne pour les informations utilisateur
const UserProfile = memo(({ 
  user, 
  isCollapsed, 
  isRTL, 
  language 
}: {
  user: User;
  isCollapsed: boolean;
  isRTL: boolean;
  language: 'fr' | 'ar';
}) => {
  const userInitial = useMemo(() => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const username = user.username || '';
    return (firstName.charAt(0) || lastName.charAt(0) || username.charAt(0) || 'U').toUpperCase();
  }, [user.firstName, user.lastName, user.username]);

  const userDisplayName = useMemo(() => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const username = user.username || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return firstName || lastName || username || 'Utilisateur';
  }, [user.firstName, user.lastName, user.username]);

  if (isCollapsed) {
    return (
      <div className="p-3 border-b">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="flex justify-center">
              <Avatar className="h-8 w-8 ring-2 ring-blue-300/50">
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-pink-100 text-blue-700 font-semibold text-sm">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side={isRTL ? "left" : "right"} 
            className="bg-background border border-border shadow-lg p-3 max-w-xs"
          >
            <div className="space-y-2">
              <p className="font-semibold">{userDisplayName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <RoleInfo 
                role={user.role as UserRole} 
                language={language} 
                variant="badge-only"
              />
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <Card className="m-3 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-10 w-10 ring-2 ring-blue-300/50">
            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-pink-100 text-blue-700 font-semibold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {userDisplayName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        <RoleInfo 
          role={user.role as UserRole} 
          language={language} 
          variant="compact"
        />
      </CardContent>
    </Card>
  );
});

UserProfile.displayName = 'UserProfile';

// Composant moderne pour les actions du bas
const SidebarFooter = memo(({ 
  isCollapsed, 
  isRTL, 
  language, 
  onToggleLanguage 
}: {
  isCollapsed: boolean;
  isRTL: boolean;
  language: 'fr' | 'ar';
  onToggleLanguage: () => void;
}) => {
  const handleLanguageToggle = useCallback(() => {
    onToggleLanguage();
  }, [onToggleLanguage]);

  const languageButtonContent = useMemo(() => 
    language === 'ar' ? 'FR' : 'عر', 
    [language]
  );

  const settingsLabel = useMemo(() => 
    language === 'ar' ? 'الإعدادات' : 'Paramètres', 
    [language]
  );

  const logoutLabel = useMemo(() => 
    language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion', 
    [language]
  );

  if (isCollapsed) {
    return (
      <div className="p-2 space-y-1 border-t">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLanguageToggle}
              className="w-full h-8 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Globe className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isRTL ? "left" : "right"}>
            {language === 'ar' ? 'Changer vers Français' : 'تغيير إلى العربية'}
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-8 text-muted-foreground hover:text-foreground hover:bg-accent"
              asChild
            >
              <Link to="/account">
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isRTL ? "left" : "right"}>
            {settingsLabel}
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isRTL ? "left" : "right"}>
            {logoutLabel}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-1 border-t bg-muted/30">
      <Button
        variant="ghost"
        onClick={handleLanguageToggle}
        className="w-full justify-start h-9 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
      >
        <Globe className={cn("w-4 h-4", isRTL ? "ml-3" : "mr-3")} />
        <span className="flex items-center gap-2">
          {language === 'ar' ? 'Français' : 'العربية'}
          <Badge variant="outline" className="text-xs">
            {languageButtonContent}
          </Badge>
        </span>
      </Button>
      
      <Button
        variant="ghost"
        className="w-full justify-start h-9 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
        asChild
      >
        <Link to="/account">
          <Settings className={cn("w-4 h-4", isRTL ? "ml-3" : "mr-3")} />
          {settingsLabel}
        </Link>
      </Button>
      
      <Button
        variant="ghost"
        className="w-full justify-start h-9 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => logout()}
      >
        <LogOut className={cn("w-4 h-4", isRTL ? "ml-3" : "mr-3")} />
        {logoutLabel}
      </Button>
    </div>
  );
});

SidebarFooter.displayName = 'SidebarFooter';

const Sidebar = memo(function Sidebar({
  user,
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
  language,
  onToggleLanguage,
  isRTL
}: SidebarProps) {
  const location = useLocation();
  const { canViewInNavigation, isAdmin } = usePermissions();
  
  // Mémorisation des callbacks pour éviter les re-renders
  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  // Filtrer les éléments visibles selon les permissions
  const visiblePrimaryItems = useMemo(() => 
    primaryNavItems.filter(item => 
      item.module === 'SYSTEM' || canViewInNavigation(item.module)
    ), [canViewInNavigation]
  );

  const visibleNavGroups = useMemo(() => 
    navGroups.filter(group => 
      group.items.some(item => 
        item.module === 'SYSTEM' || canViewInNavigation(item.module)
      )
    ), [canViewInNavigation]
  );

  // Menu d'administration
  const adminMenuItem: MenuItem = useMemo(() => ({
    icon: iconMap.shield,
    label: "Administration",
    labelAr: "الإدارة",
    path: "/admin",
    module: "USERS"
  }), []);

  // Classes CSS modernes avec système de design tokens
  const sidebarWidth = useMemo(() => isCollapsed ? 'w-16' : 'w-72', [isCollapsed]);
  
  const sidebarClasses = useMemo(() => cn(
    "fixed inset-y-0 z-50 flex flex-col bg-background border-r border-border shadow-xl",
    "transform transition-all duration-300 ease-in-out",
    sidebarWidth,
    isRTL ? 'right-0' : 'left-0',
    isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full',
    'lg:translate-x-0',
    // Amélioration pour éviter les débordements
    'max-h-screen overflow-hidden'
  ), [sidebarWidth, isRTL, isOpen]);

  // Callbacks optimisés
  const handleToggleCollapse = useCallback(() => {
    onToggleCollapse();
  }, [onToggleCollapse]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleLanguageToggle = useCallback(() => {
    onToggleLanguage();
  }, [onToggleLanguage]);

  return (
    <TooltipProvider>
      <div className={sidebarClasses}>
        {/* Header moderne avec logo */}
        <div className="flex items-center justify-between h-20 px-4 bg-white border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center min-w-0 flex-1">
              <img 
                src="/logo-GEPS.png" 
                alt="GEPS Logo" 
                className="h-16 w-auto"
              />
            </div>
          )}
          
          {/* Logo version réduite pour sidebar collapsed */}
          {isCollapsed && (
            <div className="flex items-center justify-center w-full">
              <img 
                src="/logo-GEPS.png" 
                alt="GEPS Logo" 
                className="h-12 w-auto"
              />
            </div>
          )}
          
          <div className="flex items-center gap-1">
            {/* Desktop collapse button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleCollapse}
              className="hidden lg:flex text-gray-600 hover:bg-gray-100 h-8 w-8"
            >
              {isCollapsed ? 
                (isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />) :
                (isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />)
              }
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="lg:hidden text-gray-600 hover:bg-gray-100 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* User Profile moderne */}
        {user && (
          <UserProfile 
            user={user}
            isCollapsed={isCollapsed}
            isRTL={isRTL}
            language={language} 
          />
        )}

        {/* Navigation principale */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {/* Navigation principale */}
              {!isCollapsed && (
                <div className="mb-4">
                  <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {language === 'ar' ? 'الرئيسية' : 'Principal'}
                  </h3>
                  <div className="space-y-1">
                    {visiblePrimaryItems.map((item) => (
                      <NavItem
                        key={item.path}
                        item={item}
                        isActive={isActive(item.path)}
                        isRTL={isRTL}
                        language={language}
                        variant="primary"
                        onClose={handleClose}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation en mode collapsed */}
              {isCollapsed && (
                <div className="space-y-2">
                  {visiblePrimaryItems.map((item) => (
                    <Tooltip key={item.path} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "w-full h-10",
                            isActive(item.path) ? "bg-gradient-to-r from-blue-100 to-pink-100 text-blue-700" : "text-muted-foreground hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-pink-50/50 hover:text-blue-600"
                          )}
                          asChild
                        >
                          <Link to={item.path} onClick={handleClose}>
                            {item.icon}
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side={isRTL ? "left" : "right"}>
                        {language === 'ar' ? item.labelAr : item.label}
                      </TooltipContent>
                    </Tooltip>
                  ))}

                  {/* Menu d'administration en mode collapsed */}
                  {isAdmin && (
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "w-full h-10",
                            isActive(adminMenuItem.path) ? "bg-gradient-to-r from-blue-100 to-pink-100 text-blue-700" : "text-muted-foreground hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-pink-50/50 hover:text-blue-600"
                          )}
                          asChild
                        >
                          <Link to={adminMenuItem.path} onClick={handleClose}>
                            {adminMenuItem.icon}
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side={isRTL ? "left" : "right"}>
                        {language === 'ar' ? adminMenuItem.labelAr : adminMenuItem.label}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}

              {/* Groupes de navigation - seulement en mode étendu */}
              {!isCollapsed && (
                <div className="space-y-4">
                  {visibleNavGroups.map((group) => (
                    <NavGroup
                      key={group.id}
                      group={group}
                      isRTL={isRTL}
                      language={language}
                      onClose={handleClose}
                      canViewInNavigation={canViewInNavigation}
                      isActive={isActive}
                    />
                  ))}

                  {/* Menu d'administration */}
                  {isAdmin && (
                    <div className="space-y-1">
                      <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {language === 'ar' ? 'الإدارة' : 'Administration'}
                      </div>
                      <NavItem
                        item={adminMenuItem}
                        isActive={isActive(adminMenuItem.path)}
                        isRTL={isRTL}
                        language={language}
                        variant="default"
                        onClose={handleClose}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer moderne */}
        <SidebarFooter
          isCollapsed={isCollapsed}
          isRTL={isRTL}
          language={language}
          onToggleLanguage={handleLanguageToggle}
        />
      </div>
    </TooltipProvider>
  );
});

export default Sidebar;
