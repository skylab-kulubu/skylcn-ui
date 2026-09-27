'use client';

import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';

type ToastType = 'success' | 'error' | 'info';

const ICON = {
  success: <CircleCheck className="size-4 text-success" aria-hidden />,
  error: <CircleAlert className="size-4 text-destructive" aria-hidden />,
  info: <Info className="size-4 text-info" aria-hidden />,
} as const;

/**
 * Adds a toast from anywhere under ToastProvider:
 * `toast.add({ title, description, type: 'success' })`. Errors and toasts
 * with an action stay until closed; pass `actionProps` for an undo.
 */
export const useToast = ToastPrimitive.useToastManager;

function Toasts() {
  const { toasts } = ToastPrimitive.useToastManager();
  const { messages } = useSkylcn();
  return toasts.map((toast) => (
    <ToastPrimitive.Root
      key={toast.id}
      toast={toast}
      swipeDirection={['right', 'down']}
      className={cn(
        '[--gap:0.625rem] [--offset-y:calc(var(--toast-offset-y)*-1+var(--toast-index)*var(--gap)*-1+var(--toast-swipe-movement-y))] [--peek:0.5rem] [--scale:calc(max(0,1-(var(--toast-index)*0.06)))]',
        'absolute right-0 bottom-0 z-[calc(100-var(--toast-index))] w-full origin-bottom rounded-xl border border-border bg-popover p-3 pr-10 text-foreground shadow-overlay select-none',
        '[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-var(--toast-index)*var(--peek)))_scale(var(--scale))]',
        'data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]',
        'transition-[transform,opacity] duration-(--motion-duration-slow) ease-enter',
        'data-ending-style:opacity-0 data-limited:opacity-0 data-starting-style:[transform:translateY(120%)]',
        'data-[swipe-direction=right]:data-ending-style:[transform:translateX(calc(var(--toast-swipe-movement-x)+120%))_translateY(var(--offset-y))] [&[data-ending-style]:not([data-swipe-direction])]:[transform:translateY(120%)]',
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
      )}
    >
      <ToastPrimitive.Content className="flex gap-2.5">
        {toast.type && toast.type in ICON ? (
          <span className="mt-0.5">{ICON[toast.type as ToastType]}</span>
        ) : null}
        <div className="min-w-0 flex-1">
          <ToastPrimitive.Title className="text-sm font-medium text-foreground" />
          <ToastPrimitive.Description className="mt-0.5 text-xs leading-relaxed text-muted-foreground" />
          {toast.actionProps ? (
            <ToastPrimitive.Action className="mt-2 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-secondary-foreground outline-hidden transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring" />
          ) : null}
        </div>
        <ToastPrimitive.Close
          aria-label={messages.close}
          className="absolute top-2.5 right-2.5 grid size-6 place-items-center rounded-md text-subtle-foreground outline-hidden hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3.5" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Content>
    </ToastPrimitive.Root>
  ));
}

/**
 * Hosts the toasts of an app, stacked at the bottom right (full width on
 * phones). Plain toasts leave after five seconds, paused while hovered or focused.
 */
export function ToastProvider({
  children,
  timeout = 5000,
}: {
  children: ReactNode;
  timeout?: number;
}) {
  return (
    <ToastPrimitive.Provider timeout={timeout}>
      {children}
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport className="fixed right-4 bottom-4 z-[60] mx-auto w-[calc(100vw-2rem)] sm:right-6 sm:bottom-6 sm:w-90">
          <Toasts />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}
