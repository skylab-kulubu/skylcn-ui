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
 * product, each a moment a member knows: 404 GECEKODU at 03:47 with "404" in the terminal,
 * 500 the ARTLAB robot watching a training run blow up at step 23, 403 a guessed SkyDays CTF
 * flag refused, offline YıldızJam's jam paused, an expired session GECEKODU's pranks on an
 * unlocked laptop, maintenance WEBLAB deploying.
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
      title: 'Bu sayfa yok',
      description: "GECEKODU'nda sabaha karşı yazılmış, sonra kaybolmuş; adresi bir kontrol et.",
      action: 'Ana sayfaya dön',
    },
    error: {
      code: '500',
      title: 'Bir şey bozuldu',
      description:
        "Sunucu, ARTLAB'de eğitilen bir model gibi 23. adımda çöktü; birazdan yeniden dene.",
      action: 'Yeniden dene',
    },
    forbidden: {
      code: '403',
      title: 'Bu kapı sana kapalı',
      description:
        "Bu sayfanın bayrağı sende yok ve SKYDAYS'teki gibi tahminle açılmıyor; yetki için ekip liderine yaz.",
      action: 'Ana sayfaya dön',
    },
    offline: {
      title: 'Oyun duraklatıldı',
      description:
        "İnternet bağlantın koptu, YıldızJam'de olsa 48 saatinden yiyordu; bağlanınca kaldığın yerden devam et.",
      action: 'Devam et',
    },
    sessionExpired: {
      title: 'Oturumun kapandı',
      description:
        "Masadan fazla uzak kaldın, GECEKODU'nda olsa masaüstün çoktan dosyayla dolmuştu; devam etmek için yeniden giriş yap.",
      action: 'Yeniden giriş yap',
    },
    maintenance: {
      code: '503',
      title: 'Kısa bir bakımdayız',
      description:
        "WEBLAB yeni sürümü canlıya alıyor, çubuk daha 3/5'te; birkaç dakika sonra yeniden dene.",
      action: 'Yeniden dene',
    },
  },
  en: {
    notFound: {
      code: '404',
      title: 'This page is gone',
      description:
        'It was written at GECEKODU in the small hours and then vanished; check the address.',
      action: 'Back to home',
    },
    error: {
      code: '500',
      title: 'Something broke',
      description:
        'The server crashed at step 23 like an ARTLAB training run; try again in a moment.',
      action: 'Try again',
    },
    forbidden: {
      code: '403',
      title: 'This door is closed to you',
      description:
        "You do not have this page's flag, and guessing will not open it any more than at SKYDAYS; ask your team lead for access.",
      action: 'Back to home',
    },
    offline: {
      title: 'Game paused',
      description:
        'You are offline, which at YıldızJam would eat into your 48 hours; carry on where you left off once you are back.',
      action: 'Continue',
    },
    sessionExpired: {
      title: 'Your session closed',
      description:
        'You were away from the desk too long, and at GECEKODU your desktop would be full of files by now; sign in again to carry on.',
      action: 'Sign in again',
    },
    maintenance: {
      code: '503',
      title: 'Down for a short repair',
      description:
        'WEBLAB is putting a new version live and the bar is only at 3/5; try again in a few minutes.',
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
