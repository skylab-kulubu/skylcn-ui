import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import theme from '../styles/theme-base.css?raw';
import { axeViolations } from '../test/axe.js';
import { ErrorScene, errorSceneText, type ErrorSceneKind } from './error-scene.js';
import { StatusPage } from './month-calendar.js';
import { NotFoundScene } from './scene-not-found.js';
import { ServerErrorScene } from './scene-server-error.js';
import { TaskPage } from './task-page.js';

const KINDS: ErrorSceneKind[] = [
  'notFound',
  'error',
  'forbidden',
  'offline',
  'sessionExpired',
  'maintenance',
];

function scene(container: HTMLElement) {
  return container.querySelector<SVGSVGElement>('[data-slot="error-scene"]')!;
}

describe('ErrorScene', () => {
  it.each(KINDS)('draws the %s scene as hidden decoration that animates', (kind) => {
    const { container } = render(<ErrorScene kind={kind} />);
    const svg = scene(container);
    expect(svg).toHaveAttribute('data-kind', kind);
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('viewBox', '0 0 240 180');
    expect(svg).toHaveClass('skylcn-scene');
    expect(svg).not.toHaveAttribute('data-still');
    // every scene moves, on its own classes, which reduced motion stops
    expect(svg.querySelector('[class*="skylcn-scene-"]')).not.toBeNull();
    // no inline style, so it runs under a strict Content-Security-Policy
    expect(container.querySelector('[style]')).toBeNull();
  });

  it('holds still when asked', () => {
    const { container } = render(<ErrorScene kind="forbidden" animated={false} />);
    expect(scene(container)).toHaveAttribute('data-still', '');
  });

  it('draws the same markup on the server every time, ids included', () => {
    for (const kind of KINDS) {
      expect(renderToString(<ErrorScene kind={kind} />)).toBe(
        renderToString(<ErrorScene kind={kind} />),
      );
    }
  });

  it('keeps two robots on the page from sharing a clip path', () => {
    const { container } = render(
      <>
        <ServerErrorScene />
        <ServerErrorScene />
      </>,
    );
    const ids = [...container.querySelectorAll('clipPath')].map((clip) => clip.id);
    expect(new Set(ids).size).toBe(2);
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

  it('gives each kind Turkish and English words with one button', () => {
    for (const kind of KINDS) {
      for (const locale of ['tr', 'en'] as const) {
        const text = errorSceneText(kind, locale);
        expect(text.title).toBeTruthy();
        expect(text.description).toMatch(/\.$/);
        expect(text.action).toBeTruthy();
      }
    }
    expect(errorSceneText('error').action).toBe('Yeniden dene');
    expect(errorSceneText('notFound').code).toBe('404');
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
