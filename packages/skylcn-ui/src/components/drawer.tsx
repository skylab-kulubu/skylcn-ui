'use client';

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';

export type DrawerSide = 'right' | 'left' | 'bottom';

const SideContext = createContext<DrawerSide>('right');

const SWIPE = { right: 'right', left: 'left', bottom: 'down' } as const;

export type DrawerProps = DrawerPrimitive.Root.Props & {
  /** The edge it slides from, and the way a swipe sends it back. */
  side?: DrawerSide;
};

/** A panel that slides in from an edge and is swiped, tapped outside or Esc'd away. */
export function Drawer({ side = 'right', ...props }: DrawerProps) {
  return (
    <SideContext.Provider value={side}>
      <DrawerPrimitive.Root swipeDirection={SWIPE[side]} {...props} />
    </SideContext.Provider>
  );
}

export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerClose = DrawerPrimitive.Close;

// Follows the finger while swiping, then settles with a speed that matches the swipe.
const MOVE = {
  right:
    '[transform:translateX(var(--drawer-swipe-movement-x))] data-starting-style:[transform:translateX(100%)] data-ending-style:[transform:translateX(100%)]',
  left: '[transform:translateX(var(--drawer-swipe-movement-x))] data-starting-style:[transform:translateX(-100%)] data-ending-style:[transform:translateX(-100%)]',
  bottom:
    '[transform:translateY(var(--drawer-swipe-movement-y))] data-starting-style:[transform:translateY(100%)] data-ending-style:[transform:translateY(100%)]',
} as const;

const PLACE = {
  right: 'inset-y-0 right-0 flex-row',
  left: 'inset-y-0 left-0 flex-row-reverse',
  bottom: 'inset-x-0 bottom-0 flex-col',
} as const;

export type DrawerContentProps = DrawerPrimitive.Popup.Props & {
  /** Render inside this element instead of the page body, e.g. the admin content panel. */
  container?: DrawerPrimitive.Portal.Props['container'];
  children?: ReactNode;
};

export function DrawerContent({ className, container, children, ...props }: DrawerContentProps) {
  const { messages } = useSkylcn();
  const side = useContext(SideContext);
  const scoped = Boolean(container);
  const EdgeIcon = side === 'left' ? ChevronsLeft : ChevronsRight;
  return (
    <DrawerPrimitive.Portal container={container}>
      <DrawerPrimitive.Backdrop
        className={cn(
          'inset-0 z-50 bg-black opacity-[calc(0.4*(1-var(--drawer-swipe-progress)))] transition-opacity duration-(--motion-duration-slow) ease-enter',
          'data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0',
          scoped ? 'absolute' : 'fixed',
        )}
      />
      <DrawerPrimitive.Viewport className={cn('inset-0 z-50', scoped ? 'absolute' : 'fixed')}>
        <DrawerPrimitive.Popup
          data-slot="drawer-content"
          data-side={side}
          className={cn(
            'absolute flex outline-hidden',
            PLACE[side],
            MOVE[side],
            'transition-[transform,opacity] duration-(--motion-duration-spring) ease-spring data-swiping:duration-0',
            'data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*var(--motion-duration-base))] data-ending-style:ease-exit',
            // Reduced motion fades the panel in place instead of sliding it
            'motion-reduce:data-ending-style:[transform:none] motion-reduce:data-ending-style:opacity-0 motion-reduce:data-starting-style:[transform:none] motion-reduce:data-starting-style:opacity-0',
          )}
          {...props}
        >
          {side === 'bottom' ? (
            <div
              className={cn(
                'flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-2xl border-t border-border bg-sheet pb-[env(safe-area-inset-bottom)] shadow-overlay',
                className,
              )}
            >
              <div
                aria-hidden
                className="mx-auto mt-2.5 mb-1 h-1 w-10 shrink-0 rounded-full bg-border-strong"
              />
              <DrawerPrimitive.Content className="flex min-h-0 flex-1 flex-col">
                {children}
              </DrawerPrimitive.Content>
            </div>
          ) : (
            <>
              <DrawerPrimitive.Close
                title={messages.closePanel}
                aria-label={messages.closePanel}
                className={cn(
                  'group relative flex h-full w-5 items-center justify-center border-y border-border bg-sheet text-subtle-foreground outline-hidden transition-colors hover:text-secondary-foreground focus-visible:text-foreground',
                  side === 'right'
                    ? '-mr-px rounded-l-full border-l'
                    : '-ml-px rounded-r-full border-r',
                )}
              >
                <EdgeIcon
                  className="size-3.5 opacity-60 transition-transform duration-(--motion-duration-base) group-hover:scale-110 group-hover:opacity-100"
                  strokeWidth={2.5}
                />
              </DrawerPrimitive.Close>
              <div
                className={cn(
                  'flex h-full w-[min(92vw,420px)] flex-col overflow-hidden border-y border-border bg-sheet pb-[env(safe-area-inset-bottom)] shadow-overlay',
                  side === 'right' ? 'border-r' : 'border-l',
                  className,
                )}
              >
                <DrawerPrimitive.Content className="flex min-h-0 flex-1 flex-col">
                  {children}
                </DrawerPrimitive.Content>
              </div>
            </>
          )}
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  );
}

export function DrawerHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex min-h-10 shrink-0 flex-col justify-center gap-0.5 border-b border-border px-4 py-2',
        className,
      )}
      {...props}
    />
  );
}

export function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      className={cn(
        'min-w-0 truncate text-sm font-semibold tracking-wide text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export function DrawerDescription({ className, ...props }: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
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
