'use client';

import { Collapsible } from '@base-ui/react/collapsible';
import { Dialog } from '@base-ui/react/dialog';
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
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { SKYLAB_MARK_PATHS, SKYLAB_MARK_VIEWBOX } from '../assets/skylab-mark.js';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { Avatar } from './avatar.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  MenuGroup,
  MenuItem,
  MenuLinkItem,
} from './menu.js';
import { Tooltip } from './tooltip.js';

type ShellContextValue = {
  collapsed: boolean;
  setCollapsed: (next: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (next: boolean) => void;
  desktopSlot: HTMLElement | null;
  mobileSlot: HTMLElement | null;
};

const ShellContext = createContext<ShellContextValue | null>(null);

type SidebarScope = { collapsed: boolean; inDrawer: boolean };
const SidebarScopeContext = createContext<SidebarScope>({ collapsed: false, inDrawer: false });
const NestedContext = createContext(false);

function useShell() {
  const shell = useContext(ShellContext);
  if (!shell) throw new Error('AppShell parts must be used inside <AppShell>.');
  return shell;
}

/** Whether the sidebar is drawn as an icon rail, and whether it sits in the mobile drawer. */
export function useSidebar() {
  const shell = useShell();
  const scope = useContext(SidebarScopeContext);
  return {
    ...scope,
    setCollapsed: shell.setCollapsed,
    closeDrawer: () => shell.setMobileOpen(false),
  };
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

export type AppShellProps = {
  /** The sidebar content: brand, sections, items, footer. Drawn on desktop and in the mobile drawer. */
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopSlot, setDesktopSlot] = useState<HTMLElement | null>(null);
  const [mobileSlot, setMobileSlot] = useState<HTMLElement | null>(null);

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

  return (
    <ShellContext.Provider
      value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen, desktopSlot, mobileSlot }}
    >
      <div
        data-slot="app-shell"
        data-collapsed={collapsed || undefined}
        className={cn(
          'min-h-dvh bg-background md:h-dvh md:bg-sidebar md:py-2 md:pr-2',
          'transition-[padding] duration-(--motion-duration-base) ease-enter',
          collapsed ? 'md:pl-18' : 'md:pl-66',
        )}
      >
        <aside
          aria-label={messages.navigation}
          className={cn(
            'fixed inset-y-0 left-0 z-30 hidden overflow-hidden bg-sidebar md:flex',
            'transition-[width] duration-(--motion-duration-base) ease-enter',
            collapsed ? 'w-16' : 'w-64',
          )}
        >
          <SidebarScopeContext.Provider value={{ collapsed, inDrawer: false }}>
            <SidebarFrame>{sidebar}</SidebarFrame>
          </SidebarScopeContext.Provider>
        </aside>

        <div className="sticky top-0 z-40 border-b border-border-subtle bg-sidebar/70 backdrop-blur md:hidden">
          <div className="flex h-14 items-center gap-2 px-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={messages.openMenu}
              className="grid size-10 place-items-center rounded-md text-secondary-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0 flex-1">{header}</div>
            <div ref={setMobileSlot} className="flex shrink-0 items-center gap-1.5" />
          </div>
        </div>

        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-(--motion-duration-slow) ease-enter data-ending-style:opacity-0 data-starting-style:opacity-0 md:hidden" />
            <Dialog.Popup
              aria-label={messages.navigation}
              className={cn(
                'fixed inset-y-0 left-0 z-50 flex outline-none md:hidden',
                'transition-transform duration-(--motion-duration-spring) ease-spring',
                'data-ending-style:-translate-x-full data-ending-style:duration-(--motion-duration-base) data-ending-style:ease-exit data-starting-style:-translate-x-full',
              )}
            >
              <div className="flex h-full w-72 border-r border-border bg-sidebar pb-[env(safe-area-inset-bottom)] shadow-overlay">
                <SidebarScopeContext.Provider value={{ collapsed: false, inDrawer: true }}>
                  <SidebarFrame>{sidebar}</SidebarFrame>
                </SidebarScopeContext.Provider>
              </div>
              <Dialog.Close
                aria-label={messages.close}
                title={messages.close}
                className="group -ml-px flex h-full w-5 items-center justify-center rounded-r-full border-y border-r border-border bg-sidebar text-subtle-foreground transition-colors outline-none hover:text-secondary-foreground"
              >
                <ChevronsLeft
                  className="size-3.5 opacity-60 transition-transform duration-(--motion-duration-base) group-hover:scale-110 group-hover:opacity-100"
                  strokeWidth={2.5}
                />
              </Dialog.Close>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="md:flex md:h-full md:min-h-0 md:flex-col md:overflow-hidden md:rounded-xl md:border md:border-border-subtle md:bg-background">
          <div className="hidden h-10 shrink-0 items-center gap-3 border-b border-border-subtle pr-6 pl-3 md:flex">
            <CollapseToggle collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <span aria-hidden className="h-4 w-px bg-border" />
            <div className="min-w-0 flex-1">{header}</div>
            <div ref={setDesktopSlot} className="flex shrink-0 items-center gap-1.5" />
          </div>
          <main className="scrollbar md:min-h-0 md:flex-1 md:overflow-y-auto">
            <div className="mx-auto w-full max-w-400 p-4 sm:p-6">{children}</div>
          </main>
        </div>
      </div>
    </ShellContext.Provider>
  );
}

