import {
  ERROR_SCENE_KINDS,
  ERROR_SCENE_VARIANTS,
  ErrorScene,
  errorSceneText,
  PageHeader,
} from '@skylab-kulubu/skylcn-ui';
import Link from 'next/link';

const NAMES = {
  notFound: '404 · Sayfa bulunamadı',
  error: '500 · Beklenmeyen hata',
  forbidden: '403 · Erişim yok',
  offline: 'Çevrimdışı',
  sessionExpired: 'Oturum doldu',
  unavailable: '502, 503, 504 · Sunucuya ulaşılamıyor',
  linkExpired: '410 · Bağlantının süresi doldu',
  tooManyRequests: '429 · Çok fazla deneme',
  cookiesBlocked: 'Çerezler kapalı',
  formClosed: 'Form kapandı',
} as const;

// Every kind's drawings side by side; each opens as the whole page
export default function ErrorGallery() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10">
      <PageHeader
        title="Hata sayfaları"
        description="Her türün çizimleri. Ürünlerde ErrorScenePage her gelişte birini rastgele seçer; tür sayfası da öyle."
      />
      {ERROR_SCENE_KINDS.map((kind) => (
        <section key={kind} aria-labelledby={`tur-${kind}`} className="flex flex-col gap-3">
          <h2 id={`tur-${kind}`} className="text-base font-semibold text-foreground">
            <Link href={`/errors/${kind}`} className="hover:underline">
              {NAMES[kind]}
            </Link>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ERROR_SCENE_VARIANTS[kind].map((variant) => {
              const text = errorSceneText(kind, 'tr', variant);
              return (
                <Link
                  key={variant}
                  href={`/errors/${kind}/${variant}`}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border p-5 text-center transition-colors hover:bg-muted"
                >
                  <ErrorScene kind={kind} variant={variant} className="max-w-60" />
                  <span className="font-mono text-2xs text-subtle-foreground">
                    {variant} · {text.code}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{text.title}</span>
                  <span className="text-xs text-muted-foreground">{text.description}</span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
