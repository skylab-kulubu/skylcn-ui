'use client';

import { CalendarClock, CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { m } from 'motion/react';
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
} from 'react';
import { DayPicker, type DateRange, type MonthCaptionProps } from 'react-day-picker';
import { enUS, tr } from 'react-day-picker/locale';
import { cn } from '../lib/cn.js';
import { transitions } from '../lib/motion-tokens.js';
import { useSkylcn } from '../lib/provider.js';
import { Button } from './button.js';
import { Popover, PopoverContent, PopoverTrigger } from './popover.js';

export type { DateRange };

export type CalendarProps = ComponentProps<typeof DayPicker>;

type View = 'days' | 'months' | 'years' | 'decades';
const LEVELS: readonly View[] = ['days', 'months', 'years', 'decades'];

const navButton =
  'grid size-8 place-items-center rounded-md text-subtle-foreground outline-hidden hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30';
const titleButton =
  'relative z-10 inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm font-medium text-foreground outline-hidden transition-colors duration-(--motion-duration-fast) hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring';

const ZoomContext = createContext<{ zoomOut: () => void; focusCaption: boolean } | null>(null);

/** The month title turned into the way up to months, years and decades. */
function MonthCaption({ calendarMonth, displayIndex, children, ...rest }: MonthCaptionProps) {
  const zoom = useContext(ZoomContext);
  const { messages } = useSkylcn();
  return (
    <div {...rest}>
      <button
        type="button"
        ref={(el) => {
          if (el && zoom?.focusCaption && displayIndex === 0) el.focus();
        }}
        onClick={() => zoom?.zoomOut()}
        className={titleButton}
      >
        {children}
        <span className="sr-only">, {messages.chooseMonth}</span>
        <ChevronDown className="size-3.5 text-subtle-foreground" aria-hidden />
      </button>
    </div>
  );
}

const firstOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

function selectedDates(selected: unknown): Date[] {
  if (selected instanceof Date) return [selected];
  if (Array.isArray(selected)) return selected.filter((d): d is Date => d instanceof Date);
  if (selected && typeof selected === 'object') {
    const { from, to } = selected as DateRange;
    return [from, to].filter((d): d is Date => d instanceof Date);
  }
  return [];
}

type Cell = { key: string; label: string; start: Date; end: Date; outside: boolean };

/**
 * A month grid for picking a day or a range, in the reader's language with
 * weeks starting on Monday for Turkish. Arrow keys move by day, PageUp and
 * PageDown by month. The title opens the months of that year, then its
 * decade's years, then the century's decades, for dates far away.
 */
