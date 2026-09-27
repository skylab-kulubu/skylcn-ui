import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const next = join(root, 'dist.next');
const old = join(root, 'dist.old');

// Build beside dist and swap it in at the end, so a running docs server never
// finds the package half built.
rmSync(next, { recursive: true, force: true });
execFileSync('tsc', ['-p', 'tsconfig.build.json', '--outDir', next], {
  cwd: root,
  stdio: 'inherit',
});

mkdirSync(join(next, 'styles'), { recursive: true });
for (const file of readdirSync(join(root, 'src/styles'))) {
  if (file.endsWith('.css')) cpSync(join(root, 'src/styles', file), join(next, 'styles', file));
}

rmSync(old, { recursive: true, force: true });
try {
  renameSync(dist, old);
} catch {
  // First build: there is no dist yet.
}
renameSync(next, dist);
rmSync(old, { recursive: true, force: true });
