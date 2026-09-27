'use client';

import { LazyMotion, MotionConfig, domMax } from 'motion/react';
import { createContext, useContext, type ComponentType, type ReactNode } from 'react';
import { transitions } from './motion-tokens.js';
import { useReducedMotion } from './use-reduced-motion.js';

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
    pageInput: (total: number) => `Sayfa numarası (1–${total})`,
    sortBy: (label: string) => `Sırala: ${label}`,
    clearSearch: 'Aramayı temizle',
    openMenu: 'Menüyü aç',
    collapseSidebar: 'Kenar çubuğunu daralt',
    expandSidebar: 'Kenar çubuğunu genişlet',
    consoles: 'Kulüp konsolları',
    navigation: 'Gezinme',
    skipToContent: 'İçeriğe geç',
    showTable: 'Tablo olarak göster',
    showChart: 'Grafik olarak göster',
    toggleSeries: (label: string) => `${label} serisini göster ya da gizle`,
    noData: 'Gösterilecek veri yok',
    total: 'Toplam',
    other: 'Diğer',
    cancel: 'Vazgeç',
    commandPalette: 'Komut paleti',
    searchEverything: 'Sayfa ya da işlem ara…',
    morePeople: (n: number) => `${n} kişi daha`,
    chooseFile: 'Dosya seç',
    orDropHere: 'ya da buraya bırak',
    selected: (n: number) => `${n} seçili`,
    clearSelection: 'Seçimi temizle',
    pickDate: 'Tarih seç',
    pickRange: 'Tarih aralığı seç',
    openList: 'Listeyi aç',
    removeItem: (label: string) => `${label} çıkar`,
    increase: 'Artır',
    decrease: 'Azalt',
    codeCharacter: (n: number, total: number) => `${total} karakterin ${n}.si`,
    copy: 'Kopyala',
    copied: 'Kopyalandı',
    noResults: 'Sonuç yok',
    filterItems: 'Listede ara',
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
    pageInput: (total: number) => `Page number (1–${total})`,
    sortBy: (label: string) => `Sort by ${label}`,
    clearSearch: 'Clear search',
    openMenu: 'Open menu',
    collapseSidebar: 'Collapse sidebar',
    expandSidebar: 'Expand sidebar',
    consoles: 'Club consoles',
    navigation: 'Navigation',
    skipToContent: 'Skip to content',
    showTable: 'Show as table',
    showChart: 'Show as chart',
    toggleSeries: (label: string) => `Show or hide ${label}`,
    noData: 'No data to show',
    total: 'Total',
    other: 'Other',
    cancel: 'Cancel',
    commandPalette: 'Command palette',
    searchEverything: 'Search pages and actions…',
    morePeople: (n: number) => `${n} more`,
    chooseFile: 'Choose a file',
    orDropHere: 'or drop it here',
    selected: (n: number) => `${n} selected`,
    clearSelection: 'Clear selection',
    pickDate: 'Pick a date',
    pickRange: 'Pick a date range',
    openList: 'Open list',
    removeItem: (label: string) => `Remove ${label}`,
    increase: 'Increase',
    decrease: 'Decrease',
    codeCharacter: (n: number, total: number) => `Character ${n} of ${total}`,
    copy: 'Copy',
    copied: 'Copied',
    noResults: 'No results',
    filterItems: 'Filter the list',
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
 * links (pass `next/link` in Next apps), and loads the motion features the
 * components animate with. Without it: Turkish labels, plain anchors and no
 * script-driven animation.
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
  // Reduced motion (system or in-product) keeps fades and drops travel, scaling and layout moves.
  const reduced = useReducedMotion();
  return (
    <SkylcnContext.Provider value={{ locale, messages: MESSAGES[locale], Link: linkComponent }}>
      <LazyMotion features={domMax}>
        <MotionConfig reducedMotion={reduced ? 'always' : 'never'} transition={transitions.enter}>
          {children}
        </MotionConfig>
      </LazyMotion>
    </SkylcnContext.Provider>
  );
}

export function useSkylcn() {
  return useContext(SkylcnContext);
}
