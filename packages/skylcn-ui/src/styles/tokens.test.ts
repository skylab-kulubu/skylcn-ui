import { describe, expect, it } from 'vitest';
import tokens from './tokens.css?raw';

type Rgba = [number, number, number, number];

/** The custom properties of the first rule whose selector is exactly `selector`. */
function block(selector: string) {
  const start = tokens.indexOf(`${selector} {`);
  const body = tokens.slice(start, tokens.indexOf('}', start));
  return Object.fromEntries(
    [...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]),
  );
}

function parse(value: string): Rgba {
  const hex = /^#([0-9a-f]{6})$/i.exec(value);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const rgb = /^rgb\((\d+) (\d+) (\d+)(?: \/ (\d+)%)?\)$/.exec(value);
  if (!rgb) throw new Error(`Not a colour this test reads: ${value}`);
  return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3]), rgb[4] ? Number(rgb[4]) / 100 : 1];
}

/** `top` drawn over an opaque `under`. */
function over([r, g, b, a]: Rgba, under: Rgba): Rgba {
  return [r * a + under[0] * (1 - a), g * a + under[1] * (1 - a), b * a + under[2] * (1 - a), 1];
}

function luminance([r, g, b]: Rgba) {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: Rgba, b: Rgba) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const THEMES = {
  dark: block(":root,\n[data-theme='dark']"),
  light: block("[data-theme='light']"),
};

/** A token's colour, following a var() to another token of the same theme. */
function resolve(values: Record<string, string>, name: string): Rgba {
  const ref = /^var\((--[\w-]+)\)$/.exec(values[name]);
  return ref ? resolve(values, ref[1]) : parse(values[name]);
}

describe('focus ring', () => {
  // WCAG 1.4.11 (and 2.4.13): the ring against the surface it is drawn on, 3:1 or more
  for (const [theme, values] of Object.entries(THEMES)) {
    it(`reads at 3:1 or more on every surface in the ${theme} theme`, () => {
      const color = (name: string) => resolve(values, name);
      const opaque = ['--background', '--sheet', '--popover', '--sidebar'].map(
        (name) => [name, color(name)] as const,
      );
      // The card, a highlighted row and the sidebar's active pill can be washes, so they
      // are measured on each surface they sit on, and a hovered control, focused with
      // the keyboard, adds the strong accent on top
      const plain = [
        ...opaque,
        ...['--card', '--row-highlight', '--sidebar-active'].flatMap((wash) =>
          opaque.map(([name, under]) => [`${wash} on ${name}`, over(color(wash), under)] as const),
        ),
      ];
      const surfaces = [
        ...plain,
        ...plain.map(
          ([name, under]) =>
            [`--accent-strong on ${name}`, over(color('--accent-strong'), under)] as const,
        ),
      ];
      for (const [name, surface] of surfaces) {
        const ratio = contrast(over(color('--ring'), surface), surface);
        expect(ratio, `${theme} ring on ${name}`).toBeGreaterThanOrEqual(3);
      }
    });
  }

  // The ring hugs the control, so on a primary button or a selected day it sits
  // right against the primary fill and must not melt into it. 3:1 against both
  // the page and the fill has no room in the dark theme, so the fill is kept apart
  // by a step of the brand scale instead.
  for (const [theme, values] of Object.entries(THEMES)) {
    it(`stays apart from the primary fill in the ${theme} theme`, () => {
      const ring = resolve(values, '--ring');
      const fill = resolve(values, '--primary');
      for (const name of ['--background', '--sheet', '--popover', '--sidebar']) {
        const shown = over(ring, resolve(values, name));
        expect(
          contrast(shown, fill),
          `${theme} ring by the fill on ${name}`,
        ).toBeGreaterThanOrEqual(1.4);
      }
    });
  }
});
