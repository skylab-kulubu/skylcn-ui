'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/** sm 32px for dense panels, md 36px by default, lg 38px for pages people fill in. */
export type ControlSize = 'sm' | 'md' | 'lg';

const ControlSizeContext = createContext<ControlSize | null>(null);

/** Sets the size of every box control inside, such as lg once for a whole form; a control's own size still wins. */
export function ControlSizeProvider({
  size,
  children,
}: {
  size: ControlSize;
  children: ReactNode;
}) {
  return <ControlSizeContext.Provider value={size}>{children}</ControlSizeContext.Provider>;
}

/** The size a control draws at: its own, else the nearest provider's, else md. */
export function useControlSize(size?: ControlSize): ControlSize {
  const inherited = useContext(ControlSizeContext);
  return size ?? inherited ?? 'md';
}

// Touch screens get 8px taller boxes and 16px text, the size iOS does not zoom into
export const controlHeight = {
  sm: 'h-8 pointer-coarse:h-10',
  md: 'h-9 pointer-coarse:h-11',
  lg: 'h-9.5 pointer-coarse:h-11.5',
} as const;
export const controlMinHeight = {
  sm: 'min-h-8 pointer-coarse:min-h-10',
  md: 'min-h-9 pointer-coarse:min-h-11',
  lg: 'min-h-9.5 pointer-coarse:min-h-11.5',
} as const;
export const controlText = {
  sm: 'text-xs pointer-coarse:text-base',
  md: 'text-xs pointer-coarse:text-base',
  lg: 'text-sm pointer-coarse:text-base',
} as const;
export const controlRadius = { sm: 'rounded-md', md: 'rounded-lg', lg: 'rounded-lg' } as const;
export const controlPadding = { sm: 'px-2.5', md: 'px-2.5', lg: 'px-3' } as const;
/** A leading icon: its size, where it sits, and the room the text leaves for it. */
export const controlIcon = { sm: 'size-3.5', md: 'size-3.5', lg: 'size-4' } as const;
export const controlIconLeft = { sm: 'left-2.5', md: 'left-2.5', lg: 'left-3' } as const;
export const controlIconRoom = { sm: 'pl-8', md: 'pl-8', lg: 'pl-9' } as const;

/** The box: forms' see-through fill, darker than the surface, and a border that firms on hover. */
export const controlSurface = cn(
  'w-full min-w-0 border border-input bg-background/60 text-foreground outline-hidden',
  'transition-[border-color,box-shadow,background-color] duration-(--motion-duration-fast) ease-enter',
  'placeholder:text-subtle-foreground hover:border-border-strong',
  'disabled:cursor-not-allowed disabled:opacity-60',
);
// skylab-600 stays lilac in dark, where 300 to 500 turn near white and the ring reads grey
export const controlFocus =
  'focus-visible:border-skylab-600/60 focus-visible:ring-2 focus-visible:ring-skylab-600/25';
export const controlFocusWithin =
  'focus-within:border-skylab-600/60 focus-within:ring-2 focus-within:ring-skylab-600/25';
export const controlOpen =
  'data-popup-open:border-skylab-600/60 data-popup-open:ring-2 data-popup-open:ring-skylab-600/25';
export const controlInvalid =
  'aria-invalid:border-destructive/50 aria-invalid:ring-destructive/20 data-invalid:border-destructive/50';

/**
 * The compact pill of dense rows, such as a role or a closing time beside a label: forms'
 * MenuPill, 26px with a quiet border.
 */
export const controlPill = cn(
  'inline-flex h-6.5 max-w-36 min-w-22 shrink-0 items-center justify-between gap-1 rounded-lg border border-border bg-muted px-2.5 text-2xs text-secondary-foreground outline-hidden pointer-coarse:h-8',
  'transition-colors duration-(--motion-duration-fast) hover:border-border-strong hover:bg-accent-strong hover:text-foreground',
  'focus-visible:ring-2 focus-visible:ring-skylab-600/25 data-popup-open:border-border-strong data-popup-open:bg-popover data-popup-open:text-foreground',
  'disabled:cursor-not-allowed disabled:opacity-60',
);
