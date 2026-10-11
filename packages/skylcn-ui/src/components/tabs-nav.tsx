'use client';

import type { LucideIcon } from 'lucide-react';
import { LayoutGroup, m } from 'motion/react';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { transitions } from '../lib/motion-tokens.js';
import { useSkylcn } from '../lib/provider.js';

export type TabsNavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  /** A count or a small Badge after the label. */
  badge?: ReactNode;
};

export type TabsNavProps = {
  /** Names the navigation, such as "Etkinlik" or "Ayarlar". */
  'aria-label': string;
  items: readonly TabsNavItem[];
  /** The href of the open route; that tab is the current page. */
  activeHref?: string;
  /** Links or buttons at the end of the row, outside the tabs: "Kapı", "Önizle". */
  actions?: ReactNode;
  className?: string;
};

/** Room left beside a tab scrolled into view, so the next one peeks in. */
const SCROLL_EDGE = 24;

/** Where a sideways-scrolling row should stand so a tab inside it shows whole. */
export function scrollLeftToShow(
  row: { scrollLeft: number; width: number },
  tab: { left: number; width: number },
) {
  if (tab.left < row.scrollLeft) return Math.max(0, tab.left - SCROLL_EDGE);
  const right = tab.left + tab.width;
  if (right > row.scrollLeft + row.width) return right - row.width + SCROLL_EDGE;
  return row.scrollLeft;
}

/**
 * Tabs that are links: each one opens a route of its own (/events/42,
 * /events/42/program), so the address, the back button and deep links work.
 * Navigation, not a tablist: a list of links where the open route carries
 * aria-current="page", in the natural tab order. Looks like Tabs; the row
 * scrolls sideways when it does not fit and keeps the open tab in view.
 */
export function TabsNav({
  'aria-label': label,
  items,
  activeHref,
  actions,
  className,
}: TabsNavProps) {
  const { Link } = useSkylcn();
  const group = useId();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const tab = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !tab) return;
    list.scrollLeft = scrollLeftToShow(
      { scrollLeft: list.scrollLeft, width: list.clientWidth },
      { left: tab.offsetLeft, width: tab.offsetWidth },
    );
  }, [activeHref]);

  return (
    <nav
      aria-label={label}
      data-slot="tabs-nav"
      className={cn('flex min-w-0 items-center gap-2 border-b border-border', className)}
    >
      <LayoutGroup id={group}>
        <ul
          ref={listRef}
          className="relative scrollbar-hidden flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
        >
          {items.map((item) => {
            const active = item.href === activeHref;
            const Icon = item.icon;
            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex h-9 items-center gap-2 rounded-t-md px-3 text-sm whitespace-nowrap outline-hidden pointer-coarse:h-11',
                    'transition-colors duration-(--motion-duration-fast) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                    active ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {Icon ? <Icon aria-hidden className="size-4 shrink-0" /> : null}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge !== null ? (
                    <>
                      {' '}
                      <span className="text-2xs text-subtle-foreground tabular-nums">
                        {item.badge}
                      </span>
                    </>
                  ) : null}
                  {active ? (
                    // The underline glides to the tab of the next route, as in Tabs
                    <m.span
                      layoutId="tabs-nav-active"
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-skylab-400"
                      transition={transitions.layout}
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
      {actions ? <div className="flex shrink-0 items-center gap-1.5">{actions}</div> : null}
    </nav>
  );
}
