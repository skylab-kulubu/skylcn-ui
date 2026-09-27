'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
  'flex size-7 items-center justify-center rounded-md border border-border text-xs outline-hidden pointer-coarse:size-9',
  'transition-colors duration-(--motion-duration-fast) focus-visible:ring-2 focus-visible:ring-ring',
  'enabled:bg-card enabled:text-secondary-foreground enabled:hover:border-skylab-400/40 enabled:hover:bg-skylab-500/10',
  'disabled:cursor-not-allowed disabled:bg-muted disabled:text-subtle-foreground disabled:opacity-60',
);

export type PaginationProps = {
  current: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /**
   * Lets the reader type a page number into the current page. On by default
   * once some pages are folded away behind "…".
   */
  jumpToPage?: boolean;
  className?: string;
};

const CURRENT =
  'h-7 min-w-7 rounded-md border border-skylab-400/40 bg-skylab-500/15 px-1 text-xs font-semibold text-skylab-300 tabular-nums pointer-coarse:h-9 pointer-coarse:min-w-9';

/** Page steps with a window around the current page; hidden when there is one page. */
export function Pagination({
  current,
  totalPages,
  onPageChange,
  jumpToPage,
  className,
}: PaginationProps) {
  const { messages } = useSkylcn();
  const total = Math.max(1, Math.floor(totalPages) || 1);
  const page = Math.min(Math.max(1, Math.floor(current) || 1), total);
  if (total <= 1) return null;

  const slots = pageSlots(page, total);
  const editable = jumpToPage ?? slots.length < total;
  const goTo = (next: number) => {
    const clamped = Math.min(Math.max(next, 1), total);
    if (clamped !== page) onPageChange(clamped);
  };
  const currentPage = editable ? (
    <PageInput page={page} total={total} label={messages.pageInput(total)} onJump={goTo} />
  ) : (
    <span aria-current="page" className={cn(CURRENT, 'inline-grid place-items-center')}>
      <span className="sr-only">{messages.page(page)}</span>
      <span aria-hidden>{page}</span>
    </span>
  );

  return (
    <nav
      data-slot="pagination"
      aria-label={messages.pagination}
      className={cn('flex flex-wrap items-center justify-center gap-1', className)}
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
      <span className="flex items-center gap-1.5 px-1 text-xs text-subtle-foreground tabular-nums sm:hidden">
        {currentPage}
        <span aria-hidden>/ {total}</span>
      </span>
      <div className="hidden items-center gap-1 rounded-lg border border-border bg-card px-1 py-0.5 shadow-sm sm:flex">
        {slots.map((slot) =>
          slot === page ? (
            // One key for the current page wherever it sits, so typing into it survives the move
            <span key="current" className="contents">
              {currentPage}
            </span>
          ) : typeof slot === 'number' ? (
            <button
              key={slot}
              type="button"
              onClick={() => goTo(slot)}
              aria-label={messages.page(slot)}
              className="size-7 rounded-md text-xs font-semibold text-secondary-foreground tabular-nums outline-hidden transition-colors duration-(--motion-duration-fast) hover:bg-accent-strong hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring pointer-coarse:size-9"
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
    </nav>
  );
}

/**
 * The current page as a field: digits only, as many as the last page has.
 * Enter or leaving the field goes there, held within 1 and the last page;
 * Escape or an empty field puts the current page back.
 */
function PageInput({
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
  const ref = useRef<HTMLInputElement>(null);
  const digits = String(total).length;

  // After a jump the new number is selected, ready to be typed over
  useEffect(() => {
    if (ref.current && document.activeElement === ref.current) ref.current.select();
  }, [page]);

  const commit = () => {
    if (draft === null) return;
    const typed = Number.parseInt(draft, 10);
    setDraft(null);
    if (Number.isFinite(typed)) onJump(typed);
  };
  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      enterKeyHint="go"
      autoComplete="off"
      maxLength={digits}
      aria-label={label}
      title={label}
      value={draft ?? String(page)}
      onChange={(event) => setDraft(event.target.value.replace(/\D/g, ''))}
      onFocus={(event) => event.target.select()}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          commit();
        } else if (event.key === 'Escape' && draft !== null) {
          event.preventDefault();
          setDraft(null);
        }
      }}
      style={{ width: `calc(${digits}ch + 1rem)` }}
      className={cn(
        CURRENT,
        'cursor-text text-center outline-hidden transition-[border-color,background-color,color] duration-(--motion-duration-fast) selection:bg-skylab-400/30 selection:text-foreground-strong pointer-coarse:text-base',
        'hover:border-skylab-300/60 focus-visible:border-skylab-400/60 focus-visible:bg-input-background focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
      )}
    />
  );
}
