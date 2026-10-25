'use client';

import { Check, FileUp, Megaphone, X, type LucideIcon } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { useId, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { transitions } from '../lib/motion-tokens.js';
import { useSkylcn } from '../lib/provider.js';
import { Avatar } from './avatar.js';

/* Description list */

export type DescriptionItem = { label: ReactNode; value: ReactNode };

/** Labelled facts about one thing, for detail pages: e-mail, team, joined, role. */
export function DescriptionList({
  items,
  columns = 2,
  className,
}: {
  items: readonly DescriptionItem[];
  /** Columns from the sm breakpoint; one column on phones. */
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <dl
      data-slot="description-list"
      className={cn(
        'grid gap-x-6 gap-y-4',
        columns === 2 && 'sm:grid-cols-2',
        columns === 3 && 'sm:grid-cols-3',
        className,
      )}
    >
      {items.map((item, i) => (
        <div key={i} className="flex min-w-0 flex-col gap-1">
          <dt className="text-3xs font-medium tracking-label text-subtle-foreground uppercase">
            {item.label}
          </dt>
          <dd className="min-w-0 text-sm break-words text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* Timeline */

export type TimelineItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  /** When it happened, already formatted, such as "2 saat önce". */
  time?: ReactNode;
  icon?: LucideIcon;
  /** Someone who did it, shown instead of an icon. */
  person?: { name: string; src?: string | null };
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
};

const TONE = {
  neutral: 'border-border bg-muted text-muted-foreground',
  brand: 'border-skylab-400/40 bg-skylab-500/10 text-skylab-300',
  success: 'border-success/40 bg-success/10 text-success',
  warning: 'border-warning/40 bg-warning/10 text-warning',
  danger: 'border-destructive/40 bg-destructive/10 text-destructive',
} as const;

/** What happened, in order, along a line: an approval's history, a member's activity, an event programme. */
export function Timeline({
  items,
  className,
}: {
  items: readonly TimelineItem[];
  className?: string;
}) {
  return (
    <ol data-slot="timeline" className={cn('flex flex-col', className)}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
            {i < items.length - 1 ? (
              <span
                aria-hidden
                className="absolute top-8 bottom-0 left-3.5 w-px -translate-x-1/2 bg-border"
              />
            ) : null}
            {item.person ? (
              <Avatar name={item.person.name} src={item.person.src} size="sm" />
            ) : (
              <span
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-full border',
                  TONE[item.tone ?? 'neutral'],
                )}
              >
                {Icon ? (
                  <Icon className="size-3.5" aria-hidden />
                ) : (
                  <span className="size-1.5 rounded-full bg-current" />
                )}
              </span>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-sm text-foreground">{item.title}</p>
                {item.time ? (
                  <p className="text-2xs text-subtle-foreground tabular-nums">{item.time}</p>
                ) : null}
              </div>
              {item.description ? (
                <div className="text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* Stepper */

export type Step = { id: string; label: ReactNode; description?: ReactNode };

/**
 * Where a multi-step task stands: done steps ticked, the current one ringed.
 * Pair it with Swap for the step's content.
 */
export function Stepper({
  steps,
  current,
  className,
}: {
  steps: readonly Step[];
  /** Index of the current step. */
  current: number;
  className?: string;
}) {
  return (
    <ol data-slot="stepper" className={cn('flex w-full items-start gap-2', className)}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={step.id}
            aria-current={active ? 'step' : undefined}
            className="flex min-w-0 flex-1 flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'grid size-6 shrink-0 place-items-center rounded-full border text-2xs font-semibold tabular-nums transition-colors duration-(--motion-duration-base)',
                  done && 'border-skylab-400 bg-skylab-500 text-primary-foreground',
                  active &&
                    'border-skylab-400 bg-skylab-500/15 text-skylab-300 ring-4 ring-skylab-500/10',
                  !done && !active && 'border-border text-subtle-foreground',
                )}
              >
                {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
              </span>
              {i < steps.length - 1 ? (
                <span aria-hidden className="h-px flex-1 overflow-hidden rounded-full bg-border">
                  <span
                    className="block h-full bg-skylab-400 transition-[width] duration-(--motion-duration-slow) ease-enter"
                    style={{ width: done ? '100%' : '0%' }}
                  />
                </span>
              ) : null}
            </div>
            <div className="min-w-0 pr-2">
              <p
                className={cn(
                  'truncate text-xs font-medium',
                  active || done ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </p>
              {step.description ? (
                <p className="hidden truncate text-2xs text-subtle-foreground sm:block">
                  {step.description}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* Avatar group */

/** A few people as overlapping avatars, with how many more there are. */
export function AvatarGroup({
  people,
  max = 4,
  size = 'sm',
  className,
}: {
  people: readonly { name: string; src?: string | null }[];
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const { messages } = useSkylcn();
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <div data-slot="avatar-group" className={cn('flex items-center', className)}>
      {shown.map((person, i) => (
        <Avatar
          key={`${person.name}-${i}`}
          name={person.name}
          src={person.src}
          size={size}
          className={cn('ring-2 ring-background', i > 0 && '-ml-2')}
        />
      ))}
      {rest > 0 ? (
        <span
          title={messages.morePeople(rest)}
          className={cn(
            '-ml-2 grid shrink-0 place-items-center rounded-full border border-border bg-muted text-3xs font-semibold text-muted-foreground tabular-nums ring-2 ring-background',
            size === 'sm' ? 'size-7' : 'size-9',
          )}
        >
          +{rest}
        </span>
      ) : null}
    </div>
  );
}

/* Dropzone */

export type DropzoneProps = {
  onFiles: (files: File[]) => void;
  /** File types the picker offers, such as "image/*,.pdf". */
  accept?: string;
  multiple?: boolean;
  /** What the files are for, such as "Özgeçmiş (PDF, en fazla 5 MB)". */
  hint?: ReactNode;
  disabled?: boolean;
  className?: string;
};

/**
 * Drop files here or press to pick them; dragging is never the only way in.
 * The frame lights up while files are held over it.
 */
export function Dropzone({
  onFiles,
  accept,
  multiple = false,
  hint,
  disabled = false,
  className,
}: DropzoneProps) {
  const { messages } = useSkylcn();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const id = useId();
  return (
    <div
      data-slot="dropzone"
      data-over={over || undefined}
      onDragOver={(event) => {
        if (disabled) return;
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        if (disabled) return;
        const files = Array.from(event.dataTransfer.files);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong px-6 py-8 text-center',
        'transition-[border-color,background-color] duration-(--motion-duration-fast)',
        over && 'border-skylab-400 bg-skylab-500/10',
        disabled && 'opacity-50',
        className,
      )}
    >
      <span
        className={cn(
          'grid size-10 place-items-center rounded-full bg-muted text-muted-foreground transition-transform duration-(--motion-duration-base) ease-enter',
          over && 'scale-110 text-skylab-300',
        )}
      >
        <FileUp className="size-5" aria-hidden />
      </span>
      <label htmlFor={id} className="text-sm text-foreground">
        <span className="cursor-pointer font-medium text-skylab-300 underline-offset-4 hover:underline">
          {messages.chooseFile}
        </span>{' '}
        {messages.orDropHere}
      </label>
      {hint ? <p className="text-2xs text-subtle-foreground">{hint}</p> : null}
      <input
        ref={input}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length) onFiles(files);
          event.target.value = '';
        }}
      />
    </div>
  );
}

/* Bulk action bar */

/**
 * Actions for the rows a reader has picked, rising from the bottom while
 * anything is selected: move, e-mail, remove.
 */
export function BulkBar({
  count,
  onClear,
  children,
  className,
}: {
  count: number;
  onClear: () => void;
  /** The actions, usually small buttons. */
  children: ReactNode;
  className?: string;
}) {
  const { messages } = useSkylcn();
  return (
    <AnimatePresence>
      {count > 0 ? (
        <m.div
          key="bulk"
          role="toolbar"
          aria-label={messages.selected(count)}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: transitions.spring }}
          exit={{ y: 24, opacity: 0, transition: transitions.exit }}
          className={cn(
            'fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-xl items-center gap-2 rounded-xl border border-border-strong bg-popover px-3 py-2 shadow-overlay sm:bottom-6',
            'pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:pb-2',
            className,
          )}
        >
          <span className="text-xs text-foreground tabular-nums">{messages.selected(count)}</span>
          <span aria-hidden className="h-4 w-px bg-border" />
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">{children}</div>
          <button
            type="button"
            onClick={onClear}
            aria-label={messages.clearSelection}
            className="grid size-7 place-items-center rounded-md text-subtle-foreground outline-hidden hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
          </button>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

/* Banner */

export type BannerProps = Omit<ComponentProps<'div'>, 'title'> & {
  icon?: LucideIcon;
  action?: ReactNode;
  onDismiss?: () => void;
};

/** A strip across the top of a page for news everyone should see once: a new console, a maintenance window. */
export function Banner({
  icon: Icon = Megaphone,
  action,
  onDismiss,
  className,
  children,
  ...props
}: BannerProps) {
  const { messages } = useSkylcn();
  return (
    <div
      data-slot="banner"
      role="status"
      className={cn(
        'flex items-center gap-3 border-b border-skylab-400/20 bg-skylab-500/10 px-4 py-2 text-xs text-foreground',
        className,
      )}
      {...props}
    >
      <Icon className="size-4 shrink-0 text-skylab-300" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
      {action}
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={messages.close}
          className="grid size-6 place-items-center rounded-md text-subtle-foreground outline-hidden hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
