import type { User } from 'wasp/entities';
import { UserRole, Gender, Language } from '@prisma/client';
import { logout } from 'wasp/client/auth';
import { RoleInfo } from '../client/components/ui/RoleInfo';
import { usePermissions } from '../client/hooks/usePermissions';
import LanguageSelector from '../client/components/LanguageSelector';

export default function AccountPage({ user }: { user: User }) {
  const { getRoleLabel } = usePermissions();

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenderLabel = (gender: Gender | null) => {
    switch (gender) {
      case 'HOMME': return 'Homme';
      case 'FEMME': return 'Femme';
      case 'AUTRE': return 'Autre';
      default: return null;
    }
  };

  const getLanguageLabel = (language: Language | null) => {
    switch (language) {
      case 'FR': return '🇫🇷 Français';
      case 'AR': return '🇸🇦 العربية';
      default: return '🇫🇷 Français';
    }
  };

  const getDisplayName = () => {
    const frenchName = [user.firstName, user.lastName].filter(Boolean).join(' ');
    const arabicName = [user.firstNameAr, user.lastNameAr].filter(Boolean).join(' ');
    
    if (frenchName && arabicName) {
      return `${frenchName} (${arabicName})`;
    }
    return frenchName || arabicName || user.username || 'Utilisateur';
  };
  
  return (
    <div className='mt-10 px-6'>
      {/* Section Avatar et Nom */}
      <div className='overflow-hidden border border-gray-900/10 shadow-lg sm:rounded-lg mb-4 lg:m-8 dark:border-gray-100/10'>
        <div className='px-4 py-5 sm:px-6 lg:px-8'>
          <div className='flex items-center space-x-4'>
            <div className='flex-shrink-0'>
              {user.avatar ? (
                <img
                  className='h-16 w-16 rounded-full object-cover'
                  src={user.avatar}
                  alt={`Avatar de ${getDisplayName()}`}
                />
              ) : (
                <div className='h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center'>
                  <span className='text-xl font-semibold text-gray-600 dark:text-gray-300'>
                    {getDisplayName().charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h3 className='text-lg font-semibold leading-6 text-gray-900 dark:text-white'>
                {getDisplayName()}
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {getRoleLabel('fr')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Informations personnelles */}
      <div className='overflow-hidden border border-gray-900/10 shadow-lg sm:rounded-lg mb-4 lg:m-8 dark:border-gray-100/10'>
        <div className='px-4 py-5 sm:px-6 lg:px-8'>
          <h3 className='text-base font-semibold leading-6 text-gray-900 dark:text-white'>
            Informations personnelles
          </h3>
        </div>
        <div className='border-t border-gray-900/10 dark:border-gray-100/10 px-4 py-5 sm:p-0'>
          <dl className='sm:divide-y sm:divide-gray-900/10 sm:dark:divide-gray-100/10'>
            {/* Noms français */}
            {(user.firstName || user.lastName) && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500 dark:text-white'>Nom complet (Français)</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                  {[user.firstName, user.lastName].filter(Boolean).join(' ')}
                </dd>
              </div>
            )}

            {/* Noms arabes */}
            {(user.firstNameAr || user.lastNameAr) && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500 dark:text-white'>الاسم الكامل (العربية)</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0' dir="rtl">
                  {[user.firstNameAr, user.lastNameAr].filter(Boolean).join(' ')}
                </dd>
              </div>
            )}

            {/* Sexe */}
            {user.gender && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500 dark:text-white'>Sexe</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                  {getGenderLabel(user.gender)}
                </dd>
              </div>
            )}

            {/* Date de naissance */}
            {user.dateOfBirth && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500 dark:text-white'>Date de naissance</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                  {formatDate(user.dateOfBirth)}
                </dd>
              </div>
            )}

            {/* Email */}
            {user.email && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500 dark:text-white'>Adresse email</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                  {user.email}
                </dd>
              </div>
            )}

            {/* Téléphone */}
            {user.phone && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500 dark:text-white'>Téléphone</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                  {user.phone}
                </dd>
              </div>
            )}

            {/* Langue préférée */}
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>Langue préférée</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                <div className="flex items-center gap-4">
                  <span>{getLanguageLabel((user as any).preferredLanguage)}</span>
                  <LanguageSelector 
                    showLabel={false} 
                    size="sm" 
                    className="ml-auto"
                  />
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Section Compte et rôle */}
      <div className='overflow-hidden border border-gray-900/10 shadow-lg sm:rounded-lg mb-4 lg:m-8 dark:border-gray-100/10'>
        <div className='px-4 py-5 sm:px-6 lg:px-8'>
          <h3 className='text-base font-semibold leading-6 text-gray-900 dark:text-white'>
            Informations du compte
          </h3>
        </div>
        <div className='border-t border-gray-900/10 dark:border-gray-100/10 px-4 py-5 sm:p-0'>
          <dl className='sm:divide-y sm:divide-gray-900/10 sm:dark:divide-gray-100/10'>
            {user.username && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500 dark:text-white'>Nom d'utilisateur</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                  {user.username}
                </dd>
              </div>
            )}

            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>Rôle et responsabilités</dt>
              <dd className='mt-1 sm:col-span-2 sm:mt-0'>
                <RoleInfo 
                  role={user.role as UserRole} 
                  language="fr" 
                  variant="detailed"
                  className="max-w-md"
                />
              </dd>
            </div>

            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>Statut du compte</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Actif' : 'Inactif'}
                </span>
              </dd>
            </div>

            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>Membre depuis</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                {formatDate(user.createdAt)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className='inline-flex w-full justify-end'>
        <button
          onClick={logout}
          className='inline-flex justify-center mx-8 py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
