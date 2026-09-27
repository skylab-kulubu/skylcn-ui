'use client';

import { NavigationMenu as NavPrimitive } from '@base-ui/react/navigation-menu';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * A site's top navigation whose items open panels of links; the panel
 * resizes and slides between items. Meant for public pages from md up;
 * pair it with a Drawer menu on phones.
 */
export function NavigationMenu({ className, children, ...props }: NavPrimitive.Root.Props) {
  return (
    <NavPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        'relative [--duration:var(--motion-duration-slow)] [--easing:var(--motion-ease-enter)]',
        className,
      )}
      {...props}
    >
      <NavPrimitive.List className="flex items-center gap-0.5">{children}</NavPrimitive.List>
      <NavPrimitive.Portal>
        <NavPrimitive.Positioner
          sideOffset={8}
          collisionPadding={{ top: 5, bottom: 5, left: 16, right: 16 }}
          className="z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-(--duration) ease-(--easing) data-instant:transition-none"
        >
          <NavPrimitive.Popup
            className={cn(
              'relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) overflow-hidden rounded-xl border border-border bg-popover text-foreground shadow-overlay outline-hidden',
              'transition-[opacity,scale,width,height] duration-(--duration) ease-(--easing)',
              'data-ending-style:scale-(--motion-scale-from) data-ending-style:opacity-0 data-ending-style:duration-(--motion-duration-fast) data-starting-style:scale-(--motion-scale-from) data-starting-style:opacity-0',
            )}
          >
            <NavPrimitive.Viewport className="relative size-full overflow-hidden" />
          </NavPrimitive.Popup>
        </NavPrimitive.Positioner>
      </NavPrimitive.Portal>
    </NavPrimitive.Root>
  );
}

export type NavigationMenuItemProps = {
  /** The item's label in the bar. */
  label: ReactNode;
  /** The panel's links; leave out for a plain link with `href`. */
  children?: ReactNode;
  href?: string;
  className?: string;
};

const trigger =
  'flex h-9 items-center gap-1 rounded-md px-3 text-sm text-muted-foreground outline-hidden transition-colors duration-(--motion-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-popup-open:bg-accent data-popup-open:text-foreground';

/** One item of the bar: a panel of links, or a plain link when it has only `href`. */
export function NavigationMenuItem({ label, children, href, className }: NavigationMenuItemProps) {
  if (!children) {
    return (
      <NavPrimitive.Item>
        <NavPrimitive.Link href={href} className={cn(trigger, className)}>
          {label}
        </NavPrimitive.Link>
      </NavPrimitive.Item>
    );
  }
  return (
    <NavPrimitive.Item>
      <NavPrimitive.Trigger className={cn(trigger, className)}>
        {label}
        <NavPrimitive.Icon className="transition-transform duration-(--motion-duration-base) ease-enter data-popup-open:rotate-180">
          <ChevronDown className="size-3.5" />
        </NavPrimitive.Icon>
      </NavPrimitive.Trigger>
      <NavPrimitive.Content
        className={cn(
          'grid w-[calc(100vw-2rem)] gap-1 p-2 sm:w-max sm:max-w-lg sm:grid-cols-2',
          'transition-[opacity,translate] duration-(--duration) ease-(--easing) data-ending-style:opacity-0 data-starting-style:opacity-0',
          'data-starting-style:data-[activation-direction=left]:-translate-x-1/4 data-starting-style:data-[activation-direction=right]:translate-x-1/4',
          'data-ending-style:data-[activation-direction=left]:translate-x-1/4 data-ending-style:data-[activation-direction=right]:-translate-x-1/4',
          'motion-reduce:translate-x-0!',
        )}
      >
        {children}
      </NavPrimitive.Content>
    </NavPrimitive.Item>
  );
}

export type NavigationMenuLinkProps = {
  href: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
};

/** A link card inside a panel: an icon, a title and a line on where it leads. */
export function NavigationMenuLink({
  href,
  title,
  description,
  icon: Icon,
}: NavigationMenuLinkProps) {
  return (
    <NavPrimitive.Link
      href={href}
      className="flex gap-3 rounded-lg p-2.5 outline-hidden transition-colors duration-(--motion-duration-fast) hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring sm:w-56"
    >
      {Icon ? (
        <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border text-skylab-300">
          <Icon className="size-4" aria-hidden />
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{title}</span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </NavPrimitive.Link>
  );
}
