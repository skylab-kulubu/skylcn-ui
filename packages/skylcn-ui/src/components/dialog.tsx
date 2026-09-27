'use client';

import { AlertDialog as AlertPrimitive } from '@base-ui/react/alert-dialog';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { useRef, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { Button } from './button.js';

const backdrop =
  'fixed inset-0 z-50 bg-black/50 transition-opacity duration-(--motion-duration-base) ease-enter data-ending-style:opacity-0 data-starting-style:opacity-0';

// Centred from sm up; a sheet rising from the bottom edge on phones.
const popup = cn(
  'fixed z-50 flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden border border-border bg-popover text-foreground shadow-overlay outline-hidden',
  'transition-[opacity,translate,scale] duration-(--motion-duration-base) ease-enter data-ending-style:ease-exit data-ending-style:duration-(--motion-duration-fast)',
  'inset-x-0 bottom-0 rounded-t-2xl pb-[env(safe-area-inset-bottom)] data-ending-style:translate-y-full data-starting-style:translate-y-full motion-reduce:data-ending-style:translate-y-0 motion-reduce:data-starting-style:translate-y-0 data-ending-style:opacity-0 data-starting-style:opacity-0',
  'sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[calc(100vw-2rem)] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:pb-0',
  'sm:data-ending-style:-translate-y-1/2 sm:data-starting-style:-translate-y-1/2 sm:data-ending-style:scale-(--motion-scale-from) sm:data-starting-style:scale-(--motion-scale-from)',
);

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export type DialogContentProps = DialogPrimitive.Popup.Props & {
  /** Hides the close button in the corner, for dialogs that must be answered. */
  hideClose?: boolean;
};

/**
 * A modal window for a short task: a form, a confirmation, details. Centred
 * on wide screens and a bottom sheet on phones; focus stays inside and Esc closes.
 */
export function DialogContent({
  className,
  children,
  hideClose = false,
  ...props
}: DialogContentProps) {
  const { messages } = useSkylcn();
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className={backdrop} />
      <DialogPrimitive.Popup data-slot="dialog-content" className={cn(popup, className)} {...props}>
        {children}
        {hideClose ? null : (
          <DialogPrimitive.Close
            aria-label={messages.close}
            className="absolute top-3 right-3 grid size-8 place-items-center rounded-md text-subtle-foreground outline-hidden transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1 px-5 pt-5 pr-12', className)} {...props} />;
}

export function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      className={cn('text-base font-semibold text-foreground', className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      className={cn('text-xs leading-relaxed text-muted-foreground', className)}
      {...props}
    />
  );
}

export function DialogBody({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-4', className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 border-t border-border-subtle px-5 py-3 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}

export type ConfirmDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The button that opens it, when it is not opened from state. */
  trigger?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** A verb that names what happens, such as "Formu sil"; never "Tamam". */
  actionLabel: string;
  onAction: () => void;
  /** Colours the action for removals and other things that cannot be undone. */
  destructive?: boolean;
  pending?: boolean;
  cancelLabel?: string;
};

/**
 * Asks before an action that cannot be undone. Focus starts on Cancel, the
 * action says exactly what it does, and nothing is pre-chosen for the reader.
 * For actions that can be undone, prefer an undo toast to a question.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  actionLabel,
  onAction,
  destructive = false,
  pending = false,
  cancelLabel,
}: ConfirmDialogProps) {
  const { messages } = useSkylcn();
  const cancel = useRef<HTMLButtonElement>(null);
  return (
    <AlertPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <AlertPrimitive.Trigger render={trigger as React.ReactElement} /> : null}
      <AlertPrimitive.Portal>
        <AlertPrimitive.Backdrop className={backdrop} />
        <AlertPrimitive.Popup data-slot="confirm-dialog" initialFocus={cancel} className={popup}>
          <div className="flex flex-col gap-1 px-5 pt-5">
            <AlertPrimitive.Title className="text-base font-semibold text-foreground">
              {title}
            </AlertPrimitive.Title>
            {description ? (
              <AlertPrimitive.Description className="text-xs leading-relaxed text-muted-foreground">
                {description}
              </AlertPrimitive.Description>
            ) : null}
          </div>
          <div className="mt-4 flex flex-col-reverse gap-2 border-t border-border-subtle px-5 py-3 sm:flex-row sm:justify-end">
            <AlertPrimitive.Close render={<Button ref={cancel} />}>
              {cancelLabel ?? messages.cancel}
            </AlertPrimitive.Close>
            <Button
              variant={destructive ? 'destructive' : 'primary'}
              pending={pending}
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          </div>
        </AlertPrimitive.Popup>
      </AlertPrimitive.Portal>
    </AlertPrimitive.Root>
  );
}
