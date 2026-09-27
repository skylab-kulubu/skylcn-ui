'use client';

import { Card, Reveal, useSkylcn } from '@skylab-kulubu/skylcn-ui';
import { CATEGORY_LABEL, ENTRIES, entryHref, ORDER } from '../../../demo/catalog';

export default function ComponentsIndex() {
  const { Link } = useSkylcn();
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-3xs font-medium tracking-label text-skylab-300 uppercase">Kütüphane</p>
        <h1 className="text-2xl font-semibold text-foreground">Bileşenler</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          skylcn-ui’nin temelleri ve bileşenleri, canlı örnekleriyle. Her sayfa import satırını,
          erişilebilirlik ve hareket notlarını da gösterir; senaryolarda aynı bileşenleri bir arada
          görebilirsin.
        </p>
      </header>
      {ORDER.map((category, i) => (
        <Reveal key={category} index={i} className="flex flex-col gap-3">
          <h2 className="text-3xs font-medium tracking-label text-subtle-foreground uppercase">
            {CATEGORY_LABEL[category]}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {ENTRIES.filter((entry) => entry.category === category).map((entry) => (
              <Link
                key={entry.slug}
                href={entryHref(entry.slug)}
                className="rounded-xl outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="h-full gap-1 p-4 transition-colors duration-(--motion-duration-fast) hover:border-border-strong hover:bg-accent">
                  <span className="text-sm font-medium text-foreground">{entry.name}</span>
                  <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {entry.description}
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
