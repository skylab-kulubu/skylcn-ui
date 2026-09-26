import {
  SKYLAB_MARK_PATHS,
  SKYLAB_MARK_RADII,
  SKYLAB_MARK_VIEWBOX,
} from '../assets/skylab-mark.js';
import { cn } from '../lib/cn.js';

const RADIATE_SPREAD_MS = 700;

export type SkylabLoaderProps = {
  /** Box size in CSS pixels. 16 to 24 inside buttons, 64 to 80 for page states. */
  size?: number;
  /** `done` holds the mark still, for the moment the wait ends. */
  state?: 'loading' | 'done';
  className?: string;
};

/** The SKY LAB mark lighting up from its centre; the one loading indicator of every product. */
export function SkylabLoader({ size = 80, state = 'loading', className }: SkylabLoaderProps) {
  const animate = state === 'loading';
  return (
    <svg
      data-slot="skylab-loader"
      viewBox={SKYLAB_MARK_VIEWBOX}
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      className={cn(
        'shrink-0 text-secondary-foreground',
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
