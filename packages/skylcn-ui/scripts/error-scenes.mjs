import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The dark theme's values, for a drawing shown without error-scene.css (an <img>, an email)
const FALLBACK = {
  ink: '#e5e5e5',
  soft: '#8c8c8c',
  faint: '#525252',
  brand: '#e0c8e5',
  'on-brand': '#0a0a0a',
  warm: '#fbbf24',
  cool: '#93c5fd',
  alert: '#f87171',
  surface: '#171717',
};

/** A drawing's markup as a file: its namespace and a fallback for every theme colour. */
export function standaloneSvg(markup) {
  return (
    markup
      .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
      .replace(/var\(--skylcn-scene-([\w-]+)\)/g, (whole, tone) =>
        FALLBACK[tone] ? `var(--skylcn-scene-${tone}, ${FALLBACK[tone]})` : whole,
      ) + '\n'
  );
}

/**
 * The error scenes as markup alone, for a page that renders no React (a Keycloak FreeMarker
 * page, a site that does not take the package, a server's own 404), written into `out`:
 * - <kind>-<variant>.svg, one per drawing;
 * - <kind>.json, a kind's variants, the ones a visit may land on at random, its words and
 *   its drawings' markup, for a page that inlines them;
 * - index.json, every kind's variants and words;
 * - error-scene.css, the rules the drawings take their look and motion from.
 * `scenes` is the built error-scene module; React renders the drawings exactly as the
 * components do.
 */
export function writeErrorScenes({ scenes, createElement, renderToStaticMarkup, css, out }) {
  mkdirSync(out, { recursive: true });
  const index = {};
  for (const kind of scenes.ERROR_SCENE_KINDS) {
    const variants = [...scenes.ERROR_SCENE_VARIANTS[kind]];
    const random = [...scenes.ERROR_SCENE_RANDOM[kind]];
    const text = { tr: {}, en: {} };
    const svg = {};
    for (const variant of variants) {
      svg[variant] = standaloneSvg(
        renderToStaticMarkup(createElement(scenes.ErrorScene, { kind, variant })),
      );
      writeFileSync(join(out, `${kind}-${variant}.svg`), svg[variant]);
      for (const locale of ['tr', 'en']) {
        text[locale][variant] = scenes.errorSceneText(kind, locale, variant);
      }
    }
    index[kind] = { variants, random, text };
    writeFileSync(
      join(out, `${kind}.json`),
      JSON.stringify({ kind, variants, random, text, svg }, null, 2) + '\n',
    );
  }
  writeFileSync(join(out, 'index.json'), JSON.stringify(index, null, 2) + '\n');
  copyFileSync(css, join(out, 'error-scene.css'));
  return index;
}
