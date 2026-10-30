'use client';

import {
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { AnimatePresence, m, type Variants } from 'motion/react';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { enUS, tr } from 'react-day-picker/locale';
import { cn } from '../lib/cn.js';
import { motionTokens } from '../lib/motion-tokens.js';
import { useSkylcn } from '../lib/provider.js';
import { useReducedMotion } from '../lib/use-reduced-motion.js';
import { Button } from './button.js';
import { useControlSize, type ControlSize } from './control.js';
import {
  pickerChosen,
  pickerHeader,
  pickerIcon,
  pickerTextButton,
  pickerTrigger,
  rise,
  type PickerVariant,
} from './picker-parts.js';
import { Popover, PopoverContent, PopoverTrigger } from './popover.js';
import { formatTime, parseTime, TimeColumns, type Time } from './time-picker.js';

export type { DateRange };

export type CalendarProps = ComponentProps<typeof DayPicker> & {
  /** Rises the header, then the days, as a picker's panel opens. */
  entrance?: boolean;
};

type View = 'days' | 'months' | 'years' | 'decades';
const LEVELS: readonly View[] = ['days', 'months', 'years', 'decades'];

const navButton =
  'grid size-7 place-items-center rounded-md text-subtle-foreground outline-hidden transition-colors duration-(--motion-duration-fast) hover:bg-accent-strong hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30 pointer-coarse:size-9';
const titleText = 'px-2 py-1 text-sm font-semibold text-foreground capitalize';
const titleButton = cn(
  titleText,
  'rounded-md outline-hidden transition-colors duration-(--motion-duration-fast) hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-ring',
);

/** The days view's height (the weekday row, six weeks and room for a focus ring), which the other views keep. */
const VIEW_SIZE = 'h-[13.625rem] w-63 pointer-coarse:h-[16.625rem] pointer-coarse:w-70';

const DAY_CLASS_NAMES = {
  months: 'relative flex flex-col gap-4 pb-0.5 sm:flex-row',
  month: 'flex flex-col',
  // The header above draws the month; the caption stays for screen readers and to time the slide
  month_caption: 'sr-only',
  month_grid: 'border-collapse',
  weekdays: 'flex',
  weekday:
    'flex h-6 w-9 items-center justify-center text-2xs font-medium tracking-wide text-subtle-foreground uppercase select-none pointer-coarse:w-10',
  week: 'mt-1 flex',
  day: 'w-9 px-0.5 text-center pointer-coarse:w-10',
  day_button: cn(
    'relative z-10 grid h-7 w-full place-items-center rounded-md border border-transparent text-xs text-secondary-foreground tabular-nums outline-hidden pointer-coarse:h-9',
    'transition-colors duration-(--motion-duration-instant) hover:bg-accent-strong hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
  ),
  selected:
    '[&>button]:border-skylab-600/30 [&>button]:bg-skylab-600/20 [&>button]:font-medium [&>button]:text-foreground [&>button]:hover:bg-skylab-600/30',
  // Today is a dot, not a ring; its text steps aside for a chosen day, whatever order the utilities land in
  today: cn(
    "[&>button]:after:absolute [&>button]:after:bottom-0.5 [&>button]:after:left-1/2 [&>button]:after:size-1 [&>button]:after:-translate-x-1/2 [&>button]:after:rounded-full [&>button]:after:bg-skylab-600 [&>button]:after:content-['']",
    '[&:not([data-selected])>button]:font-semibold [&:not([data-selected])>button]:text-foreground',
  ),
  outside: '[&:not([data-selected])>button]:text-faint-foreground',
  disabled: '[&>button]:cursor-not-allowed [&>button]:opacity-40 [&>button]:hover:bg-transparent',
  range_start: 'rounded-l-md bg-skylab-600/15',
  range_middle:
    'bg-skylab-600/15 [&>button]:border-transparent! [&>button]:bg-transparent! [&>button]:font-normal! [&>button]:text-foreground! [&>button]:shadow-none! [&>button]:hover:bg-skylab-600/15!',
  range_end: 'rounded-r-md bg-skylab-600/15',
  hidden: 'invisible',
  weeks_before_enter: 'calendar-weeks-before-enter',
  weeks_before_exit: 'calendar-weeks-before-exit',
  weeks_after_enter: 'calendar-weeks-after-enter',
  weeks_after_exit: 'calendar-weeks-after-exit',
  caption_before_enter: 'calendar-caption-enter',
  caption_after_enter: 'calendar-caption-enter',
  caption_before_exit: 'calendar-caption-exit',
  caption_after_exit: 'calendar-caption-exit',
};

const firstOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const addMonths = (date: Date, n: number) => new Date(date.getFullYear(), date.getMonth() + n, 1);

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
 * PageDown by month, and months glide in from the side they come from. The
 * title opens the months of that year, then its decade's years, then the
 * century's decades, for dates far away; each level slides up over the last.
 */
export function Calendar({
  className,
  classNames,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  entrance = false,
  ...props
}: CalendarProps) {
  const { locale, messages } = useSkylcn();
  const reduced = useReducedMotion();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const [view, setView] = useState<View>('days');
  const [direction, setDirection] = useState<1 | -1>(1);
  const [innerMonth, setInnerMonth] = useState(() =>
    firstOfMonth(
      monthProp ??
        defaultMonth ??
        selectedDates('selected' in props ? props.selected : undefined)[0] ??
        new Date(),
    ),
  );
  const titleRef = useRef<HTMLButtonElement>(null);
  const backToDays = useRef(false);
  const month = monthProp ?? innerMonth;
  const count = props.numberOfMonths ?? 1;
  const locked = Boolean(props.disableNavigation);

  const changeMonth = (next: Date) => {
    setInnerMonth(next);
    onMonthChange?.(next);
  };
  const go = (next: View) => {
    setDirection(LEVELS.indexOf(next) > LEVELS.indexOf(view) ? 1 : -1);
    backToDays.current = next === 'days';
    setView(next);
  };

  // Back from the months, keyboard focus lands on the title it left from
  useEffect(() => {
    if (view !== 'days' || !backToDays.current) return;
    backToDays.current = false;
    titleRef.current?.focus();
  }, [view]);

  const monthTitle = (date: Date) =>
    date.toLocaleDateString(tag, { month: 'long', year: 'numeric' });
  const year = month.getFullYear();
  const shiftYears = (years: number) => changeMonth(new Date(year + years, month.getMonth(), 1));
  const step = props.pagedNavigation ? count : 1;
  const last = addMonths(month, count - 1);
  const header = {
    days: {
      title: count > 1 ? `${monthTitle(month)} – ${monthTitle(last)}` : monthTitle(month),
      prev: () => changeMonth(addMonths(month, -step)),
      next: () => changeMonth(addMonths(month, step)),
      labels: [messages.previousMonth, messages.nextMonth],
      up: 'months' as View,
      upLabel: messages.chooseMonth,
      prevOff: Boolean(props.startMonth && month <= firstOfMonth(props.startMonth)),
      nextOff: Boolean(props.endMonth && last >= firstOfMonth(props.endMonth)),
    },
    months: {
      title: String(year),
      prev: () => shiftYears(-1),
      next: () => shiftYears(1),
      labels: [messages.previousYear, messages.nextYear],
      up: 'years' as View,
      upLabel: messages.chooseYear,
      prevOff: false,
      nextOff: false,
    },
    years: {
      title: `${Math.floor(year / 10) * 10}–${Math.floor(year / 10) * 10 + 9}`,
      prev: () => shiftYears(-10),
      next: () => shiftYears(10),
      labels: [messages.previousDecade, messages.nextDecade],
      up: 'decades' as View,
      upLabel: messages.chooseDecade,
      prevOff: false,
      nextOff: false,
    },
    decades: {
      title: `${Math.floor(year / 100) * 100}–${Math.floor(year / 100) * 100 + 99}`,
      prev: () => shiftYears(-100),
      next: () => shiftYears(100),
      labels: [messages.previousCentury, messages.nextCentury],
      up: null,
      upLabel: '',
      prevOff: false,
      nextOff: false,
    },
  }[view];
  const Prev = view === 'days' ? ChevronLeft : ChevronsLeft;
  const Next = view === 'days' ? ChevronRight : ChevronsRight;
  // In the days view the hidden caption announces the month; the other views announce here
  const live = view === 'days' ? undefined : 'polite';

  const blur = reduced ? 'blur(0px)' : 'blur(4px)';
  const travel = motionTokens.shift * 6;
  const levels: Variants = {
    enter: (dir: number) => ({ y: dir * travel, opacity: 0, scale: 0.98, filter: blur }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] },
      transitionEnd: { filter: 'none' },
    },
    exit: (dir: number) => ({
      y: dir * -travel,
      opacity: 0,
      scale: 0.98,
      filter: blur,
      transition: { duration: 0.2, ease: 'easeIn' },
    }),
  };

  return (
    <div data-slot="calendar" className={cn('flex w-fit flex-col gap-2 text-xs', className)}>
      <div
        className={cn(pickerHeader, entrance && 'enter-rise-blur')}
        style={entrance ? rise(1) : undefined}
      >
        <button
          type="button"
          aria-label={header.labels[0]}
          disabled={locked || header.prevOff}
          onClick={header.prev}
          className={navButton}
        >
          <Prev className="size-4" />
        </button>
        {header.up && !locked ? (
          <button
            ref={titleRef}
            type="button"
            onClick={() => go(header.up!)}
            className={titleButton}
          >
            <span aria-live={live}>{header.title}</span>
            <span className="sr-only">, {header.upLabel}</span>
          </button>
        ) : (
          <span aria-live={live} className={titleText}>
            {header.title}
          </span>
        )}
        <button
          type="button"
          aria-label={header.labels[1]}
          disabled={locked || header.nextOff}
          onClick={header.next}
          className={navButton}
        >
          <Next className="size-4" />
        </button>
      </div>
      <div
        className={cn('relative overflow-hidden', entrance && 'enter-rise-blur')}
        style={entrance ? rise(2) : undefined}
      >
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <m.div
            key={view}
            custom={direction}
            variants={levels}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {view === 'days' ? (
              <DayPicker
                locale={locale === 'tr' ? tr : enUS}
                showOutsideDays
                fixedWeeks
                hideNavigation
                // A month left mid-slide waits for an animationend that may never come, so reduced motion skips it
                animate={!reduced}
                month={month}
                onMonthChange={changeMonth}
                formatters={{
                  formatWeekdayName: (day) => day.toLocaleDateString(tag, { weekday: 'short' }),
                }}
                classNames={{ ...DAY_CLASS_NAMES, ...classNames }}
                {...props}
              />
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
        </AnimatePresence>
      </div>
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
  const { locale } = useSkylcn();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const cellsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const year = month.getFullYear();
  const today = new Date();

  let cells: Cell[];
  let step: number;
  let into: View;
  if (view === 'months') {
    cells = Array.from({ length: 12 }, (_, i) => ({
      key: `m${i}`,
      label: new Date(year, i, 1).toLocaleDateString(tag, { month: 'long' }),
      start: new Date(year, i, 1),
      end: new Date(year, i + 1, 0),
      outside: false,
    }));
    step = 1;
    into = 'days';
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
    step = 10;
    into = 'months';
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
    step = 100;
    into = 'years';
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
    <div
      className={cn('grid grid-cols-3 grid-rows-4 gap-2 p-0.5', VIEW_SIZE)}
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
              'relative rounded-md border px-1 text-xs capitalize tabular-nums outline-hidden',
              'transition-colors duration-(--motion-duration-instant) focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40',
              chosen
                ? cn(pickerChosen, 'hover:bg-skylab-600/30')
                : 'border-transparent font-medium hover:bg-accent-strong',
              !chosen && (cell.outside ? 'text-subtle-foreground' : 'text-secondary-foreground'),
              within(cell, today) &&
                "after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-skylab-600 after:content-['']",
              !chosen && within(cell, today) && 'text-foreground',
            )}
          >
            {cell.label}
          </button>
        );
      })}
    </div>
  );
}

