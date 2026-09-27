'use client';

import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { enUS, tr } from 'react-day-picker/locale';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { Popover, PopoverContent, PopoverTrigger } from './popover.js';

export type { DateRange };

export type CalendarProps = ComponentProps<typeof DayPicker>;

/**
 * A month grid for picking a day or a range, in the reader's language with
 * weeks starting on Monday for Turkish. Arrow keys move by day, PageUp and
 * PageDown by month.
 */
export function Calendar({ className, classNames, ...props }: CalendarProps) {
  const { locale } = useSkylcn();
  return (
    <DayPicker
      locale={locale === 'tr' ? tr : enUS}
      showOutsideDays
      className={cn('w-fit p-1 text-xs', className)}
      classNames={{
        months: 'relative flex flex-col gap-4 sm:flex-row',
        month: 'flex flex-col gap-3',
        month_caption: 'flex h-8 items-center justify-center',
        caption_label: 'text-sm font-medium text-foreground',
        nav: 'absolute inset-x-0 top-0 flex h-8 items-center justify-between',
        button_previous:
          'grid size-8 place-items-center rounded-md text-subtle-foreground outline-hidden hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30',
        button_next:
          'grid size-8 place-items-center rounded-md text-subtle-foreground outline-hidden hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30',
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
        disabled: 'opacity-40 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent',
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
      }}
      {...props}
    />
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
          onSelect={(day) => {
            onValueChange(day ?? null);
            if (day) setOpen(false);
          }}
        />
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
