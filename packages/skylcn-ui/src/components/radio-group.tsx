'use client';

import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { choiceCardClass, choiceCardSize, choiceControlPlace, useChoiceText } from './checkbox.js';
import { useControlSize, type ControlSize } from './control.js';

/**
 * A radio's ring and its dot, shared with parts that draw bare radios, such as ChoiceMatrix.
 * Checked, it fills like a checked Checkbox: skylab-800 stays purple in dark, where 300 to 500 turn white.
 */
export const radioClass = cn(
  'mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border border-border-strong bg-input-background outline-hidden pointer-coarse:size-5',
  'transition-[border-color,background-color] duration-(--motion-duration-fast) focus-visible:ring-2 focus-visible:ring-ring',
  'data-checked:border-skylab-800 data-checked:bg-skylab-800 data-disabled:opacity-50',
);
export const radioDotClass =
  'size-1.5 rounded-full bg-white transition-[scale,opacity] duration-(--motion-duration-fast) ease-enter data-ending-style:scale-0 data-starting-style:scale-0';

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
      <RadioPrimitive.Root className={radioClass} {...props}>
        <RadioPrimitive.Indicator className={radioDotClass} />
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

export type RadioCardProps = RadioPrimitive.Root.Props & {
  label: ReactNode;
  description?: ReactNode;
  /** Draws the card in the error colour, such as a required question left empty. */
  invalid?: boolean;
  /** Defaults to the surrounding ControlSizeProvider's, then md. */
  size?: ControlSize;
};

/** One choice of a RadioGroup drawn as a bordered row, for a question's options. */
export function RadioCard({
  label,
  description,
  invalid = false,
  size: sizeProp,
  className,
  ...props
}: RadioCardProps) {
  const size = useControlSize(sizeProp);
  const { controlProps, text } = useChoiceText(label, description, size);
  return (
    <label
      data-slot="radio-card"
      className={cn(
        choiceCardClass,
        choiceCardSize[size],
        invalid && 'border-destructive/50',
        className,
      )}
    >
      <RadioPrimitive.Root
        className={cn(
          radioClass,
          choiceControlPlace(size, Boolean(description)),
          // The ring grows to 20px on touch, so it sits 2px down on the first line, not 4
          description && 'pointer-coarse:mt-0.5',
        )}
        {...controlProps}
        {...props}
      >
        <RadioPrimitive.Indicator className={radioDotClass} />
      </RadioPrimitive.Root>
      {text}
    </label>
  );
}
