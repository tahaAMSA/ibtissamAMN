import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from 'wasp/client/auth';
import { useI18n } from '../../translations/useI18n';
import { type Language } from '../../translations/index';

interface I18nContextType {
  t: (key: string) => string;
  lang: Language;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const { data: user } = useAuth();
  const i18n = useI18n(user as any);

  return (
    <I18nContext.Provider value={i18n}>
      <div dir={i18n.dir} className={i18n.isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18nContext(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18nContext must be used within an I18nProvider');
  }
  return context;
}
