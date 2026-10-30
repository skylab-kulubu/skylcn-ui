'use client';

import { ArrowLeft, Search, SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, LayoutGroup, m } from 'motion/react';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { transitions } from '../lib/motion-tokens.js';
import { useSkylcn } from '../lib/provider.js';
import type { BreadcrumbItem } from './breadcrumbs.js';
import { Button, type ButtonProps } from './button.js';
import {
  controlFocus,
  controlHeight,
  controlIcon,
  controlIconLeft,
  controlIconRoom,
  controlRadius,
  controlSurface,
  controlText,
  useControlSize,
  type ControlSize,
} from './control.js';
import { AnimatedNumber } from './motion.js';

export type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  /** A badge beside the title, such as a form's open or closed state. */
  badge?: ReactNode;
  /** Buttons at the end of the title row, after the divider. */
  actions?: ReactNode;
  /** Chips or stats under the description. */
  meta?: ReactNode;
  /**
   * A link up to the parent page above the title, named after it: "← Etkinlikler".
   * Use it or Breadcrumbs, not both.
   */
  back?: BreadcrumbItem;
  /**
   * A small 16:9 picture before the title from the sm breakpoint, such as an
   * event's cover; an img fills it. Hidden on phones, where the title needs the room.
   */
  cover?: ReactNode;
  /** The page's TabsNav; it takes the divider's place. */
  tabs?: ReactNode;
  className?: string;
  /** A toolbar row under the title: search, filters, view switches. */
  children?: ReactNode;
};

/**
 * The top of a page: an optional way back, title, description, actions, the
 * page's tabs and an optional toolbar row.
 */
