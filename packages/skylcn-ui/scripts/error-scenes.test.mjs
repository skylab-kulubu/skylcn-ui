import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterAll, describe, expect, it } from 'vitest';
import * as scenes from '../src/components/error-scene.tsx';
import { standaloneSvg, writeErrorScenes } from './error-scenes.mjs';

const out = mkdtempSync(join(tmpdir(), 'skylcn-error-scenes-'));
afterAll(() => rmSync(out, { recursive: true, force: true }));
const index = writeErrorScenes({
  scenes,
  createElement,
  renderToStaticMarkup,
  css: resolve('src/styles/error-scene.css'),
  out,
});

describe('dist/error-scenes', () => {
  it('holds one SVG per drawing, a JSON per kind, the index and the rules', () => {
    const files = readdirSync(out);
    expect(files.filter((file) => file.endsWith('.svg'))).toHaveLength(23);
    for (const kind of scenes.ERROR_SCENE_KINDS) {
      expect(files).toContain(`${kind}.json`);
      for (const variant of scenes.ERROR_SCENE_VARIANTS[kind]) {
        expect(files).toContain(`${kind}-${variant}.svg`);
      }
    }
    expect(files).toContain('index.json');
    expect(readFileSync(join(out, 'error-scene.css'), 'utf8')).toContain('.skylcn-scene {');
  });

  it('writes each drawing as a file that stands alone', () => {
    for (const file of readdirSync(out).filter((name) => name.endsWith('.svg'))) {
      const svg = readFileSync(join(out, file), 'utf8');
      expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" data-slot="error-scene"/);
      // no inline style, and every colour has a fallback
      expect(svg).not.toMatch(/ style="/);
      expect(svg).not.toMatch(/var\(--skylcn-scene-[\w-]+\)/);
    }
    expect(standaloneSvg('<svg stroke="var(--skylcn-scene-ink)"></svg>')).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" stroke="var(--skylcn-scene-ink, #e5e5e5)"></svg>\n',
    );
  });

  it('lists every kind with its variants, the random ones and the words', () => {
    const written = JSON.parse(readFileSync(join(out, 'index.json'), 'utf8'));
    expect(written).toEqual(index);
    expect(Object.keys(written)).toEqual(scenes.ERROR_SCENE_KINDS);
    expect(written.unavailable.random).toEqual(['A']);
    expect(written.unavailable.text.tr.B.code).toBe('504');
    expect(written.notFound.text.en.C.title).toBe('No such address');
    const kind = JSON.parse(readFileSync(join(out, 'forbidden.json'), 'utf8'));
    expect(kind.variants).toEqual(['A', 'B', 'C']);
    expect(kind.svg.C).toContain('data-variant="C"');
    expect(kind.text.tr.C.title).toBe('Anahtarın uymuyor');
  });
});
