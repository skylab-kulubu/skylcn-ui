'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { cn } from '../lib/cn.js';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverClose = PopoverPrimitive.Close;

export type PopoverContentProps = PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    'side' | 'align' | 'sideOffset' | 'alignOffset' | 'anchor'
  >;

/** A floating panel: filters, share options, pickers. Glassy like the admin filter shells. */
export function PopoverContent({
  className,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  alignOffset = 0,
  anchor,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            'border-border-strong bg-popover/85 text-foreground shadow-overlay w-80 max-w-[calc(100vw-1rem)] origin-(--transform-origin) rounded-xl border p-3 backdrop-blur outline-none',
            'ease-enter transition-[opacity,transform] duration-(--motion-duration-base)',
            'data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:-translate-y-2 data-starting-style:scale-98 data-starting-style:opacity-0',
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export const PopoverTitle = ({ className, ...props }: PopoverPrimitive.Title.Props) => (
  <PopoverPrimitive.Title
    className={cn('text-foreground text-sm font-semibold', className)}
    {...props}
  />
);

export const PopoverDescription = ({ className, ...props }: PopoverPrimitive.Description.Props) => (
  <PopoverPrimitive.Description
    className={cn('text-2xs text-subtle-foreground', className)}
    {...props}
  />
);
