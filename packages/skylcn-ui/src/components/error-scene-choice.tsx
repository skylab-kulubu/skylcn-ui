'use client';

import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn, type SkylcnLocale } from '../lib/provider.js';
import { Button } from './button.js';
import { errorSceneText } from './error-scene-text.js';
import { StatusPage } from './month-calendar.js';
import {
  pickErrorSceneVariant,
  sceneVariant,
  type ErrorSceneKind,
  type ErrorSceneVariant,
} from './scene-frame.js';

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

export type ErrorSceneChoiceProps = {
  kind: ErrorSceneKind;
  /** The kind's drawings that may be shown, each already drawn; the first is the fallback. */
  scenes: Partial<Record<ErrorSceneVariant, ReactNode>>;
  variant?: ErrorSceneVariant;
  locale?: SkylcnLocale;
  code?: ReactNode | null;
  title?: ReactNode;
  description?: ReactNode;
  href?: string;
  onAction?: () => void;
  children?: ReactNode;
  as?: 'main' | 'div';
  className?: string;
};

/**
 * The browser side of an error scene page: picks one of the drawings it is handed and shows
 * it with its words on StatusPage. The drawings come in as elements, so a server page sends
 * only its own kind's markup and a client page bundles only the kind it imports.
 */
export function ErrorSceneChoice({
  kind,
  scenes,
  variant,
  locale,
  code,
  title,
  description,
  href,
  onAction,
  children,
  as,
  className,
}: ErrorSceneChoiceProps) {
  const { locale: providerLocale, Link } = useSkylcn();
  const picked = useErrorSceneVariant(kind, variant);
  const first = Object.keys(scenes)[0] as ErrorSceneVariant;
  const shown = picked && picked in scenes ? picked : first;
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
      scene={scenes[shown]}
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
