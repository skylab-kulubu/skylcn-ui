'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { IconButton } from './button.js';
import { SkylabLoader } from './skylab-loader.js';
import { Swap } from './motion.js';

export type CalendarEvent = {
  id: string;
  /** The day, as an ISO date (YYYY-MM-DD). */
  date: string;
  title: string;
  time?: string;
  tone?: 'brand' | 'success' | 'warning' | 'info';
};

const TONE = {
  brand: 'border-skylab-400/30 bg-skylab-500/10 text-skylab-300',
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  info: 'border-info/30 bg-info/10 text-info',
} as const;

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export type MonthCalendarProps = {
  events: readonly CalendarEvent[];
  /** The month first shown; this month by default. */
  defaultMonth?: Date;
  onSelectEvent?: (event: CalendarEvent) => void;
  className?: string;
};

/**
 * The club's events on a month grid, weeks starting Monday in Turkish; on
 * phones an agenda of the month's days that have events. Months slide in the
 * direction you move.
 */
export function MonthCalendar({
  events,
  defaultMonth,
  onSelectEvent,
  className,
}: MonthCalendarProps) {
  const { locale, messages } = useSkylcn();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const [month, setMonth] = useState(() => {
    const d = defaultMonth ?? new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [direction, setDirection] = useState<-1 | 1>(1);
  const today = iso(new Date());

  const move = (step: -1 | 1) => {
    setDirection(step);
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + step, 1));
  };

  // Monday-first grid covering whole weeks around the month
  const offset = (month.getDay() + 6) % 7;
  const start = new Date(month.getFullYear(), month.getMonth(), 1 - offset);
  const days = Array.from(
    { length: 42 },
    (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  );
  const weeks = days[35]!.getMonth() === month.getMonth() ? 6 : 5;
  const shown = days.slice(0, weeks * 7);
  const byDay = new Map<string, CalendarEvent[]>();
  for (const event of events) byDay.set(event.date, [...(byDay.get(event.date) ?? []), event]);
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 1 + i).toLocaleDateString(tag, { weekday: 'short' }),
  );
  const title = month.toLocaleDateString(tag, { month: 'long', year: 'numeric' });

  const chip = (event: CalendarEvent, block = false): ReactNode => (
    <button
      key={event.id}
      type="button"
      onClick={() => onSelectEvent?.(event)}
      className={cn(
        'truncate rounded border px-1.5 py-0.5 text-left text-2xs outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
        block && 'w-full py-1.5 text-xs',
        TONE[event.tone ?? 'brand'],
      )}
    >
      {event.time ? <span className="tabular-nums opacity-80">{event.time} </span> : null}
      {event.title}
    </button>
  );

  return (
    <div data-slot="month-calendar" className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-2">
        <h2 aria-live="polite" className="text-base font-semibold text-foreground capitalize">
          {title}
        </h2>
        <div className="ml-auto flex gap-1">
          <IconButton
            icon={ChevronLeft}
            label={messages.previousMonth}
            variant="ghost"
            size="icon-sm"
            onClick={() => move(-1)}
          />
          <IconButton
            icon={ChevronRight}
            label={messages.nextMonth}
            variant="ghost"
            size="icon-sm"
            onClick={() => move(1)}
          />
        </div>
      </div>
      <Swap id={iso(month)} direction={direction}>
        <div className="hidden overflow-hidden rounded-xl border border-border md:block">
          <div className="grid grid-cols-7 border-b border-border bg-card">
            {weekdays.map((day) => (
              <span
                key={day}
                className="px-2 py-1.5 text-3xs font-medium tracking-label text-subtle-foreground uppercase"
              >
                {day}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {shown.map((day) => {
              const key = iso(day);
              const inMonth = day.getMonth() === month.getMonth();
              const list = byDay.get(key) ?? [];
              return (
                <div
                  key={key}
                  className={cn(
                    'flex min-h-24 flex-col gap-1 border-r border-b border-border-subtle p-1.5 [&:nth-child(7n)]:border-r-0',
                    !inMonth && 'bg-muted/40',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-6 place-items-center rounded-full text-2xs tabular-nums',
                      key === today
                        ? 'bg-primary text-primary-foreground'
                        : inMonth
                          ? 'text-secondary-foreground'
                          : 'text-faint-foreground',
                    )}
                  >
                    {day.getDate()}
                  </span>
                  {list.slice(0, 2).map((event) => chip(event))}
                  {list.length > 2 ? (
                    <span className="px-1 text-3xs text-subtle-foreground">+{list.length - 2}</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        <ol className="flex flex-col gap-3 md:hidden">
          {shown
            .filter((day) => day.getMonth() === month.getMonth() && byDay.has(iso(day)))
            .map((day) => (
              <li key={iso(day)} className="flex gap-3">
                <span className="w-12 shrink-0 text-center">
                  <span className="block text-lg font-semibold text-foreground tabular-nums">
                    {day.getDate()}
                  </span>
                  <span className="block text-3xs text-subtle-foreground uppercase">
                    {day.toLocaleDateString(tag, { weekday: 'short' })}
                  </span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  {byDay.get(iso(day))!.map((event) => chip(event, true))}
                </span>
              </li>
            ))}
          {shown.some(
            (day) => day.getMonth() === month.getMonth() && byDay.has(iso(day)),
          ) ? null : (
            <li className="py-8 text-center text-xs text-muted-foreground">
              {messages.noEventsThisMonth}
            </li>
          )}
        </ol>
      </Swap>
    </div>
  );
}

export type StatusPageProps = {
  /** A large figure such as 404; leave out for a redirect or other wait. */
  code?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Shows the SKY LAB loader instead of the code, for redirects. */
  loading?: boolean;
  /** Buttons such as "Ana sayfa" or "Yeniden dene". */
  children?: ReactNode;
  /** `div` when shown inside a page that already has its main landmark. */
  as?: 'main' | 'div';
  className?: string;
};

/** A whole-page state: not found, no access, a server error, or a redirect in progress. */
export function StatusPage({
  code,
  title,
  description,
  loading = false,
  children,
  as: Root = 'main',
  className,
}: StatusPageProps) {
  return (
    <Root
      data-slot="status-page"
      role={loading ? 'status' : undefined}
      className={cn(
        'flex min-h-dvh flex-col items-center justify-center gap-5 bg-background px-6 text-center',
        className,
      )}
    >
      <div className="flex enter-rise-lg flex-col items-center gap-5">
        {loading ? (
          <SkylabLoader size={64} />
        ) : code ? (
          <p className="bg-gradient-to-b from-foreground to-subtle-foreground bg-clip-text font-mono text-7xl font-bold text-transparent tabular-nums">
            {code}
          </p>
        ) : null}
        <div className="flex max-w-md flex-col gap-2">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {children ? <div className="flex flex-wrap justify-center gap-2">{children}</div> : null}
      </div>
    </Root>
  );
}
