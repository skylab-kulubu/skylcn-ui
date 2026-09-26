'use client';

import { createContext, useContext, type ComponentType, type ReactNode } from 'react';

export type SkylcnLocale = 'tr' | 'en';

const MESSAGES = {
  tr: {
    loading: 'Yükleniyor…',
    close: 'Kapat',
    closePanel: 'Paneli kapat',
    previousPage: 'Önceki sayfa',
    nextPage: 'Sonraki sayfa',
    page: (n: number) => `Sayfa ${n}`,
    pagination: 'Sayfalama',
    goToPage: 'Sayfaya git',
    breadcrumb: 'Sayfa yolu',
    noOptions: 'Seçenek yok',
    select: 'Seçiniz…',
    search: 'Ara…',
    noMatch: 'Eşleşme bulunamadı',
    searching: 'Aranıyor…',
    clear: 'Temizle',
    unexpectedError: 'Beklenmeyen bir hata oluştu.',
  },
  en: {
    loading: 'Loading…',
    close: 'Close',
    closePanel: 'Close panel',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    page: (n: number) => `Page ${n}`,
    pagination: 'Pagination',
    goToPage: 'Go to page',
    breadcrumb: 'Breadcrumb',
    noOptions: 'No options',
    select: 'Select…',
    search: 'Search…',
    noMatch: 'No matches',
    searching: 'Searching…',
    clear: 'Clear',
    unexpectedError: 'Something went wrong.',
  },
} as const;

export type SkylcnMessages = (typeof MESSAGES)[SkylcnLocale];

export type LinkComponentProps = {
  href: string;
  className?: string;
  children?: ReactNode;
  title?: string;
  'aria-current'?: 'page';
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

type SkylcnContextValue = {
  locale: SkylcnLocale;
  messages: SkylcnMessages;
  Link: ComponentType<LinkComponentProps> | 'a';
};

const SkylcnContext = createContext<SkylcnContextValue>({
  locale: 'tr',
  messages: MESSAGES.tr,
  Link: 'a',
});

/**
 * Sets the language of the built-in labels and the component used for internal
 * links (pass `next/link` in Next apps). Everything works without it: Turkish
 * labels and plain anchors.
 */
export function SkylcnProvider({
  locale = 'tr',
  linkComponent = 'a',
  children,
}: {
  locale?: SkylcnLocale;
  linkComponent?: ComponentType<LinkComponentProps> | 'a';
  children: ReactNode;
}) {
  return (
    <SkylcnContext.Provider value={{ locale, messages: MESSAGES[locale], Link: linkComponent }}>
      {children}
    </SkylcnContext.Provider>
  );
}

export function useSkylcn() {
  return useContext(SkylcnContext);
}
