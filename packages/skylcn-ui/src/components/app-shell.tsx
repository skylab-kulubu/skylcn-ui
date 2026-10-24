'use client';

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsUpDown,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { LayoutGroup, m } from 'motion/react';
import { cn } from '../lib/cn.js';
import { transitions } from '../lib/motion-tokens.js';
import { useSkylcn } from '../lib/provider.js';
import { Avatar } from './avatar.js';
import { SkylabMark } from './skylab-mark.js';
import { IconSwap } from './icon-swap.js';
import { AnimatedNumber } from './motion.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  MenuItem,
  MenuLinkItem,
} from './menu.js';
import { Tooltip } from './tooltip.js';

// Kept here too, where it was first exported
export { SkylabMark };

type ShellContextValue = {
  setCollapsed: (next: boolean) => void;
  // Read when a rail tooltip is about to open, so items need not re-render on every toggle
  collapsedRef: RefObject<boolean>;
  setMobileOpen: (next: boolean) => void;
  desktopSlot: HTMLElement | null;
  mobileSlot: HTMLElement | null;
};

const ShellContext = createContext<ShellContextValue | null>(null);
/** True on the desktop icon rail, false in the drawer. Only parts that change with it read it. */
const CollapsedContext = createContext(false);
const DrawerContext = createContext(false);
const NestedContext = createContext(false);

function useShell() {
  const shell = useContext(ShellContext);
  if (!shell) throw new Error('AppShell parts must be used inside <AppShell>.');
  return shell;
}

/** Whether the sidebar is drawn as an icon rail, and whether it sits in the mobile drawer. */
export function useSidebar() {
  const shell = useShell();
  return {
    collapsed: useContext(CollapsedContext),
    inDrawer: useContext(DrawerContext),
    setCollapsed: shell.setCollapsed,
    closeDrawer: () => shell.setMobileOpen(false),
  };
}

/** Names an icon on the rail; while the sidebar shows its text there is nothing to add, so it stays shut. */
function RailTooltip({ label, children }: { label: ReactNode; children: ReactElement }) {
  const { collapsedRef } = useShell();
  const inDrawer = useContext(DrawerContext);
  return (
    <Tooltip
      label={label}
      side="right"
      onOpenChange={(open, details) => {
        if (open && (inDrawer || !collapsedRef.current)) details.cancel();
      }}
    >
      {children}
    </Tooltip>
  );
}

const DESKTOP_QUERY = '(min-width: 48rem)';

function useIsDesktop() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(DESKTOP_QUERY);
      query.addEventListener('change', onChange);
      return () => query.removeEventListener('change', onChange);
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true,
  );
}

/*
 * Collapsing to the rail and back changes no markup, so nothing remounts and
 * nothing jumps: every icon sits on one column, the middle of the rail, and CSS
 * moves the width and fades the text. Collapsing, the text fades before the
 * width moves; expanding, the width moves first and the text fades in as it lands.
 */
const FULL_ONLY = [
  'transition-opacity duration-(--motion-duration-fast) ease-enter delay-100',
  'group-data-collapsed/sidebar:opacity-0 group-data-collapsed/sidebar:duration-(--motion-duration-instant) group-data-collapsed/sidebar:delay-0',
].join(' ');

/*
 * Groups fold in CSS alone, through grid rows going 0fr ↔ 1fr, so nothing is
 * measured from script mid-animation. FOLD is the reader opening or closing a
 * group; RAIL_FOLD, nested inside it, folds every group away with the rail and
 * unfolds it as the labels fade in.
 */
const FOLD =
  'grid transition-[grid-template-rows,opacity,visibility] duration-(--motion-duration-base) ease-enter motion-reduce:transition-[opacity,visibility]';
const RAIL_FOLD = [
  // Visibility only moves on the way into the rail: otherwise the outer fold's
  // visibility, inherited here, would run through this delay a second time
  'grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-(--motion-duration-base) ease-enter delay-100 motion-reduce:transition-opacity',
  'group-data-collapsed/sidebar:invisible group-data-collapsed/sidebar:grid-rows-[0fr] group-data-collapsed/sidebar:opacity-0 group-data-collapsed/sidebar:delay-0 group-data-collapsed/sidebar:transition-[grid-template-rows,opacity,visibility] motion-reduce:group-data-collapsed/sidebar:transition-[opacity,visibility]',
].join(' ');

