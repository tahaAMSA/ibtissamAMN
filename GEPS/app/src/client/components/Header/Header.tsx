import React, { memo, useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../cn';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Menu, 
  Bell, 
  Search, 
  Settings,
  LogOut,
  ChevronDown,
  MessageSquare,
  HelpCircle,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '../ui/tooltip';
import type { AuthUser } from 'wasp/auth';
import { UserRole } from '@prisma/client';

interface HeaderProps {
  user?: AuthUser;
  onMenuClick: () => void;
  language: 'fr' | 'ar';
  isRTL: boolean;
  onSearch?: (query: string) => void;
}

// Simuler quelques notifications pour le badge
const mockNotifications = [
  { id: 1, title: "Nouveau bénéficiaire", message: "Un nouveau dossier attend validation", time: "Il y a 5 min" },
  { id: 2, title: "Rappel formation", message: "Formation prévue demain à 14h", time: "Il y a 1h" },
  { id: 3, title: "Document expiré", message: "Vérifier les pièces d'identité", time: "Il y a 2h" }
];

const Header = memo(function Header({
  user,
  onMenuClick,
  language,
  isRTL,
  onSearch
}: HeaderProps) {
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Obtenir le titre de la page actuelle
  const currentPageTitle = useMemo(() => {
    const pathMap: Record<string, { fr: string; ar: string }> = {
      '/dashboard': { fr: 'Tableau de bord', ar: 'لوحة التحكم' },
      '/beneficiaries': { fr: 'Bénéficiaires', ar: 'المستفيدون' },
      '/documents': { fr: 'Documents', ar: 'الوثائق' },
      '/interventions': { fr: 'Interventions', ar: 'التدخلات' },
      '/accommodation': { fr: 'Hébergement', ar: 'الإيواء' },
      '/meals': { fr: 'Repas', ar: 'الوجبات' },
      '/resources': { fr: 'Ressources', ar: 'الموارد' },
      '/education': { fr: 'Éducation', ar: 'التعليم' },
      '/activities': { fr: 'Activités', ar: 'الأنشطة' },
      '/training': { fr: 'Formations', ar: 'التدريبات' },
      '/projects': { fr: 'Projets', ar: 'المشاريع' },
      '/budget': { fr: 'Budget', ar: 'الميزانية' },
      '/notifications': { fr: 'Notifications', ar: 'الإشعارات' },
      '/admin': { fr: 'Administration', ar: 'الإدارة' },
      '/time-tracking': { fr: 'Suivi du temps', ar: 'تتبع الوقت' }
    };

    const pageInfo = pathMap[location.pathname];
    return pageInfo ? pageInfo[language] : (language === 'ar' ? 'الصفحة الرئيسية' : 'Accueil');
  }, [location.pathname, language]);

  // Informations utilisateur
  const userDisplayName = useMemo(() => {
    if (!user) return language === 'ar' ? 'مستخدم' : 'Utilisateur';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const username = user.username || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return firstName || lastName || username || (language === 'ar' ? 'مستخدم' : 'Utilisateur');
  }, [user, language]);

  const userInitial = useMemo(() => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const username = user.username || '';
    return (firstName.charAt(0) || lastName.charAt(0) || username.charAt(0) || 'U').toUpperCase();
  }, [user]);

  // Traduire le rôle
  const getRoleLabel = useCallback((role?: UserRole) => {
    if (!role) return '';
    
    const roleMap: Record<UserRole, { fr: string; ar: string }> = {
      PENDING_ROLE: { fr: 'En attente', ar: 'في الانتظار' },
      ADMIN: { fr: 'Administrateur', ar: 'مدير النظام' },
      DIRECTEUR: { fr: 'Directeur', ar: 'مدير' },
      AGENT_ACCUEIL: { fr: 'Agent d\'accueil', ar: 'موظف استقبال' },
      COORDINATEUR: { fr: 'Coordinateur', ar: 'منسق' },
      ASSISTANTE_SOCIALE: { fr: 'Assistante sociale', ar: 'مساعدة اجتماعية' },
      TRAVAILLEUR_SOCIAL: { fr: 'Travailleur social', ar: 'عامل اجتماعي' },
      CONSEILLER_JURIDIQUE: { fr: 'Conseiller juridique', ar: 'مستشار قانوني' },
      RESPONSABLE_HEBERGEMENT: { fr: 'Resp. hébergement', ar: 'مسؤول الإيواء' },
      RESPONSABLE_EDUCATION: { fr: 'Resp. éducation', ar: 'مسؤول التعليم' },
      RESPONSABLE_ACTIVITES: { fr: 'Resp. activités', ar: 'مسؤول الأنشطة' },
      COMPTABLE: { fr: 'Comptable', ar: 'محاسب' },
      GESTIONNAIRE_RESSOURCES: { fr: 'Gest. ressources', ar: 'مدير الموارد' },
      DOCUMENTALISTE: { fr: 'Documentaliste', ar: 'أمين المكتبة' },
      OBSERVATEUR: { fr: 'Observateur', ar: 'مراقب' }
    };

    return roleMap[role]?.[language] || role;
  }, [language]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = useCallback(() => {
    // Logique de déconnexion
    window.location.href = '/login';
  }, []);

  const handleMenuClick = useCallback(() => {
    onMenuClick();
  }, [onMenuClick]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  }, [onSearch]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  }, [onSearch, searchQuery]);

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Section gauche */}
          <div className="flex items-center gap-4">
            {/* Bouton menu mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMenuClick}
              className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Titre de la page */}
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-foreground">
                {currentPageTitle}
              </h1>
            </div>
          </div>

          {/* Section centrale - Recherche dans les bénéficiaires */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={language === 'ar' ? 'البحث في قائمة المستفيدين...' : 'Rechercher dans les bénéficiaires...'}
                className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </form>
          </div>

          {/* Section droite */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {mockNotifications.length > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                    >
                      {mockNotifications.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="font-semibold">
                  {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mockNotifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{notification.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-primary">
                  {language === 'ar' ? 'عرض جميع الإشعارات' : 'Voir toutes les notifications'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6" />

            {/* Profil utilisateur */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 h-10 px-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">{userDisplayName}</span>
                      <span className="text-xs text-muted-foreground">
                        {getRoleLabel(user.role as UserRole)}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userDisplayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'الملف الشخصي' : 'Profil'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'الإعدادات' : 'Paramètres'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'الرسائل' : 'Messages'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'المساعدة' : 'Aide'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Message de bienvenue simple si pas d'utilisateur */}
            {!user && (
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'مرحباً بك' : 'Bienvenue'}
              </div>
            )}
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
});

export default Header;
