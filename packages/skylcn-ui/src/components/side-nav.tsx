'use client';

import { ChevronsUpDown, type LucideIcon } from 'lucide-react';
import { LayoutGroup, m } from 'motion/react';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn.js';
import { transitions } from '../lib/motion-tokens.js';
import { useSkylcn } from '../lib/provider.js';
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerTitle } from './drawer.js';
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from './preview-card.js';
import { SearchInput } from './page-header.js';

export type SideNavItem = {
  href: string;
  label: string;
  /** A lucide icon before the label; tinted with the primary colour on the open page. */
  icon?: LucideIcon;
  /** A count or a small Badge at the end of the row, quiet beside the label. */
  badge?: ReactNode;
};
export type SideNavSection = {
  /** A small upper-case heading over the section; a rule above it divides it from the one before. */
  label?: string;
  items: readonly SideNavItem[];
};

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

// Scrolls before the first paint in the browser, so the panel never jumps; no layout on the server
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Where a panel scrolling up and down should stand so the open item inside it shows: where it
 * is when the item is already in view, else with the item in the middle.
 */
export function scrollTopToShow(
  panel: { scrollTop: number; height: number },
  item: { top: number; height: number },
) {
  const inView =
    item.top >= panel.scrollTop && item.top + item.height <= panel.scrollTop + panel.height;
  if (inView) return panel.scrollTop;
  return Math.max(0, Math.round(item.top - (panel.height - item.height) / 2));
}

/** Moves focus between the menu's links with the arrow keys, Home and End; Tab still leaves. */
function moveFocus(event: KeyboardEvent<HTMLElement>) {
  const links = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href]')];
  const at = links.indexOf(document.activeElement as HTMLElement);
  if (at === -1) return;
  const next =
    event.key === 'ArrowDown'
      ? Math.min(at + 1, links.length - 1)
      : event.key === 'ArrowUp'
        ? Math.max(at - 1, 0)
        : event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? links.length - 1
            : null;
  if (next === null) return;
  event.preventDefault();
  links[next]?.focus();
}

function hasBadge(badge: ReactNode) {
  return badge !== undefined && badge !== null && badge !== false && badge !== '';
}

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
    return <p className="px-3 py-3 text-xs text-muted-foreground">{messages.noResults}</p>;
  }
  return (
    <LayoutGroup id={group}>
      <div className="flex flex-col" onKeyDown={moveFocus}>
        {shown.map((section, i) => {
          const headingId = section.label ? `${group}-s${i}` : undefined;
          return (
            <div
              key={section.label ?? i}
              data-slot="side-nav-section"
              className={cn(i > 0 && 'mt-3 border-t border-border-subtle pt-3')}
            >
              {section.label ? (
                <p
                  id={headingId}
                  className="mb-1 px-3 text-2xs font-semibold tracking-[0.08em] text-subtle-foreground uppercase"
                >
                  {section.label}
                </p>
              ) : null}
              <ul aria-labelledby={headingId} className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const active = item.href === activeHref;
                  const Icon = item.icon;
                  const link = (
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      onClick={onNavigate}
                      className={cn(
                        'group relative isolate flex h-9 items-center gap-2.5 rounded-md pr-2.5 pl-3 text-sm outline-hidden pointer-coarse:h-11',
                        'transition-colors duration-(--motion-duration-fast) focus-visible:ring-2 focus-visible:ring-ring',
                        active
                          ? 'font-medium text-foreground-strong'
                          : 'text-secondary-foreground hover:bg-accent hover:text-foreground',
                      )}
                    >
                      {active ? (
                        // The fill and the bar on its left glide together to the next open page
                        <m.span
                          layoutId="side-nav-active"
                          aria-hidden
                          data-slot="side-nav-active"
                          className="absolute inset-0 -z-10 rounded-md bg-accent-strong"
                          transition={transitions.layout}
                        >
                          <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-primary" />
                        </m.span>
                      ) : null}
                      {Icon ? (
                        <Icon
                          aria-hidden
                          className={cn(
                            'size-4 shrink-0 transition-colors duration-(--motion-duration-fast)',
                            active
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-foreground',
                          )}
                        />
                      ) : null}
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {hasBadge(item.badge) ? (
                        <>
                          {' '}
                          <span
                            className={cn(
                              'shrink-0 text-xs font-normal tabular-nums',
                              active ? 'text-secondary-foreground' : 'text-subtle-foreground',
                            )}
                          >
                            {item.badge}
                          </span>
                        </>
                      ) : null}
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
          );
        })}
      </div>
    </LayoutGroup>
  );
}

/**
 * A page's own navigation beside its content: the component list of a docs
 * page, the folders of a mailbox, the sections of settings, the pages of an
 * object. A panel of its own tone and border, sticky from the lg breakpoint;
 * sections under small upper-case headings with a rule between them; rows
 * with an icon, a quiet count and a filled, bar-marked open page. Below lg, a
 * button naming the open page opens the same list in a bottom drawer.
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
  const panel = useRef<HTMLElement>(null);
  const current = sections
    .flatMap((section) => section.items)
    .find((item) => item.href === activeHref);
  const CurrentIcon = current?.icon;

  // A long menu keeps the open page in view inside its own scrolling panel
  useIsomorphicLayoutEffect(() => {
    const box = panel.current;
    const item = box?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!box || !item) return;
    const top = item.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop;
    box.scrollTop = scrollTopToShow(
      { scrollTop: box.scrollTop, height: box.clientHeight },
      { top, height: item.offsetHeight },
    );
  }, [activeHref]);

  return (
    <>
      <nav
        ref={panel}
        aria-label={label}
        data-slot="side-nav"
        className={cn(
          'sticky top-6 scrollbar-hidden hidden max-h-[calc(100dvh-7rem)] flex-col gap-3 overflow-y-auto rounded-xl border border-border bg-sheet p-2 lg:flex',
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
        <button
          type="button"
          data-slot="side-nav-trigger"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className={cn(
            'flex h-11 w-full items-center gap-2.5 rounded-lg border border-border bg-sheet px-3 text-sm text-foreground outline-hidden',
            'transition-colors duration-(--motion-duration-fast) hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring',
          )}
        >
          {CurrentIcon ? (
            <CurrentIcon aria-hidden className="size-4 shrink-0 text-primary" />
          ) : null}
          <span className="min-w-0 flex-1 truncate text-left">
            <span className="text-subtle-foreground">{current ? `${label} ·` : label}</span>
            {current ? (
              <>
                {' '}
                <span className="font-medium">{current.label}</span>
              </>
            ) : null}
          </span>
          <ChevronsUpDown aria-hidden className="size-4 shrink-0 text-muted-foreground" />
        </button>
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
              <nav aria-label={label}>
                <List
                  sections={sections}
                  activeHref={activeHref}
                  query={query}
                  onNavigate={() => setOpen(false)}
                />
              </nav>
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
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start lg:gap-6">
      {nav}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
