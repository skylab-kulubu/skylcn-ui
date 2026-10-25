'use client';

import { AlertDialog as AlertPrimitive } from '@base-ui/react/alert-dialog';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';
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
  /**
   * Does the work. When it returns a promise the dialog stays open and locked until it
   * settles: it closes on success and says why inside on a throw.
   */
  onAction: () => void | Promise<void>;
  /** What to say inside when `onAction` throws; the locale's "İşlem tamamlanamadı" by default. */
  failureMessage?: ReactNode | ((error: unknown) => ReactNode);
  /** A throw that arrives after the reader left the stalled dialog, for an error toast. */
  onLateFailure?: (error: unknown) => void;
  /** How long to hold the reader before Cancel lets them leave a request that has not answered. */
  stallAfter?: number;
  /** What to say once it stalls; the locale's "Sunucu yanıt vermedi; sonucu listeden denetle." by default. */
  stallMessage?: ReactNode;
  /** Colours the action for removals and other things that cannot be undone. */
  destructive?: boolean;
  /**
   * Work the parent runs itself: the action shows as pending and Cancel is locked, with the
   * same stall as an async `onAction`, so the reader is never trapped.
   */
  pending?: boolean;
  cancelLabel?: string;
  /**
   * Where focus goes when the dialog closes; the trigger, or what had focus before, by
   * default. `false` leaves it alone, for an action that also closes the surface under it,
   * such as a drawer that hands focus elsewhere. Takes Base UI's `finalFocus` as is.
   */
  finalFocus?: AlertPrimitive.Popup.Props['finalFocus'];
};

const STALL_AFTER = 25_000;

/**
 * Asks before an action that cannot be undone. Focus starts on Cancel, the action says
 * exactly what it does, and nothing is pre-chosen for the reader. For actions that can be
 * undone, prefer an undo toast to a question.
 *
 * An async `onAction` keeps the dialog open with the action pending and Cancel locked, so
 * the reader sees the outcome where they asked: a refusal is said in the dialog and only a
 * success closes it. If nothing answers within `stallAfter`, the dialog says so and lets
 * them leave; the request is not cancelled, since a removal may already have happened.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  actionLabel,
  onAction,
  failureMessage,
  onLateFailure,
  stallAfter = STALL_AFTER,
  stallMessage,
  destructive = false,
  pending = false,
  cancelLabel,
  finalFocus,
}: ConfirmDialogProps) {
  const { messages } = useSkylcn();
  const cancel = useRef<HTMLButtonElement>(null);
  const [innerOpen, setInnerOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [stalled, setStalled] = useState(false);
  const [failure, setFailure] = useState<ReactNode>(null);
  // Each opening is a run; an answer for an earlier one is late. A click in the same batch runs once.
  const run = useRef(0);
  const busy = useRef(false);
  const isOpen = open ?? innerOpen;
  const waiting = running || pending;
  const locked = waiting && !stalled;

  // Every opening starts clean, whoever opens it: a trigger, or a parent setting `open`
  const wasOpen = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      run.current += 1;
      busy.current = false;
      setRunning(false);
      setStalled(false);
      setFailure(null);
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  const setOpen = (next: boolean) => {
    if (open === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };

  // An async action and a parent's `pending` stall alike, so the reader can always leave
  useEffect(() => {
    if (!waiting) {
      setStalled(false);
      return;
    }
    const timer = setTimeout(() => setStalled(true), stallAfter);
    return () => clearTimeout(timer);
  }, [waiting, stallAfter]);

  // Once the wait runs out or the action fails, Cancel is the way out: put the keyboard on it
  useEffect(() => {
    if (stalled || failure) cancel.current?.focus();
  }, [stalled, failure]);

  const act = () => {
    if (busy.current || pending) return;
    const result = onAction();
    if (!result || typeof (result as Promise<void>).then !== 'function') return;
    const mine = run.current;
    busy.current = true;
    setRunning(true);
    setFailure(null);
    (result as Promise<void>).then(
      () => {
        if (run.current !== mine) return;
        busy.current = false;
        setRunning(false);
        setOpen(false);
      },
      (error: unknown) => {
        if (run.current !== mine) {
          onLateFailure?.(error);
          return;
        }
        busy.current = false;
        setRunning(false);
        setFailure(
          typeof failureMessage === 'function'
            ? failureMessage(error)
            : (failureMessage ?? messages.actionFailed),
        );
      },
    );
  };

  return (
    <AlertPrimitive.Root
      open={isOpen}
      onOpenChange={(next) => {
        // The reader cannot leave while the action runs, until it stalls
        if (!next && locked) return;
        // Leaving ends the run, so an answer that comes later counts as late
        if (!next) run.current += 1;
        setOpen(next);
      }}
    >
      {trigger ? <AlertPrimitive.Trigger render={trigger as React.ReactElement} /> : null}
      <AlertPrimitive.Portal>
        <AlertPrimitive.Backdrop className={backdrop} />
        <AlertPrimitive.Popup
          data-slot="confirm-dialog"
          initialFocus={cancel}
          finalFocus={finalFocus}
          className={popup}
        >
          <div className="flex flex-col gap-1 px-5 pt-5">
            <AlertPrimitive.Title className="text-base font-semibold text-foreground">
              {title}
            </AlertPrimitive.Title>
            {description ? (
              <AlertPrimitive.Description className="text-xs leading-relaxed text-muted-foreground">
                {description}
              </AlertPrimitive.Description>
            ) : null}
            {failure ? (
              <p role="alert" className="mt-2 text-xs text-destructive">
                {failure}
              </p>
            ) : stalled ? (
              <p role="status" className="mt-2 text-xs text-muted-foreground">
                {stallMessage ?? messages.actionStalled}
              </p>
            ) : null}
          </div>
          <div className="mt-4 flex flex-col-reverse gap-2 border-t border-border-subtle px-5 py-3 sm:flex-row sm:justify-end">
            <AlertPrimitive.Close render={<Button ref={cancel} />} disabled={locked}>
              {cancelLabel ?? messages.cancel}
            </AlertPrimitive.Close>
            <Button
              variant={destructive ? 'destructive' : 'primary'}
              pending={waiting}
              onClick={act}
            >
              {actionLabel}
            </Button>
          </div>
        </AlertPrimitive.Popup>
      </AlertPrimitive.Portal>
    </AlertPrimitive.Root>
  );
}
