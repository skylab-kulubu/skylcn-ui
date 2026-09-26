'use client';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { SkylabLoader } from './skylab-loader.js';

const TONE_ICON = {
  neutral: 'text-secondary-foreground',
  danger: 'text-destructive',
  warning: 'text-warning',
  brand: 'text-skylab-300',
} as const;

export type StateCardProps = {
  /** Defaults to the "loading" label while `loading` is set. */
  title?: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  loading?: boolean;
  tone?: keyof typeof TONE_ICON;
  /** A line under the text, such as a status badge. */
  meta?: ReactNode;
  /** Content above the icon, such as an illustration. */
  top?: ReactNode;
  className?: string;
  /** Actions under the text. */
  children?: ReactNode;
};

/** A centred loading, empty, error or permission state for a page or a panel. */
export function StateCard({
  title,
  description,
  icon: Icon,
  loading = false,
  tone = 'neutral',
  meta,
  top,
  className,
  children,
}: StateCardProps) {
  const { messages } = useSkylcn();
  return (
    <div
      data-slot="state-card"
      role={loading ? 'status' : undefined}
      aria-live={loading ? 'polite' : undefined}
      className={cn('flex w-full flex-1 items-center justify-center px-6 py-10', className)}
    >
      <div className="mx-auto flex w-full max-w-md animate-in flex-col items-center text-center duration-(--motion-duration-slow) ease-enter fade-in-0 slide-in-from-bottom-6 zoom-in-98">
        {top ? <div className="mb-8 w-full max-w-85">{top}</div> : null}
        {loading ? (
          <SkylabLoader size={72} />
        ) : Icon ? (
          <Icon
            className={cn('size-9 drop-shadow-[0_6px_18px_rgb(0_0_0/0.35)]', TONE_ICON[tone])}
            strokeWidth={1.75}
          />
        ) : null}
        <div className={cn('flex flex-col gap-2 text-balance', loading ? 'mt-5' : 'mt-4')}>
          <p
            className={cn(
              'text-sm font-semibold',
              loading ? 'shimmer-text text-muted-foreground' : 'text-foreground',
            )}
          >
            {title ?? (loading ? messages.loading : null)}
          </p>
          {description ? (
            <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {meta ? <div className="mt-4">{meta}</div> : null}
        {children ? <div className="mt-5 w-full">{children}</div> : null}
      </div>
    </div>
  );
}
