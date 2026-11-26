import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sourcesStylesheet, themeSources } from './theme-sources.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const next = join(root, 'dist.next');
const old = join(root, 'dist.old');

// Build beside dist and swap it in at the end, so a running docs server never
// finds the package half built.
rmSync(next, { recursive: true, force: true });
// tsc is started through node: Windows cannot spawn the tsc.cmd shim without a shell
const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc');
execFileSync(process.execPath, [tsc, '-p', 'tsconfig.build.json', '--outDir', next], {
  cwd: root,
  stdio: 'inherit',
});

mkdirSync(join(next, 'styles'), { recursive: true });
for (const file of readdirSync(join(root, 'src/styles'))) {
  if (file.endsWith('.css')) cpSync(join(root, 'src/styles', file), join(next, 'styles', file));
}

// theme-base.css with one of these per piece in use keeps an app's CSS to what it renders
mkdirSync(join(next, 'styles/sources'), { recursive: true });
for (const { name, files } of themeSources(next)) {
  writeFileSync(join(next, 'styles/sources', `${name}.css`), sourcesStylesheet(name, files));
}

// The error scenes as markup alone, for a page that renders no React (a Keycloak FreeMarker
// page, a site on another React, a server's own 404): one SVG per drawing, drawn by the
// built components, and their words. They take their look from error-scene.css.
{
  const require = createRequire(import.meta.url);
  const { createElement } = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const scenes = await import(pathToFileURL(join(next, 'components/error-scene.js')).href);
  const out = join(next, 'error-scenes');
  mkdirSync(out, { recursive: true });
  const index = {};
  for (const kind of scenes.ERROR_SCENE_KINDS) {
    const variants = scenes.ERROR_SCENE_VARIANTS[kind];
    index[kind] = { variants, text: { tr: {}, en: {} } };
    for (const variant of variants) {
      const svg = renderToStaticMarkup(createElement(scenes.ErrorScene, { kind, variant }));
      writeFileSync(
        join(out, `${kind}-${variant}.svg`),
        svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ') + '\n',
      );
      for (const locale of ['tr', 'en']) {
        index[kind].text[locale][variant] = scenes.errorSceneText(kind, locale, variant);
      }
    }
  }
  writeFileSync(join(out, 'index.json'), JSON.stringify(index, null, 2) + '\n');
}

rmSync(old, { recursive: true, force: true });
try {
  renameSync(dist, old);
} catch {
  // First build: there is no dist yet.
}
try {
  renameSync(next, dist);
} catch (error) {
  // Windows keeps a folder that a docs server or editor watches from moving, so dist stayed put:
  // the new build is copied over it instead
  if (error.code !== 'EPERM' && error.code !== 'EBUSY') throw error;
  cpSync(next, dist, { recursive: true, force: true });
  rmSync(next, { recursive: true, force: true });
}
rmSync(old, { recursive: true, force: true });
