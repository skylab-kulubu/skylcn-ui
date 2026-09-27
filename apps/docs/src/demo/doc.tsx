'use client';

import { CopyButton, Reveal, useSkylcn } from '@skylab-kulubu/skylcn-ui';
import { Accessibility, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { CATEGORY_LABEL, ENTRIES, entryHref, ORDER, type Entry } from './catalog';
import { EXAMPLES } from './examples';

/** One preview on a component page: a title, a line on what it shows, and the live component. */
export function Example({
  title,
  description,
  children,
  align = 'center',
}: {
  title: string;
  description?: string;
  children: ReactNode;
  /** `start` for wide content such as lists and forms. */
  align?: 'center' | 'start';
}) {
  return (
    <section className="flex flex-col gap-2">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <div
        className={
          'flex min-h-36 flex-wrap gap-3 rounded-xl border border-border bg-card p-6 ' +
          '[background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] ' +
          (align === 'center' ? 'items-center justify-center' : 'flex-col items-stretch')
        }
      >
        {children}
      </div>
    </section>
  );
}

function Notes({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Accessibility;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="size-4 text-skylab-300" aria-hidden /> {title}
      </p>
      <ul className="flex list-disc flex-col gap-1.5 pl-5 text-xs leading-relaxed text-muted-foreground marker:text-subtle-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

const ordered = ORDER.flatMap((category) => ENTRIES.filter((entry) => entry.category === category));

function Neighbour({ entry, direction }: { entry: Entry | undefined; direction: 'prev' | 'next' }) {
  const { Link } = useSkylcn();
  if (!entry) return <span />;
  return (
    <Link
      href={entryHref(entry.slug)}
      className={
        'group flex flex-col gap-0.5 rounded-xl border border-border p-4 outline-hidden transition-colors duration-(--motion-duration-fast) hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring ' +
        (direction === 'next' ? 'items-end text-right' : '')
      }
    >
      <span className="flex items-center gap-1 text-3xs tracking-label text-subtle-foreground uppercase">
        {direction === 'prev' ? <ArrowLeft className="size-3" /> : null}
        {direction === 'prev' ? 'Önceki' : 'Sonraki'}
        {direction === 'next' ? <ArrowRight className="size-3" /> : null}
      </span>
      <span className="text-sm font-medium text-foreground">{entry.name}</span>
    </Link>
  );
}

export function ComponentDoc({ slug }: { slug: string }) {
  const entry = ENTRIES.find((item) => item.slug === slug);
  if (!entry) return null;
  const Examples = EXAMPLES[slug];
  const index = ordered.findIndex((item) => item.slug === slug);
  const importLine = entry.imports.length
    ? `import { ${entry.imports.join(', ')} } from '@skylab-kulubu/skylcn-ui${entry.charts ? '/charts' : ''}';`
    : null;

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-3xs font-medium tracking-label text-skylab-300 uppercase">
          {CATEGORY_LABEL[entry.category]}
        </p>
        <h1 className="text-2xl font-semibold text-foreground">{entry.name}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {entry.description}
        </p>
        {importLine ? (
          <div className="flex max-w-full items-center gap-2 rounded-lg border border-border bg-card py-1 pr-1 pl-3">
            <code className="min-w-0 flex-1 font-mono text-xs break-words text-secondary-foreground">
              {importLine}
            </code>
            <CopyButton value={importLine} label="Import satırını kopyala" />
          </div>
        ) : null}
      </header>

      {Examples ? (
        <Reveal className="flex flex-col gap-8">
          <Examples />
        </Reveal>
      ) : null}

      {entry.a11y || entry.motion ? (
        <div className="grid gap-3 md:grid-cols-2">
          {entry.a11y ? (
            <Notes icon={Accessibility} title="Erişilebilirlik" items={entry.a11y} />
          ) : null}
          {entry.motion ? <Notes icon={Sparkles} title="Hareket" items={entry.motion} /> : null}
        </div>
      ) : null}

      <nav aria-label="Bileşenler arasında" className="grid grid-cols-2 gap-3">
        <Neighbour entry={ordered[index - 1]} direction="prev" />
        <Neighbour entry={ordered[index + 1]} direction="next" />
      </nav>
    </article>
  );
}
