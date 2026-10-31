'use client';

import { CircleAlert, CircleCheck, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';

const NOTICE = {
  info: { icon: Info, box: 'border-info/30 bg-info/5', icon_: 'text-info' },
  success: { icon: CircleCheck, box: 'border-success/30 bg-success/5', icon_: 'text-success' },
  warning: { icon: TriangleAlert, box: 'border-warning/30 bg-warning/5', icon_: 'text-warning' },
  danger: {
    icon: CircleAlert,
    box: 'border-destructive/30 bg-destructive/5',
    icon_: 'text-destructive',
  },
} as const;

export type NoticeProps = Omit<ComponentProps<'div'>, 'title'> & {
  tone?: keyof typeof NOTICE;
  /**
   * Replaces the tone's icon, such as a calendar for a deadline; it keeps the tone's
   * colour. Its shape no longer tells the tone, so the text has to.
   */
  icon?: LucideIcon;
  title?: ReactNode;
  /** A button or link under the text. */
  action?: ReactNode;
  /** Shows a close button; the parent removes the notice. */
  onDismiss?: () => void;
  /** The close button's accessible name, such as "Duyuruyu kapat"; the locale's "Kapat" by default. */
  dismissLabel?: string;
};

/**
 * A message inside the page: a service under maintenance, a form that closes
 * tomorrow. The tone comes with an icon, so it is not told by colour alone.
 */
export function Notice({
  tone = 'info',
  icon,
  title,
  action,
  onDismiss,
  dismissLabel,
  className,
  children,
  ...props
}: NoticeProps) {
  const { messages } = useSkylcn();
  const style = NOTICE[tone];
  const Icon = icon ?? style.icon;
  return (
    <div
      data-slot="notice"
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn(
        'relative flex gap-3 rounded-lg border p-3',
        onDismiss && 'pr-10',
        style.box,
        className,
      )}
      {...props}
    >
      <Icon className={cn('mt-0.5 size-4 shrink-0', style.icon_)} aria-hidden />
      <div className="flex min-w-0 flex-col gap-1">
        {title ? <p className="text-sm font-medium text-foreground">{title}</p> : null}
        {children ? (
          <div className="text-xs leading-relaxed text-muted-foreground">{children}</div>
        ) : null}
        {action ? <div className="mt-1">{action}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel ?? messages.close}
          className="absolute top-2.5 right-2.5 grid size-6 place-items-center rounded-md text-subtle-foreground outline-hidden hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