/** Marks only the rail shows, such as the rule standing for a section's name; in once it settles. */
const RAIL_ONLY = [
  'opacity-0 transition-opacity duration-(--motion-duration-instant)',
  'group-data-collapsed/sidebar:opacity-100 group-data-collapsed/sidebar:duration-(--motion-duration-fast) group-data-collapsed/sidebar:delay-150',
].join(' ');

/** Width and the content panel's edge move together, the same way, after FULL_ONLY's fade when collapsing. */
const SLIDE = 'duration-(--motion-duration-base) ease-enter motion-reduce:transition-none';

export type AppShellProps = {
  /** The sidebar content: account, sections, items, footer. Drawn on desktop and in the mobile drawer. */
  sidebar: ReactNode;
  /** The header row content, usually breadcrumbs. */
  header?: ReactNode;
  defaultCollapsed?: boolean;
  /** Where the collapsed choice is remembered; `null` turns remembering off. */
  storageKey?: string | null;
  children: ReactNode;
};

/**
 * The admin frame shared by every console: a sidebar that collapses to an icon
 * rail (Ctrl/⌘+B), a rounded content panel with a header row, and on phones a
 * sticky top bar with the sidebar in a drawer.
 */
export function AppShell({
  sidebar,
  header,
  defaultCollapsed = false,
  storageKey = 'skylcn:sidebar-collapsed',
  children,
}: AppShellProps) {
  const { messages } = useSkylcn();
  const [collapsed, setCollapsedState] = useState(defaultCollapsed);
  // Only the reader's own toggles animate; restoring the remembered choice on load snaps
  const [animated, setAnimated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // The drawer is hidden from md up; closing it there keeps a widened window usable
  const desktop = useIsDesktop();
  if (desktop && mobileOpen) setMobileOpen(false);
  const [desktopSlot, setDesktopSlot] = useState<HTMLElement | null>(null);
  const [mobileSlot, setMobileSlot] = useState<HTMLElement | null>(null);
  const collapsedRef = useRef(collapsed);
  useLayoutEffect(() => {
    collapsedRef.current = collapsed;
  }, [collapsed]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved !== null) setCollapsedState(saved === 'true');
    } catch {
      // Storage can be unavailable (private mode); the default stays.
    }
  }, [storageKey]);

  const setCollapsed = useCallback(
    (next: boolean) => {
      setAnimated(true);
      setCollapsedState(next);
      if (!storageKey) return;
      try {
        window.localStorage.setItem(storageKey, String(next));
      } catch {
        // Not remembering is fine.
      }
    },
    [storageKey],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      // Leave Ctrl+B to text fields and editors, where it means bold.
      if (
        target?.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')
      )
        return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        setCollapsed(!collapsed);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [collapsed, setCollapsed]);

  // Stays the same object across toggles, so the parts that do not draw the rail differently skip the render
  const shell = useMemo(
    () => ({ setCollapsed, collapsedRef, setMobileOpen, desktopSlot, mobileSlot }),
    [setCollapsed, desktopSlot, mobileSlot],
  );

  return (
    <ShellContext.Provider value={shell}>
      <div
        data-slot="app-shell"
        data-collapsed={collapsed || undefined}
        className={cn(
          // Sticky parts inside the page (list headers) stick below the phone's top bar
          'min-h-dvh bg-background [--skylcn-sticky-top:3.5rem] md:h-dvh md:bg-sidebar md:py-2 md:pr-2 md:[--skylcn-sticky-top:0px]',
          animated && ['transition-[padding]', SLIDE],
          collapsed ? 'delay-50 md:pl-18' : 'md:pl-66',
        )}
      >
        <a
          href="#skylcn-main"
          className="fixed top-2 left-2 z-60 -translate-y-16 rounded-md border border-border bg-popover px-3 py-2 text-sm text-foreground shadow-overlay outline-hidden focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring"
        >
          {messages.skipToContent}
        </a>

        <aside
          aria-label={messages.navigation}
          data-collapsed={collapsed || undefined}
          className={cn(
            'group/sidebar fixed inset-y-0 left-0 z-30 hidden overflow-hidden bg-sidebar md:flex',
            animated && ['transition-[width]', SLIDE],
            collapsed ? 'w-16 delay-50' : 'w-64',
          )}
        >
          <CollapsedContext.Provider value={collapsed}>
            <SidebarFrame>{sidebar}</SidebarFrame>
          </CollapsedContext.Provider>
        </aside>

        <div className="sticky top-0 z-40 border-b border-border-subtle bg-sidebar/70 backdrop-blur md:hidden">
          <div className="flex h-14 items-center gap-2 px-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={messages.openMenu}
              className="grid size-10 place-items-center rounded-md text-secondary-foreground outline-hidden hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0 flex-1">{header}</div>
            <div ref={setMobileSlot} className="flex shrink-0 items-center gap-1.5" />
          </div>
        </div>

        <DrawerPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen} swipeDirection="left">
          <DrawerPrimitive.Portal>
            <DrawerPrimitive.Backdrop className="fixed inset-0 z-50 bg-black opacity-[calc(0.4*(1-var(--drawer-swipe-progress)))] transition-opacity duration-(--motion-duration-slow) ease-enter data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0 md:hidden" />
            <DrawerPrimitive.Viewport className="fixed inset-0 z-50 md:hidden">
              <DrawerPrimitive.Popup
                aria-label={messages.navigation}
                className={cn(
                  'absolute inset-y-0 left-0 flex outline-hidden',
                  '[transform:translateX(var(--drawer-swipe-movement-x))] transition-[transform,opacity] duration-(--motion-duration-spring) ease-spring data-swiping:duration-0',
                  'data-ending-style:[transform:translateX(-100%)] data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*var(--motion-duration-base))] data-ending-style:ease-exit data-starting-style:[transform:translateX(-100%)]',
                  'motion-reduce:data-ending-style:[transform:none] motion-reduce:data-ending-style:opacity-0 motion-reduce:data-starting-style:[transform:none] motion-reduce:data-starting-style:opacity-0',
                )}
              >
                <div className="flex h-full w-72 border-r border-border bg-sidebar pb-[env(safe-area-inset-bottom)] shadow-overlay">
                  <DrawerContext.Provider value>
                    <SidebarFrame>{sidebar}</SidebarFrame>
                  </DrawerContext.Provider>
                </div>
                <DrawerPrimitive.Close
                  aria-label={messages.close}
                  title={messages.close}
                  className="group -ml-px flex h-full w-5 items-center justify-center rounded-r-full border-y border-r border-border bg-sidebar text-subtle-foreground outline-hidden transition-colors hover:text-secondary-foreground"
                >
                  <ChevronsLeft
                    className="size-3.5 opacity-60 transition-transform duration-(--motion-duration-base) group-hover:scale-110 group-hover:opacity-100"
                    strokeWidth={2.5}
                  />
                </DrawerPrimitive.Close>
              </DrawerPrimitive.Popup>
            </DrawerPrimitive.Viewport>
          </DrawerPrimitive.Portal>
        </DrawerPrimitive.Root>

        <div className="md:flex md:h-full md:min-h-0 md:flex-col md:overflow-hidden md:rounded-xl md:border md:border-border-subtle md:bg-background">
          <div className="hidden h-10 shrink-0 items-center gap-3 border-b border-border-subtle pr-6 pl-3 md:flex">
            <CollapseToggle collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <span aria-hidden className="h-4 w-px bg-border" />
            <div className="min-w-0 flex-1">{header}</div>
            <div ref={setDesktopSlot} className="flex shrink-0 items-center gap-1.5" />
          </div>
          <main
            id="skylcn-main"
            tabIndex={-1}
            // Positioned, so absolute children (a Sparkline's layers, screen-reader copy)
            // scroll with the content instead of stretching the page into a second scroll
            className="relative scrollbar outline-hidden md:min-h-0 md:flex-1 md:scroll-pt-12 md:overflow-y-auto"
          >
            {/* Every page takes the panel's width; a filled one also its height, from md */}
            <div className="w-full p-4 sm:p-6 md:has-data-[slot=app-shell-fill]:h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ShellContext.Provider>
  );
}

