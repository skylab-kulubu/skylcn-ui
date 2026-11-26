import type { ComponentType, ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Every kind's variants. A page that does not fix one shows a random one on each visit
 * (`ErrorScenePage`, `pickErrorSceneVariant`); the text for each lives beside its drawing.
 */
export const ERROR_SCENE_VARIANTS = {
  notFound: ['A', 'B', 'C'],
  error: ['A', 'B'],
  forbidden: ['A', 'B', 'C'],
  offline: ['A', 'B'],
  sessionExpired: ['A', 'B', 'C'],
  unavailable: ['A', 'B'],
  linkExpired: ['A', 'B'],
  tooManyRequests: ['A', 'B'],
  cookiesBlocked: ['A', 'B'],
  formClosed: ['A', 'B'],
} as const;

/**
 * The whole-page errors: 404, 500, 403, offline, an expired session, a server that does not
 * answer (502, 503, 504 and timeouts), an expired link (410), too many tries (429), cookies
 * blocked and a closed form.
 */
export type ErrorSceneKind = keyof typeof ERROR_SCENE_VARIANTS;
export type ErrorSceneVariant = 'A' | 'B' | 'C';
/** The variants a kind has. */
export type ErrorSceneVariantOf<K extends ErrorSceneKind> =
  (typeof ERROR_SCENE_VARIANTS)[K][number];

export type SceneProps<K extends ErrorSceneKind = ErrorSceneKind> = {
  /** Which of the kind's drawings; the first when left out or unknown. */
  variant?: ErrorSceneVariantOf<K>;
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
 * The drawings a visit may land on at random. A drawing tied to one cause is shown only for
 * it: unavailable's B ("Süre sınırı aşıldı") answers a 504 or a timeout alone.
 */
export const ERROR_SCENE_RANDOM: { [K in ErrorSceneKind]: readonly ErrorSceneVariantOf<K>[] } = {
  ...ERROR_SCENE_VARIANTS,
  unavailable: ['A'],
};

/**
 * The drawing an HTTP status asks for, if it asks for one: for `unavailable`, 504 (a
 * timeout) draws B and any other status (502, 503) A.
 */
export function statusSceneVariant(
  kind: ErrorSceneKind,
  status: number | undefined,
): ErrorSceneVariant | undefined {
  if (kind === 'unavailable' && status !== undefined) return status === 504 ? 'B' : 'A';
  return undefined;
}

/**
 * One of the kind's random drawings. Pass a `seed` (a request id, the path) to get the same
 * one for the same seed, for instance on the server and again in the browser.
 */
export function pickErrorSceneVariant(
  kind: ErrorSceneKind,
  seed?: string | number,
): ErrorSceneVariant {
  const variants = ERROR_SCENE_RANDOM[kind];
  const unit = seed === undefined ? Math.random() : hashToUnit(String(seed));
  return variants[Math.min(variants.length - 1, Math.floor(unit * variants.length))];
}

// FNV-1a, scaled into [0, 1)
function hashToUnit(text: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) / 0x100000000;
}

/** The variant to draw: the one asked for when the kind has it, else the first. */
export function sceneVariant<K extends ErrorSceneKind>(
  kind: K,
  variant: string | undefined,
): ErrorSceneVariantOf<K> {
  const variants: readonly string[] = ERROR_SCENE_VARIANTS[kind];
  return (variant && variants.includes(variant) ? variant : variants[0]) as ErrorSceneVariantOf<K>;
}

/**
 * The shared drawing of every error scene: a 240 × 180 box of round-capped lines, 2 units for
 * a subject and 1.25 for its details, in theme colours (`--skylcn-scene-*` in the theme), with
 * a CSS-only animation that reduced motion stops. Decoration: hidden from screen readers, the
 * page's title and line carry the meaning.
 */
export function SceneFrame<K extends ErrorSceneKind>({
  kind,
  variant,
  drawings,
  animated = true,
  className,
}: SceneProps<K> & {
  kind: K;
  drawings: Record<ErrorSceneVariantOf<K>, ComponentType>;
}) {
  const chosen = sceneVariant(kind, variant);
  const Drawing: ComponentType = drawings[chosen];
  return (
    <svg
      data-slot="error-scene"
      data-kind={kind}
      data-variant={chosen}
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
      <Drawing />
    </svg>
  );
}

export type SceneTone = 'ink' | 'soft' | 'faint' | 'brand' | 'warm' | 'cool' | 'alert' | 'surface';

/** Square cells of a pixel drawing (a logo, a canvas), each in a theme tone. */
export function Pixels({
  cells,
  width,
  height,
}: {
  cells: readonly (readonly [x: number, y: number, tone: SceneTone])[];
  width: number;
  height: number;
}): ReactNode {
  return cells.map(([x, y, tone]) => (
    <rect
      key={`${x} ${y}`}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={`var(--skylcn-scene-${tone})`}
    />
  ));
}
