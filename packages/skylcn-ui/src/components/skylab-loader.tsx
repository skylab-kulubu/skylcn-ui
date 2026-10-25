import { useId } from 'react';
import {
  SKYLAB_MARK_PATHS,
  SKYLAB_MARK_RADII,
  SKYLAB_MARK_VIEWBOX,
} from '../assets/skylab-mark.js';
import { cn } from '../lib/cn.js';

// Fatih Naz's loader from forms-frontend lights the mark in seven groups from the centre out.
// Each path's group, in SKYLAB_MARK_PATHS order; the stylesheet delays each group, so the
// loader carries no inline style and runs under a strict Content-Security-Policy.
const GROUPS = [4, 2, 0, 3, 4, 2, 5, 6, 3, 1, 4, 2, 3, 4, 2, 5, 6, 3, 1];
// Below these sizes the shimmer, halo and steel outline only muddy the mark.
const RICH_FROM = 32;
const METAL_FROM = 64;

export type SkylabLoaderProps = {
  /** Box size in CSS pixels. 16 to 24 inside buttons, 64 to 80 for page states. */
  size?: number;
  /** `done` holds the mark still, for the moment the wait ends. */
  state?: 'loading' | 'done';
  /**
   * `reveal`, the default, lights the mark group by group from its centre with a shimmer,
   * halo and steel glint at larger sizes; `radiate` lights each path by its distance from
   * the centre; `pulse` breathes the whole mark, for small quiet places.
   */
  variant?: 'reveal' | 'radiate' | 'pulse';
  className?: string;
};

/** The SKY LAB mark lighting up from its centre; the one loading indicator of every product. */
export function SkylabLoader({
  size = 80,
  state = 'loading',
  variant = 'reveal',
  className,
}: SkylabLoaderProps) {
  // useId's characters do not all survive inside url(#…)
  const steelId = `skylcn-steel-${useId().replace(/[^\w-]/g, '')}`;
  const animate = state === 'loading';
  const reveal = animate && variant === 'reveal';
  const rich = reveal && size >= RICH_FROM;
  const metal = reveal && size >= METAL_FROM;
  const paths = SKYLAB_MARK_PATHS.map((d, i) => (
    <path
      key={i}
      d={d}
      data-group={reveal ? GROUPS[i] : undefined}
      data-r={animate && variant === 'radiate' ? Math.round(SKYLAB_MARK_RADII[i]! * 10) : undefined}
    />
  ));

  return (
    <span
      data-slot="skylab-loader"
      aria-hidden
      className={cn(
        'relative inline-grid shrink-0 text-secondary-foreground',
        reveal && 'skylcn-loader',
        animate && variant === 'radiate' && 'skylcn-loader-radiate',
        animate && variant === 'pulse' && 'skylcn-loader-pulse',
        rich && 'skylcn-loader-rich',
        className,
      )}
    >
      {rich ? <span className="skylcn-loader-halo absolute inset-0 rounded-full" /> : null}
      <svg
        viewBox={SKYLAB_MARK_VIEWBOX}
        width={size}
        height={size}
        fill="currentColor"
        className="skylcn-loader-mark relative block"
      >
        <g fillRule="evenodd">{paths}</g>
      </svg>
      {metal ? (
        <svg
          viewBox={SKYLAB_MARK_VIEWBOX}
          fill="none"
          className="skylcn-loader-metal absolute inset-0 block size-full"
        >
          <defs>
            <linearGradient
              id={steelId}
              x1="0"
              y1="0"
              x2="586"
              y2="554"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="var(--skylcn-steel-hi)" />
              <stop offset="0.22" stopColor="var(--skylcn-steel-lo)" />
              <stop offset="0.45" stopColor="var(--skylcn-steel-hi)" />
              <stop offset="0.6" stopColor="var(--skylcn-steel-lo)" />
              <stop offset="0.82" stopColor="var(--skylcn-steel-hi)" />
              <stop offset="1" stopColor="var(--skylcn-steel-lo)" />
            </linearGradient>
          </defs>
          <g stroke={`url(#${steelId})`} strokeWidth={size >= 120 ? 5 : 7} strokeLinejoin="round">
            {paths}
          </g>
        </svg>
      ) : null}
    </span>
  );
}
