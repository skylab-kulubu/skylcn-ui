# skylcn-ui

SKY LAB web ürünlerinin ortak tasarım sistemi: token'lar, tema ve [Base UI](https://base-ui.com) üzerine shadcn yaklaşımıyla yazılmış bileşenler. Karar kaydı: [ADR 0055](https://github.com/skylab-kulubu/e-skylab/blob/main/docs/adr/0055-skylcn-ui-is-the-shared-design-system.md).

Paket `@skylab-kulubu/skylcn-ui` adıyla npm'de yayımlanacak; henüz yayımlanmadı.

## Kullanım

Tailwind 4 kullanan uygulamalar temayı Tailwind'den hemen sonra içe aktarır:

```css
@import 'tailwindcss';
@import '@skylab-kulubu/skylcn-ui/theme.css';
```

```tsx
import { Button, SkylcnProvider, ThemeScript } from '@skylab-kulubu/skylcn-ui';

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <SkylcnProvider locale="tr">{children}</SkylcnProvider>
      </body>
    </html>
  );
}
```

- Yazı tiplerini uygulama yükler (Space Grotesk ve Space Mono) ve `--skylcn-font-sans` / `--skylcn-font-mono` değişkenlerine bağlar. Yüklenmezse sistem yazı tipine düşülür; Keycloak teması gibi yüzeylerde bu yeterlidir.
- Koyu tema varsayılandır; `data-theme="light"` açık temaya geçirir. `useTheme` seçimi hatırlar ve temayı kısa bir geçişle değiştirir.
- Sayfanın yanlış temada açılıp titrememesi için `<ThemeScript />` `<head>` içine konur ve `<html>` etiketine `suppressHydrationWarning` eklenir.
- `SkylcnProvider` hazır metinlerin dilini (`tr` / `en`) ve iç bağlantılar için kullanılacak bileşeni (Next.js'te `next/link`) belirler.
- Tailwind kullanmayan yüzeyler yalnızca token'ları alır: `@skylab-kulubu/skylcn-ui/tokens.css`.

## Giriş noktaları

- `@skylab-kulubu/skylcn-ui` — bileşenler, hareket yardımcıları, tema ve token'lar.
- `@skylab-kulubu/skylcn-ui/charts` — Recharts üzerine grafikler (alan, çizgi, çubuk, halka). Grafik kullanmayan uygulama Recharts'ı hiç yüklemez.
- `@skylab-kulubu/skylcn-ui/data-table` — TanStack Table üzerine yönetim tablosu.
- `@skylab-kulubu/skylcn-ui/theme.css` ve `/tokens.css` — Tailwind teması ve yalın CSS token'ları.

## Bileşenler

Tüm bileşenler canlı örnekleriyle doküman uygulamasındaki playground'da (`/playground/components`):

- **Eylemler:** Button, IconButton, IconSwap, CopyButton, SegmentedControl
- **Form:** Field, Input, Textarea, Select, Combobox, MultiSelect, Checkbox, RadioGroup, Switch, ToggleRow, NumberField, Slider, DatePicker, DateRangePicker, Calendar, Dropzone, OTPField
- **Katmanlar:** Dialog, ConfirmDialog, Drawer (sağ, sol, alt; kaydırarak kapanır), Popover, PreviewCard, Tooltip, Menu, ContextMenu, Toast, CommandPalette
- **Gezinme:** AppShell, SideNav, NavigationMenu, Tabs, Accordion, Stepper, Breadcrumbs, Pagination, PageHeader
- **Veri:** DataList, DataTable, ListPanel, Card, StatCard, Badge, StatusDot, Avatar, AvatarGroup, DescriptionList, Timeline, Tree, MonthCalendar, BarList, ProportionBar, TrendBadge, Sparkline, Notice, Banner, BulkBar, Progress, Meter, Kbd, StateCard, StatusPage, Skeleton
- **Hareket:** Reveal, Collapse, Swap, AnimatedNumber

## İlkeler

- **Erişilebilirlik:** Okunacak her metin her yüzeyde en az 4.5:1 kontrastta kalır; `faint` tonu yalnızca süs ve devre dışı durumlar içindir. Odak halkası anında görünür ve Windows yüksek kontrast modunda da çizilir. Yüksek kontrast isteyen okura sessiz metin ve çizgiler bir kademe güçlenir.
- **Hareket:** Süreler, eğriler ve mesafeler token'dır. Hareket azaltma tercihinde kısa solmalar kalır, kayma ve büyüme kalkar. Animasyon yalnızca bir şeyin nereden gelip nereye gittiğini ya da durumunun değiştiğini anlatıyorsa kullanılır.
- **Mobil:** Dokunmatik ekranda kontroller büyür ve yazı alanları 16px olur; bu sayede iOS alana yakınlaştırma yapmaz.

## Tarayıcı desteği

Chrome/Edge 113, Safari 17.2 ve Firefox 112 ile sonrası. Tema geçişindeki yumuşak solma View Transitions API'si olan tarayıcılarda çalışır, olmayanlarda tema anında değişir.

## Geliştirme

```sh
pnpm install
pnpm --filter @skylab-kulubu/skylcn-ui build
pnpm dev        # playground: senaryolar ve bileşen kütüphanesi
pnpm typecheck
pnpm lint
pnpm test       # birim ve erişilebilirlik (axe) testleri
```

Uçtan uca testler docs uygulamasının üretim derlemesine karşı çalışır; her sayfa iki temada axe'tan geçer ve ana etkileşimler denenir:

```sh
pnpm --filter docs build
pnpm --filter docs exec playwright install chromium   # ya da PLAYWRIGHT_CHROMIUM_EXECUTABLE ile kurulu bir Chromium
pnpm --filter docs e2e
```

Playground statik dosya olarak da derlenebilir; `DOCS_BASE_PATH` onu bir alt yolda sunar:

```sh
DOCS_EXPORT=1 DOCS_BASE_PATH=/playground pnpm --filter docs build   # çıktı: apps/docs/out
```

Her değişiklik bir Changesets kaydıyla gelir: `pnpm changeset`.

## Lisans

[MIT](LICENSE)
