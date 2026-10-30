'use client';

import { AlertDialog as AlertPrimitive } from '@base-ui/react/alert-dialog';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { ArrowRight, Check, CircleAlert, Info, Keyboard, X, type LucideIcon } from 'lucide-react';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react';
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
  /** A line under the title, such as what the action is about: "SKY LAB 2026 · 128 başvuru". */
  description?: ReactNode;
  /** The header tile's icon, such as Archive; tinted red with `destructive`. */
  icon?: LucideIcon;
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
  /** What will happen, listed under "Ne olacak", such as "Tüm cevaplar silinir". */
  consequences?: readonly ReactNode[];
  /** What the action leaves alone, listed beside `consequences` under "Ne kalacak", such as "Cevaplar silinmez". */
  unaffected?: readonly ReactNode[];
  /**
   * A phrase the reader types before the action unlocks, for the heaviest removals;
   * case does not matter, and Enter confirms once it matches.
   */
  confirmText?: string;
  /** Seconds the action stays locked once the dialog opens, drained by a line under it. */
  delay?: number;
  /**
   * Where focus goes when the dialog closes; the trigger, or what had focus before, by
   * default. `false` leaves it alone, for an action that also closes the surface under it,
   * such as a drawer that hands focus elsewhere. Takes Base UI's `finalFocus` as is.
   */
  finalFocus?: AlertPrimitive.Popup.Props['finalFocus'];
};

const STALL_AFTER = 25_000;

const confirmBackdrop =
  'fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity duration-(--motion-duration-base) ease-enter data-ending-style:opacity-0 data-starting-style:opacity-0';

// forms' rise on wide screens (up from 8px below, at 98%), a sheet from the bottom edge on phones;
// the shift and scale tokens drop to nothing under reduced motion.
const confirmPopup = cn(
  'fixed z-50 flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden border border-border bg-popover text-foreground shadow-overlay outline-hidden',
  'transition-[opacity,translate,scale] duration-(--motion-duration-base) ease-enter data-ending-style:ease-exit data-ending-style:duration-(--motion-duration-fast)',
  'inset-x-0 bottom-0 rounded-t-2xl pb-[env(safe-area-inset-bottom)] data-ending-style:translate-y-full data-starting-style:translate-y-full motion-reduce:data-ending-style:translate-y-0 motion-reduce:data-starting-style:translate-y-0 data-ending-style:opacity-0 data-starting-style:opacity-0',
  'sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[calc(100vw-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:pb-0',
  'sm:data-starting-style:-translate-y-[calc(50%-var(--motion-shift-lg))] sm:data-ending-style:-translate-y-[calc(50%-var(--motion-shift))] sm:data-ending-style:scale-(--motion-scale-from) sm:data-starting-style:scale-(--motion-scale-from)',
);

