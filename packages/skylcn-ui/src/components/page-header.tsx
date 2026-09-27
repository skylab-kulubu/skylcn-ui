'use client';

import { Search, X } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';

export type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  /** A badge beside the title, such as a form's open or closed state. */
  badge?: ReactNode;
  /** Buttons at the right of the title row. */
  actions?: ReactNode;
  /** Chips or stats under the description. */
  meta?: ReactNode;
  className?: string;
  /** A toolbar row under the divider: search, filters, view switches. */
  children?: ReactNode;
};

/** The top of a page: title, description, actions and an optional toolbar row. */
export function PageHeader({
  title,
  description,
  badge,
  actions,
  meta,
  className,
  children,
}: PageHeaderProps) {
  return (
    <header data-slot="page-header" className={cn('flex flex-col gap-3', className)}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2.5">
            <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
            {badge ? <span className="shrink-0">{badge}</span> : null}
          </div>
          {description ? (
            <p className="mt-0.5 text-2xs text-subtle-foreground">{description}</p>
          ) : null}
          {meta ? <div className="flex flex-wrap items-center gap-1.5 pt-2">{meta}</div> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-1.5">{actions}</div> : null}
      </div>
      <div className="h-px bg-border" />
      {children ? (
        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">{children}</div>
      ) : null}
    </header>
  );
}

export type SearchInputProps = Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'size'> & {
  value: string;
  onValueChange: (value: string) => void;
  /** The narrow form for toolbars in the shell header; it widens while focused. */
  compact?: boolean;
};

/** A search box with a leading glass and a clear button while it has text. */
export function SearchInput({
  value,
  onValueChange,
  compact = false,
  placeholder,
  className,
  ...props
}: SearchInputProps) {
  const { messages } = useSkylcn();
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
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint-foreground" />
      <input
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder ?? messages.search}
        aria-label={
          props['aria-label'] ?? (typeof placeholder === 'string' ? placeholder : messages.search)
        }
        className={cn(
          'w-full rounded-md border border-input bg-card pr-8 pl-8 text-xs text-foreground outline-hidden placeholder:text-subtle-foreground',
          'transition-[border-color,background-color] duration-(--motion-duration-fast) ease-enter',
          'focus-visible:border-skylab-400/50 focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-skylab-400/20',
          '[&::-webkit-search-cancel-button]:hidden',
          compact ? 'h-8' : 'h-9 rounded-lg',
          'pointer-coarse:h-10 pointer-coarse:text-base',
        )}
        {...props}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onValueChange('')}
          aria-label={messages.clearSearch}
          title={messages.clearSearch}
          className="absolute top-1/2 right-1.5 grid size-5 -translate-y-1/2 animate-in place-items-center rounded text-subtle-foreground outline-hidden transition-colors duration-(--motion-duration-fast) fade-in-0 zoom-in-90 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:zoom-in-100"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
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
  return (
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
              'inline-flex h-full items-center gap-1.5 rounded px-2.5 text-xs outline-hidden',
              'transition-[color,background-color] duration-(--motion-duration-fast) ease-enter focus-visible:ring-2 focus-visible:ring-ring',
              active
                ? 'bg-skylab-500/20 text-skylab-300'
                : 'text-muted-foreground hover:text-secondary-foreground',
            )}
          >
            {option.label}
            {option.count !== undefined ? (
              <span
                className={cn(
                  'text-3xs tabular-nums',
                  active ? 'text-skylab-300' : 'text-subtle-foreground',
                )}
              >
                {option.count}
              </span>
            ) : null}
          </button>
        );
      })}
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
      <p className="text-3xs font-medium tracking-label text-subtle-foreground uppercase">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground tabular-nums">{value ?? '--'}</p>
    </div>
  );
}
