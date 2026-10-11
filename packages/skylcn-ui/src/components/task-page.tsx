import type { LucideIcon } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { SkylabMark } from './skylab-mark.js';
import { SkylabLoader } from './skylab-loader.js';

// No 'use client': a server page can render it and pass a Lucide icon straight in.

const TONE_ICON = {
  neutral: 'text-secondary-foreground',
  success: 'text-success',
  danger: 'text-destructive',
  warning: 'text-warning',
  brand: 'text-skylab-300',
} as const;

const SIZE = {
  md: 'max-w-md',
  lg: 'max-w-xl',
} as const;

export type TaskPageProps = {
  /** The page's one h1; it also names the task region. */
  title: ReactNode;
  /** A line under the title; screen readers hear it as the task's description. */
  description?: ReactNode;
  /** A short label above the title, such as "Etkinlik girişi". */
  eyebrow?: ReactNode;
  /** Above the title; the tone colours it. Replaced by the loader while `loading`. */
  icon?: LucideIcon;
  /** StateCard's tones plus `success`. */
  tone?: keyof typeof TONE_ICON;
  /** Shows the SKY LAB loader and marks the heading busy until the result is in. */
  loading?: boolean;
  /** The row above the task. Defaults to the SKY LAB mark and name; `null` leaves it out. */
  brand?: ReactNode;
  /** The task's body: a form, details, notices. Unlike StateCard, not its buttons. */
  children?: ReactNode;
  /** Buttons under the body: stacked on phones, in a row from `sm` up. */
  actions?: ReactNode;
  /** Small links under the task, outside the card: privacy, help, the home page. */
  footer?: ReactNode;
  /** `md` (28rem) for a form or a sign-in, `lg` (36rem) for a record such as a certificate. */
  size?: keyof typeof SIZE;
  /** `center` for sign-in and state pages, `start` for forms and records. */
  align?: 'start' | 'center';
  /** Draws the task on a card from `sm` up; on phones it always fills the width without one. */
  framed?: boolean;
  /** `div` when shown inside a page that already has its main landmark. */
  as?: 'main' | 'div';
  className?: string;
};

/**
 * A page with one job: sign in, check in at the door, verify a certificate,
 * follow an account deletion. The SKY LAB mark on top, then one task with its
 * title, description, body and actions, and small links under it. Centred on
 * larger screens, full width on phones.
 *
 * Unlike StateCard, `children` is the task's body; its buttons go in `actions`.
 *
 * Focus is left alone: a full page load starts at the top and the title is the
 * first heading. When the page swaps a loading state for its result in place,
 * the heading is a polite live region that stays quiet while `loading` is set,
 * so the new title and description are read once, without moving focus. That
 * works only while the same TaskPage stays mounted and its props change: a
 * Suspense fallback replaced by another TaskPage builds a new live region, which
 * is not announced. Put no `aria-live` of your own around it, or it is read twice.
 *
 * The page paints `bg-background`; over a decorated background of its own, pass
 * `className="bg-transparent"`. A body that already sits on a Card (a door
 * check-in form) takes `framed={false}`, so there is no card in a card.
 */
export function TaskPage({
  title,
  description,
  eyebrow,
  icon: Icon,
  tone = 'neutral',
  loading = false,
  brand,
  children,
  actions,
  footer,
  size = 'md',
  align = 'start',
  framed = true,
  as: Root = 'main',
  className,
}: TaskPageProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const center = align === 'center';

  return (
    <Root
      data-slot="task-page"
      className={cn(
        'flex min-h-dvh flex-col bg-background px-5 pt-10 pb-12 sm:items-center sm:justify-center sm:px-6',
        className,
      )}
    >
      <div className={cn('mx-auto flex w-full enter-rise-lg flex-col gap-6', SIZE[size])}>
        {brand === null ? null : (
          <div
            data-slot="task-page-brand"
            className={cn(
              'flex items-center gap-2 text-foreground-strong',
              center && 'justify-center',
            )}
          >
            {brand ?? (
              <>
                <SkylabMark size={22} />
                <span className="text-sm font-semibold tracking-tight">SKY LAB</span>
              </>
            )}
          </div>
        )}

        <section
          data-slot="task-page-task"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          className={cn(
            'flex flex-col',
            framed && 'sm:rounded-xl sm:border sm:border-border sm:bg-card sm:p-8',
          )}
        >
          <div
            data-slot="task-page-header"
            aria-live="polite"
            aria-busy={loading || undefined}
            className={cn(
              'flex min-w-0 flex-col',
              center ? 'items-center text-center' : 'items-start',
            )}
          >
            {loading ? (
              <SkylabLoader size={64} className="mb-5" />
            ) : Icon ? (
              <Icon className={cn('mb-4 size-9', TONE_ICON[tone])} strokeWidth={1.75} />
            ) : null}
            {eyebrow ? (
              <p className="mb-2 text-2xs font-medium tracking-label text-subtle-foreground uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h1
              id={titleId}
              // An admin-typed session title or an e-mail can be one long word: break it
              // anywhere rather than push the page sideways on a phone
              className="max-w-full text-2xl leading-tight font-semibold text-balance wrap-anywhere text-foreground-strong"
            >
              {title}
            </h1>
            {description ? (
              <p
                id={descriptionId}
                className="mt-2 max-w-full text-sm leading-relaxed text-pretty wrap-anywhere text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>

          {children ? (
            <div data-slot="task-page-body" className="mt-6 flex min-w-0 flex-col gap-4">
              {children}
            </div>
          ) : null}

          {actions ? (
            <div
              data-slot="task-page-actions"
              className={cn(
                'mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap',
                center && 'sm:justify-center',
              )}
            >
              {actions}
            </div>
          ) : null}
        </section>

        {footer ? (
          <footer
            data-slot="task-page-footer"
            className={cn(
              'flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground',
              // Plain anchors and router links alike get a 24px target, the hover and the focus ring
              '[&_a]:inline-flex [&_a]:min-h-6 [&_a]:items-center [&_a]:rounded-sm [&_a]:outline-hidden [&_a]:transition-colors [&_a]:duration-(--motion-duration-fast) [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-ring [&_a:hover]:text-foreground',
              center && 'justify-center',
            )}
          >
            {footer}
          </footer>
        ) : null}
      </div>
    </Root>
  );
}