/**
 * Asks before an action that cannot be undone. Focus starts on Cancel, or in the phrase box
 * when one is required; the action says exactly what it does, and nothing is pre-chosen for
 * the reader. For actions that can be undone, prefer an undo toast to a question.
 *
 * A dialog with a summary (`consequences`, `unaffected`) or a phrase opens wide, with the two
 * lists side by side; a bare question keeps a narrow window.
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
  icon: Icon,
  actionLabel,
  onAction,
  failureMessage,
  onLateFailure,
  stallAfter = STALL_AFTER,
  stallMessage,
  destructive = false,
  pending = false,
  cancelLabel,
  consequences,
  unaffected,
  confirmText,
  delay = 0,
  finalFocus,
}: ConfirmDialogProps) {
  const { messages, locale } = useSkylcn();
  const cancel = useRef<HTMLButtonElement>(null);
  const phrase = useRef<HTMLInputElement>(null);
  const phraseId = useId();
  const [innerOpen, setInnerOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [stalled, setStalled] = useState(false);
  const [failure, setFailure] = useState<ReactNode>(null);
  const [typed, setTyped] = useState('');
  const [left, setLeft] = useState(delay);
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
      setTyped('');
      setLeft(delay);
    }
    wasOpen.current = isOpen;
  }, [isOpen, delay]);

  // The wait ticks only while the dialog is open, a second at a time
  useEffect(() => {
    if (!isOpen || left <= 0) return;
    const timer = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [isOpen, left]);

  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const phraseMet =
    !confirmText || typed.trim().toLocaleLowerCase(tag) === confirmText.toLocaleLowerCase(tag);
  const unlocked = phraseMet && left <= 0;
  const wide = Boolean(consequences?.length || unaffected?.length || confirmText);
  const lists = [
    {
      title: messages.whatHappens,
      items: consequences,
      Mark: ArrowRight,
      tone: destructive ? 'text-destructive' : 'text-skylab-300',
    },
    { title: messages.whatStays, items: unaffected, Mark: Check, tone: 'text-success' },
  ].filter((list) => list.items?.length);
  const hasBody = Boolean(description || lists.length || confirmText || failure || stalled);

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
    if (busy.current || pending || !unlocked) return;
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
        <AlertPrimitive.Backdrop className={confirmBackdrop} />
        <AlertPrimitive.Popup
          data-slot="confirm-dialog"
          initialFocus={confirmText ? phrase : cancel}
          finalFocus={finalFocus}
          className={cn(confirmPopup, wide ? 'sm:max-w-2xl' : 'sm:max-w-md')}
        >
          <div
            className={cn(
              'flex items-center gap-3 px-5 py-2.5',
              hasBody && 'border-b border-border-subtle',
            )}
          >
            {Icon ? (
              <span
                aria-hidden
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-lg border',
                  destructive
                    ? 'border-destructive/30 bg-destructive/10 text-destructive'
                    : 'border-skylab-400/30 bg-skylab-500/10 text-skylab-300',
                )}
              >
                <Icon className="size-4" />
              </span>
            ) : null}
            <AlertPrimitive.Title className="min-w-0 flex-1 py-1 text-base font-medium text-foreground">
              {title}
            </AlertPrimitive.Title>
            <AlertPrimitive.Close
              aria-label={messages.close}
              disabled={locked}
              className="-mr-1.5 grid size-8 shrink-0 place-items-center rounded-md text-subtle-foreground outline-hidden transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
            >
              <X className="size-4" />
            </AlertPrimitive.Close>
          </div>
          {hasBody ? (
            <div className="flex scrollbar min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">
              {description ? (
                <AlertPrimitive.Description
                  className={cn(
                    'text-muted-foreground',
                    wide ? 'text-xs' : 'text-sm leading-relaxed',
                  )}
                >
                  {description}
                </AlertPrimitive.Description>
              ) : null}
              {lists.length ? (
                <div className={cn('grid gap-5', lists.length > 1 && 'sm:grid-cols-2')}>
                  {lists.map(({ title: heading, items, Mark, tone }) => (
                    <div key={heading} className="flex flex-col gap-2">
                      <h3 className="text-xs font-medium text-foreground">{heading}</h3>
                      <ul className="flex flex-col gap-2">
                        {items!.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm leading-relaxed text-secondary-foreground"
                          >
                            <Mark aria-hidden className={cn('mt-1 size-3.5 shrink-0', tone)} />
                            <span className="min-w-0">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}
              {confirmText ? (
                <div className={cn('flex flex-col gap-2', (description || lists.length) && 'mt-1')}>
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <label htmlFor={phraseId} className="text-xs font-medium text-foreground">
                      {messages.typedConfirmation}
                    </label>
                    <span
                      id={`${phraseId}-need`}
                      className="inline-flex items-center gap-1.5 text-2xs text-subtle-foreground"
                    >
                      <Keyboard aria-hidden className="size-3.5 shrink-0" />
                      <span>
                        {messages.requiredPhrase}:{' '}
                        <span className="font-semibold text-secondary-foreground select-all">
                          {confirmText}
                        </span>
                      </span>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      ref={phrase}
                      id={phraseId}
                      value={typed}
                      onChange={(event) => setTyped(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter') return;
                        event.preventDefault();
                        act();
                      }}
                      placeholder={confirmText}
                      autoComplete="off"
                      spellCheck={false}
                      disabled={locked}
                      aria-describedby={`${phraseId}-need ${phraseId}-hint`}
                      className="h-10 w-full rounded-lg border border-input bg-input-background pr-10 pl-3 text-sm text-foreground outline-hidden transition-[border-color] duration-(--motion-duration-fast) placeholder:text-faint-foreground hover:border-border-strong focus-visible:border-skylab-400/50 focus-visible:ring-2 focus-visible:ring-skylab-400/20 disabled:opacity-60 pointer-coarse:h-11 pointer-coarse:text-base"
                    />
                    <Check
                      aria-hidden
                      data-on={(phraseMet && typed.trim().length > 0) || undefined}
                      className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 scale-75 text-success opacity-0 transition-[opacity,scale] duration-(--motion-duration-base) ease-enter data-on:scale-100 data-on:opacity-100 motion-reduce:scale-100"
                    />
                  </div>
                  <p id={`${phraseId}-hint`} className="text-2xs text-subtle-foreground">
                    {messages.confirmHint}
                  </p>
                </div>
              ) : null}
              {failure ? (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-relaxed text-destructive-foreground"
                >
                  <CircleAlert aria-hidden className="mt-px size-3.5 shrink-0" />
                  <span className="min-w-0">{failure}</span>
                </p>
              ) : stalled ? (
                <p
                  role="status"
                  className="flex items-start gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-xs leading-relaxed text-muted-foreground"
                >
                  <Info aria-hidden className="mt-px size-3.5 shrink-0" />
                  <span className="min-w-0">{stallMessage ?? messages.actionStalled}</span>
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-col-reverse gap-2 border-t border-border-subtle bg-muted/40 px-5 py-3 sm:flex-row sm:items-center sm:justify-end">
            <AlertPrimitive.Close
              render={<Button ref={cancel} variant="ghost" size="lg" className="px-4 text-sm" />}
              disabled={locked}
            >
              {cancelLabel ?? messages.cancel}
            </AlertPrimitive.Close>
            <Button
              variant={destructive ? 'destructive' : 'primary'}
              size="lg"
              className="overflow-hidden px-4 text-sm"
              pending={waiting}
              disabled={!unlocked}
              onClick={act}
            >
              {actionLabel}
              {left > 0 ? (
                <>
                  {/* The draining line is motion, so reduced motion counts the seconds instead */}
                  <span aria-hidden className="hidden tabular-nums motion-reduce:inline">
                    ({messages.secondsShort(left)})
                  </span>
                  <span className="sr-only">, {messages.unlocksIn(left)}</span>
                </>
              ) : null}
              {delay > 0 ? (
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-x-0 bottom-0 h-0.5 drain-line motion-reduce:hidden',
                    destructive ? 'bg-destructive' : 'bg-skylab-400',
                  )}
                  style={{ '--skylcn-drain': `${delay}s` } as CSSProperties}
                />
              ) : null}
            </Button>
          </div>
        </AlertPrimitive.Popup>
      </AlertPrimitive.Portal>
    </AlertPrimitive.Root>
  );
}
