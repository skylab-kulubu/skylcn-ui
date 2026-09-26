'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';

type PageSlot = number | 'gap-start' | 'gap-end';

export function pageSlots(current: number, total: number): PageSlot[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 'gap-end', total];
  if (current >= total - 2) return [1, 'gap-start', total - 3, total - 2, total - 1, total];
  return [1, 'gap-start', current - 1, current, current + 1, 'gap-end', total];
}

const stepClass = cn(
  'flex size-7 items-center justify-center rounded-md border border-border text-xs outline-none',
  'transition-colors duration-(--motion-duration-fast) focus-visible:ring-2 focus-visible:ring-ring',
  'enabled:bg-card enabled:text-secondary-foreground enabled:hover:border-skylab-400/40 enabled:hover:bg-skylab-500/10',
  'disabled:cursor-not-allowed disabled:bg-muted disabled:text-subtle-foreground disabled:opacity-60',
);

export type PaginationProps = {
  current: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

/** Page steps with a window around the current page; hidden when there is one page. */
export function Pagination({ current, totalPages, onPageChange, className }: PaginationProps) {
  const { messages } = useSkylcn();
  const total = Math.max(1, Math.floor(totalPages) || 1);
  const page = Math.min(Math.max(1, Math.floor(current) || 1), total);
  if (total <= 1) return null;

  const goTo = (next: number) => {
    const clamped = Math.min(Math.max(next, 1), total);
    if (clamped !== page) onPageChange(clamped);
  };

  return (
    <nav
      data-slot="pagination"
      aria-label={messages.pagination}
      className={cn(
        'animate-in fade-in-0 slide-in-from-bottom-3 ease-enter flex flex-wrap items-center justify-center gap-1 duration-(--motion-duration-base)',
        className,
      )}
    >
      <button
        type="button"
        className={stepClass}
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        aria-label={messages.previousPage}
      >
        <ArrowLeft className="size-3.5" />
      </button>
      <div className="border-border bg-card flex items-center gap-1 rounded-lg border px-1 py-0.5 shadow-sm">
        {pageSlots(page, total).map((slot) =>
          typeof slot === 'number' ? (
            <button
              key={slot}
              type="button"
              onClick={() => goTo(slot)}
              aria-label={messages.page(slot)}
              aria-current={slot === page ? 'page' : undefined}
              className={cn(
                'focus-visible:ring-ring size-7 rounded-md text-xs font-semibold tabular-nums transition-colors duration-(--motion-duration-fast) outline-none focus-visible:ring-2',
                slot === page
                  ? 'border-skylab-400/40 bg-skylab-500/15 text-skylab-300 border'
                  : 'text-secondary-foreground hover:bg-accent-strong hover:text-foreground',
              )}
            >
              {slot}
            </button>
          ) : (
            <span key={slot} aria-hidden className="text-subtle-foreground px-1 text-xs">
              …
            </span>
          ),
        )}
      </div>
      <button
        type="button"
        className={stepClass}
        onClick={() => goTo(page + 1)}
        disabled={page >= total}
        aria-label={messages.nextPage}
      >
        <ArrowRight className="size-3.5" />
      </button>
    </nav>
  );
}
