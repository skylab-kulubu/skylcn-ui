'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn.js';

export function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('flex flex-col divide-y divide-border-subtle', className)}
      {...props}
    />
  );
}

export const AccordionItem = AccordionPrimitive.Item;

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        className={cn(
          'group flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-medium text-foreground outline-hidden',
          'rounded-md focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="size-4 shrink-0 text-subtle-foreground transition-transform duration-(--motion-duration-base) ease-enter group-data-panel-open:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/** Opens to its natural height; reduced motion leaves the fade. */
export function AccordionPanel({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      className="h-(--accordion-panel-height) overflow-hidden transition-[height,opacity] duration-(--motion-duration-slow) ease-enter data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:duration-(--motion-duration-base)"
      {...props}
    >
      <div className={cn('pb-3 text-xs leading-relaxed text-muted-foreground', className)}>
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}
