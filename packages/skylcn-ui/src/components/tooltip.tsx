'use client';

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../lib/cn.js';

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
              'border-border-strong bg-popover text-3xs text-secondary-foreground origin-(--transform-origin) rounded-md border px-1.5 py-0.5 font-medium shadow-lg',
              'ease-enter transition-[opacity,transform] duration-(--motion-duration-fast)',
              'data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
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
