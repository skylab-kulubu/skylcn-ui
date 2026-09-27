import type { LucideIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/** A framed surface for one piece of content: a summary, a form section, a chart. */
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex min-w-0 flex-col rounded-xl border border-border bg-card text-card-foreground',
        className,
      )}
      {...props}
    />
  );
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
  className,
}: StatCardProps) {
  return (
    <Card data-slot="stat-card" className={cn('gap-2 p-4', className)}>
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="size-3.5 text-subtle-foreground" /> : null}
        <p className="text-3xs font-medium tracking-label text-subtle-foreground uppercase">
          {label}
        </p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-foreground tabular-nums">{value}</p>
        {delta ? (
          <span className={cn('text-xs font-medium tabular-nums', DELTA_TONE[deltaTone])}>
            {delta}
          </span>
        ) : null}
      </div>
      {hint ? <p className="text-2xs text-muted-foreground">{hint}</p> : null}
    </Card>
  );
}
