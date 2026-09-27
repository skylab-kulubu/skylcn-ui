'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { cn } from '../lib/cn.js';

export const Tabs = TabsPrimitive.Root;

/** The row of tabs; an underline slides to the chosen one. Scrolls sideways when it does not fit. */
export function TabsList({ className, children, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'relative scrollbar-hidden flex items-center gap-1 overflow-x-auto border-b border-border',
        className,
      )}
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator className="absolute bottom-0 left-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) rounded-full bg-skylab-400 transition-[translate,width] duration-(--motion-duration-base) ease-enter" />
    </TabsPrimitive.List>
  );
}

export function Tab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tab"
      className={cn(
        'relative flex h-9 shrink-0 items-center gap-2 rounded-t-md px-3 text-sm whitespace-nowrap text-muted-foreground outline-hidden pointer-coarse:h-11',
        'transition-colors duration-(--motion-duration-fast) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
        'data-selected:text-foreground data-disabled:text-faint-foreground [&_svg]:size-4',
        className,
      )}
      {...props}
    />
  );
}

/** A tab's content; it fades in when chosen. */
export function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-panel"
      className={cn('enter-fade pt-4 outline-hidden', className)}
      {...props}
    />
  );
}
