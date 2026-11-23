import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export type ErrorSceneKind =
  'notFound' | 'error' | 'forbidden' | 'offline' | 'sessionExpired' | 'maintenance';

export type SceneProps = {
  /**
   * `false` holds the scene on its still frame, which also tells the story, as reduced
   * motion does. Defaults to `true`; reduced motion (system or `data-motion="reduced"`)
   * stops it either way.
   */
  animated?: boolean;
  /** Sizes the scene; it is fluid up to 18rem by default and keeps its 4:3 shape. */
  className?: string;
};

/**
 * The shared drawing of every error scene: a 240 × 180 box of round-capped lines, 2 units for
 * a subject and 1.25 for its details, in theme colours (`--skylcn-scene-*` in the theme), with
 * a CSS-only animation that reduced motion stops. Decoration: hidden from screen readers, the
 * page's title and line carry the meaning.
 */
export function SceneFrame({
  kind,
  animated = true,
  className,
  children,
}: SceneProps & { kind: ErrorSceneKind; children: ReactNode }) {
  return (
    <svg
      data-slot="error-scene"
      data-kind={kind}
      data-still={animated ? undefined : ''}
      viewBox="0 0 240 180"
      aria-hidden
      focusable="false"
      fill="none"
      stroke="var(--skylcn-scene-ink)"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('skylcn-scene block aspect-[4/3] h-auto w-full max-w-72', className)}
    >
      {children}
    </svg>
  );
}

/** A four-pointed sparkle centred on (x, y), for stars and glints. */
export function Sparkle({
  x,
  y,
  r = 5,
  className,
}: {
  x: number;
  y: number;
  r?: number;
  className?: string;
}) {
  const k = Math.round(r * 28) / 100;
  return (
    <path
      className={className}
      d={`M${x} ${y - r}L${x + k} ${y - k}L${x + r} ${y}L${x + k} ${y + k}L${x} ${y + r}L${x - k} ${y + k}L${x - r} ${y}L${x - k} ${y - k}Z`}
      fill="var(--skylcn-scene-warm)"
      stroke="none"
    />
  );
}
