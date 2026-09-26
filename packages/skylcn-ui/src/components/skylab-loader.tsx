'use client';

import { SKYLAB_MARK_DATA_URI } from '../assets/skylab-mark.js';
import {
  Benday,
  bakeCached,
  type BakeOptions,
  type BendayState,
  type PresetName,
} from '../lib/benday/benday.js';
import { cn } from '../lib/cn.js';

const MARK_BAKE: BakeOptions = { grid: 28 };

// Bake the mark once the package loads in a browser, so the first loader paints at once.
if (typeof window !== 'undefined') {
  bakeCached(SKYLAB_MARK_DATA_URI, MARK_BAKE).catch(() => undefined);
}

export type SkylabLoaderProps = {
  /** Box size in CSS pixels. 16 to 24 inside buttons, 64 to 80 for page states. */
  size?: number;
  /** A benday preset; `contour` sweeps along the mark's strokes. */
  preset?: PresetName;
  /** `done` settles the dots back into the still mark. */
  state?: BendayState;
  className?: string;
};

/** The SKY LAB mark as an animated dot field; the one loading indicator of every product. */
export function SkylabLoader({
  size = 80,
  preset = 'contour',
  state = 'thinking',
  className,
}: SkylabLoaderProps) {
  return (
    <Benday
      src={SKYLAB_MARK_DATA_URI}
      bake={MARK_BAKE}
      size={size}
      preset={preset}
      state={state}
      className={cn('text-secondary-foreground', className)}
      aria-hidden
    />
  );
}
