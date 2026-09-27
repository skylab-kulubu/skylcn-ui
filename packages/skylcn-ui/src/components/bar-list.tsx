'use client';

import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
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
  formatValue,
  className,
}: BarListProps) {
  const { locale } = useSkylcn();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const total = max ?? items.reduce((sum, item) => sum + item.value, 0);
  const number = formatValue ?? ((value: number) => value.toLocaleString(tag));
  const percent = (value: number) => {
    const share = total ? (value / total) * 100 : 0;
    const text = share.toLocaleString(tag, { maximumFractionDigits: share % 1 ? 1 : 0 });
    return locale === 'tr' ? `%${text}` : `${text}%`;
  };

  return (
    <ul data-slot="bar-list" className={cn('flex flex-col gap-0.5', className)}>
      {items.map((item) => {
        const share = total ? Math.min((item.value / total) * 100, 100) : 0;
        const chosen = selected.includes(item.key);
        const body = (
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
                {item.detail ?? (
                  <>
                    <span className="text-secondary-foreground">{number(item.value)}</span>
                    {showPercent ? ` · ${percent(item.value)}` : null}
                  </>
                )}
              </span>
            </span>
            <span aria-hidden className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-muted">
              <span
                className={cn(
                  'block h-full rounded-full transition-[width,background-color] duration-(--motion-duration-slow) ease-enter',
                  item.disabled
                    ? 'bg-faint-foreground'
                    : chosen
                      ? 'bg-skylab-400'
                      : 'bg-skylab-500',
                )}
                style={{ width: `${share}%` }}
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
                  'block w-full rounded-lg px-2.5 py-2 text-left outline-hidden transition-colors duration-(--motion-duration-fast)',
                  'focus-visible:ring-2 focus-visible:ring-ring',
                  chosen ? 'bg-skylab-500/10' : 'hover:bg-accent',
                )}
              >
                {body}
              </button>
            ) : (
              <div className={cn('px-2.5 py-2', item.disabled && 'opacity-60')}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
