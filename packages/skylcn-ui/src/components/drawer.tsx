'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { ChevronsRight } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

export type DrawerContentProps = DialogPrimitive.Popup.Props & {
  /** Render inside this element instead of the page body, e.g. the admin content panel. */
  container?: DialogPrimitive.Portal.Props['container'];
  children?: ReactNode;
};

/** A panel sliding in from the right with a spring, closed by its edge tab, Escape or the backdrop. */
export function DrawerContent({ className, container, children, ...props }: DrawerContentProps) {
  const { messages } = useSkylcn();
  const scoped = Boolean(container);
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Backdrop
        className={cn(
          'ease-enter inset-0 z-50 bg-black/10 backdrop-blur-[1px] transition-opacity duration-(--motion-duration-slow) data-ending-style:opacity-0 data-starting-style:opacity-0',
          scoped ? 'absolute' : 'fixed',
        )}
      />
      <DialogPrimitive.Popup
        data-slot="drawer-content"
        className={cn(
          'inset-y-0 right-0 z-50 flex outline-none',
          scoped ? 'absolute' : 'fixed',
          'ease-spring transition-transform duration-(--motion-duration-spring)',
          'data-ending-style:ease-exit data-ending-style:translate-x-full data-ending-style:duration-(--motion-duration-base) data-starting-style:translate-x-full',
        )}
        {...props}
      >
        <DialogPrimitive.Close
          title={messages.closePanel}
          aria-label={messages.closePanel}
          className="group border-border bg-sheet text-subtle-foreground hover:text-secondary-foreground focus-visible:text-foreground relative -mr-px flex h-full w-5 items-center justify-center rounded-l-full border-y border-l transition-colors outline-none"
        >
          <ChevronsRight
            className="size-3.5 opacity-60 transition-transform duration-(--motion-duration-base) group-hover:scale-110 group-hover:opacity-100"
            strokeWidth={2.5}
          />
        </DialogPrimitive.Close>
        <div
          className={cn(
            'border-border bg-sheet shadow-overlay flex h-full w-[min(92vw,420px)] flex-col overflow-hidden border-y border-r',
            className,
          )}
        >
          {children}
        </div>
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

export function DrawerHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('border-border flex h-10 shrink-0 items-center gap-2 border-b px-4', className)}
      {...props}
    />
  );
}

export function DrawerTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      className={cn(
        'text-foreground min-w-0 truncate text-sm font-semibold tracking-wide',
        className,
      )}
      {...props}
    />
  );
}

export function DrawerDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      className={cn('text-2xs text-subtle-foreground', className)}
      {...props}
    />
  );
}

export function DrawerBody({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('scrollbar min-h-0 flex-1 overflow-y-auto p-4', className)} {...props} />
  );
}
