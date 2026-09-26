'use client';

import {
  SKYLAB_MARK_DATA_URI,
  SKYLAB_MARK_PATHS,
  SKYLAB_MARK_RADII,
  SKYLAB_MARK_VIEWBOX,
} from '../assets/skylab-mark.js';
import { Benday, bakeCached, type BakeOptions, type BendayState } from '../lib/benday/benday.js';
import { cn } from '../lib/cn.js';

// Below this a dot field cannot hold the mark's thin rays, so the crisp mark animates instead.
const DOT_FIELD_MIN_SIZE = 56;
const RADIATE_SPREAD_MS = 700;
const MARK_BAKE: BakeOptions = { grid: 44, threshold: 0.12, dilate: 1 };

// Bake the mark once the package loads in a browser, so the first dot field paints at once.
if (typeof window !== 'undefined') {
  bakeCached(SKYLAB_MARK_DATA_URI, MARK_BAKE).catch(() => undefined);
}

export type SkylabLoaderProps = {
  /** Box size in CSS pixels. 16 to 24 inside buttons, 64 to 80 for page states. */
  size?: number;
  /** `done` settles into the still mark. */
  state?: BendayState;
  /**
   * `auto` draws the crisp mark lighting up from its centre below 56px and the
   * dot field from 56px up; `mark` and `dots` force one of them.
   */
  variant?: 'auto' | 'mark' | 'dots';
  className?: string;
};

/** The SKY LAB mark as the one loading indicator of every product. */
export function SkylabLoader({
  size = 80,
  state = 'thinking',
  variant = 'auto',
  className,
}: SkylabLoaderProps) {
  const dots = variant === 'dots' || (variant === 'auto' && size >= DOT_FIELD_MIN_SIZE);

  if (!dots) {
    const animate = state === 'thinking';
    return (
      <svg
        data-slot="skylab-loader"
        viewBox={SKYLAB_MARK_VIEWBOX}
        width={size}
        height={size}
        fill="currentColor"
        aria-hidden
        className={cn(
          'text-secondary-foreground shrink-0',
          animate && 'skylcn-mark-radiate',
          className,
        )}
      >
        <g fillRule="evenodd">
          {SKYLAB_MARK_PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              style={
                animate
                  ? { animationDelay: `${Math.round(SKYLAB_MARK_RADII[i]! * RADIATE_SPREAD_MS)}ms` }
                  : undefined
              }
            />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <Benday
      data-slot="skylab-loader"
      src={SKYLAB_MARK_DATA_URI}
      bake={MARK_BAKE}
      preset="shimmer"
      dotScale={0.82}
      weight={0.35}
      size={size}
      state={state}
      className={cn('text-secondary-foreground shrink-0', className)}
      aria-hidden
    />
  );
}