function SidebarFrame({ children }: { children: ReactNode }) {
  const inDrawer = useContext(DrawerContext);
  return (
    // The drawer and the desktop sidebar each keep their own sliding highlight
    <LayoutGroup id={inDrawer ? 'skylcn-sidebar-drawer' : 'skylcn-sidebar'}>
      <div className="flex h-full w-full min-w-0 flex-col gap-4 px-3 py-3">{children}</div>
    </LayoutGroup>
  );
}

/**
 * A page that takes the content panel's full height from md, as a flex column,
 * so a list can scroll inside it with its paging held at the foot. On phones the
 * page scrolls as usual.
 */
export function AppShellFill({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="app-shell-fill"
      className={cn('flex flex-col gap-4 md:h-full md:min-h-0', className)}
      {...props}
    />
  );
}

/** Renders page actions into the shell header, on desktop and on phones alike. */
export function AppShellActions({ children }: { children: ReactNode }) {
  const { desktopSlot, mobileSlot } = useShell();
  const desktop = useIsDesktop();
  const target = desktop ? desktopSlot : mobileSlot;
  return target ? createPortal(children, target) : null;
}

/*
 * The account row and the console switcher: a 28px tile on the icon column and
 * two short lines, the same size and corners as the items between them.
 */
const ROW =
  'flex w-full items-center gap-2.5 overflow-hidden rounded-md px-1.5 py-1 text-left outline-hidden focus-visible:ring-2 focus-visible:ring-ring';
