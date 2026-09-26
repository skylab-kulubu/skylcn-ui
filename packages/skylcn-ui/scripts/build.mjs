import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
execFileSync('tsc', ['-p', 'tsconfig.build.json'], { cwd: root, stdio: 'inherit' });

mkdirSync(join(dist, 'styles'), { recursive: true });
for (const file of readdirSync(join(root, 'src/styles'))) {
  if (file.endsWith('.css')) cpSync(join(root, 'src/styles', file), join(dist, 'styles', file));
}
