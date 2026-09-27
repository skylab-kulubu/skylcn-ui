'use client';

import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

export type RadioProps = RadioPrimitive.Root.Props & {
  label: ReactNode;
  description?: ReactNode;
};

/** One choice of a RadioGroup, with its label; the whole row is the hit area. */
export function Radio({ label, description, className, ...props }: RadioProps) {
  return (
    <label
      className={cn(
        'group flex cursor-pointer items-start gap-2.5 text-sm has-data-disabled:cursor-not-allowed',
        className,
      )}
    >
      <RadioPrimitive.Root
        className={cn(
          'mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border border-border-strong bg-input-background outline-hidden pointer-coarse:size-5',
          'transition-[border-color,background-color] duration-(--motion-duration-fast) focus-visible:ring-2 focus-visible:ring-ring',
          'data-checked:border-skylab-400 data-checked:bg-skylab-500/15 data-disabled:opacity-50',
        )}
        {...props}
      >
        <RadioPrimitive.Indicator className="size-2 rounded-full bg-skylab-400 transition-[scale,opacity] duration-(--motion-duration-fast) ease-enter data-ending-style:scale-0 data-starting-style:scale-0" />
      </RadioPrimitive.Root>
      <span className="flex flex-col gap-0.5">
        <span className="text-secondary-foreground group-has-data-disabled:text-faint-foreground">
          {label}
        </span>
        {description ? <span className="text-xs text-muted-foreground">{description}</span> : null}
      </span>
    </label>
  );
}
