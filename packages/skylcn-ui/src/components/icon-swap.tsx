import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn.js';

const LAYER =
  'col-start-1 row-start-1 transition-[opacity,scale,filter] duration-(--motion-duration-base) ease-enter motion-reduce:scale-100 motion-reduce:blur-none';
const SHOWN = 'scale-100 opacity-100 blur-none';
const HIDDEN = 'scale-50 opacity-0 blur-[2px]';

export type IconSwapProps = {
  /** Shows `swappedIcon` instead of `icon`. */
  swapped: boolean;
  icon: LucideIcon;
  swappedIcon: LucideIcon;
  className?: string;
  strokeWidth?: number;
};

/**
 * Two icons in one spot that blend into each other when the state changes,
 * such as open/close or copy/copied, instead of snapping.
 */
export function IconSwap({
  swapped,
  icon: Icon,
  swappedIcon: SwappedIcon,
  className,
  strokeWidth,
}: IconSwapProps) {
  return (
    <span data-slot="icon-swap" aria-hidden className="inline-grid shrink-0 place-items-center">
      <Icon strokeWidth={strokeWidth} className={cn(LAYER, swapped ? HIDDEN : SHOWN, className)} />
      <SwappedIcon
        strokeWidth={strokeWidth}
        className={cn(LAYER, swapped ? SHOWN : HIDDEN, className)}
      />
    </span>
  );
}
