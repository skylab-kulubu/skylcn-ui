'use client';

import { ChevronsUpDown } from 'lucide-react';
import { LayoutGroup, m } from 'motion/react';
import { useId, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { transitions } from '../lib/motion-tokens.js';
import { useSkylcn } from '../lib/provider.js';
import { Button } from './button.js';
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerTitle } from './drawer.js';
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from './preview-card.js';
import { SearchInput } from './page-header.js';

export type SideNavItem = { href: string; label: string; badge?: ReactNode };
export type SideNavSection = { label?: string; items: readonly SideNavItem[] };

export type SideNavProps = {
  /** Names the navigation, such as "Bileşenler" or "Ayarlar". */
  'aria-label': string;
  sections: readonly SideNavSection[];
  activeHref?: string;
  /** Adds a box that narrows the list by name, for long lists. */
  searchable?: boolean;
  /** A glimpse of each item shown beside it on hover or focus, on wide screens only. */
  preview?: (item: SideNavItem) => ReactNode;
  className?: string;
};

function List({
  sections,
  activeHref,
  query,
  onNavigate,
  preview,
}: Pick<SideNavProps, 'sections' | 'activeHref' | 'preview'> & {
  query: string;
  onNavigate?: () => void;
}) {
  const { Link, messages } = useSkylcn();
  const group = useId();
  const q = query.trim().toLocaleLowerCase('tr-TR');
  const shown = sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !q || item.label.toLocaleLowerCase('tr-TR').includes(q),
      ),
    }))
    .filter((section) => section.items.length > 0);

  if (shown.length === 0) {
    return <p className="px-2 py-3 text-xs text-muted-foreground">{messages.noResults}</p>;
  }
  return (
    <LayoutGroup id={group}>
      <div className="flex flex-col gap-4">
        {shown.map((section, i) => (
          <div key={section.label ?? i} className="flex flex-col gap-0.5">
            {section.label ? (
              <p className="px-2 pb-1 text-3xs font-medium tracking-label text-subtle-foreground uppercase">
                {section.label}
              </p>
            ) : null}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = item.href === activeHref;
                const link = (
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={onNavigate}
                    className={cn(
                      'relative isolate flex items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden pointer-coarse:py-2.5',
                      'transition-colors duration-(--motion-duration-fast) focus-visible:ring-2 focus-visible:ring-ring',
                      active
                        ? 'text-foreground-strong'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                  >
                    {active ? (
                      <m.span
                        layoutId="side-nav-active"
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-md bg-accent-strong"
                        transition={transitions.layout}
                      />
                    ) : null}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge ? <span className="shrink-0">{item.badge}</span> : null}
                  </Link>
                );
                return (
                  <li key={item.href}>
                    {preview ? (
                      <PreviewCard>
                        <PreviewCardTrigger render={link} />
                        <PreviewCardContent>{preview(item)}</PreviewCardContent>
                      </PreviewCard>
                    ) : (
                      link
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </LayoutGroup>
  );
}

/**
 * A page's own navigation beside its content: the component list of a docs
 * page, the folders of a mailbox, the sections of settings. A sticky column
 * from the lg breakpoint; below it, a button that opens the list in a panel.
 */
export function SideNav({
  'aria-label': label,
  sections,
  activeHref,
  searchable = false,
  preview,
  className,
}: SideNavProps) {
  const { messages } = useSkylcn();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const current = sections
    .flatMap((section) => section.items)
    .find((item) => item.href === activeHref);

  return (
    <>
      <nav
        aria-label={label}
        data-slot="side-nav"
        className={cn(
          'sticky top-6 scrollbar-hidden hidden max-h-[calc(100dvh-7rem)] flex-col gap-3 overflow-y-auto lg:flex',
          className,
        )}
      >
        {searchable ? (
          <SearchInput
            value={query}
            onValueChange={setQuery}
            placeholder={messages.filterItems}
            className="max-w-none min-w-0 flex-none"
          />
        ) : null}
        <List sections={sections} activeHref={activeHref} query={query} preview={preview} />
      </nav>

      <div className="lg:hidden">
        <Button
          className="w-full justify-between"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
        >
          <span className="truncate">
            <span className="text-subtle-foreground">{label}</span>
            {current ? <span className="text-foreground"> · {current.label}</span> : null}
          </span>
          <ChevronsUpDown className="text-subtle-foreground" />
        </Button>
        <Drawer open={open} onOpenChange={setOpen} side="bottom">
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{label}</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="flex flex-col gap-3">
              {searchable ? (
                <SearchInput
                  value={query}
                  onValueChange={setQuery}
                  placeholder={messages.filterItems}
                  className="max-w-none"
                />
              ) : null}
              <List
                sections={sections}
                activeHref={activeHref}
                query={query}
                onNavigate={() => setOpen(false)}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}

/** Lays a SideNav beside the page content from the lg breakpoint, above it on smaller screens. */
export function SideNavLayout({ nav, children }: { nav: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start lg:gap-10">
      {nav}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
