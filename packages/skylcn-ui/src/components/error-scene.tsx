import type { SkylcnLocale } from '../lib/provider.js';
import { ForbiddenScene } from './scene-forbidden.js';
import type { ErrorSceneKind, SceneProps } from './scene-frame.js';
import { MaintenanceScene } from './scene-maintenance.js';
import { NotFoundScene } from './scene-not-found.js';
import { OfflineScene } from './scene-offline.js';
import { ServerErrorScene } from './scene-server-error.js';
import { SessionExpiredScene } from './scene-session-expired.js';

// No 'use client': a server page (not-found.tsx) can draw a scene.

export type { ErrorSceneKind } from './scene-frame.js';

const SCENES = {
  notFound: NotFoundScene,
  error: ServerErrorScene,
  forbidden: ForbiddenScene,
  offline: OfflineScene,
  sessionExpired: SessionExpiredScene,
  maintenance: MaintenanceScene,
} as const;

export type ErrorSceneProps = SceneProps & { kind: ErrorSceneKind };

/**
 * The club's moving picture for a whole-page error, the same one for each kind in every
 * product: 404 GECEKODU asleep, 500 the ARTLAB robot crying, 403 the SkyDays key that will
 * not turn, offline the YıldızJam controller unplugged, an expired session SkyCamp's fire
 * gone out, maintenance WEBLAB's window under repair.
 *
 * Decoration only: hidden from screen readers, so the page's title and line say what
 * happened. Inline SVG with CSS animation, still under reduced motion, nothing random, so
 * server and browser draw the same frame. It brings all six scenes; a page that knows its
 * kind imports that scene alone (`NotFoundScene`, `ServerErrorScene`, `ForbiddenScene`,
 * `OfflineScene`, `SessionExpiredScene`, `MaintenanceScene`).
 */
export function ErrorScene({ kind, ...props }: ErrorSceneProps) {
  const Scene = SCENES[kind];
  return <Scene {...props} />;
}

export type ErrorSceneText = {
  /** A small code under the scene, for someone telling support what they saw. */
  code?: string;
  title: string;
  /** One sentence: what happened and what to do. */
  description: string;
  /** The one button's label. */
  action: string;
};

const TEXT: Record<SkylcnLocale, Record<ErrorSceneKind, ErrorSceneText>> = {
  tr: {
    notFound: {
      code: '404',
      title: 'Bu sayfa uyuyakalmış',
      description: 'Adres yanlış ya da sayfa taşınmış.',
      action: 'Ana sayfaya dön',
    },
    error: {
      code: '500',
      title: 'Bir şey bozuldu',
      description: 'Hata bizde; biraz sonra yeniden dene.',
      action: 'Yeniden dene',
    },
    forbidden: {
      code: '403',
      title: 'Bu kapı sana kapalı',
      description: 'Bu sayfayı görme yetkin yok.',
      action: 'Ana sayfaya dön',
    },
    offline: {
      title: 'Bağlantı koptu',
      description: 'İnternete bağlı değilsin; bağlanınca yeniden dene.',
      action: 'Yeniden dene',
    },
    sessionExpired: {
      title: 'Ateş sönmüş',
      description: 'Oturumun sona erdi; devam etmek için yeniden giriş yap.',
      action: 'Giriş yap',
    },
    maintenance: {
      code: '503',
      title: 'Kısa bir bakımdayız',
      description: 'Birkaç dakika içinde dönüyoruz.',
      action: 'Yeniden dene',
    },
  },
  en: {
    notFound: {
      code: '404',
      title: 'This page fell asleep',
      description: 'The address is wrong or the page has moved.',
      action: 'Back to home',
    },
    error: {
      code: '500',
      title: 'Something broke',
      description: 'The fault is ours; try again in a moment.',
      action: 'Try again',
    },
    forbidden: {
      code: '403',
      title: 'This door is closed to you',
      description: 'You do not have access to this page.',
      action: 'Back to home',
    },
    offline: {
      title: 'Connection lost',
      description: 'You are offline; try again once you are back.',
      action: 'Try again',
    },
    sessionExpired: {
      title: 'The fire went out',
      description: 'Your session ended; sign in again to carry on.',
      action: 'Sign in',
    },
    maintenance: {
      code: '503',
      title: 'Down for a short repair',
      description: 'We will be back in a few minutes.',
      action: 'Try again',
    },
  },
};

/**
 * The default title, line, code and button label for an error scene, so every product says
 * the same thing for the same error. A plain function, usable on the server; pass the
 * provider's `locale` in a client component.
 */
export function errorSceneText(kind: ErrorSceneKind, locale: SkylcnLocale = 'tr'): ErrorSceneText {
  return TEXT[locale][kind];
}
