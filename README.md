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
pnpm dev        # bileşen önizlemesi
pnpm typecheck
pnpm lint
pnpm test       # birim ve erişilebilirlik (axe) testleri
```

Her değişiklik bir Changesets kaydıyla gelir: `pnpm changeset`.

## Lisans

[MIT](LICENSE)
