import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';

export type TrendBadgeProps = {
  /** The change in percent; positive is a rise. */
  value: number | null | undefined;
  /** Whether a rise is good news; false for figures like errors or wait time. */
  riseIsGood?: boolean;
  className?: string;
};

/**
 * A change against the previous period, with an arrow so the direction is not
 * told by colour alone: green when the change is good news, red when it is not.
 */
export function TrendBadge({ value, riseIsGood = true, className }: TrendBadgeProps) {
  const { locale } = useSkylcn();
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  const rounded = Math.round(value * 10) / 10;
  const Icon = rounded > 0 ? TrendingUp : rounded < 0 ? TrendingDown : Minus;
  const good = rounded === 0 ? null : rounded > 0 === riseIsGood;
  const number = new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    maximumFractionDigits: 1,
    signDisplay: 'exceptZero',
  }).format(rounded);
  return (
    <span
      data-slot="trend-badge"
      className={cn(
        'inline-flex items-center gap-1 text-2xs font-medium tabular-nums',
        good === null ? 'text-muted-foreground' : good ? 'text-success' : 'text-destructive',
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {locale === 'tr' ? `%${number}` : `${number}%`}
    </span>
  );
}
