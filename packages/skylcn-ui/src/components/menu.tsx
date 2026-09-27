'use client';

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { Check, ChevronRight, type LucideIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { popupMotionFast } from '../lib/motion.js';

const popupClass = cn(
  'min-w-44 rounded-lg border border-border bg-popover p-1 text-foreground shadow-overlay outline-hidden',
  popupMotionFast,
);

const itemClass = cn(
  'group/menu-item relative flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-secondary-foreground outline-hidden select-none',
  'transition-colors duration-(--motion-duration-instant)',
  'data-highlighted:bg-accent data-highlighted:text-foreground-strong',
  'data-disabled:cursor-not-allowed data-disabled:text-faint-foreground',
  'pointer-coarse:py-2.5 pointer-coarse:text-sm',
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
);

const destructiveClass =
  'text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive';

type ItemExtras = {
  icon?: LucideIcon;
  /** A keyboard shortcut hint at the end of the row. */
  shortcut?: ReactNode;
  /** Colours the item for actions that remove or sign out. */
  destructive?: boolean;
  /** Indents the item to line up with items that have icons. */
  inset?: boolean;
};

function ItemBody({
  icon: Icon,
  shortcut,
  children,
}: Pick<ItemExtras, 'icon' | 'shortcut'> & { children?: ReactNode }) {
  return (
    <>
      {Icon ? (
        <Icon className="text-subtle-foreground group-data-highlighted/menu-item:text-current" />
      ) : null}
      {typeof children === 'string' || typeof children === 'number' ? (
        <span className="min-w-0 flex-1 truncate">{children}</span>
      ) : (
        children
      )}
      {shortcut ? <MenuShortcut>{shortcut}</MenuShortcut> : null}
    </>
  );
}

/* Shared items: they work inside both DropdownMenu and ContextMenu. */

export type MenuItemProps = MenuPrimitive.Item.Props & ItemExtras;

export function MenuItem({
  className,
  icon,
  shortcut,
  destructive,
  inset,
  children,
  ...props
}: MenuItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      className={cn(itemClass, destructive && destructiveClass, inset && 'pl-7.5', className)}
      {...props}
    >
      <ItemBody icon={icon} shortcut={shortcut}>
        {children}
      </ItemBody>
    </MenuPrimitive.Item>
  );
}

export type MenuLinkItemProps = MenuPrimitive.LinkItem.Props & ItemExtras;

/** A menu row that navigates; pass `render={<Link href="…" />}` for client-side links. */
export function MenuLinkItem({
  className,
  icon,
  shortcut,
  destructive,
  inset,
  children,
  ...props
}: MenuLinkItemProps) {
  return (
    <MenuPrimitive.LinkItem
      data-slot="menu-item"
      className={cn(itemClass, destructive && destructiveClass, inset && 'pl-7.5', className)}
      {...props}
    >
      <ItemBody icon={icon} shortcut={shortcut}>
        {children}
      </ItemBody>
    </MenuPrimitive.LinkItem>
  );
}

export function MenuCheckboxItem({
  className,
  children,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menu-checkbox-item"
      className={cn(itemClass, 'pl-7.5', className)}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <MenuPrimitive.CheckboxItemIndicator>
          <Check className="size-3.5 text-skylab-400" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

export const MenuRadioGroup = MenuPrimitive.RadioGroup;

export function MenuRadioItem({ className, children, ...props }: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menu-radio-item"
      className={cn(itemClass, 'pl-7.5', className)}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <MenuPrimitive.RadioItemIndicator>
          <span className="block size-1.5 rounded-full bg-skylab-400" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

const labelClass =
  'px-2 pt-2 pb-1 text-3xs font-medium tracking-label text-subtle-foreground uppercase';

/** A run of related items; `label` names the group for assistive tech too. */
export function MenuGroup({
  label,
  children,
  ...props
}: MenuPrimitive.Group.Props & { label?: ReactNode }) {
  return (
    <MenuPrimitive.Group data-slot="menu-group" {...props}>
      {label ? (
        <MenuPrimitive.GroupLabel className={labelClass}>{label}</MenuPrimitive.GroupLabel>
      ) : null}
      {children}
    </MenuPrimitive.Group>
  );
}

/** A small uppercase heading anywhere in a menu, such as the signed-in e-mail. */
export function MenuLabel({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="menu-label"
      role="presentation"
      className={cn(labelClass, className)}
      {...props}
    />
  );
}

export function MenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="menu-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

export function MenuShortcut({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="menu-shortcut"
      className={cn(
        'ml-auto pl-4 font-mono text-3xs tracking-wide text-subtle-foreground',
        className,
      )}
      {...props}
    />
  );
}

export const MenuSub = MenuPrimitive.SubmenuRoot;

export function MenuSubTrigger({
  className,
  icon,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & Omit<ItemExtras, 'shortcut' | 'destructive'>) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="menu-sub-trigger"
      className={cn(
        itemClass,
        'data-popup-open:bg-accent data-popup-open:text-foreground-strong',
        inset && 'pl-7.5',
        className,
      )}
      {...props}
    >
      <ItemBody icon={icon}>{children}</ItemBody>
      <ChevronRight className="ml-auto text-subtle-foreground" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

type ContentPlacement = Pick<
  MenuPrimitive.Positioner.Props,
  'side' | 'align' | 'sideOffset' | 'alignOffset'
>;

function MenuContent({
  className,
  side,
  align,
  sideOffset,
  alignOffset,
  ...props
}: MenuPrimitive.Popup.Props & ContentPlacement) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className="z-50 outline-hidden"
      >
        <MenuPrimitive.Popup
          data-slot="menu-content"
          className={cn(popupClass, className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export function MenuSubContent({
  side = 'right',
  align = 'start',
  sideOffset = 2,
  alignOffset = -5,
  ...props
}: MenuPrimitive.Popup.Props & ContentPlacement) {
  return (
    <MenuContent
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      {...props}
    />
  );
}

/* Dropdown menu: opened from a trigger. */

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;

export function DropdownMenuContent({
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  ...props
}: MenuPrimitive.Popup.Props & ContentPlacement) {
  return <MenuContent side={side} align={align} sideOffset={sideOffset} {...props} />;
}

/* Context menu: opened by right click, or a long press on touch screens. */

export const ContextMenu = ContextMenuPrimitive.Root;

export function ContextMenuTrigger({ className, ...props }: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn('select-none', className)}
      {...props}
    />
  );
}

export function ContextMenuContent({ className, ...props }: MenuPrimitive.Popup.Props) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner className="z-50 outline-hidden">
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cn(popupClass, className)}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}
