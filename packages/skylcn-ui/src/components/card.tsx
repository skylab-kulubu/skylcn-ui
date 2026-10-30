'use client';

import type { LucideIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { StatusDot, type StatusDotProps } from './badge.js';
import { AnimatedNumber } from './motion.js';
import { Sparkline } from './sparkline.js';

const cardClass =
  'flex min-w-0 flex-col rounded-xl border border-border bg-card text-card-foreground';

/** A framed surface for one piece of content: a summary, a form section, a chart. */
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card" className={cn(cardClass, className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn('flex min-w-0 items-start gap-3 px-4 pt-4', className)}
      {...props}
    />
  );
}

export type CardTitleProps = ComponentProps<'h2'> & {
  /** The heading level; 2 under a page title, 3 inside a section that has its own. */
  level?: 2 | 3 | 4;
};

export function CardTitle({ level = 2, className, ...props }: CardTitleProps) {
  const Heading = `h${level}` as const;
  return (
    <Heading
      data-slot="card-title"
      className={cn('text-sm font-semibold text-foreground', className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="card-description"
      className={cn('mt-0.5 text-xs text-muted-foreground', className)}
      {...props}
    />
  );
}

/** Buttons or a menu at the end of the header row. */
export function CardAction({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('ml-auto flex shrink-0 items-center gap-1', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('min-w-0 p-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'mt-auto flex items-center gap-2 border-t border-border-subtle px-4 py-3',
        className,
      )}
      {...props}
    />
  );
}

const DELTA_TONE = {
  positive: 'text-success',
  negative: 'text-destructive',
  neutral: 'text-muted-foreground',
} as const;

const VALUE_TONE = {
  default: 'text-foreground',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
} as const;

export type StatCardProps = {
  label: ReactNode;
  value: ReactNode;
  icon?: LucideIcon;
  /** A change next to the value, such as "+12". */
  delta?: ReactNode;
  /** Whether the change is good news; a drop in errors is positive. */
  deltaTone?: keyof typeof DELTA_TONE;
  /** A line under the value, such as the period it covers. */
  hint?: ReactNode;
  /** Recent figures, oldest first, drawn as a sparkline under the value. */
  trend?: readonly number[];
  /** Draws the card; turn off to set the figure straight into a Section or a row of figures. */
  framed?: boolean;
  /** Makes the whole figure a link, such as to the list it counts. */
  href?: string;
  /** A state dot before the label, glowing for live states. */
  dot?: StatusDotProps['tone'];
  /** Colours the value, such as amber for what is waiting on someone. */
  valueTone?: keyof typeof VALUE_TONE;
  className?: string;
};

/** One figure for a dashboard row: a label, a large value, and how it moved. */
export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaTone = 'neutral',
  hint,
  trend,
  framed = true,
  href,
  dot,
  valueTone = 'default',
  className,
}: StatCardProps) {
  const { Link } = useSkylcn();
  const mark = dot ? (
    <StatusDot tone={dot} />
  ) : Icon ? (
    <Icon className={cn('shrink-0 text-subtle-foreground', framed ? 'size-4' : 'size-3.5')} />
  ) : null;
  const number = (
    <div className="flex items-baseline gap-2">
      <p
        className={cn(
          'font-semibold tabular-nums',
          framed ? 'text-lg leading-tight' : 'text-2xl leading-none',
          VALUE_TONE[valueTone],
        )}
      >
        {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
      </p>
      {delta ? (
        <span className={cn('text-xs font-medium tabular-nums', DELTA_TONE[deltaTone])}>
          {delta}
        </span>
      ) : null}
    </div>
  );
  const more = (
    <>
      {hint ? <p className="text-2xs text-muted-foreground">{hint}</p> : null}
      {trend ? <Sparkline values={trend} className="mt-1" /> : null}
    </>
  );
  // Framed, a compact tile: the mark beside the label and the number. Outside a card the
  // figure stands taller, with its mark on the label's line
  const figure = framed ? (
    <>
      {mark}
      <div className="min-w-0 flex-1">
        <p className="truncate text-2xs text-subtle-foreground">{label}</p>
        {number}
        {more}
      </div>
    </>
  ) : (
    <>
      <div className="flex items-center gap-2">
        {mark}
        <p className="text-2xs text-subtle-foreground">{label}</p>
      </div>
      {number}
      {more}
    </>
  );
  const layout = framed
    ? 'flex min-w-0 items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 text-card-foreground'
    : 'flex min-w-0 flex-col gap-1.5';
  if (href) {
    return (
      <Link
        href={href}
        data-slot="stat-card"
        className={cn(
          layout,
          'outline-hidden transition-colors duration-(--motion-duration-fast) focus-visible:ring-2 focus-visible:ring-ring',
          framed
            ? 'hover:border-border-strong hover:bg-accent'
            : // Outside a card, the hover wash spills past the figure so its text stays in line
              '-m-2 rounded-lg p-2 hover:bg-accent',
          className,
        )}
      >
        {figure}
      </Link>
    );
  }
  return (
    <div data-slot="stat-card" className={cn(layout, className)}>
      {figure}
    </div>
  );
}
