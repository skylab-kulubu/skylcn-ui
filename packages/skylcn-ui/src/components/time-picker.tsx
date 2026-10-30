'use client';

import { Clock } from 'lucide-react';
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { Button } from './button.js';
import { useControlSize, type ControlSize } from './control.js';
import {
  pad,
  pickerChosen,
  pickerHeader,
  pickerIcon,
  pickerTextButton,
  pickerTrigger,
  rise,
  type PickerVariant,
} from './picker-parts.js';
import { Popover, PopoverContent, PopoverTrigger } from './popover.js';

export type Time = { hour: number; minute: number };

/** Reads HH:MM on a 24-hour clock; anything else is no time. */
export function parseTime(text: string | null | undefined): Time | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(text ?? '');
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return hour < 24 && minute < 60 ? { hour, minute } : null;
}

export const formatTime = ({ hour, minute }: Time) => `${pad(hour)}:${pad(minute)}`;

/** Now, rounded to the nearest minute on offer. */
function nowRounded(step: number): Time {
  const now = new Date();
  const total = now.getHours() * 60 + Math.round(now.getMinutes() / step) * step;
  return { hour: Math.floor(total / 60) % 24, minute: total % 60 };
}

/** Minutes `step` apart, plus the current one when it falls between them, so it stays visible. */
function minutesOffered(step: number, current: number) {
  const safe = Math.min(30, Math.max(1, Math.round(step)));
  const list = Array.from({ length: Math.ceil(60 / safe) }, (_, i) => i * safe);
  return list.includes(current) ? list : [...list, current].sort((a, b) => a - b);
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

function TimeColumn({
  label,
  values,
  value,
  onSelect,
  onCommit,
  listRef,
  className,
}: {
  label: string;
  values: readonly number[];
  value: number;
  onSelect: (value: number) => void;
  onCommit?: () => void;
  listRef?: RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  const id = useId();
  const ownRef = useRef<HTMLDivElement>(null);
  const ref = listRef ?? ownRef;
  const index = values.indexOf(value);

  // Opening, the chosen value sits in the middle of its column; scrollTop moves only the column, never the page
  useLayoutEffect(() => {
    const list = ref.current;
    const option = list?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (list && option) {
      list.scrollTop = option.offsetTop - (list.clientHeight - option.offsetHeight) / 2;
    }
  }, [ref]);

  const reveal = (next: number) => {
    const list = ref.current;
    const option = list?.querySelector<HTMLElement>(`[data-value="${next}"]`);
    if (!list || !option) return;
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onCommit?.();
      return;
    }
    const last = values.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      PageDown: index + 4,
      PageUp: index - 4,
      Home: 0,
      End: last,
    };
    const target = moves[event.key];
    if (target === undefined) return;
    event.preventDefault();
    const next = values[Math.min(last, Math.max(0, target))]!;
    onSelect(next);
    reveal(next);
  };

  return (
    <div
      ref={ref}
      role="listbox"
      tabIndex={0}
      aria-label={label}
      aria-activedescendant={`${id}-${value}`}
      onKeyDown={onKeyDown}
      className={cn(
        // No box: the column fades out at both ends to show it scrolls
        'relative scrollbar-hidden overflow-y-auto rounded-md px-1.5 py-1 outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
        'mask-[linear-gradient(to_bottom,transparent,black_1.25rem,black_calc(100%-1.25rem),transparent)]',
        className,
      )}
    >
      {values.map((option) => {
        const chosen = option === value;
        return (
          <div
            key={option}
            id={`${id}-${option}`}
            role="option"
            aria-selected={chosen}
            data-value={option}
            onClick={() => onSelect(option)}
            className={cn(
              'cursor-default rounded-md border border-transparent px-1.5 py-1 text-center text-xs tabular-nums select-none pointer-coarse:py-2',
              'transition-colors duration-(--motion-duration-instant)',
              chosen
                ? pickerChosen
                : 'text-secondary-foreground hover:bg-accent-strong hover:text-foreground',
            )}
          >
            {pad(option)}
          </div>
        );
      })}
    </div>
  );
}

