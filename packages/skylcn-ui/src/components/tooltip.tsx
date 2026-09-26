'use client';

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { popupMotionFast } from '../lib/motion.js';

/** Shares one open delay across tooltips, so moving between them feels instant. */
export function TooltipProvider({
  delay = 400,
  children,
}: {
  delay?: number;
  children: ReactNode;
}) {
  return <TooltipPrimitive.Provider delay={delay}>{children}</TooltipPrimitive.Provider>;
}

export type TooltipProps = {
  label: ReactNode;
  /** The element the tooltip describes; it must accept a ref. */
  children: ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
};

export function Tooltip({ label, children, side = 'bottom', className }: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger render={children} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side={side} sideOffset={6} className="z-50">
          <TooltipPrimitive.Popup
            data-slot="tooltip"
            className={cn(
              'rounded-md border border-border-strong bg-popover px-1.5 py-0.5 text-3xs font-medium text-secondary-foreground shadow-lg',
              popupMotionFast,
              className,
            )}
          >
            {label}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