const PRESSABLE_ROW =
  'transition-colors duration-(--motion-duration-fast) hover:bg-accent data-popup-open:bg-accent';

function RowText({
  title,
  subtitle,
  strong = false,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  strong?: boolean;
}) {
  return (
    <span className={cn('min-w-0 flex-1', FULL_ONLY)}>
      <span
        className={cn(
          'block truncate text-sm leading-5 text-foreground',
          strong ? 'font-semibold' : 'font-medium',
        )}
      >
        {title}
      </span>
      {subtitle ? (
        <span className="block truncate text-2xs text-subtle-foreground">{subtitle}</span>
      ) : null}
    </span>
  );
}

/**
 * A row's menu: it opens away from the sidebar edge the row sits on, or beside
 * the rail. The only part of the row that reads the collapsed state.
 */
function RowMenuContent({
  edge,
  label,
  children,
}: {
  edge: 'top' | 'bottom';
  label?: string;
  children: ReactNode;
}) {
  const collapsed = useContext(CollapsedContext);
  return (
    <DropdownMenuContent
      aria-label={label}
      side={collapsed ? 'right' : edge === 'top' ? 'bottom' : 'top'}
      align={collapsed && edge === 'bottom' ? 'end' : 'start'}
      sideOffset={collapsed ? 8 : 4}
      className={cn(
        // The rows step in from the trigger and back out to it; the card then shrinks into
        // the trigger's corner (Base UI's transform origin), five times the usual popup
        // scale so it reads as closing there rather than as a fade
        'stagger-items data-ending-style:scale-[calc(1-(1-var(--motion-scale-from))*5)] data-ending-style:delay-(--motion-stagger)',
        collapsed ? 'w-56' : 'w-(--anchor-width) min-w-56',
      )}
    >
      {children}
    </DropdownMenuContent>
  );
}

export type ClubConsole = {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  /** A short line under the name, such as what the console is for. */
  description?: string;
};

function ConsoleRow({ app, current }: { app: ClubConsole; current: boolean }) {
  const Icon = app.icon;
  return (
    <>
      <span
        className={cn(
          'grid size-8 shrink-0 place-items-center rounded-md border',
          current
            ? 'border-skylab-400/40 bg-skylab-500/10 text-skylab-300'
            : 'border-border bg-muted text-muted-foreground',
        )}
      >
        {Icon ? (
          <Icon className="size-4!" strokeWidth={1.75} />
        ) : (
          <span className="text-2xs font-semibold">{app.label.slice(0, 1)}</span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block truncate text-xs font-medium',
            current ? 'text-foreground' : 'text-secondary-foreground',
          )}
        >
          {app.label}
        </span>
        {app.description ? (
          <span className="block text-3xs leading-snug text-pretty text-subtle-foreground">
            {app.description}
          </span>
        ) : null}
      </span>
      {current ? <Check className="size-3.5! shrink-0 text-skylab-400" /> : null}
    </>
  );
}

