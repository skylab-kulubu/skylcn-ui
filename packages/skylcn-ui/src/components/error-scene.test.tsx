import { act, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import theme from '../styles/error-scene.css?raw';
import themeBase from '../styles/theme-base.css?raw';
import { axeViolations } from '../test/axe.js';
import {
  ERROR_SCENE_KINDS,
  ERROR_SCENE_RANDOM,
  ERROR_SCENE_VARIANTS,
  ErrorScene,
  ErrorScenePage,
  errorSceneText,
  pickErrorSceneVariant,
  statusSceneVariant,
  type ErrorSceneVariant,
} from './error-scene.js';
import * as kinds from '../index.js';
import { StatusPage } from './month-calendar.js';
import { NotFoundScene } from './scene-not-found.js';
import { ServerErrorScene } from './scene-server-error.js';
import { SessionExpiredScene } from './scene-session-expired.js';
import { UnavailableScenePage } from './scene-unavailable.js';
import { TaskPage } from './task-page.js';

const EVERY = ERROR_SCENE_KINDS.flatMap((kind) =>
  ERROR_SCENE_VARIANTS[kind].map((variant) => [kind, variant] as const),
);

function scene(container: HTMLElement) {
  return container.querySelector<SVGSVGElement>('[data-slot="error-scene"]')!;
}

describe('ErrorScene', () => {
  it('has ten kinds, each with two or three variants', () => {
    expect(ERROR_SCENE_KINDS).toEqual([
      'notFound',
      'error',
      'forbidden',
      'offline',
      'sessionExpired',
      'unavailable',
      'linkExpired',
      'tooManyRequests',
      'cookiesBlocked',
      'formClosed',
    ]);
    expect(EVERY).toHaveLength(23);
  });

  it.each(EVERY)('draws %s %s as hidden decoration that animates', (kind, variant) => {
    const { container } = render(<ErrorScene kind={kind} variant={variant} />);
    const svg = scene(container);
    expect(svg).toHaveAttribute('data-kind', kind);
    expect(svg).toHaveAttribute('data-variant', variant);
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('viewBox', '0 0 240 180');
    expect(svg).toHaveClass('skylcn-scene');
    expect(svg).not.toHaveAttribute('data-still');
    // every scene moves, on its own classes, which reduced motion stops
    expect(svg.querySelector('[class*="skylcn-scene-"]')).not.toBeNull();
    // no inline style, so it runs under a strict Content-Security-Policy
    expect(container.querySelector('[style]')).toBeNull();
  });

  it('gives every class a scene uses a rule in the theme', () => {
    const markup = EVERY.map(([kind, variant]) =>
      renderToString(<ErrorScene kind={kind} variant={variant} />),
    ).join('');
    const used = new Set(
      [...markup.matchAll(/class="([^"]*)"/g)].flatMap(([, list]) => list.split(' ')),
    );
    for (const name of used) {
      if (name.startsWith('skylcn-scene-')) expect(theme).toContain(`.${name}`);
    }
  });

  it('draws each variant differently', () => {
    for (const kind of ERROR_SCENE_KINDS) {
      const drawings = ERROR_SCENE_VARIANTS[kind].map((variant) =>
        renderToString(<ErrorScene kind={kind} variant={variant} />).replace(
          /data-variant="\w"/,
          '',
        ),
      );
      expect(new Set(drawings).size).toBe(drawings.length);
    }
  });

  it('falls back to the first drawing for a variant the kind does not have', () => {
    const { container } = render(<ErrorScene kind="error" variant="C" />);
    expect(scene(container)).toHaveAttribute('data-variant', 'A');
    const { container: plain } = render(<NotFoundScene />);
    expect(scene(plain)).toHaveAttribute('data-variant', 'A');
  });

  it('holds still when asked', () => {
    const { container } = render(<ErrorScene kind="forbidden" animated={false} />);
    expect(scene(container)).toHaveAttribute('data-still', '');
  });

  it('draws the same markup on the server every time, ids included', () => {
    for (const [kind, variant] of EVERY) {
      expect(renderToString(<ErrorScene kind={kind} variant={variant} />)).toBe(
        renderToString(<ErrorScene kind={kind} variant={variant} />),
      );
    }
  });

  it('keeps two laptops on the page from sharing a clip path', () => {
    const { container } = render(
      <>
        <SessionExpiredScene variant="C" />
        <SessionExpiredScene variant="C" />
      </>,
    );
    const ids = [...container.querySelectorAll('clipPath')].map((clip) => clip.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it('comes with the theme and stands alone with fallback colours', () => {
    expect(themeBase).toContain("@import './error-scene.css';");
    expect(theme).toContain('--skylcn-scene-ink: var(--secondary-foreground, #e5e5e5);');
    expect(theme).not.toMatch(/@apply|@theme|@utility|@custom-variant/);
  });

  it('reveals a page that never hydrates, untouched by reduced motion', () => {
    expect(theme).toMatch(
      /@media \(scripting: enabled\) \{\s*\.skylcn-error-pending \{\s*animation: skylcn-error-reveal 0s 1\.5s both;\s*\}/,
    );
    expect(theme).toMatch(
      /@keyframes skylcn-error-reveal \{\s*from \{\s*visibility: hidden;\s*\}\s*to \{\s*visibility: visible;/,
    );
    // nothing hides it outside the animation, and the still rules reach only into a scene
    expect(theme).not.toMatch(/\.skylcn-error-pending[^{]*\{[^}]*visibility/);
    for (const [, selector] of theme.matchAll(/([^{}]*)\{\s*animation: none;/g)) {
      expect(selector).toMatch(/\.skylcn-scene(\[data-still\])? \*\s*$/);
    }
  });

  it('stops every part under reduced motion, the in-product setting and data-still', () => {
    const reduce = theme.slice(theme.indexOf('Still: every part on the frame'));
    expect(reduce).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\s*\.skylcn-scene \* \{\s*animation: none;/,
    );
    expect(reduce).toMatch(
      /\[data-motion='reduced'\] \.skylcn-scene \*,\s*\.skylcn-scene\[data-still\] \* \{\s*animation: none;/,
    );
  });
});

describe('errorSceneText', () => {
  it.each(EVERY)('gives %s %s Turkish and English words with one button', (kind, variant) => {
    for (const locale of ['tr', 'en'] as const) {
      const text = errorSceneText(kind, locale, variant);
      expect(text.title).toBeTruthy();
      expect(text.action).toBeTruthy();
      expect(text.code).toBeTruthy();
      // one sentence that ends in a full stop, with no exclamation
      expect(text.description).toMatch(/\.$/);
      expect(text.description).not.toMatch(/!|\. [A-ZÇĞİÖŞÜ]/);
    }
    // no comparisons in the Turkish lines
    expect(errorSceneText(kind, 'tr', variant).description).not.toMatch(/\b(gibi|tıpkı)\b/);
  });

  it('keeps the approved words', () => {
    expect(errorSceneText('notFound')).toEqual({
      code: '404',
      title: 'Bu sayfa yok',
      description: "GECEKODU'nda sabaha karşı yazılmış, sonra kaybolmuş; adresi bir kontrol et.",
      action: 'Ana sayfaya dön',
    });
    expect(errorSceneText('error', 'tr', 'A').title).toBe('Sunucumuz molada');
    expect(errorSceneText('forbidden', 'tr', 'C').title).toBe('Anahtarın uymuyor');
    expect(errorSceneText('sessionExpired', 'tr', 'C').description).toContain('USB');
    expect(errorSceneText('offline', 'tr', 'A').action).toBe('Devam et');
    expect(errorSceneText('error', 'en').action).toBe('Try again');
  });

  it('answers a variant the kind does not have with the first one', () => {
    expect(errorSceneText('error', 'tr', 'C')).toEqual(errorSceneText('error', 'tr', 'A'));
  });
});

describe('pickErrorSceneVariant', () => {
  it('reaches every random variant of every kind, and only those', () => {
    for (const kind of ERROR_SCENE_KINDS) {
      const seen = new Set<ErrorSceneVariant>();
      for (let seed = 0; seed < 200; seed++) seen.add(pickErrorSceneVariant(kind, seed));
      expect([...seen].sort()).toEqual([...ERROR_SCENE_RANDOM[kind]]);
    }
    // the time limit's drawing answers a timeout alone
    expect(ERROR_SCENE_RANDOM.unavailable).toEqual(['A']);
    expect(ERROR_SCENE_RANDOM.notFound).toEqual(ERROR_SCENE_VARIANTS.notFound);
  });

  it('lets a status choose where the drawings of a kind answer different causes', () => {
    expect(statusSceneVariant('unavailable', 504)).toBe('B');
    expect(statusSceneVariant('unavailable', 503)).toBe('A');
    expect(statusSceneVariant('unavailable', 502)).toBe('A');
    expect(statusSceneVariant('unavailable', undefined)).toBeUndefined();
    expect(statusSceneVariant('notFound', 404)).toBeUndefined();
    expect(errorSceneText('unavailable', 'tr', 'B').code).toBe('504');
    expect(errorSceneText('unavailable', 'tr', 'A').code).toBe('503');
  });

  it('gives the same seed the same variant', () => {
    for (const seed of ['/etkinlik/yok', 'req-81f2', 42]) {
      expect(pickErrorSceneVariant('notFound', seed)).toBe(pickErrorSceneVariant('notFound', seed));
    }
  });

  it('picks at random without a seed', () => {
    const random = vi.spyOn(Math, 'random');
    random.mockReturnValueOnce(0).mockReturnValueOnce(0.5).mockReturnValueOnce(0.9999);
    expect(pickErrorSceneVariant('notFound')).toBe('A');
    expect(pickErrorSceneVariant('notFound')).toBe('B');
    expect(pickErrorSceneVariant('notFound')).toBe('C');
    random.mockRestore();
  });
});

describe('ErrorScenePage', () => {
  it('has a page of its own for every kind, which draws that kind alone', () => {
    const NAMES = {
      notFound: 'NotFoundScenePage',
      error: 'ServerErrorScenePage',
      forbidden: 'ForbiddenScenePage',
      offline: 'OfflineScenePage',
      sessionExpired: 'SessionExpiredScenePage',
      unavailable: 'UnavailableScenePage',
      linkExpired: 'LinkExpiredScenePage',
      tooManyRequests: 'TooManyRequestsScenePage',
      cookiesBlocked: 'CookiesBlockedScenePage',
      formClosed: 'FormClosedScenePage',
    } as const;
    for (const kind of ERROR_SCENE_KINDS) {
      const Page = kinds[NAMES[kind]];
      const { container, unmount } = render(<Page variant="A" />);
      expect(scene(container)).toHaveAttribute('data-kind', kind);
      unmount();
    }
  });

  it('sends a server page only the drawings of its own kind', () => {
    const html = renderToString(<ErrorScenePage kind="notFound" href="/" />);
    // the first drawing is in the HTML; the others travel with the page's props, not here
    expect(html.match(/data-slot="error-scene"/g)).toHaveLength(1);
    expect(html).toContain('data-kind="notFound"');
    expect(html).not.toMatch(/data-kind="(?!notFound)/);
  });

  it('draws the time limit for a 504 and the server gone for tea for a 503', () => {
    const { container, unmount } = render(<UnavailableScenePage status={504} />);
    expect(scene(container)).toHaveAttribute('data-variant', 'B');
    expect(screen.getByText('504')).toBeInTheDocument();
    unmount();
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const { container: other } = render(<UnavailableScenePage status={503} />);
    const { container: plain } = render(<UnavailableScenePage />);
    random.mockRestore();
    expect(scene(other)).toHaveAttribute('data-variant', 'A');
    // without a status, never the timeout
    expect(scene(plain)).toHaveAttribute('data-variant', 'A');
  });

  it('shows the fixed variant with its words and a link button, and stays accessible', async () => {
    const { container } = render(<ErrorScenePage kind="notFound" variant="B" href="/" />);
    expect(scene(container)).toHaveAttribute('data-variant', 'B');
    const text = errorSceneText('notFound', 'tr', 'B');
    expect(screen.getByRole('heading', { level: 1, name: text.title })).toBeInTheDocument();
    expect(screen.getByText(text.description)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: text.action })).toHaveAttribute('href', '/');
    expect(container.querySelector('.skylcn-error-pending')).toBeNull();
    expect(await axeViolations()).toEqual([]);
  });

  it('picks a random variant in the browser and shows it at once', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const { container } = render(<ErrorScenePage kind="sessionExpired" />);
    random.mockRestore();
    expect(scene(container)).toHaveAttribute('data-variant', 'C');
    expect(
      screen.getByRole('heading', {
        name: errorSceneText('sessionExpired', 'tr', 'C').title,
      }),
    ).toBeInTheDocument();
    expect(container.querySelector('.skylcn-error-pending')).toBeNull();
  });

  it('renders the first drawing, held out of sight, on the server, then hydrates without a mismatch and picks', async () => {
    const html = renderToString(<ErrorScenePage kind="notFound" href="/" />);
    expect(html).toContain('skylcn-error-pending');
    expect(html).toContain('data-variant="A"');
    expect(html).toContain(errorSceneText('notFound', 'tr', 'A').title);

    const host = document.createElement('div');
    host.innerHTML = html;
    document.body.append(host);
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const recoverable: unknown[] = [];
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(host, <ErrorScenePage kind="notFound" href="/" />, {
        onRecoverableError: (error) => recoverable.push(error),
      });
    });
    random.mockRestore();
    expect(recoverable).toEqual([]);
    expect(errors).not.toHaveBeenCalled();
    errors.mockRestore();
    expect(scene(host)).toHaveAttribute('data-variant', 'B');
    expect(host.querySelector('.skylcn-error-pending')).toBeNull();
    expect(host.querySelector('h1')).toHaveTextContent(errorSceneText('notFound', 'tr', 'B').title);
    act(() => root?.unmount());
    host.remove();
  });

  it('runs the action, takes overrides and further buttons', () => {
    const reset = vi.fn();
    render(
      <ErrorScenePage kind="error" variant="B" onAction={reset} code={null} title="Panel açılmadı">
        <a href="/destek">Destek</a>
      </ErrorScenePage>,
    );
    screen.getByRole('button', { name: 'Yeniden dene' }).click();
    expect(reset).toHaveBeenCalledOnce();
    expect(screen.getByRole('heading', { name: 'Panel açılmadı' })).toBeInTheDocument();
    expect(screen.queryByText('500')).toBeNull();
    expect(screen.getByRole('link', { name: 'Destek' })).toBeInTheDocument();
  });

  it('speaks English when asked', () => {
    render(<ErrorScenePage kind="formClosed" variant="A" locale="en" href="/" />);
    expect(screen.getByRole('link', { name: 'Back to home' })).toBeInTheDocument();
  });
});

describe('StatusPage with a scene', () => {
  it('shows the scene with the code as a small line, and stays accessible', async () => {
    const text = errorSceneText('notFound');
    const { container } = render(
      <StatusPage
        scene={<NotFoundScene />}
        code={text.code}
        title={text.title}
        description={text.description}
      >
        <button type="button">{text.action}</button>
      </StatusPage>,
    );
    expect(screen.getByRole('heading', { level: 1, name: text.title })).toBeInTheDocument();
    expect(container.querySelector('[data-slot="status-page-scene"]')).toContainElement(
      screen.getByText('404', { selector: 'p' }),
    );
    expect(await axeViolations()).toEqual([]);
  });
});

describe('TaskPage top', () => {
  it('draws the picture above the title in place of the icon', async () => {
    const { container } = render(
      <TaskPage top={<ServerErrorScene />} title="Bir şey bozuldu" align="center" />,
    );
    const top = container.querySelector('[data-slot="task-page-top"]')!;
    expect(top).toContainElement(scene(container));
    expect(top.compareDocumentPosition(screen.getByRole('heading', { level: 1 }))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(await axeViolations()).toEqual([]);
  });

  it('shows the loader instead while loading', () => {
    const { container } = render(<TaskPage top={<ServerErrorScene />} title="Bekle" loading />);
    expect(container.querySelector('[data-slot="task-page-top"]')).toBeNull();
  });
});
