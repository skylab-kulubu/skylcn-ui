'use client';

import { useId, useMemo, useState, type KeyboardEvent } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';

export type ActivityDay = { date: Date | string; count: number };

export type ActivityHeatmapProps = {
  data: readonly ActivityDay[];
  /** How many weeks back from `end` it shows. */
  weeks?: number;
  /** The last day shown; today by default. */
  end?: Date;
  /** Words for a day's count, such as `(n) => `${n} katılım``. */
  formatCount?: (count: number) => string;
  /** Names the chart and is read before the summary of its busiest day. */
  'aria-label': string;
  className?: string;
};

const LEVELS = [
  'bg-muted',
  'bg-chart-1/25',
  'bg-chart-1/50',
  'bg-chart-1/75',
  'bg-chart-1',
] as const;

const DAY = 86_400_000;
const keyOf = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

/**
 * Days as small squares in week columns, darker the busier: attendance over a term,
 * a member's activity. Arrow keys move along the days and the line under it reads the one in focus.
 */
export function ActivityHeatmap({
  data,
  weeks = 26,
  end,
  formatCount = String,
  'aria-label': ariaLabel,
  className,
}: ActivityHeatmapProps) {
  const { locale, messages } = useSkylcn();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const hintId = useId();
  const [active, setActive] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);

  const { days, max, total, busiest, months } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const day of data) {
      const date = new Date(day.date);
      counts.set(keyOf(date), (counts.get(keyOf(date)) ?? 0) + day.count);
    }
    const last = end ? new Date(end) : new Date();
    last.setHours(12, 0, 0, 0);
    // Weeks start on Monday in Turkish and on Sunday in English, as the calendar does
    const weekday = (last.getDay() + (locale === 'tr' ? 6 : 7)) % 7;
    const first = new Date(last.getTime() - ((weeks - 1) * 7 + weekday) * DAY);
    const list: { date: Date; count: number }[] = [];
    for (let time = first.getTime(); time <= last.getTime(); time += DAY) {
      const date = new Date(time);
      list.push({ date, count: counts.get(keyOf(date)) ?? 0 });
    }
    const top = list.reduce((best, day) => (day.count > best.count ? day : best), list[0]!);
    const heads: { column: number; label: string }[] = [];
    list.forEach((day, i) => {
      if (day.date.getDate() <= 7 && i % 7 === 0) {
        heads.push({
          column: i / 7,
          label: new Intl.DateTimeFormat(tag, { month: 'short' }).format(day.date),
        });
      }
    });
    return {
      days: list,
      max: top.count,
      total: list.reduce((sum, day) => sum + day.count, 0),
      busiest: top,
      months: heads,
    };
  }, [data, weeks, end, locale, tag]);

  const level = (count: number) => (count === 0 || max === 0 ? 0 : Math.ceil((count / max) * 4));
  const say = (i: number) => {
    const day = days[i]!;
    const date = new Intl.DateTimeFormat(tag, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    }).format(day.date);
    return `${date}: ${formatCount(day.count)}`;
  };
  const summary = `${ariaLabel}. ${formatCount(total)}${
    busiest.count ? `; ${say(days.indexOf(busiest))}` : ''
  }`;
  const columns = Math.ceil(days.length / 7);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 }[event.key];
    if (step === undefined && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const from = active ?? days.length - 1;
    const next =
      event.key === 'Home' ? 0 : event.key === 'End' ? days.length - 1 : from + (step ?? 0);
    if (next >= 0 && next < days.length) setActive(next);
  };

  const weekdayNames = [0, 2, 4].map((offset) => {
    const date = new Date(days[offset]!.date);
    return new Intl.DateTimeFormat(tag, { weekday: 'short' }).format(date);
  });

  return (
    <div
      data-slot="activity-heatmap"
      className={cn('flex w-fit max-w-full flex-col gap-2', className)}
    >
      <div
        role="img"
        aria-label={summary}
        aria-describedby={hintId}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={() => {
          setFocused(true);
          setActive((current) => current ?? days.length - 1);
        }}
        onBlur={() => setFocused(false)}
        onMouseLeave={() => !focused && setActive(null)}
        className="scrollbar w-fit max-w-full overflow-x-auto rounded-md outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      >
        {/* Filled column by column, a week to a column, so no column count has to be set inline */}
        <div className="grid w-max auto-cols-[0.6875rem] grid-flow-col grid-cols-[auto] grid-rows-[0.75rem_repeat(7,0.6875rem)] gap-0.75 p-0.5 text-3xs leading-[0.6875rem] text-subtle-foreground">
          <span />
          {Array.from({ length: 7 }, (_, row) => (
            <span key={row} className="pr-1.5">
              {row % 2 === 0 && row < 6 ? weekdayNames[row / 2] : null}
            </span>
          ))}
          {Array.from({ length: columns }, (_, column) => [
            <span key={`m${column}`} className="whitespace-nowrap">
              {months.find((month) => month.column === column)?.label}
            </span>,
            ...Array.from({ length: 7 }, (_, row) => {
              const i = column * 7 + row;
              const day = days[i];
              if (!day) return <span key={i} />;
              return (
                <span
                  key={i}
                  onMouseEnter={() => setActive(i)}
                  data-active={active === i || undefined}
                  className={cn(
                    'size-2.75 rounded-xs transition-shadow duration-(--motion-duration-fast)',
                    LEVELS[level(day.count)],
                    'data-active:ring-2 data-active:ring-foreground/60',
                  )}
                />
              );
            }),
          ])}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-2xs text-subtle-foreground">
        <span aria-live={focused ? 'polite' : 'off'} className="min-h-4 tabular-nums">
          {active === null ? '' : say(active)}
        </span>
        <span aria-hidden className="flex items-center gap-1">
          {messages.less}
          {LEVELS.map((tone) => (
            <span key={tone} className={cn('size-2.75 rounded-xs', tone)} />
          ))}
          {messages.more}
        </span>
      </div>
      <span id={hintId} hidden>
        {messages.heatmapHint}
      </span>
    </div>
  );
}