function SidebarFrame({ children }: { children: ReactNode }) {
  const { collapsed } = useContext(SidebarScopeContext);
  return (
    <div
      className={cn(
        'flex h-full w-full min-w-0 flex-col py-5',
        collapsed ? 'gap-3 px-2' : 'gap-4 px-4',
      )}
    >
      {children}
    </div>
  );
}

/** Renders page actions into the shell header, on desktop and on phones alike. */
export function AppShellActions({ children }: { children: ReactNode }) {
  const { desktopSlot, mobileSlot } = useShell();
  const desktop = useIsDesktop();
  const target = desktop ? desktopSlot : mobileSlot;
  return target ? createPortal(children, target) : null;
}

/** The SKY LAB mark as a still image, for brand slots. */
export function SkylabMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox={SKYLAB_MARK_VIEWBOX}
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      className={cn('shrink-0', className)}
    >
      <g fillRule="evenodd">
        {SKYLAB_MARK_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
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
          <span className="block truncate text-3xs text-subtle-foreground">{app.description}</span>
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

export function SidebarBrand({ name, subtitle, href, consoles, current }: SidebarBrandProps) {
  const { collapsed } = useSidebar();
  const { Link, messages } = useSkylcn();
  const body = (
    <>
      <span className="grid size-8 shrink-0 place-items-center text-foreground-strong">
        <SkylabMark size={24} />
      </span>
      {collapsed ? null : (
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-sm font-semibold text-foreground">{name}</span>
          {subtitle ? (
            <span className="block truncate text-3xs text-subtle-foreground">{subtitle}</span>
          ) : null}
        </span>
      )}
    </>
  );
  const base = cn(
    'flex w-full items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring',
    collapsed ? 'justify-center p-1' : 'p-1.5',
  );

  if (consoles?.length) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={messages.consoles}
          className={cn(
            base,
            'transition-colors duration-(--motion-duration-fast) hover:bg-accent data-popup-open:bg-accent',
          )}
        >
          {body}
          {collapsed ? null : <ChevronsUpDown className="size-4 shrink-0 text-subtle-foreground" />}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={collapsed ? 'right' : 'bottom'}
          align="start"
          sideOffset={6}
          className={collapsed ? 'w-56' : 'w-(--anchor-width) min-w-56'}
        >
          <MenuGroup label={messages.consoles}>
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
          </MenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return href ? (
    <Link href={href} className={base}>
      {body}
    </Link>
  ) : (
    <div className={base}>{body}</div>
  );
}

export function SidebarContent({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <nav
      className={cn(
        'scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-y-auto',
        collapsed ? 'gap-3' : 'gap-5',
      )}
    >
      {children}
    </nav>
  );
}

export function SidebarSection({ label, children }: { label?: ReactNode; children: ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className="flex flex-col gap-1">
      {label ? (
        collapsed ? (
          <div className="mx-auto my-2 h-px w-6 bg-border" aria-hidden />
        ) : (
          <div className="px-2 pb-1 text-xs font-medium tracking-wide text-muted-foreground select-none">
            {label}
          </div>
        )
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
};

export function SidebarItem({
  href,
  label,
  icon: Icon,
  active = false,
  badge,
  external = false,
}: SidebarItemProps) {
  const { collapsed, inDrawer, closeDrawer } = useSidebar();
  const nested = useContext(NestedContext);
  const { Link } = useSkylcn();

  const className = cn(
    'group/item relative flex items-center rounded-md outline-none',
    'transition-[color,background-color] duration-(--motion-duration-fast) ease-enter focus-visible:ring-2 focus-visible:ring-ring',
    nested
      ? 'gap-2 px-2 py-1 text-xs pointer-coarse:py-1.5'
      : 'gap-3 px-3 py-2 text-sm pointer-coarse:py-2.5',
    collapsed && !nested && 'justify-center px-0',
    active
      ? nested
        ? 'text-foreground'
        : 'bg-accent-strong text-foreground'
      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
  );

  const content = (
    <>
      {Icon ? (
        <span className="relative">
          <Icon
            className={cn(nested ? 'size-4' : 'size-5', 'shrink-0', active && 'text-skylab-300')}
            strokeWidth={1.75}
          />
          {collapsed && badge ? (
            <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-skylab-400 ring-2 ring-sidebar" />
          ) : null}
        </span>
      ) : null}
      {collapsed && !nested ? null : (
        <>
          <span className="min-w-0 flex-1 truncate font-medium">{label}</span>
          {badge ? (
            <span className="shrink-0 rounded-md bg-muted px-1.5 text-3xs text-muted-foreground tabular-nums">
              {badge}
            </span>
          ) : nested ? null : (
            <ChevronRight
              className={cn(
                'size-4 shrink-0 transition-[opacity,transform] duration-(--motion-duration-fast) group-hover/item:translate-x-0.5',
                active ? 'opacity-60' : 'opacity-0 group-hover/item:opacity-60',
              )}
            />
          )}
        </>
      )}
    </>
  );

  const onClick = inDrawer ? closeDrawer : undefined;
  const link = external ? (
    <a
      href={href}
      className={className}
      aria-label={collapsed ? label : undefined}
      onClick={onClick}
    >
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
      {collapsed && !nested ? <span className="sr-only">{label}</span> : null}
    </Link>
  );

  return collapsed && !nested ? (
    <Tooltip label={label} side="right">
      {link}
    </Tooltip>
  ) : (
    link
  );
}

export type SidebarGroupProps = {
  label: string;
  icon: LucideIcon;
  /** True while one of its items is the current page; opens the group. */
  active?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
};

/** A collapsible run of nested items. On the icon rail it opens the sidebar instead. */
export function SidebarGroup({
  label,
  icon: Icon,
  active = false,
  defaultOpen,
  children,
}: SidebarGroupProps) {
  const { collapsed, setCollapsed } = useSidebar();
  const [open, setOpen] = useState(defaultOpen ?? active);
  const [wasActive, setWasActive] = useState(active);
  if (active !== wasActive) {
    setWasActive(active);
    if (active) setOpen(true);
  }

  const rowClass = cn(
    'group/group flex w-full items-center rounded-md text-sm outline-none',
    'transition-[color,background-color] duration-(--motion-duration-fast) ease-enter focus-visible:ring-2 focus-visible:ring-ring',
    active ? 'text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
    collapsed ? 'justify-center py-2' : 'gap-3 px-3 py-2 pointer-coarse:py-2.5',
  );

  if (collapsed) {
    return (
      <Tooltip label={label} side="right">
        <button
          type="button"
          className={rowClass}
          aria-label={label}
          onClick={() => {
            setOpen(true);
            setCollapsed(false);
          }}
        >
          <Icon className={cn('size-5 shrink-0', active && 'text-skylab-300')} strokeWidth={1.75} />
        </button>
      </Tooltip>
    );
  }

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger className={rowClass}>
        <Icon className={cn('size-5 shrink-0', active && 'text-skylab-300')} strokeWidth={1.75} />
        <span className="min-w-0 flex-1 truncate text-left font-medium">{label}</span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 transition-transform duration-(--motion-duration-base) ease-enter',
            open ? 'rotate-180' : 'rotate-0',
          )}
        />
      </Collapsible.Trigger>
      <Collapsible.Panel className="h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-(--motion-duration-base) ease-enter data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0">
        <NestedContext.Provider value>
          <div className="mt-1 ml-5 flex flex-col gap-1 border-l border-border pl-3">
            {children}
          </div>
        </NestedContext.Provider>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

export function SidebarFooter({ children }: { children: ReactNode }) {
  return <div className="mt-auto flex flex-col gap-2">{children}</div>;
}

export type SidebarUserProps = {
  name: string;
  email?: string | null;
  /** A second line under the name, such as the role. */
  subtitle?: ReactNode;
  avatarSrc?: string | null;
  /** A button at the end of the row, such as sign-out. Ignored when `menu` is set. */
  action?: ReactNode;
  /** Menu items (MenuItem, MenuLinkItem, …); the row becomes the trigger of a profile menu. */
  menu?: ReactNode;
};

export function SidebarUser({ name, email, subtitle, avatarSrc, action, menu }: SidebarUserProps) {
  const { collapsed } = useSidebar();
  const avatar = (
    <Avatar name={name} email={email} src={avatarSrc} size={collapsed ? 'md' : 'lg'} />
  );
  const text = (
    <span className="min-w-0 flex-1 text-left">
      <span className="block truncate text-sm font-medium text-foreground">{name}</span>
      {subtitle ? (
        <span className="block truncate text-3xs tracking-label text-subtle-foreground uppercase">
          {subtitle}
        </span>
      ) : null}
    </span>
  );

  if (menu) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={name}
          className={cn(
            'flex w-full items-center rounded-lg outline-none',
            'transition-colors duration-(--motion-duration-fast) hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring data-popup-open:bg-accent',
            collapsed ? 'justify-center p-1' : 'gap-3 p-2',
          )}
        >
          {avatar}
          {collapsed ? null : (
            <>
              {text}
              <ChevronsUpDown className="size-4 shrink-0 text-subtle-foreground" />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={collapsed ? 'right' : 'top'}
          align={collapsed ? 'end' : 'start'}
          sideOffset={8}
          className={collapsed ? 'w-56' : 'w-(--anchor-width) min-w-56'}
        >
          {menu}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1">
        <Tooltip label={name}>
          <span className="inline-flex">{avatar}</span>
        </Tooltip>
        {action}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 px-2">
      {avatar}
      {text}
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function CollapseToggle({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { messages } = useSkylcn();
  const label = collapsed ? messages.expandSidebar : messages.collapseSidebar;
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
  return (
    <Tooltip label={`${label} · Ctrl+B`}>
      <button
        type="button"
        onClick={onToggle}
        aria-label={label}
        aria-expanded={!collapsed}
        className="grid size-7 shrink-0 place-items-center rounded-md text-subtle-foreground transition-colors duration-(--motion-duration-fast) outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Icon className="size-4" strokeWidth={1.75} />
      </button>
    </Tooltip>
  );
}