export function PageHeader({
  title,
  description,
  badge,
  actions,
  meta,
  back,
  cover,
  tabs,
  className,
  children,
}: PageHeaderProps) {
  const { Link } = useSkylcn();
  return (
    <header data-slot="page-header" className={cn('flex flex-col gap-3', className)}>
      {back ? (
        <Link
          href={back.href}
          className="-mb-1 inline-flex min-h-6 w-fit max-w-full items-center gap-1 rounded-md py-1 text-xs text-muted-foreground outline-hidden transition-colors duration-(--motion-duration-fast) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring pointer-coarse:min-h-11"
        >
          <ArrowLeft aria-hidden className="size-3.5 shrink-0" />
          <span className="truncate">{back.label}</span>
        </Link>
      ) : null}
      <div className="flex min-w-0 items-center gap-3">
        {cover ? (
          <div
            data-slot="page-header-cover"
            className="relative hidden aspect-video h-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted sm:block [&_img]:size-full [&_img]:object-cover"
          >
            {cover}
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
              {badge ? <span className="shrink-0">{badge}</span> : null}
            </div>
            {/* Runs beside the title the way a Section draws its rule; tabs take its place */}
            {tabs ? null : (
              <div
                aria-hidden
                data-slot="page-header-divider"
                className="h-px min-w-8 flex-1 bg-border"
              />
            )}
            {actions ? (
              <div className="ml-auto flex shrink-0 items-center gap-1.5">{actions}</div>
            ) : null}
          </div>
          {description ? (
            <p className="mt-0.5 text-2xs text-subtle-foreground">{description}</p>
          ) : null}
          {meta ? <div className="flex flex-wrap items-center gap-1.5 pt-2">{meta}</div> : null}
        </div>
      </div>
      {tabs}
      {children ? (
        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">{children}</div>
      ) : null}
    </header>
  );
}

export type SearchInputProps = Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'size'> & {
  value: string;
  onValueChange: (value: string) => void;
  /** The narrow form for toolbars in the shell header; it widens while focused, at sm unless `size` says otherwise. */
  compact?: boolean;
  /** sm 32px, md 36px (the default) or lg 38px. */
  size?: ControlSize;
};

/** A search box with a leading glass and a clear button while it has text. */
export function SearchInput({
  value,
  onValueChange,
  compact = false,
  size: sizeProp,
  placeholder,
  className,
  ...props
}: SearchInputProps) {
  const { messages } = useSkylcn();
  const size = useControlSize(sizeProp ?? (compact ? 'sm' : undefined));
  return (
    <div
      data-slot="search-input"
      className={cn(
        'relative',
        compact
          ? 'w-56 transition-[width] duration-(--motion-duration-base) ease-enter focus-within:w-72'
          : 'max-w-sm min-w-45 flex-1',
        className,
      )}
    >
      <Search
        className={cn(
          'pointer-events-none absolute top-1/2 -translate-y-1/2 text-subtle-foreground',
          controlIcon[size],
          controlIconLeft[size],
        )}
      />
      <input
        type="search"
        data-size={size}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder ?? messages.search}
        aria-label={
          props['aria-label'] ?? (typeof placeholder === 'string' ? placeholder : messages.search)
        }
        className={cn(
          controlSurface,
          controlFocus,
          controlHeight[size],
          controlText[size],
          controlRadius[size],
          controlIconRoom[size],
          size === 'lg' ? 'pr-9' : 'pr-8',
          '[&::-webkit-search-cancel-button]:hidden',
        )}
        {...props}
      />
      <AnimatePresence initial={false}>
        {value ? (
          <m.button
            key="clear"
            type="button"
            onClick={() => onValueChange('')}
            aria-label={messages.clearSearch}
            title={messages.clearSearch}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: transitions.enter }}
            exit={{ opacity: 0, scale: 0.8, transition: transitions.exit }}
            className="absolute top-1/2 right-1.5 grid size-5 -translate-y-1/2 place-items-center rounded text-subtle-foreground outline-hidden transition-colors duration-(--motion-duration-fast) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-3.5" />
          </m.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export type FilterPillOption<T extends string> = { value: T; label: ReactNode; count?: number };

export type FilterPillsProps<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  options: readonly FilterPillOption<T>[];
  'aria-label': string;
  className?: string;
};

/** A few mutually exclusive list filters, with optional counts. */
export function FilterPills<T extends string>({
  value,
  onValueChange,
  options,
  'aria-label': ariaLabel,
  className,
}: FilterPillsProps<T>) {
  const group = useId();
  return (
    <LayoutGroup id={group}>
      <div
        role="group"
        aria-label={ariaLabel}
        data-slot="filter-pills"
        className={cn(
          'inline-flex h-8 items-center gap-0.5 rounded-md border border-border bg-input-background p-0.5 pointer-coarse:h-10',
          className,
        )}
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onValueChange(option.value)}
              className={cn(
                'relative isolate inline-flex h-full items-center gap-1.5 rounded px-2.5 text-xs outline-hidden',
                'transition-colors duration-(--motion-duration-fast) ease-enter focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'text-skylab-300'
                  : 'text-muted-foreground hover:text-secondary-foreground',
              )}
            >
              {active ? (
                // The chosen pill's fill glides to the next choice
                <m.span
                  layoutId="pill"
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded bg-skylab-500/20"
                  transition={transitions.layout}
                />
              ) : null}
              {option.label}
              {option.count !== undefined ? (
                <span
                  className={cn(
                    'text-3xs tabular-nums',
                    active ? 'text-skylab-300' : 'text-subtle-foreground',
                  )}
                >
                  <AnimatedNumber value={option.count} tabular />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

export type FilterButtonProps = Omit<ButtonProps, 'children'> & {
  /** How many filters are on; above zero the button takes the brand colour and says so. */
  count?: number;
  /** The words on the button; the locale's "Filtreler" by default. */
  label?: ReactNode;
};

/** The toolbar button that opens a filter panel, saying how many filters are on. */
export function FilterButton({ count = 0, label, ...props }: FilterButtonProps) {
  const { messages } = useSkylcn();
  return (
    <Button variant={count > 0 ? 'primary' : 'outline'} {...props}>
      <SlidersHorizontal aria-hidden />
      {label ?? messages.filters}
      {count > 0 ? (
        <>
          {/* The space is for screen readers ("Filtreler (2)"); on screen the flex gap spaces it */}{' '}
          <span className="tabular-nums">({count})</span>
        </>
      ) : null}
    </Button>
  );
}

export type ActiveFilter = {
  key: string;
  /** What the filter keeps, such as "Durum: Açık"; also names its remove button. */
  label: string;
  onRemove: () => void;
};

/** The filters that are on, as chips that each take one off, with a way to clear them all. */
export function ActiveFilters({
  filters,
  onClear,
  className,
}: {
  filters: readonly ActiveFilter[];
  /** Clears every filter; offered once two or more are on. */
  onClear?: () => void;
  className?: string;
}) {
  const { messages } = useSkylcn();
  if (filters.length === 0) return null;
  return (
    <div
      data-slot="active-filters"
      className={cn('flex flex-wrap items-center gap-1.5', className)}
    >
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex enter-fade items-center gap-1 rounded-md border border-border bg-muted py-0.5 pr-0.5 pl-2 text-2xs text-secondary-foreground"
        >
          {filter.label}
          <button
            type="button"
            aria-label={messages.removeFilter(filter.label)}
            title={messages.removeFilter(filter.label)}
            onClick={filter.onRemove}
            className="grid size-4 place-items-center rounded text-subtle-foreground outline-hidden transition-colors duration-(--motion-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring pointer-coarse:size-6"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      {onClear && filters.length > 1 ? (
        <button
          type="button"
          onClick={onClear}
          className="rounded px-1 text-2xs font-medium text-muted-foreground outline-hidden transition-colors duration-(--motion-duration-fast) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          {messages.clear}
        </button>
      ) : null}
    </div>
  );
}

/** A labelled figure for header rows: a count, a date, a total. */
export function Stat({
  label,
  value,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="stat" className={cn('text-right', className)}>
      <p className="text-2xs text-subtle-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground tabular-nums">{value ?? '--'}</p>
    </div>
  );
}
