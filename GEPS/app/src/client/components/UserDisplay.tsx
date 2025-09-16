import React from 'react';
import type { User } from 'wasp/entities';
import { Gender } from '@prisma/client';

interface UserDisplayProps {
  user: User;
  variant?: 'compact' | 'full' | 'avatar-only';
  showAvatar?: boolean;
  showRole?: boolean;
  language?: 'fr' | 'ar' | 'both';
  className?: string;
}

export function UserDisplay({ 
  user, 
  variant = 'compact', 
  showAvatar = true, 
  showRole = false,
  language = 'fr',
  className = '' 
}: UserDisplayProps) {
  
  const getDisplayName = () => {
    const frenchName = [user.firstName, user.lastName].filter(Boolean).join(' ');
    const arabicName = [user.firstNameAr, user.lastNameAr].filter(Boolean).join(' ');
    
    switch (language) {
      case 'fr':
        return frenchName || arabicName || user.username || 'Utilisateur';
      case 'ar':
        return arabicName || frenchName || user.username || 'مستخدم';
      case 'both':
        if (frenchName && arabicName) {
          return `${frenchName} (${arabicName})`;
        }
        return frenchName || arabicName || user.username || 'Utilisateur';
      default:
        return frenchName || arabicName || user.username || 'Utilisateur';
    }
  };

  const getInitials = () => {
    const name = getDisplayName();
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const Avatar = () => {
    if (!showAvatar) return null;
    
    const size = variant === 'compact' ? 'h-8 w-8' : variant === 'full' ? 'h-12 w-12' : 'h-6 w-6';
    const textSize = variant === 'compact' ? 'text-sm' : variant === 'full' ? 'text-base' : 'text-xs';
    
    return (
      <div className={`flex-shrink-0 ${variant === 'avatar-only' ? '' : 'mr-3'}`}>
        {user.avatar ? (
          <img
            className={`${size} rounded-full object-cover`}
            src={user.avatar}
            alt={`Avatar de ${getDisplayName()}`}
          />
        ) : (
          <div className={`${size} rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center`}>
            <span className={`${textSize} font-semibold text-gray-600 dark:text-gray-300`}>
              {getInitials()}
            </span>
          </div>
        )}
      </div>
    );
  };

  if (variant === 'avatar-only') {
    return (
      <div className={className}>
        <Avatar />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <Avatar />
      <div className="min-w-0 flex-1">
        <div className={`${variant === 'full' ? 'text-sm' : 'text-xs'} font-medium text-gray-900 dark:text-white truncate`}>
          {getDisplayName()}
        </div>
        {showRole && user.role && (
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {getRoleLabel(user.role)}
          </div>
        )}
      </div>
    </div>
  );
}

// Fonction utilitaire pour obtenir le label du rôle
function getRoleLabel(role: string): string {
  const roleLabels: Record<string, string> = {
    ADMIN: 'Administrateur',
    DIRECTEUR: 'Directeur',
    AGENT_ACCUEIL: 'Agent d\'accueil',
    COORDINATEUR: 'Coordinateur',
    ASSISTANTE_SOCIALE: 'Assistante sociale',
    TRAVAILLEUR_SOCIAL: 'Travailleur social',
    CONSEILLER_JURIDIQUE: 'Conseiller juridique',
    RESPONSABLE_HEBERGEMENT: 'Responsable hébergement',
    RESPONSABLE_EDUCATION: 'Responsable éducation',
    RESPONSABLE_ACTIVITES: 'Responsable activités',
    COMPTABLE: 'Comptable',
    GESTIONNAIRE_RESSOURCES: 'Gestionnaire ressources',
    DOCUMENTALISTE: 'Documentaliste',
    OBSERVATEUR: 'Observateur',
    PENDING_ROLE: 'En attente de rôle'
  };
  
  return roleLabels[role] || role;
}

// Composant pour afficher une liste d'utilisateurs
interface UserListDisplayProps {
  users: User[];
  variant?: 'compact' | 'full';
  showAvatars?: boolean;
  showRoles?: boolean;
  language?: 'fr' | 'ar' | 'both';
  className?: string;
  maxDisplay?: number;
}

export function UserListDisplay({ 
  users, 
  variant = 'compact',
  showAvatars = true,
  showRoles = false,
  language = 'fr',
  className = '',
  maxDisplay 
}: UserListDisplayProps) {
  
  const displayUsers = maxDisplay ? users.slice(0, maxDisplay) : users;
  const remainingCount = maxDisplay && users.length > maxDisplay ? users.length - maxDisplay : 0;
  
  if (users.length === 0) {
    return (
      <span className={`text-gray-500 dark:text-gray-400 italic ${className}`}>
        Aucun utilisateur
      </span>
    );
  }
  
  if (users.length === 1) {
    return (
      <UserDisplay
        user={users[0]}
        variant={variant}
        showAvatar={showAvatars}
        showRole={showRoles}
        language={language}
        className={className}
      />
    );
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      {displayUsers.map((user) => (
        <UserDisplay
          key={user.id}
          user={user}
          variant={variant}
          showAvatar={showAvatars}
          showRole={showRoles}
          language={language}
        />
      ))}
      {remainingCount > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 italic">
          +{remainingCount} autre{remainingCount > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

// Hook utilitaire pour obtenir le nom d'affichage d'un utilisateur
export function useDisplayName(user: User, language: 'fr' | 'ar' | 'both' = 'fr') {
  return React.useMemo(() => {
    const frenchName = [user.firstName, user.lastName].filter(Boolean).join(' ');
    const arabicName = [user.firstNameAr, user.lastNameAr].filter(Boolean).join(' ');
    
    switch (language) {
      case 'fr':
        return frenchName || arabicName || user.username || 'Utilisateur';
      case 'ar':
        return arabicName || frenchName || user.username || 'مستخدم';
      case 'both':
        if (frenchName && arabicName) {
          return `${frenchName} (${arabicName})`;
        }
        return frenchName || arabicName || user.username || 'Utilisateur';
      default:
        return frenchName || arabicName || user.username || 'Utilisateur';
    }
  }, [user, language]);
}
