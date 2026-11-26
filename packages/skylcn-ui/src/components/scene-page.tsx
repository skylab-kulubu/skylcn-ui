import type { ComponentType, ReactNode } from 'react';
import type { SkylcnLocale } from '../lib/provider.js';
import { ErrorSceneChoice } from './error-scene-choice.js';
import {
  ERROR_SCENE_RANDOM,
  sceneVariant,
  statusSceneVariant,
  type ErrorSceneKind,
  type ErrorSceneVariant,
  type ErrorSceneVariantOf,
  type SceneProps,
} from './scene-frame.js';

// No 'use client': a server page (not-found.tsx) renders it and sends the browser its kind's
// drawings as markup, with no scene code at all.

export type ErrorScenePageProps = {
  /**
   * One of the kind's drawings with its words. Left out, each visit gets a random one, chosen
   * in the browser; a server that wants it in the HTML passes `pickErrorSceneVariant(kind)`,
   * and a page that never hydrates (static HTML, renderToStaticMarkup) must pass one.
   */
  variant?: ErrorSceneVariant;
  /**
   * The HTTP status behind the page, for a kind whose drawings answer different causes:
   * `unavailable` draws B for 504 (a timeout) and A for 502 and 503, never at random.
   */
  status?: number;
  /** The words' language; the provider's by default. */
  locale?: SkylcnLocale;
  /** Overrides the variant's small line; `null` leaves it out. */
  code?: ReactNode | null;
  /** Overrides the variant's title. */
  title?: ReactNode;
  /** Overrides the variant's sentence. */
  description?: ReactNode;
  /** The button as a link, labelled with the variant's words (such as "Ana sayfaya dön"). */
  href?: string;
  /** The button as a button, such as an error boundary's `reset`; from a client page only. */
  onAction?: () => void;
  /** Further buttons after the variant's one. */
  children?: ReactNode;
  /** `false` holds the scene still. */
  animated?: boolean;
  /**
   * `div` inside a page that already has its main landmark. The title stays the page's h1,
   * so the frame around it should not carry one of its own.
   */
  as?: 'main' | 'div';
  className?: string;
};

/** A kind's error page drawn with that kind's scene alone; each kind exports one. */
export function ScenePage<K extends ErrorSceneKind>({
  kind,
  Scene,
  variant,
  status,
  animated,
  ...rest
}: ErrorScenePageProps & { kind: K; Scene: ComponentType<SceneProps<K>> }) {
  const fixed = variant ? sceneVariant(kind, variant) : statusSceneVariant(kind, status);
  const variants: readonly ErrorSceneVariantOf<K>[] = fixed
    ? [fixed as ErrorSceneVariantOf<K>]
    : ERROR_SCENE_RANDOM[kind];
  const scenes: Partial<Record<ErrorSceneVariant, ReactNode>> = {};
  for (const each of variants) scenes[each] = <Scene variant={each} animated={animated} />;
  return <ErrorSceneChoice kind={kind} variant={fixed} scenes={scenes} {...rest} />;
}
