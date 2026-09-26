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
import { Button, SkylcnProvider } from '@skylab-kulubu/skylcn-ui';
```

- Yazı tiplerini uygulama yükler (Space Grotesk ve Space Mono) ve `--skylcn-font-sans` / `--skylcn-font-mono` değişkenlerine bağlar.
- Koyu tema varsayılandır; `data-theme="light"` açık temaya geçirir.
- `SkylcnProvider` hazır metinlerin dilini (`tr` / `en`) ve iç bağlantılar için kullanılacak bileşeni (Next.js'te `next/link`) belirler.
- Tailwind kullanmayan yüzeyler yalnızca token'ları alır: `@skylab-kulubu/skylcn-ui/tokens.css`.

## Geliştirme

```sh
pnpm install
pnpm --filter @skylab-kulubu/skylcn-ui build
pnpm dev        # bileşen önizlemesi
pnpm typecheck
pnpm lint
```

Her değişiklik bir Changesets kaydıyla gelir: `pnpm changeset`.