function useDateFormat() {
  const { locale } = useSkylcn();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  return (date: Date) =>
    date.toLocaleDateString(tag, { day: 'numeric', month: 'long', year: 'numeric' });
}

/** A pill's short form: the day and short month, the year only when it is not this one, and the time if asked. */
function useShortFormat() {
  const { locale } = useSkylcn();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  return (date: Date, withTime = false) =>
    date.toLocaleString(tag, {
      day: 'numeric',
      month: 'short',
      ...(date.getFullYear() === new Date().getFullYear() ? {} : { year: 'numeric' }),
      ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    });
}

type TriggerProps = {
  /** The field's size: sm 32px, md 36px (the default) or lg 38px. */
  size?: ControlSize;
  /** `pill` is the compact 26px trigger of a dense row, with the date written short. */
  variant?: PickerVariant;
};

export type DatePickerProps = TriggerProps & {
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

const startOfDay = (date: Date) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
};

/**
 * A field that opens a calendar and closes once a day is picked; Today and Clear
 * sit under the calendar.
 */
export function DatePicker({
  value,
  onValueChange,
  placeholder,
  min,
  max,
  size: sizeProp,
  variant = 'box',
  className,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const format = useDateFormat();
  const short = useShortFormat();
  const size = useControlSize(sizeProp);
  const { messages } = useSkylcn();
  const today = startOfDay(new Date());
  const todayOff =
    (min !== undefined && today < startOfDay(min)) ||
    (max !== undefined && today > startOfDay(max));
  const choose = (day: Date | null) => {
    onValueChange(day);
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={props.id}
        aria-label={props['aria-label']}
        data-size={variant === 'pill' ? undefined : size}
        className={cn(pickerTrigger(size, variant), className)}
      >
        <CalendarDays className={pickerIcon(size, variant)} />
        <span className={cn('truncate', !value && 'text-subtle-foreground')}>
          {value
            ? variant === 'pill'
              ? short(value)
              : format(value)
            : (placeholder ?? messages.pickDate)}
        </span>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        aria-label={props['aria-label'] ?? messages.pickDate}
        className="w-auto p-3"
      >
        <Calendar
          entrance
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
        <div
          className="mt-2 flex enter-rise-blur items-center justify-between gap-2 border-t border-border-subtle pt-2"
          style={rise(3)}
        >
          <button
            type="button"
            disabled={todayOff}
            onClick={() => choose(today)}
            className={pickerTextButton}
          >
            {messages.today}
          </button>
          {value ? (
            <button type="button" onClick={() => choose(null)} className={pickerTextButton}>
              {messages.clear}
            </button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export type DateTimePickerProps = TriggerProps & {
  value: Date | null;
  onValueChange: (value: Date | null) => void;
  placeholder?: string;
  /** The time a newly picked day gets, as HH:MM; 18:00, when club events usually start. */
  defaultTime?: string;
  /** How far apart the offered minutes are; five by default. */
  minuteStep?: number;
  /** Days before and after these cannot be picked. */
  min?: Date;
  max?: Date;
  'aria-label'?: string;
  id?: string;
  className?: string;
};

function atTime(day: Date, time: Time) {
  const next = new Date(day);
  next.setHours(time.hour, time.minute, 0, 0);
  return next;
}

/**
 * A day and a time in one field, such as when an event starts: the calendar
 * with an hours and a minutes column beside it. Picking a day keeps the panel
 * open so the time can follow; Done closes it.
 */
export function DateTimePicker({
  value,
  onValueChange,
  placeholder,
  defaultTime = '18:00',
  minuteStep = 5,
  min,
  max,
  size: sizeProp,
  variant = 'box',
  className,
  ...props
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [draftTime, setDraftTime] = useState<Time>(
    () => parseTime(defaultTime) ?? { hour: 18, minute: 0 },
  );
  const { locale, messages } = useSkylcn();
  const short = useShortFormat();
  const size = useControlSize(sizeProp);
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const time: Time = value ? { hour: value.getHours(), minute: value.getMinutes() } : draftTime;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={props.id}
        aria-label={props['aria-label']}
        data-size={variant === 'pill' ? undefined : size}
        className={cn(pickerTrigger(size, variant), className)}
      >
        <CalendarClock className={pickerIcon(size, variant)} />
        <span className={cn('truncate', !value && 'text-subtle-foreground')}>
          {value
            ? variant === 'pill'
              ? short(value, true)
              : value.toLocaleString(tag, {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
            : (placeholder ?? messages.pickDateTime)}
        </span>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        aria-label={props['aria-label'] ?? messages.pickDateTime}
        className="w-auto p-3"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Calendar
            entrance
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
          <div
            className="flex enter-rise-blur flex-col gap-2 border-t border-border-subtle pt-3 sm:w-32 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3"
            style={rise(2)}
          >
            <div
              className={cn(
                pickerHeader,
                'justify-center text-sm font-semibold text-foreground tabular-nums',
              )}
            >
              <span className="sr-only">{messages.time} </span>
              {formatTime(time)}
            </div>
            <TimeColumns
              value={time}
              onChange={(next) => {
                if (value) onValueChange(atTime(value, next));
                else setDraftTime(next);
              }}
              minuteStep={minuteStep}
              // Ends level with the last week of the month grid beside it
              className="h-32 sm:h-[13.5rem] pointer-coarse:sm:h-[16.5rem]"
            />
          </div>
        </div>
        <div
          className="mt-2 flex enter-rise-blur items-center justify-end border-t border-border-subtle pt-2"
          style={rise(3)}
        >
          <Button size="sm" variant="primary" onClick={() => setOpen(false)}>
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
  /** The field's size: sm 32px, md 36px (the default) or lg 38px. */
  size?: ControlSize;
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
  size: sizeProp,
  className,
  ...props
}: DateRangePickerProps) {
  const { locale, messages } = useSkylcn();
  const [open, setOpen] = useState(false);
  const format = useDateFormat();
  const size = useControlSize(sizeProp);
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
        data-size={size}
        className={cn(pickerTrigger(size, 'box'), className)}
      >
        <CalendarDays className={pickerIcon(size, 'box')} />
        <span className={cn('truncate', !value?.from && 'text-subtle-foreground')}>{label}</span>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        aria-label={props['aria-label'] ?? messages.pickRange}
        className="flex w-auto flex-col gap-3 p-3 sm:flex-row"
      >
        <ul
          className="flex enter-rise-blur flex-row flex-wrap gap-1 sm:w-32 sm:flex-col"
          style={rise(1)}
        >
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
        <div className="border-t border-border-subtle pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3">
          <Calendar
            entrance
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
