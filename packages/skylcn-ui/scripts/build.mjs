import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
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
