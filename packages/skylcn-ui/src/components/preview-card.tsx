'use client';

import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card';
import { cn } from '../lib/cn.js';
import { popupMotionBase } from '../lib/motion.js';

export const PreviewCard = PreviewCardPrimitive.Root;

/** The link that shows the card on hover or keyboard focus; opens after `delay` ms (300 here). */
export function PreviewCardTrigger({
  delay = 300,
  closeDelay = 150,
  ...props
}: PreviewCardPrimitive.Trigger.Props) {
  return <PreviewCardPrimitive.Trigger delay={delay} closeDelay={closeDelay} {...props} />;
}

export type PreviewCardContentProps = PreviewCardPrimitive.Popup.Props &
  Pick<PreviewCardPrimitive.Positioner.Props, 'side' | 'align' | 'sideOffset'>;

/**
 * A glimpse of what a link leads to, beside it: a component, a member, an
 * event. Extra help only; the link works the same without it.
 */
export function PreviewCardContent({
  className,
  side = 'right',
  align = 'start',
  sideOffset = 12,
  ...props
}: PreviewCardContentProps) {
  return (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="preview-card"
          className={cn(
            'w-72 max-w-[calc(100vw-1rem)] rounded-xl border border-border bg-popover p-3 text-foreground shadow-overlay outline-hidden',
            popupMotionBase,
            className,
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}
