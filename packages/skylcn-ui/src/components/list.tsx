'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { StateCard } from './state-card.js';

export type ListStatus =
  { kind: 'loading' } | { kind: 'empty'; message: string } | { kind: 'ready' };

/** Derives a list's status from its request state and row count. */
export function listStatus(options: {
  loading: boolean;
  failed?: boolean;
  rowCount: number;
  emptyMessage: string;
}): ListStatus {
  if (options.loading) return { kind: 'loading' };
  if (options.failed) return { kind: 'ready' };
  if (options.rowCount === 0) return { kind: 'empty', message: options.emptyMessage };
  return { kind: 'ready' };
}

export type ListPanelProps = {
  status: ListStatus;
  /** Draws the rounded border around the list. */
  framed?: boolean;
  emptyIcon?: LucideIcon;
  emptyDescription?: ReactNode;
  emptyAction?: ReactNode;
  className?: string;
  children?: ReactNode;
};

/** A plain list of rows that shows its own loading and empty states and fades its rows in. */
export function ListPanel({
  status,
  framed = true,
  emptyIcon,
  emptyDescription,
  emptyAction,
  className,
  children,
}: ListPanelProps) {
  return (
    <div
      key={status.kind}
      data-slot="list-panel"
      className={cn(
        'enter-fade divide-y divide-border-subtle',
        framed && 'overflow-hidden rounded-lg border border-border',
        className,
      )}
    >
      {status.kind === 'loading' ? (
        <StateCard loading />
      ) : status.kind === 'empty' ? (
        <StateCard title={status.message} description={emptyDescription} icon={emptyIcon}>
          {emptyAction}
        </StateCard>
      ) : (
        children
      )}
    </div>
  );
}

export type ListItemProps = {
  href?: string;
  onSelect?: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  /** An avatar, icon or status dot before the text. */
  leading?: ReactNode;
  /** Chips or actions after the text; they stay pressable over the row link. */
  trailing?: ReactNode;
  className?: string;
};

/** One row of a ListPanel: title, subtitle, leading and trailing slots, optionally a link. */
export function ListItem({
  href,
  onSelect,
  title,
  subtitle,
  leading,
  trailing,
  className,
}: ListItemProps) {
  const { Link } = useSkylcn();
  const pressable = Boolean(href || onSelect);
  const overlay =
    'absolute inset-0 outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset';
  const name = typeof title === 'string' ? title : undefined;

  return (
    <div
      data-slot="list-item"
      className={cn(
        'group/row relative transition-colors duration-(--motion-duration-fast)',
        pressable && 'hover:bg-card',
        className,
      )}
    >
      {href ? (
        <Link href={href} className={overlay}>
          <span className="sr-only">{name}</span>
        </Link>
      ) : onSelect ? (
        <button type="button" onClick={onSelect} aria-label={name} className={overlay} />
      ) : null}
      <div className="flex items-center gap-3 px-3 py-2.5 pointer-coarse:py-3">
        {leading}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-secondary-foreground transition-colors group-hover/row:text-foreground-strong">
            {title}
          </p>
          {subtitle ? (
            <p className="mt-0.5 truncate text-3xs text-subtle-foreground">{subtitle}</p>
          ) : null}
        </div>
        {trailing || pressable ? (
          <div className="relative z-10 flex items-center gap-1">
            {trailing}
            {pressable ? (
              <span className="pointer-events-none inline-flex size-6 items-center justify-center text-muted-foreground transition-colors group-hover/row:text-skylab-300">
                <ChevronRight className="size-4 transition-transform duration-(--motion-duration-fast) group-hover/row:translate-x-0.5" />
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
