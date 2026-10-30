'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { Check, Minus } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { controlText, useControlSize, type ControlSize } from './control.js';

export function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'relative grid size-4 shrink-0 cursor-pointer place-content-center rounded-sm border border-border-strong bg-input-background outline-hidden after:absolute after:-inset-3',
        'transition-[background-color,border-color] duration-(--motion-duration-fast) ease-enter',
        'focus-visible:ring-2 focus-visible:ring-ring',
        'data-indeterminate:border-skylab-800 data-indeterminate:bg-skylab-800 data-checked:border-skylab-800 data-checked:bg-skylab-800',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        keepMounted
        className="text-white transition-transform duration-(--motion-duration-fast) ease-enter data-unchecked:scale-0"
        render={(indicatorProps, state) => (
          <span {...indicatorProps}>
            {state.indeterminate ? (
              <Minus className="size-3" strokeWidth={3} />
            ) : (
              <Check className="size-3" strokeWidth={3} />
            )}
          </span>
        )}
      />
    </CheckboxPrimitive.Root>
  );
}

/** The bordered row a checkbox or radio card is drawn as; it tints once its control is on. */
export const choiceCardClass = cn(
  'group/choice flex cursor-pointer rounded-md border border-border bg-input-background select-none',
  'transition-colors duration-(--motion-duration-fast) hover:bg-accent',
  'has-data-checked:border-skylab-600/30 has-data-checked:bg-skylab-600/20',
  'has-data-disabled:cursor-not-allowed has-data-disabled:opacity-60',
);

/** A one-line card stands as tall as a box control of its size: 32, 36 or 38px. */
export const choiceCardSize = {
  sm: 'gap-2.5 px-2.5 py-1.75',
  md: 'gap-2.5 px-2.5 py-2.25',
  lg: 'gap-3 px-3 py-2',
} as const;

/**
 * Lines a card's control up with its label: centred on a one-line card, on the first line's
 * middle when a description follows.
 */
export function choiceControlPlace(size: ControlSize, described: boolean) {
  if (!described) return 'self-center mt-0';
  return size === 'lg' ? 'mt-0.5 pointer-coarse:mt-1' : 'mt-0 pointer-coarse:mt-1';
}

/** A card's label and description, with ids its control is named and described by. */
export function useChoiceText(label: ReactNode, description?: ReactNode, size: ControlSize = 'md') {
  const labelId = useId();
  const descriptionId = useId();
  return {
    controlProps: {
      'aria-labelledby': labelId,
      'aria-describedby': description ? descriptionId : undefined,
    },
    text: (
      <span className="flex min-w-0 flex-col gap-0.5">
        <span
          id={labelId}
          className={cn(
            controlText[size],
            'text-secondary-foreground group-has-data-checked/choice:text-foreground',
          )}
        >
          {label}
        </span>
        {description ? (
          <span
            id={descriptionId}
            className={cn(size === 'lg' ? 'text-xs' : 'text-2xs', 'text-muted-foreground')}
          >
            {description}
          </span>
        ) : null}
      </span>
    ),
  };
}

export type CheckboxCardProps = Omit<CheckboxPrimitive.Root.Props, 'children'> & {
  label: ReactNode;
  description?: ReactNode;
  /** Draws the card in the error colour, such as a required question left empty. */
  invalid?: boolean;
  /** Defaults to the surrounding ControlSizeProvider's, then md. */
  size?: ControlSize;
};

/** One option of a question drawn as a bordered row with its checkbox; the whole row is the hit area. */
export function CheckboxCard({
  label,
  description,
  invalid = false,
  size: sizeProp,
  className,
  ...props
}: CheckboxCardProps) {
  const size = useControlSize(sizeProp);
  const { controlProps, text } = useChoiceText(label, description, size);
  return (
    <label
      data-slot="checkbox-card"
      className={cn(
        choiceCardClass,
        choiceCardSize[size],
        invalid && 'border-destructive/50',
        className,
      )}
    >
      <Checkbox
        className={choiceControlPlace(size, Boolean(description))}
        {...controlProps}
        {...props}
      />
      {text}
    </label>
  );
}