export type SidebarBrandProps = {
  name: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  /** The club consoles; the brand becomes a switcher with the current one ticked. */
  consoles?: readonly ClubConsole[];
  /** The id of this console among `consoles`. */
  current?: string;
};

/** The console's name with the SKY LAB mark, at the head of the sidebar; a switcher when given `consoles`. */
export function SidebarBrand({ name, subtitle, href, consoles, current }: SidebarBrandProps) {
  const { Link, messages } = useSkylcn();
  const body = (
    <>
      <span className="grid size-7 shrink-0 place-items-center text-foreground-strong">
        <SkylabMark size={20} />
      </span>
      <RowText title={name} subtitle={subtitle} strong />
    </>
  );

  return consoles?.length ? (
    <DropdownMenu>
      <RailTooltip label={name}>
        <DropdownMenuTrigger aria-label={messages.consoles} className={cn(ROW, PRESSABLE_ROW)}>
          {body}
          <ChevronsUpDown className={cn('size-4 shrink-0 text-subtle-foreground', FULL_ONLY)} />
        </DropdownMenuTrigger>
      </RailTooltip>
      {/* The console tiles speak for themselves; the list keeps its name for screen readers */}
      <RowMenuContent edge="top" label={messages.consoles}>
        {consoles.map((app) =>
          app.id === current ? (
            <MenuItem key={app.id} className="gap-2.5 py-1.5">
              <ConsoleRow app={app} current />
            </MenuItem>
          ) : (
            <MenuLinkItem key={app.id} href={app.href} className="gap-2.5 py-1.5">
              <ConsoleRow app={app} current={false} />
            </MenuLinkItem>
          ),
        )}
      </RowMenuContent>
    </DropdownMenu>
  ) : href ? (
    <Link href={href} className={cn(ROW, PRESSABLE_ROW)}>
      {body}
    </Link>
  ) : (
    <div className={ROW}>{body}</div>
  );
}

export function SidebarContent({ children }: { children: ReactNode }) {
  return (
    // The margin and padding cancel out; they keep focus rings clear of the scroll clip
    <nav className="-m-1 scrollbar-hidden flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-1">
      {children}
    </nav>
  );
}

export function SidebarSection({ label, children }: { label?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <div className="relative flex h-6 items-center px-2.5 select-none">
          <span className={cn('truncate text-xs font-medium text-muted-foreground', FULL_ONLY)}>
            {label}
          </span>
          <span aria-hidden className={cn('absolute left-2.5 h-px w-5 bg-border', RAIL_ONLY)} />
        </div>
      ) : null}
      {children}
    </div>
  );
}

export type SidebarItemProps = {
  href: string;
  label: string;
  icon?: LucideIcon;
  active?: boolean;
  /** A count or short tag after the label; a dot on the icon rail. */
  badge?: ReactNode;
  /** Opens outside the app (another console); renders a plain anchor. */
  external?: boolean;
  /**
   * Items one level down, drawn under this one, such as an open form's pages
   * under the form inside a group. Hidden on the icon rail.
   */
  children?: ReactNode;
};

