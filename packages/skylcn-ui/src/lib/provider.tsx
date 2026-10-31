'use client';

import { LazyMotion, MotionConfig } from 'motion/react';
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
    actionFailed: 'İşlem tamamlanamadı. Tekrar dene.',
    actionStalled: 'Sunucu yanıt vermedi; sonucu listeden denetle.',
    previous: 'Önceki',
    next: 'Sonraki',
    slideOf: (n: number, total: number) => `${total} öğeden ${n}.`,
    moveCard: 'Kartı taşı',
    filters: 'Filtreler',
    clearFilters: 'Filtreleri temizle',
    columns: 'Sütunlar',
    selectAll: 'Sayfadaki tüm satırları seç',
    selectRow: 'Satırı seç',
    stepRows: 'ile satırlar arasında gez',
    details: 'Ayrıntılar',
    rowDetails: (label: string) => `${label} ayrıntıları`,
    previousMonth: 'Önceki ay',
    nextMonth: 'Sonraki ay',
    chooseMonth: 'Ay seç',
    chooseYear: 'Yıl seç',
    chooseDecade: 'On yıl seç',
    previousYear: 'Önceki yıl',
    nextYear: 'Sonraki yıl',
    previousDecade: 'Önceki on yıl',
    nextDecade: 'Sonraki on yıl',
    previousCentury: 'Önceki yüzyıl',
    nextCentury: 'Sonraki yüzyıl',
    noEventsThisMonth: 'Bu ay etkinlik yok',
    commandPalette: 'Komut paleti',
    searchEverything: 'Sayfa ya da işlem ara…',
    morePeople: (n: number) => `${n} kişi daha`,
    moreActions: 'Diğer eylemler',
    moveItem: (label: string) => `${label} öğesini taşı`,
    sortHint: 'Yukarı ve aşağı ok tuşlarıyla taşı.',
    less: 'Az',
    more: 'Çok',
    heatmapHint: 'Günler arasında ok tuşlarıyla gezin.',
    saving: 'Kaydediliyor…',
    saved: 'Kaydedildi',
    saveFailed: 'Kaydedilemedi',
    code: 'Kod',
    before: 'Önce',
    after: 'Sonra',
    addedLine: 'eklendi',
    removedLine: 'silindi',
    movedTo: (label: string, position: number, total: number) =>
      `${label}: ${total} öğeden ${position}. sırada`,
    chooseFile: 'Dosya seç',
    orDropHere: 'ya da buraya bırak',
    uploading: 'Yükleniyor',
    uploadProgress: (percent: number) => `Yükleniyor %${percent}`,
    scanning: 'Taranıyor',
    uploaded: 'Yüklendi',
    uploadFailed: 'Yüklenemedi',
    retry: 'Tekrar dene',
    replaceFile: 'Değiştir',
    stopUpload: (name: string) => `${name} yüklemesini durdur`,
    selected: (n: number) => `${n} seçili`,
    clearSelection: 'Seçimi temizle',
    pickDate: 'Tarih seç',
    pickDateTime: 'Tarih ve saat seç',
    time: 'Saat',
    pickTime: 'Saat seç',
    hours: 'Saat',
    minutes: 'Dakika',
    choose: 'Seç',
    done: 'Tamam',
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
    create: (label: string) => `Yeni oluştur: “${label}”`,
    today: 'Bugün',
    whatHappens: 'Ne olacak',
    whatStays: 'Ne kalacak',
    typedConfirmation: 'Yazılı onay',
    requiredPhrase: 'Gereken metin',
    confirmHint: 'Metin tutunca Enter ile de onaylayabilirsin.',
    unlocksIn: (seconds: number) => `${seconds} saniye sonra açılır`,
    secondsShort: (seconds: number) => `${seconds} sn`,
    removeFilter: (label: string) => `${label} filtresini kaldır`,
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
    actionFailed: "That didn't go through. Try again.",
    actionStalled: 'The server did not answer; check the list for the result.',
    previous: 'Previous',
    next: 'Next',
    slideOf: (n: number, total: number) => `${n} of ${total}`,
    moveCard: 'Move card',
    filters: 'Filters',
    clearFilters: 'Clear filters',
    columns: 'Columns',
    selectAll: 'Select all rows on this page',
    selectRow: 'Select row',
    stepRows: 'to step through rows',
    details: 'Details',
    rowDetails: (label: string) => `Details for ${label}`,
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    chooseMonth: 'Choose a month',
    chooseYear: 'Choose a year',
    chooseDecade: 'Choose a decade',
    previousYear: 'Previous year',
    nextYear: 'Next year',
    previousDecade: 'Previous decade',
    nextDecade: 'Next decade',
    previousCentury: 'Previous century',
    nextCentury: 'Next century',
    noEventsThisMonth: 'No events this month',
    commandPalette: 'Command palette',
    searchEverything: 'Search pages and actions…',
    morePeople: (n: number) => `${n} more`,
    moreActions: 'More actions',
    moveItem: (label: string) => `Move ${label}`,
    sortHint: 'Move with the up and down arrow keys.',
    less: 'Less',
    more: 'More',
    heatmapHint: 'Move between days with the arrow keys.',
    saving: 'Saving…',
    saved: 'Saved',
    saveFailed: 'Could not save',
    code: 'Code',
    before: 'Before',
    after: 'After',
    addedLine: 'added',
    removedLine: 'removed',
    movedTo: (label: string, position: number, total: number) =>
      `${label}: position ${position} of ${total}`,
    chooseFile: 'Choose a file',
    orDropHere: 'or drop it here',
    uploading: 'Uploading',
    uploadProgress: (percent: number) => `Uploading ${percent}%`,
    scanning: 'Scanning',
    uploaded: 'Uploaded',
    uploadFailed: 'Upload failed',
    retry: 'Try again',
    replaceFile: 'Replace',
    stopUpload: (name: string) => `Stop uploading ${name}`,
    selected: (n: number) => `${n} selected`,
    clearSelection: 'Clear selection',
    pickDate: 'Pick a date',
    pickDateTime: 'Pick a date and time',
    time: 'Time',
    pickTime: 'Pick a time',
    hours: 'Hours',
    minutes: 'Minutes',
    choose: 'Select',
    done: 'Done',
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
    create: (label: string) => `Create “${label}”`,
    today: 'Today',
    whatHappens: 'What happens',
    whatStays: 'What stays',
    typedConfirmation: 'Typed confirmation',
    requiredPhrase: 'Required text',
    confirmHint: 'Once it matches, Enter confirms too.',
    unlocksIn: (seconds: number) => `unlocks in ${seconds} seconds`,
    secondsShort: (seconds: number) => `${seconds}s`,
    removeFilter: (label: string) => `Remove the ${label} filter`,
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
      <LazyMotion features={loadMotionFeatures}>
        <MotionConfig reducedMotion={reduced ? 'always' : 'never'} transition={transitions.enter}>
          {children}
        </MotionConfig>
      </LazyMotion>
    </SkylcnContext.Provider>
  );
}

// domMax is about 38 KB gzipped; components draw with the light `m` and animate once it arrives
function loadMotionFeatures() {
  return import('./motion-features.js').then((features) => features.default);
}

export function useSkylcn() {
  return useContext(SkylcnContext);
}
