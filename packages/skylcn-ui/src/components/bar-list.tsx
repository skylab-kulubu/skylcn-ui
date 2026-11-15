'use client';

import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { numberFormat } from '../lib/number-format.js';
import { useSkylcn } from '../lib/provider.js';

export type BarListItem = {
  key: string;
  label: ReactNode;
  value: number;
  /** Replaces the value on the right, such as "412 · %38". */
  detail?: ReactNode;
  /** A row that cannot be chosen, drawn dimmed. */
  disabled?: boolean;
};

export type BarListProps = {
  items: readonly BarListItem[];
  /**
   * What 100% is: the total of the values by default, which suits shares of
   * one answer; pass a number for rates against a separate total.
   */
  max?: number;
  /** Shows each row's share after its value. */
  showPercent?: boolean;
  /** Makes the rows pressable, such as picking the questions to chart. */
  onSelect?: (key: string) => void;
  /** Keys of the rows that are chosen. */
  selected?: readonly string[];
  /** Draws the longest row in the stronger colour; off by default, as its bar already says it. */
  highlightTop?: boolean;
  /**
   * `bars` puts a thin bar under each label; `fill` fills each row's box to its share with the
   * label inside, for answers that each stand on their own, such as a multiple choice's.
   */
  variant?: 'bars' | 'fill';
  formatValue?: (value: number) => string;
  className?: string;
};

/**
 * Categories as labelled rows over thin bars: the answers to a question, the
 * reply rate of each question, the members of each team. Reads better than a
 * chart when the labels are long, and doubles as a pick list.
 */
export function BarList({
  items,
  max,
  showPercent = true,
  onSelect,
  selected = [],
  highlightTop = false,
  variant = 'bars',
  formatValue,
  className,
}: BarListProps) {
  const { locale } = useSkylcn();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const total = max ?? items.reduce((sum, item) => sum + item.value, 0);
  const top = Math.max(0, ...items.filter((item) => !item.disabled).map((item) => item.value));
  const leader =
    highlightTop && top > 0
      ? items.find((item) => !item.disabled && item.value === top)?.key
      : undefined;
  const fill = variant === 'fill';
  const number = formatValue ?? ((value: number) => numberFormat(tag).format(value));
  const percent = (value: number) => {
    const share = total ? (value / total) * 100 : 0;
    const text = numberFormat(tag, share % 1 ? 1 : 0).format(share);
    return locale === 'tr' ? `%${text}` : `${text}%`;
  };

  return (
    <ul
      data-slot="bar-list"
      data-variant={variant}
      className={cn('flex flex-col', fill ? 'gap-2' : 'gap-0.5', className)}
    >
      {items.map((item) => {
        const share = total ? Math.min((item.value / total) * 100, 100) : 0;
        const chosen = selected.includes(item.key);
        const detail = item.detail ?? (
          <>
            <span className={fill ? 'text-foreground' : 'text-secondary-foreground'}>
              {number(item.value)}
            </span>
            {showPercent ? ` · ${percent(item.value)}` : null}
          </>
        );
        const body = fill ? (
          <span
            className={cn(
              'relative flex items-center gap-3 overflow-hidden rounded-md border bg-background/60 px-2.5 py-2',
              chosen
                ? 'border-skylab-400/40'
                : item.key === leader
                  ? 'border-skylab-400/25'
                  : 'border-border',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'absolute inset-y-0 left-0 transition-[width] duration-(--motion-duration-slow) ease-enter',
                item.disabled ? 'bg-faint-foreground/15' : 'bg-skylab-500/14',
              )}
              style={{ width: `${share}%` }}
            />
            <span
              className={cn(
                'relative min-w-0 flex-1 truncate text-sm',
                chosen ? 'text-foreground-strong' : 'text-secondary-foreground',
              )}
            >
              {item.label}
            </span>
            <span className="relative shrink-0 text-2xs text-subtle-foreground tabular-nums">
              {detail}
            </span>
          </span>
        ) : (
          <>
            <span className="flex items-baseline justify-between gap-3">
              <span
                className={cn(
                  'min-w-0 truncate text-xs',
                  chosen ? 'text-foreground-strong' : 'text-secondary-foreground',
                )}
              >
                {item.label}
              </span>
              <span
                className={cn(
                  'shrink-0 text-2xs tabular-nums',
                  chosen ? 'text-muted-foreground' : 'text-subtle-foreground',
                )}
              >
                {detail}
              </span>
            </span>
            <span aria-hidden className="mt-1.5 block h-2 overflow-hidden rounded-full bg-muted">
              <span
                className={cn(
                  'block h-full rounded-full transition-[width,background-color] duration-(--motion-duration-slow) ease-enter',
                  item.disabled && 'bg-faint-foreground',
                )}
                style={{
                  width: `${share}%`,
                  background: item.disabled
                    ? undefined
                    : chosen || item.key === leader
                      ? 'var(--chart-4)'
                      : 'var(--chart-1)',
                }}
              />
            </span>
          </>
        );
        return (
          <li key={item.key}>
            {onSelect && !item.disabled ? (
              <button
                type="button"
                aria-pressed={chosen}
                onClick={() => onSelect(item.key)}
                className={cn(
                  'block w-full text-left outline-hidden transition-colors duration-(--motion-duration-fast)',
                  'focus-visible:ring-2 focus-visible:ring-ring',
                  fill
                    ? 'rounded-md'
                    : ['rounded-lg px-2.5 py-2', chosen ? 'bg-skylab-500/10' : 'hover:bg-accent'],
                )}
              >
                {body}
              </button>
            ) : (
              <div className={cn(!fill && 'px-2.5 py-2', item.disabled && 'opacity-60')}>
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
