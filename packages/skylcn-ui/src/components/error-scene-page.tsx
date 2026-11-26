'use client';

import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn, type SkylcnLocale } from '../lib/provider.js';
import { Button } from './button.js';
import { errorSceneText } from './error-scene-text.js';
import { ErrorScene, pickErrorSceneVariant } from './error-scene.js';
import { StatusPage } from './month-calendar.js';
import { sceneVariant, type ErrorSceneKind, type ErrorSceneVariant } from './scene-frame.js';

const noSubscription = () => () => {};

/**
 * The variant to show: the one given, else a random one per mount, chosen in the browser.
 * While a server-rendered page hydrates it is `undefined`, so the server's HTML and the first
 * browser render agree; the pick follows straight after. A page rendered in the browser (a
 * client-side navigation, an error boundary) gets its pick on the first render.
 */
export function useErrorSceneVariant(
  kind: ErrorSceneKind,
  variant?: ErrorSceneVariant,
): ErrorSceneVariant | undefined {
  // Drawn once per mount, on the server too, where it is never shown
  const [random] = useState(() => pickErrorSceneVariant(kind));
  const inBrowser = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  if (variant) return sceneVariant(kind, variant);
  return inBrowser ? sceneVariant(kind, random) : undefined;
}

export type ErrorScenePageProps = {
  kind: ErrorSceneKind;
  /**
   * One of the kind's drawings with its words. Left out, each visit gets a random one, chosen
   * in the browser; a server that wants it in the HTML passes `pickErrorSceneVariant(kind)`.
   */
  variant?: ErrorSceneVariant;
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
  /** The button as a button, such as an error boundary's `reset`. */
  onAction?: () => void;
  /** Further buttons after the variant's one. */
  children?: ReactNode;
  /** `false` holds the scene still. */
  animated?: boolean;
  /** `div` inside a page that already has its main landmark. */
  as?: 'main' | 'div';
  className?: string;
};

/**
 * A whole-page error as every product shows it: the kind's scene, its small code, title, one
 * sentence and one button, on StatusPage. Without `variant` it shows a random drawing on each
 * visit. Rendered on the server, the page stays hidden for the moment it takes to hydrate, so
 * nobody sees one drawing swap for another; without script (or a browser that cannot tell) it
 * shows the first drawing.
 */
export function ErrorScenePage({
  kind,
  variant,
  locale,
  code,
  title,
  description,
  href,
  onAction,
  children,
  animated,
  as,
  className,
}: ErrorScenePageProps) {
  const { locale: providerLocale, Link } = useSkylcn();
  const picked = useErrorSceneVariant(kind, variant);
  const shown = picked ?? sceneVariant(kind, undefined);
  const text = errorSceneText(kind, locale ?? providerLocale, shown);
  const action = href ? (
    <Button variant="primary" render={Link === 'a' ? <a href={href} /> : <Link href={href} />}>
      {text.action}
    </Button>
  ) : onAction ? (
    <Button variant="primary" onClick={onAction}>
      {text.action}
    </Button>
  ) : null;
  return (
    <StatusPage
      // a new drawing enters afresh, so the rise plays once it is visible
      key={picked ?? 'pending'}
      as={as}
      className={cn(picked ? undefined : 'skylcn-error-pending', className)}
      scene={<ErrorScene kind={kind} variant={shown} animated={animated} />}
      code={code === null ? undefined : (code ?? text.code)}
      title={title ?? text.title}
      description={description ?? text.description}
    >
      {action || children ? (
        <>
          {action}
          {children}
        </>
      ) : null}
    </StatusPage>
  );
}
