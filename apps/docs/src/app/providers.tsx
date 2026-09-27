'use client';

import { SkylcnProvider, TooltipProvider, type SkylcnLocale } from '@skylab-kulubu/skylcn-ui';
import Link from 'next/link';
import { createContext, useContext, useState, type ReactNode } from 'react';

const LocaleContext = createContext<{
  locale: SkylcnLocale;
  setLocale: (locale: SkylcnLocale) => void;
}>({ locale: 'tr', setLocale: () => undefined });

/** The language of the package's own texts in the preview, switchable from the playground. */
export function useDemoLocale() {
  return useContext(LocaleContext);
}

export function Providers({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<SkylcnLocale>('tr');
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <SkylcnProvider locale={locale} linkComponent={Link}>
        <TooltipProvider>{children}</TooltipProvider>
      </SkylcnProvider>
    </LocaleContext.Provider>
  );
}