export function Calendar({
  className,
  classNames,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  ...props
}: CalendarProps) {
  const { locale } = useSkylcn();
  const [view, setView] = useState<View>('days');
  const [direction, setDirection] = useState<1 | -1>(1);
  const [focusTarget, setFocusTarget] = useState(false);
  const [innerMonth, setInnerMonth] = useState(() =>
    firstOfMonth(
      monthProp ??
        defaultMonth ??
        selectedDates('selected' in props ? props.selected : undefined)[0] ??
        new Date(),
    ),
  );
  const month = monthProp ?? innerMonth;
  const changeMonth = (next: Date) => {
    setInnerMonth(next);
    onMonthChange?.(next);
  };
  const go = (next: View) => {
    setDirection(LEVELS.indexOf(next) > LEVELS.indexOf(view) ? 1 : -1);
    setFocusTarget(true);
    setView(next);
  };

  return (
    <div data-slot="calendar" className={cn('w-fit overflow-hidden p-1 text-xs', className)}>
      <m.div
        key={view}
        initial={{ opacity: 0, scale: direction > 0 ? 1.06 : 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={transitions.enter}
      >
        {view === 'days' ? (
          <ZoomContext.Provider value={{ zoomOut: () => go('months'), focusCaption: focusTarget }}>
            <DayPicker
              locale={locale === 'tr' ? tr : enUS}
              showOutsideDays
              month={month}
              onMonthChange={changeMonth}
              classNames={{
                months: 'relative flex flex-col gap-4 sm:flex-row',
                month: 'flex flex-col gap-3',
                month_caption: 'flex h-8 items-center justify-center',
                caption_label: 'text-sm font-medium text-foreground',
                // Only the arrows take clicks, so the title between them stays pressable
                nav: 'pointer-events-none absolute inset-x-0 top-0 z-20 flex h-8 items-center justify-between',
                button_previous: cn(navButton, 'pointer-events-auto'),
                button_next: cn(navButton, 'pointer-events-auto'),
                month_grid: 'border-collapse',
                weekdays: 'flex',
                weekday:
                  'w-9 pb-1 text-center text-3xs font-medium tracking-wide text-subtle-foreground uppercase',
                week: 'mt-0.5 flex',
                day: 'group/day relative size-9 p-0 text-center pointer-coarse:size-10',
                day_button: cn(
                  'relative z-10 grid size-9 place-items-center rounded-md text-secondary-foreground tabular-nums outline-hidden pointer-coarse:size-10',
                  'transition-colors duration-(--motion-duration-instant) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
                  'group-data-[selected=true]/day:bg-primary group-data-[selected=true]/day:text-primary-foreground group-data-[selected=true]/day:hover:bg-primary',
                ),
                today:
                  "after:absolute after:bottom-1.5 after:left-1/2 after:z-20 after:h-0.5 after:w-3 after:-translate-x-1/2 after:rounded-full after:bg-skylab-400 after:content-['']",
                outside: 'text-faint-foreground [&>button]:text-faint-foreground',
                disabled:
                  'opacity-40 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent',
                range_start: 'rounded-l-md bg-skylab-500/15',
                range_middle:
                  'bg-skylab-500/15 [&>button]:bg-transparent! [&>button]:text-foreground! [&>button]:hover:bg-skylab-500/10!',
                range_end: 'rounded-r-md bg-skylab-500/15',
                hidden: 'invisible',
                ...classNames,
              }}
              components={{
                Chevron: ({ orientation }) =>
                  orientation === 'left' ? (
                    <ChevronLeft className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  ),
                MonthCaption,
              }}
              {...props}
            />
          </ZoomContext.Provider>
        ) : (
          <PeriodGrid
            view={view}
            month={month}
            selected={selectedDates('selected' in props ? props.selected : undefined)}
            startMonth={props.startMonth}
            endMonth={props.endMonth}
            onMonth={changeMonth}
            onView={go}
          />
        )}
      </m.div>
    </div>
  );
}

/** Months of a year, years of a decade or decades of a century, three to a row. */
function PeriodGrid({
  view,
  month,
  selected,
  startMonth,
  endMonth,
  onMonth,
  onView,
}: {
  view: Exclude<View, 'days'>;
  month: Date;
  selected: readonly Date[];
  startMonth?: Date;
  endMonth?: Date;
  onMonth: (month: Date) => void;
  onView: (view: View) => void;
}) {
  const { locale, messages } = useSkylcn();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const cellsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const year = month.getFullYear();
  const today = new Date();

  let cells: Cell[];
  let title: string;
  let step: number;
  let prev: string;
  let next: string;
  let up: View | null;
  let into: View;
  if (view === 'months') {
    cells = Array.from({ length: 12 }, (_, i) => ({
      key: `m${i}`,
      label: new Date(year, i, 1).toLocaleDateString(tag, { month: 'long' }),
      start: new Date(year, i, 1),
      end: new Date(year, i + 1, 0),
      outside: false,
    }));
    title = String(year);
    step = 1;
    [prev, next, up, into] = [messages.previousYear, messages.nextYear, 'years', 'days'];
  } else if (view === 'years') {
    const first = Math.floor(year / 10) * 10;
    cells = Array.from({ length: 12 }, (_, i) => {
      const y = first - 1 + i;
      return {
        key: `y${y}`,
        label: String(y),
        start: new Date(y, 0, 1),
        end: new Date(y, 11, 31),
        outside: i === 0 || i === 11,
      };
    });
    title = `${first}–${first + 9}`;
    step = 10;
    [prev, next, up, into] = [messages.previousDecade, messages.nextDecade, 'decades', 'months'];
  } else {
    const first = Math.floor(year / 100) * 100;
    cells = Array.from({ length: 12 }, (_, i) => {
      const d = first - 10 + i * 10;
      return {
        key: `d${d}`,
        label: `${d}–${d + 9}`,
        start: new Date(d, 0, 1),
        end: new Date(d + 9, 11, 31),
        outside: i === 0 || i === 11,
      };
    });
    title = `${first}–${first + 99}`;
    step = 100;
    [prev, next, up, into] = [messages.previousCentury, messages.nextCentury, null, 'years'];
  }

  const within = (cell: Cell, date: Date) => date >= cell.start && date <= cell.end;
  const disabled = (cell: Cell) =>
    Boolean(
      (startMonth && cell.end < firstOfMonth(startMonth)) ||
      (endMonth && cell.start > new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0)),
    );
  const current =
    view === 'months'
      ? month.getMonth()
      : cells.findIndex((cell, i) => i > 0 && i < 11 && within(cell, month));

  // Keyboard focus lands on the period the calendar is showing
  useEffect(() => {
    cellsRef.current[current]?.focus();
  }, [current, view]);

  const shift = (years: number) => onMonth(new Date(year + years, month.getMonth(), 1));
  const pick = (cell: Cell) => {
    onMonth(
      view === 'months' ? cell.start : new Date(cell.start.getFullYear(), month.getMonth(), 1),
    );
    onView(into);
  };

  return (
    <div className="flex w-[15.75rem] flex-col gap-3 pointer-coarse:w-[17.5rem]">
      <div className="flex h-8 items-center justify-between">
        <button type="button" aria-label={prev} onClick={() => shift(-step)} className={navButton}>
          <ChevronLeft className="size-4" />
        </button>
        {up ? (
          <button type="button" onClick={() => onView(up)} className={titleButton}>
            <span aria-live="polite">{title}</span>
            <span className="sr-only">
              , {up === 'years' ? messages.chooseYear : messages.chooseDecade}
            </span>
            <ChevronDown className="size-3.5 text-subtle-foreground" aria-hidden />
          </button>
        ) : (
          <span aria-live="polite" className="text-sm font-medium text-foreground">
            {title}
          </span>
        )}
        <button type="button" aria-label={next} onClick={() => shift(step)} className={navButton}>
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div
        className="grid grid-cols-3 gap-1"
        onKeyDown={(event) => {
          const i = cellsRef.current.indexOf(document.activeElement as HTMLButtonElement);
          if (i < 0) return;
          const moves: Record<string, number> = {
            ArrowLeft: -1,
            ArrowRight: 1,
            ArrowUp: -3,
            ArrowDown: 3,
          };
          if (event.key in moves) {
            event.preventDefault();
            cellsRef.current[Math.min(11, Math.max(0, i + moves[event.key]!))]?.focus();
          } else if (event.key === 'PageUp' || event.key === 'PageDown') {
            event.preventDefault();
            shift(event.key === 'PageUp' ? -step : step);
          }
        }}
      >
        {cells.map((cell, i) => {
          const chosen = selected.some((date) => within(cell, date));
          return (
            <button
              key={cell.key}
              ref={(el) => {
                cellsRef.current[i] = el;
              }}
              type="button"
              disabled={disabled(cell)}
              aria-pressed={chosen}
              tabIndex={i === current ? 0 : -1}
              onClick={() => pick(cell)}
              className={cn(
                'relative h-14 rounded-md px-1 text-xs capitalize tabular-nums outline-hidden pointer-coarse:h-16',
                'transition-colors duration-(--motion-duration-instant) focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40',
                chosen
                  ? 'bg-primary text-primary-foreground'
                  : cell.outside
                    ? 'text-subtle-foreground hover:bg-accent hover:text-foreground'
                    : 'text-secondary-foreground hover:bg-accent hover:text-foreground',
                within(cell, today) &&
                  "after:absolute after:bottom-2 after:left-1/2 after:h-0.5 after:w-3 after:-translate-x-1/2 after:rounded-full after:bg-skylab-400 after:content-['']",
              )}
            >
              {cell.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function useDateFormat() {
  const { locale } = useSkylcn();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  return (date: Date) =>
    date.toLocaleDateString(tag, { day: 'numeric', month: 'long', year: 'numeric' });
}

const triggerClass = cn(
  'flex h-9 w-full items-center gap-2 rounded-md border border-input bg-input-background px-2.5 text-left text-xs text-foreground outline-hidden',
  'transition-[border-color] duration-(--motion-duration-fast) hover:border-border-strong focus-visible:border-skylab-400/50 focus-visible:ring-2 focus-visible:ring-skylab-400/20',
  'data-popup-open:border-skylab-400/50 pointer-coarse:h-11 pointer-coarse:text-base',
);

export type DatePickerProps = {
  value: Date | null;
  onValueChange: (value: Date | null) => void;
  placeholder?: string;
  /** Days before and after these cannot be picked. */
  min?: Date;
  max?: Date;
  'aria-label'?: string;
  id?: string;
  className?: string;
};

/** A field that opens a calendar and closes once a day is picked. */
export function DatePicker({
  value,
  onValueChange,
  placeholder,
  min,
  max,
  className,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const format = useDateFormat();
  const { messages } = useSkylcn();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={props.id}
        aria-label={props['aria-label']}
        className={cn(triggerClass, className)}
      >
        <CalendarDays className="size-3.5 shrink-0 text-subtle-foreground" />
        <span className={cn('truncate', !value && 'text-subtle-foreground')}>
          {value ? format(value) : (placeholder ?? messages.pickDate)}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          defaultMonth={value ?? undefined}
          disabled={[...(min ? [{ before: min }] : []), ...(max ? [{ after: max }] : [])]}
          startMonth={min}
          endMonth={max}
          onSelect={(day) => {
            onValueChange(day ?? null);
            if (day) setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export type DateTimePickerProps = {
  value: Date | null;
  onValueChange: (value: Date | null) => void;
  placeholder?: string;
  /** The time a newly picked day gets, as HH:MM; 18:00, when club events usually start. */
  defaultTime?: string;
  /** Days before and after these cannot be picked. */
  min?: Date;
  max?: Date;
  'aria-label'?: string;
  id?: string;
  className?: string;
};

const pad = (n: number) => String(n).padStart(2, '0');

function atTime(day: Date, time: string) {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  const next = new Date(day);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

/**
 * A day and a time in one field, such as when an event starts. Picking a day
 * keeps the calendar open so the time can follow; Done closes it.
 */
export function DateTimePicker({
  value,
  onValueChange,
  placeholder,
  defaultTime = '18:00',
  min,
  max,
  className,
  ...props
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [draftTime, setDraftTime] = useState(defaultTime);
  const { locale, messages } = useSkylcn();
  const timeId = useId();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const time = value ? `${pad(value.getHours())}:${pad(value.getMinutes())}` : draftTime;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={props.id}
        aria-label={props['aria-label']}
        className={cn(triggerClass, className)}
      >
        <CalendarClock className="size-3.5 shrink-0 text-subtle-foreground" />
        <span className={cn('truncate', !value && 'text-subtle-foreground')}>
          {value
            ? value.toLocaleString(tag, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : (placeholder ?? messages.pickDateTime)}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          defaultMonth={value ?? undefined}
          disabled={[...(min ? [{ before: min }] : []), ...(max ? [{ after: max }] : [])]}
          startMonth={min}
          endMonth={max}
          onSelect={(day) => {
            if (day) onValueChange(atTime(day, time));
          }}
        />
        <div className="mt-2 flex items-center gap-2 border-t border-border-subtle px-1 pt-2">
          <label htmlFor={timeId} className="text-2xs text-subtle-foreground">
            {messages.time}
          </label>
          {/* A plain input: Base UI's would join the Field around the picker and take its label */}
          <input
            id={timeId}
            type="time"
            value={time}
            onChange={(event) => {
              const next = event.target.value;
              if (!next) return;
              if (value) onValueChange(atTime(value, next));
              else setDraftTime(next);
            }}
            className="h-7 w-28 rounded-md border border-input bg-input-background px-2 text-xs text-foreground tabular-nums outline-hidden hover:border-border-strong focus-visible:border-skylab-400/50 focus-visible:ring-2 focus-visible:ring-skylab-400/20 pointer-coarse:h-9 pointer-coarse:text-base"
          />
          <Button size="sm" variant="primary" className="ml-auto" onClick={() => setOpen(false)}>
            {messages.done}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export type DatePreset = { label: string; range: () => DateRange };

export type DateRangePickerProps = {
  value: DateRange | undefined;
  onValueChange: (value: DateRange | undefined) => void;
  /** Ready ranges listed before the calendar, such as the last 30 days. */
  presets?: readonly DatePreset[];
  placeholder?: string;
  'aria-label'?: string;
  className?: string;
};

const daysAgo = (n: number) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - n);
  return date;
};

/** Last 7, 30 and 90 days, ending today. */
export function defaultDatePresets(locale: 'tr' | 'en'): DatePreset[] {
  const today = () => daysAgo(0);
  return [7, 30, 90].map((n) => ({
    label: locale === 'tr' ? `Son ${n} gün` : `Last ${n} days`,
    range: () => ({ from: daysAgo(n - 1), to: today() }),
  }));
}

/**
 * A from–to range with ready presets first, since nobody should fight a grid
 * for "the last 30 days"; the calendar is there for anything else.
 */
export function DateRangePicker({
  value,
  onValueChange,
  presets,
  placeholder,
  className,
  ...props
}: DateRangePickerProps) {
  const { locale, messages } = useSkylcn();
  const [open, setOpen] = useState(false);
  const format = useDateFormat();
  const list = presets ?? defaultDatePresets(locale);
  const label = value?.from
    ? value.to
      ? `${format(value.from)} – ${format(value.to)}`
      : format(value.from)
    : (placeholder ?? messages.pickRange);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={props['aria-label'] ? `${props['aria-label']}, ${label}` : undefined}
        className={cn(triggerClass, className)}
      >
        <CalendarDays className="size-3.5 shrink-0 text-subtle-foreground" />
        <span className={cn('truncate', !value?.from && 'text-subtle-foreground')}>{label}</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-auto flex-col gap-2 p-2 sm:flex-row">
        <ul className="flex flex-row flex-wrap gap-1 sm:w-32 sm:flex-col">
          {list.map((preset) => (
            <li key={preset.label}>
              <button
                type="button"
                onClick={() => {
                  onValueChange(preset.range());
                  setOpen(false);
                }}
                className="w-full rounded-md px-2 py-1.5 text-left text-xs text-secondary-foreground outline-hidden hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {preset.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-border-subtle pt-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-2">
          <Calendar
            mode="range"
            selected={value}
            defaultMonth={value?.from}
            onSelect={onValueChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