export function SidebarItem({
  href,
  label,
  icon: Icon,
  active = false,
  badge,
  external = false,
  children,
}: SidebarItemProps) {
  const { setMobileOpen } = useShell();
  const inDrawer = useContext(DrawerContext);
  const nested = useContext(NestedContext);
  const { Link } = useSkylcn();

  const className = cn(
    'group/item relative isolate flex items-center overflow-hidden rounded-md outline-hidden',
    'transition-[color,background-color] duration-(--motion-duration-fast) ease-enter focus-visible:ring-2 focus-visible:ring-ring',
    nested
      ? 'gap-2 px-2 py-1 text-xs pointer-coarse:py-1.5'
      : 'gap-3 px-2.5 py-2 text-sm pointer-coarse:py-2.5',
    !active && 'text-muted-foreground hover:bg-accent hover:text-foreground',
    active && !nested && 'text-foreground',
    // A nested item has no pill under it, so its label takes the brand colour with its icon
    active && nested && 'text-skylab-300',
  );

  const content = (
    <>
      {active && !nested ? (
        // One highlight that glides to the active item when the page changes
        <m.span
          layoutId="active-item"
          aria-hidden
          className="absolute inset-0 -z-10 rounded-md bg-sidebar-active shadow-sidebar-active"
          transition={transitions.layout}
        />
      ) : null}
      {Icon ? (
        <span className="relative shrink-0">
          <Icon
            className={cn(nested ? 'size-4' : 'size-5', active && 'text-skylab-300')}
            strokeWidth={1.75}
          />
          {badge && !nested ? (
            <span
              aria-hidden
              className={cn(
                'absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-skylab-400 ring-2 ring-sidebar',
                RAIL_ONLY,
              )}
            />
          ) : null}
        </span>
      ) : null}
      <span
        className={cn(
          'flex min-w-0 flex-1 items-center',
          // Nested items fade with the fold around them; one fade each would only add work
          nested ? 'gap-2' : ['gap-3', FULL_ONLY],
        )}
      >
        <span className="min-w-0 flex-1 truncate font-medium">{label}</span>
        {badge ? (
          <span className="shrink-0 rounded-md bg-muted px-1.5 text-3xs text-muted-foreground tabular-nums">
            {typeof badge === 'number' ? <AnimatedNumber value={badge} tabular /> : badge}
          </span>
        ) : nested ? null : (
          <ChevronRight
            className={cn(
              'size-4 shrink-0 transition-[opacity,translate] duration-(--motion-duration-fast) group-hover/item:translate-x-0.5',
              active ? 'opacity-60' : 'opacity-0 group-hover/item:opacity-60',
            )}
          />
        )}
      </span>
    </>
  );

  const onClick = inDrawer ? () => setMobileOpen(false) : undefined;
  const link = external ? (
    <a href={href} className={className} onClick={onClick}>
      {content}
    </a>
  ) : (
    <Link
      href={href}
      className={className}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      {content}
    </Link>
  );

  const item = nested ? link : <RailTooltip label={label}>{link}</RailTooltip>;
  if (!children) return item;
  return (
    <div className="flex flex-col gap-1">
      {item}
      <NestedContext.Provider value>
        <div
          className={cn(
            'flex flex-col gap-1 border-l border-border',
            // Under a nested item the line starts below its icon; under a top-level one, below the group's line
            nested ? 'ml-4 pl-2.5' : 'ml-5 pl-3 group-data-collapsed/sidebar:hidden',
          )}
        >
          {children}
        </div>
      </NestedContext.Provider>
    </div>
  );
}

export type SidebarGroupProps = {
  label: string;
  icon: LucideIcon;
  /** True while one of its items is the current page; opens the group. */
  active?: boolean;
  defaultOpen?: boolean;
  /** Remembers whether the reader left it open or closed, under this key. */
  storageKey?: string;
  children: ReactNode;
};

