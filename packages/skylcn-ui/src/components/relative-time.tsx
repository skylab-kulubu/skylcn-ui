'use client';

import { useSyncExternalStore, type ComponentProps } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { Tooltip } from './tooltip.js';

const STEPS: readonly [Intl.RelativeTimeFormatUnit, number][] = [
  ['second', 60],
  ['minute', 60],
  ['hour', 24],
  ['day', 7],
  ['week', 4.345],
  ['month', 12],
  ['year', Infinity],
];

/** Says how far `date` is from `now` in the largest whole unit: "3 saat önce", "yarın". */
export function formatRelativeTime(date: Date, now: Date, locale: string) {
  const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  let amount = (date.getTime() - now.getTime()) / 1000;
  // Under 45 seconds either way is "şimdi", so a fresh row does not count seconds up
  if (Math.abs(amount) < 45) return format.format(0, 'second');
  for (const [unit, size] of STEPS) {
    if (Math.abs(amount) < size) return format.format(Math.round(amount), unit);
    amount /= size;
  }
  return format.format(Math.round(amount), 'year');
}

// Every RelativeTime on the page reads one clock that ticks each 30 seconds
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
let tick = Date.now();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    timer = setInterval(() => {
      tick = Date.now();
      listeners.forEach((notify) => notify());
    }, 30_000);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

export type RelativeTimeProps = Omit<ComponentProps<'time'>, 'children' | 'dateTime'> & {
  date: Date | string | number;
  /** Fixes the moment it counts from, such as in tests; the shared clock otherwise. */
  now?: Date;
  /** Where the full date opens on hover; `false` falls back to the browser's title. */
  tooltip?: 'top' | 'bottom' | 'left' | 'right' | false;
};

/**
 * A moment said from now, "3 saat önce" or "yarın", kept current as time passes;
 * the full date and time show on hover and stay in the element for machines.
 */
export function RelativeTime({
  date,
  now,
  tooltip = 'top',
  className,
  title,
  ...props
}: RelativeTimeProps) {
  const { locale } = useSkylcn();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const clock = useSyncExternalStore(
    subscribe,
    () => tick,
    () => tick,
  );
  const value = date instanceof Date ? date : new Date(date);
  const full = new Intl.DateTimeFormat(tag, { dateStyle: 'long', timeStyle: 'short' }).format(
    value,
  );
  const label = title ?? full;
  const time = (
    <time
      data-slot="relative-time"
      dateTime={value.toISOString()}
      title={tooltip ? undefined : label}
      // The server's clock and the reader's differ by the time the page takes to arrive
      suppressHydrationWarning
      className={cn('tabular-nums', className)}
      {...props}
    >
      {formatRelativeTime(value, now ?? new Date(Math.max(clock, Date.now())), tag)}
    </time>
  );
  return tooltip ? (
    <Tooltip label={label} side={tooltip}>
      {time}
    </Tooltip>
  ) : (
    time
  );
}
