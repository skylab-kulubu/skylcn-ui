import type { CSSProperties } from 'react';
import { cn } from '../lib/cn.js';
import {
  controlFocus,
  controlHeight,
  controlIcon,
  controlOpen,
  controlPadding,
  controlPill,
  controlRadius,
  controlSurface,
  controlText,
  type ControlSize,
} from './control.js';

/** `box` is a form field; `pill` the compact 26px trigger of a dense row, such as a closing time beside its label. */
export type PickerVariant = 'box' | 'pill';

/** The field that opens a picker: an icon, then the chosen value or a placeholder. */
export function pickerTrigger(size: ControlSize, variant: PickerVariant) {
  if (variant === 'pill') return cn(controlPill, 'justify-start gap-1.5 text-left tabular-nums');
  return cn(
    controlSurface,
    controlFocus,
    controlOpen,
    controlHeight[size],
    controlText[size],
    controlRadius[size],
    controlPadding[size],
    'flex items-center gap-2 text-left',
  );
}

/** The trigger's leading icon, sized with the box or small in a pill. */
export function pickerIcon(size: ControlSize, variant: PickerVariant) {
  return cn(
    'shrink-0 text-subtle-foreground',
    variant === 'pill' ? 'size-3 opacity-80' : controlIcon[size],
  );
}

/** A picker's header row: the month and its arrows, or the time. A plain row, not a box in the panel. */
export const pickerHeader = 'flex h-7 items-center justify-between pointer-coarse:h-9';

/** The quiet text buttons under a picker, such as Today and Clear. */
export const pickerTextButton =
  'rounded-md px-2 py-1 text-2xs font-medium text-muted-foreground outline-hidden transition-colors duration-(--motion-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40';

/**
 * The chosen day, month or time: the checked choice card's tint. skylab-600 is the same lilac in
 * both themes, where 300 to 500 turn near white in dark and read grey.
 */
export const pickerChosen = 'border-skylab-600/30 bg-skylab-600/20 font-medium text-foreground';

/** Staggers the `enter-rise-blur` rows of a panel opening: header 1, body 2, footer 3. */
export const rise = (step: number) => ({ '--skylcn-rise-i': step }) as CSSProperties;

export const pad = (n: number) => String(n).padStart(2, '0');