/** A collapsible run of nested items. On the icon rail it opens the sidebar instead. */
export function SidebarGroup({
  label,
  icon: Icon,
  active = false,
  defaultOpen,
  storageKey,
  children,
}: SidebarGroupProps) {
  const collapsed = useContext(CollapsedContext);
  const { setCollapsed } = useShell();
  const panelId = useId();
  const [open, setOpenState] = useState(defaultOpen ?? active);

  useEffect(() => {
    if (!storageKey || active) return;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved !== null) setOpenState(saved === 'true');
    } catch {
      // Storage can be unavailable (private mode); the default stays.
    }
    // Read once per key; the active page opening its group must not be undone
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const setOpen = (next: boolean) => {
    setOpenState(next);
    if (!storageKey) return;
    try {
      window.localStorage.setItem(storageKey, String(next));
    } catch {
      // Not remembering is fine.
    }
  };
  const [wasActive, setWasActive] = useState(active);
  if (active !== wasActive) {
    setWasActive(active);
    if (active) setOpenState(true);
  }

  return (
    <div>
      <RailTooltip label={label}>
        <button
          type="button"
          aria-expanded={open && !collapsed}
          aria-controls={panelId}
          onClick={() => {
            // Pressed on the rail, it opens the sidebar and itself
            if (collapsed) {
              setCollapsed(false);
              setOpen(true);
            } else {
              setOpen(!open);
            }
          }}
          className={cn(
            'flex w-full items-center gap-3 overflow-hidden rounded-md px-2.5 py-2 text-sm outline-hidden pointer-coarse:py-2.5',
            'transition-[color,background-color] duration-(--motion-duration-fast) ease-enter focus-visible:ring-2 focus-visible:ring-ring',
            active
              ? 'text-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground',
          )}
        >
          <Icon className={cn('size-5 shrink-0', active && 'text-skylab-300')} strokeWidth={1.75} />
          <span className={cn('flex min-w-0 flex-1 items-center gap-3', FULL_ONLY)}>
            <span className="min-w-0 flex-1 truncate text-left font-medium">{label}</span>
            <ChevronDown
              className={cn(
                'size-4 shrink-0 transition-transform duration-(--motion-duration-base) ease-enter',
                open ? 'rotate-180' : 'rotate-0',
              )}
            />
          </span>
        </button>
      </RailTooltip>
      <div
        id={panelId}
        className={cn(FOLD, open ? 'grid-rows-[1fr]' : 'invisible grid-rows-[0fr] opacity-0')}
      >
        {/* The margin and padding cancel out; they keep the nested items' focus rings unclipped */}
        <div className="-mx-1 min-h-0 overflow-hidden px-1">
          <div className={RAIL_FOLD}>
            <div className="min-h-0 overflow-hidden">
              <NestedContext.Provider value>
                <div className="mt-1 ml-5 flex flex-col gap-1 border-l border-border pb-0.5 pl-3">
                  {children}
                </div>
              </NestedContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SidebarFooter({ children }: { children: ReactNode }) {
  return <div className="mt-auto flex flex-col gap-1">{children}</div>;
}

export type SidebarUserProps = {
  name: string;
  email?: string | null;
  /** A second line under the name, such as the e-mail address or the role. */
  subtitle?: ReactNode;
  avatarSrc?: string | null;
  /** A button at the end of the row, such as sign-out; out of reach on the icon rail. Ignored when `menu` is set. */
  action?: ReactNode;
  /** Menu items (MenuItem, MenuLinkItem, …); the row becomes the trigger of a profile menu. */
  menu?: ReactNode;
};

/** The signed-in person at the foot of the sidebar, usually the trigger of a profile menu. */
export function SidebarUser({ name, email, subtitle, avatarSrc, action, menu }: SidebarUserProps) {
  const avatar = (
    <Avatar
      name={name}
      email={email}
      src={avatarSrc}
      size="sm"
      shape="square"
      className="rounded-md"
    />
  );

  if (menu) {
    return (
      <DropdownMenu>
        <RailTooltip label={name}>
          <DropdownMenuTrigger aria-label={name} className={cn(ROW, PRESSABLE_ROW)}>
            {avatar}
            <RowText title={name} subtitle={subtitle} />
            <ChevronsUpDown className={cn('size-4 shrink-0 text-subtle-foreground', FULL_ONLY)} />
          </DropdownMenuTrigger>
        </RailTooltip>
        <RowMenuContent edge="bottom">{menu}</RowMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={ROW}>
      <RailTooltip label={name}>
        <span className="inline-flex shrink-0">{avatar}</span>
      </RailTooltip>
      <RowText title={name} subtitle={subtitle} />
      {action ? (
        <div
          className={cn(
            'shrink-0',
            FULL_ONLY,
            'transition-[opacity,visibility] group-data-collapsed/sidebar:invisible',
          )}
        >
          {action}
        </div>
      ) : null}
    </div>
  );
}

function CollapseToggle({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { messages } = useSkylcn();
  const label = collapsed ? messages.expandSidebar : messages.collapseSidebar;
  return (
    <Tooltip label={`${label} · Ctrl+B`}>
      <button
        type="button"
        onClick={onToggle}
        aria-label={label}
        aria-expanded={!collapsed}
        className="grid size-7 shrink-0 place-items-center rounded-md text-subtle-foreground outline-hidden transition-colors duration-(--motion-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <IconSwap
          swapped={collapsed}
          icon={PanelLeftClose}
          swappedIcon={PanelLeftOpen}
          className="size-4"
          strokeWidth={1.75}
        />
      </button>
    </Tooltip>
  );
}
