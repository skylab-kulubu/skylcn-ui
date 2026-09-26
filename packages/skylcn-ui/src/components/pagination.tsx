'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
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
  'flex size-7 items-center justify-center rounded-md border border-border text-xs outline-none pointer-coarse:size-9',
  'transition-colors duration-(--motion-duration-fast) focus-visible:ring-2 focus-visible:ring-ring',
  'enabled:bg-card enabled:text-secondary-foreground enabled:hover:border-skylab-400/40 enabled:hover:bg-skylab-500/10',
  'disabled:cursor-not-allowed disabled:bg-muted disabled:text-subtle-foreground disabled:opacity-60',
);

export type PaginationProps = {
  current: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Adds a box for typing a page number, for long lists. */
  jumpToPage?: boolean;
  className?: string;
};

/** Page steps with a window around the current page; hidden when there is one page. */
export function Pagination({
  current,
  totalPages,
  onPageChange,
  jumpToPage = false,
  className,
}: PaginationProps) {
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
        'flex animate-in flex-wrap items-center justify-center gap-1 duration-(--motion-duration-base) ease-enter fade-in-0 slide-in-from-bottom-3',
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
      {jumpToPage ? null : (
        <span className="px-2 text-xs text-secondary-foreground tabular-nums sm:hidden">
          {page} / {total}
        </span>
      )}
      <div className="hidden items-center gap-1 rounded-lg border border-border bg-card px-1 py-0.5 shadow-sm sm:flex">
        {pageSlots(page, total).map((slot) =>
          typeof slot === 'number' ? (
            <button
              key={slot}
              type="button"
              onClick={() => goTo(slot)}
              aria-label={messages.page(slot)}
              aria-current={slot === page ? 'page' : undefined}
              className={cn(
                'size-7 rounded-md text-xs font-semibold tabular-nums transition-colors duration-(--motion-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring pointer-coarse:size-9',
                slot === page
                  ? 'border border-skylab-400/40 bg-skylab-500/15 text-skylab-300'
                  : 'text-secondary-foreground hover:bg-accent-strong hover:text-foreground',
              )}
            >
              {slot}
            </button>
          ) : (
            <span key={slot} aria-hidden className="px-1 text-xs text-subtle-foreground">
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
      {jumpToPage ? (
        <PageJump page={page} total={total} label={messages.goToPage} onJump={goTo} />
      ) : null}
    </nav>
  );
}

function PageJump({
  page,
  total,
  label,
  onJump,
}: {
  page: number;
  total: number;
  label: string;
  onJump: (page: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    const typed = Number.parseInt(draft ?? '', 10);
    if (Number.isFinite(typed)) onJump(typed);
    setDraft(null);
  };
  return (
    <form
      className="ml-2 flex items-center gap-1.5 text-2xs text-subtle-foreground"
      onSubmit={(event) => {
        event.preventDefault();
        commit();
      }}
    >
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={label}
        title={label}
        value={draft ?? String(page)}
        onChange={(event) => setDraft(event.target.value.replace(/[^0-9]/g, ''))}
        onFocus={(event) => event.target.select()}
        onBlur={() => setDraft(null)}
        className={cn(
          'h-7 w-10 rounded-md border border-input bg-input-background text-center text-xs text-foreground tabular-nums outline-none pointer-coarse:h-9 pointer-coarse:w-12 pointer-coarse:text-base',
          'transition-[border-color,box-shadow] duration-(--motion-duration-fast) ease-enter',
          'hover:border-border-strong focus-visible:border-skylab-400/50 focus-visible:ring-2 focus-visible:ring-skylab-400/20',
        )}
      />
      <span className="tabular-nums">/ {total}</span>
    </form>
  );
}
