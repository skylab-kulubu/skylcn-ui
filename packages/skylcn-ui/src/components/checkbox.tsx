'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '../lib/cn.js';

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
