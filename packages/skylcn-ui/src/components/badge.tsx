import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

const TONES = {
  neutral: 'border-border text-muted-foreground',
  strong: 'border-border-strong bg-accent-strong text-secondary-foreground',
  brand: 'border-skylab-400/40 bg-skylab-500/10 text-skylab-300',
  success: 'border-success/35 bg-success/10 text-success',
  warning: 'border-warning/35 bg-warning/10 text-warning',
  danger: 'border-destructive/35 bg-destructive/10 text-destructive',
  info: 'border-info/35 bg-info/10 text-info',
} as const;

const badgeVariants = cva(
  'inline-flex shrink-0 items-center gap-1 border font-medium whitespace-nowrap [&_svg]:size-3 [&_svg]:shrink-0',
  {
    variants: {
      tone: TONES,
      size: {
        xs: 'rounded-md px-1 py-px text-3xs leading-3.5 tracking-wide uppercase',
        sm: 'rounded-md px-1.5 py-0.5 text-3xs',
        md: 'rounded-md px-2 py-0.5 text-2xs',
        pill: 'rounded-full px-3 py-0.5 text-3xs font-semibold tracking-label uppercase',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'sm' },
  },
);

export type BadgeTone = keyof typeof TONES;

export type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>;

/** A small label: a role, a count, a state. `pill` is the uppercase section status. */
export function Badge({ className, tone, size, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ tone, size }), className)} {...props} />
  );
}

const DOT_TONES = {
  neutral: 'bg-subtle-foreground',
  brand: 'bg-skylab-400 shadow-skylab-400/40',
  success: 'bg-success shadow-success/40',
  warning: 'bg-warning shadow-warning/40',
  danger: 'bg-destructive shadow-destructive/40',
  info: 'bg-info shadow-info/40',
} as const;

export type StatusDotProps = ComponentProps<'span'> & {
  tone?: keyof typeof DOT_TONES;
  /** Adds the soft glow used for live states. */
  glow?: boolean;
  /**
   * What the state is, such as "Açık". Colour alone does not reach everyone, so
   * give it unless the same words already sit next to the dot.
   */
  label?: string;
};

/** A 6px state dot, glowing for live states. */
export function StatusDot({
  tone = 'neutral',
  glow = tone !== 'neutral',
  label,
  className,
  ...props
}: StatusDotProps) {
  return (
    <span
      data-slot="status-dot"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      title={label}
      className={cn(
        'inline-block size-1.5 shrink-0 rounded-full',
        DOT_TONES[tone],
        glow && 'shadow-[0_0_6px]',
        className,
      )}
      {...props}
    />
  );
}

export { badgeVariants };
