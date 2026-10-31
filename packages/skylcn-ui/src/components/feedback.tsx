'use client';

import { Meter as MeterPrimitive } from '@base-ui/react/meter';
import { Progress as ProgressPrimitive } from '@base-ui/react/progress';
import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';

/** A key or shortcut as the reader types it, such as ⌘K. */
export function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded border border-border-strong bg-muted px-1 font-mono text-3xs text-secondary-foreground',
        className,
      )}
      {...props}
    />
  );
}

export function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch',
        className,
      )}
      {...props}
    />
  );
}

export type ProgressProps = ProgressPrimitive.Root.Props & {
  label?: ReactNode;
  /** Shows the value at the end of the label row. */
  showValue?: boolean;
};

/** How far a task has come: an upload, a send going out. Without a value it runs as busy. */
export function Progress({ label, showValue = true, className, ...props }: ProgressProps) {
  const { locale } = useSkylcn();
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      // A fixed locale keeps the server and browser writing the value the same way
      locale={locale === 'tr' ? 'tr-TR' : 'en-US'}
      className={cn('flex flex-col gap-1.5', className)}
      {...props}
    >
      {label || showValue ? (
        <div className="flex items-baseline justify-between gap-3 text-xs">
          {label ? (
            <ProgressPrimitive.Label className="text-secondary-foreground">
              {label}
            </ProgressPrimitive.Label>
          ) : (
            <span />
          )}
          {showValue ? (
            <ProgressPrimitive.Value className="text-subtle-foreground tabular-nums" />
          ) : null}
        </div>
      ) : null}
      <ProgressPrimitive.Track className="h-1.5 overflow-hidden rounded-full bg-muted">
        <ProgressPrimitive.Indicator className="block h-full rounded-full bg-skylab-500 transition-[width] duration-(--motion-duration-slow) ease-enter data-indeterminate:w-1/3 data-indeterminate:animate-pulse" />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}

export type MeterProps = MeterPrimitive.Root.Props & {
  label: ReactNode;
  /** Shares of max where the fill turns to warning, then danger. */
  warnAt?: number;
  dangerAt?: number;
};

/**
 * A level within known bounds: storage used, seats taken. The fill carries
 * the severity and the track is a lighter step of the same colour; the value
 * is always written, never told by colour alone.
 */
export function Meter({
  label,
  warnAt = 0.75,
  dangerAt = 0.9,
  value,
  max = 100,
  min = 0,
  className,
  ...props
}: MeterProps) {
  const { locale } = useSkylcn();
  const share = (value - min) / (max - min || 1);
  const tone =
    share >= dangerAt ? 'bg-destructive' : share >= warnAt ? 'bg-warning' : 'bg-skylab-500';
  const track =
    share >= dangerAt
      ? 'bg-destructive/15'
      : share >= warnAt
        ? 'bg-warning/15'
        : 'bg-skylab-500/15';
  return (
    <MeterPrimitive.Root
      data-slot="meter"
      locale={locale === 'tr' ? 'tr-TR' : 'en-US'}
      value={value}
      max={max}
      min={min}
      className={cn('flex flex-col gap-1.5', className)}
      {...props}
    >
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <MeterPrimitive.Label className="text-secondary-foreground">{label}</MeterPrimitive.Label>
        <MeterPrimitive.Value className="text-subtle-foreground tabular-nums" />
      </div>
      <MeterPrimitive.Track
        className={cn('h-1.5 overflow-hidden rounded-full transition-colors', track)}
      >
        <MeterPrimitive.Indicator
          className={cn(
            'block h-full rounded-full transition-[width,background-color] duration-(--motion-duration-slow) ease-enter',
            tone,
          )}
        />
      </MeterPrimitive.Track>
    </MeterPrimitive.Root>
  );
}