/** An hours and a minutes column, each a listbox: arrows, Page keys and Home/End move, Enter commits. */
export function TimeColumns({
  value,
  onChange,
  minuteStep = 5,
  onCommit,
  hoursRef,
  className,
}: {
  value: Time;
  onChange: (value: Time) => void;
  minuteStep?: number;
  onCommit?: () => void;
  hoursRef?: RefObject<HTMLDivElement | null>;
  /** Sizes both columns, such as their height. */
  className?: string;
}) {
  const { messages } = useSkylcn();
  return (
    <div className="grid grid-cols-2 divide-x divide-border-subtle">
      <TimeColumn
        label={messages.hours}
        values={HOURS}
        value={value.hour}
        onSelect={(hour) => onChange({ ...value, hour })}
        onCommit={onCommit}
        listRef={hoursRef}
        className={className}
      />
      <TimeColumn
        label={messages.minutes}
        values={minutesOffered(minuteStep, value.minute)}
        value={value.minute}
        onSelect={(minute) => onChange({ ...value, minute })}
        onCommit={onCommit}
        className={className}
      />
    </div>
  );
}

export type TimePickerProps = {
  /** HH:MM on a 24-hour clock; null for no time. */
  value: string | null;
  onValueChange: (value: string | null) => void;
  /** How far apart the offered minutes are; five by default. */
  minuteStep?: number;
  placeholder?: string;
  disabled?: boolean;
  /** The field's size: sm 32px, md 36px (the default) or lg 38px. */
  size?: ControlSize;
  /** `pill` is the compact 26px trigger of a dense row, such as a start time beside its label. */
  variant?: PickerVariant;
  'aria-label'?: string;
  id?: string;
  className?: string;
};

/**
 * A field that opens an hours and a minutes column. The time is set with
 * Select, so browsing the columns never changes it by accident; Enter in a
 * column selects too, and Esc or Cancel leaves the time as it was.
 */
export function TimePicker({
  value,
  onValueChange,
  minuteStep = 5,
  placeholder,
  disabled,
  size: sizeProp,
  variant = 'box',
  className,
  ...props
}: TimePickerProps) {
  const { messages } = useSkylcn();
  const size = useControlSize(sizeProp);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Time>(() => parseTime(value) ?? nowRounded(minuteStep));
  const hoursRef = useRef<HTMLDivElement>(null);
  const chosen = parseTime(value);
  const commit = (next: string | null) => {
    onValueChange(next);
    setOpen(false);
  };
  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(parseTime(value) ?? nowRounded(minuteStep));
        setOpen(next);
      }}
    >
      <PopoverTrigger
        id={props.id}
        aria-label={props['aria-label']}
        disabled={disabled}
        data-size={variant === 'pill' ? undefined : size}
        className={cn(pickerTrigger(size, variant), className)}
      >
        <Clock className={pickerIcon(size, variant)} />
        <span className={cn('truncate tabular-nums', !chosen && 'text-subtle-foreground')}>
          {chosen ? formatTime(chosen) : (placeholder ?? messages.pickTime)}
        </span>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        initialFocus={hoursRef}
        aria-label={props['aria-label'] ?? messages.pickTime}
        className="w-auto p-3"
      >
        <div className="flex w-64 flex-col gap-2 pointer-coarse:w-72">
          <div
            className={cn(
              pickerHeader,
              'enter-rise-blur justify-center text-sm font-semibold text-foreground tabular-nums',
            )}
            style={rise(1)}
          >
            {formatTime(draft)}
          </div>
          <div className="enter-rise-blur" style={rise(2)}>
            <TimeColumns
              value={draft}
              onChange={setDraft}
              minuteStep={minuteStep}
              onCommit={() => commit(formatTime(draft))}
              hoursRef={hoursRef}
              className="h-40 pointer-coarse:h-48"
            />
          </div>
          <div
            className="flex enter-rise-blur items-center justify-between gap-2 border-t border-border-subtle pt-2"
            style={rise(3)}
          >
            {chosen ? (
              <button type="button" onClick={() => commit(null)} className={pickerTextButton}>
                {messages.clear}
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
                {messages.cancel}
              </Button>
              <Button size="sm" variant="primary" onClick={() => commit(formatTime(draft))}>
                {messages.choose}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
