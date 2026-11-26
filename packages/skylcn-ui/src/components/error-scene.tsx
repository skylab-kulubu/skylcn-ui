import type { ComponentType } from 'react';
import { CookiesBlockedScene } from './scene-cookies-blocked.js';
import { ForbiddenScene } from './scene-forbidden.js';
import { FormClosedScene } from './scene-form-closed.js';
import {
  ERROR_SCENE_VARIANTS,
  type ErrorSceneKind,
  type ErrorSceneVariant,
  type SceneProps,
} from './scene-frame.js';
import { LinkExpiredScene } from './scene-link-expired.js';
import { NotFoundScene } from './scene-not-found.js';
import { OfflineScene } from './scene-offline.js';
import { ServerErrorScene } from './scene-server-error.js';
import { SessionExpiredScene } from './scene-session-expired.js';
import { TooManyRequestsScene } from './scene-too-many-requests.js';
import { ScenePage, type ErrorScenePageProps } from './scene-page.js';
import { UnavailableScene } from './scene-unavailable.js';

// No 'use client': a server page (not-found.tsx) can draw a scene.

export {
  ERROR_SCENE_RANDOM,
  ERROR_SCENE_VARIANTS,
  pickErrorSceneVariant,
  statusSceneVariant,
  type ErrorSceneKind,
  type ErrorSceneVariant,
  type ErrorSceneVariantOf,
} from './scene-frame.js';
export type { ErrorScenePageProps } from './scene-page.js';
export { errorSceneText, type ErrorSceneText } from './error-scene-text.js';

const SCENES: Record<ErrorSceneKind, ComponentType<SceneProps>> = {
  notFound: NotFoundScene,
  error: ServerErrorScene,
  forbidden: ForbiddenScene,
  offline: OfflineScene,
  sessionExpired: SessionExpiredScene,
  unavailable: UnavailableScene,
  linkExpired: LinkExpiredScene,
  tooManyRequests: TooManyRequestsScene,
  cookiesBlocked: CookiesBlockedScene,
  formClosed: FormClosedScene,
} as Record<ErrorSceneKind, ComponentType<SceneProps>>;

/** Every kind, in the order the docs list them. */
export const ERROR_SCENE_KINDS = Object.keys(ERROR_SCENE_VARIANTS) as ErrorSceneKind[];

export type ErrorSceneProps = Omit<SceneProps, 'variant'> & {
  kind: ErrorSceneKind;
  /** One of the kind's drawings; the first when left out or when the kind has no such one. */
  variant?: ErrorSceneVariant;
};

/**
 * The club's moving picture for a whole-page error, the same set for each kind in every
 * product, each a moment a member knows from GECEKODU, SKYDAYS, ARTLAB, YıldızJam, WEBLAB,
 * ALGOLAB or YıldızPlace. Each kind has two or three drawings with their own words
 * (`errorSceneText(kind, locale, variant)`); `ErrorScenePage` shows a random one on each visit.
 *
 * Decoration only: hidden from screen readers, so the page's title and line say what
 * happened. Inline SVG with CSS animation, still under reduced motion, nothing random inside,
 * so server and browser draw the same frame for the same variant. It brings every kind's
 * drawings; a page that knows its kind imports that scene alone (`NotFoundScene`,
 * `ServerErrorScene`, `ForbiddenScene`…).
 */
export function ErrorScene({ kind, ...props }: ErrorSceneProps) {
  const Scene = SCENES[kind];
  return <Scene {...props} />;
}

/**
 * A whole-page error as every product shows it: the kind's scene, its small code, title, one
 * sentence and one button, on StatusPage, with a random drawing on each visit (see
 * `ErrorScenePageProps`). Rendered by a server page (not-found.tsx) it sends the browser only
 * its kind's drawings, as markup. A client page (error.tsx, global-error.tsx) imports the
 * kind's own page instead (`ServerErrorScenePage`, `OfflineScenePage`…), since this one
 * brings every kind's drawings into its bundle.
 *
 * Picked in the browser, a server-rendered page stays hidden while it hydrates, so a page that
 * hydrates within 1.5 seconds shows its pick straight away. Past 1.5 seconds it shows the
 * first drawing, which the pick replaces if the page hydrates later; without script, or when
 * hydration never comes, the first drawing stays.
 */
export function ErrorScenePage({ kind, ...props }: ErrorScenePageProps & { kind: ErrorSceneKind }) {
  return <ScenePage kind={kind} Scene={SCENES[kind]} {...props} />;
}
