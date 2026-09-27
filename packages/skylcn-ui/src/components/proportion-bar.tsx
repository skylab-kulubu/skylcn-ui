'use client';

import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';

export type ProportionSegment = { key: string; label: string; value: number };

export type ProportionBarProps = {
  /** Two to six parts in a fixed order; each keeps its chart colour by position. */
  segments: readonly ProportionSegment[];
  className?: string;
};

/**
 * One whole split into a few parts along a thin bar, such as registered and
 * anonymous replies, with a legend of counts and shares under it.
 */
export function ProportionBar({ segments, className }: ProportionBarProps) {
  const { locale } = useSkylcn();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const share = (value: number) => (total ? (value / total) * 100 : 0);
  const percent = (value: number) => {
    const text = Math.round(share(value)).toLocaleString(tag);
    return locale === 'tr' ? `%${text}` : `${text}%`;
  };

  return (
    <div data-slot="proportion-bar" className={cn('flex flex-col gap-2', className)}>
      <div
        aria-hidden
        className={cn(
          'flex h-2 w-full gap-0.5 overflow-hidden rounded-full',
          total === 0 && 'bg-muted',
        )}
      >
        {segments.map((segment, i) =>
          segment.value > 0 ? (
            <span
              key={segment.key}
              className="h-full transition-[width] duration-(--motion-duration-slow) ease-enter first:rounded-l-full last:rounded-r-full"
              style={{ width: `${share(segment.value)}%`, background: `var(--chart-${i + 1})` }}
            />
          ) : null,
        )}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((segment, i) => (
          <li key={segment.key} className="flex items-center gap-1.5 text-2xs">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-xs"
              style={{ background: `var(--chart-${i + 1})` }}
            />
            <span className="text-secondary-foreground">{segment.label}</span>
            <span className="text-subtle-foreground tabular-nums">
              {segment.value.toLocaleString(tag)} · {percent(segment.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
