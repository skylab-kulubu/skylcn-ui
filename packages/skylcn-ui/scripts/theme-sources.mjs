import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const RELATIVE_IMPORT = /(?:from|import)\s*['"](\.{1,2}\/[^'"]+\.js)['"]/g;

/**
 * Every module a module reaches through relative imports, itself included, as paths
 * relative to `root`. Imports name the built `.js` files; when `root` holds sources,
 * `.tsx` or `.ts` stands in for them.
 */
export function moduleClosure(root, entry) {
  const seen = new Set();
  const visit = (file) => {
    const actual = [file, file.replace(/\.js$/, '.tsx'), file.replace(/\.js$/, '.ts')].find(
      (candidate) => existsSync(candidate),
    );
    if (!actual) return;
    const key = relative(root, file);
    if (seen.has(key)) return;
    seen.add(key);
    for (const [, spec] of readFileSync(actual, 'utf8').matchAll(RELATIVE_IMPORT)) {
      visit(resolve(dirname(actual), spec));
    }
  };
  visit(join(root, entry));
  return [...seen].sort();
}

/**
 * One stylesheet per public piece (each component, charts, data-table), holding an @source
 * for every built file the piece reaches, so an app scans only what it uses.
 */
export function themeSources(root) {
  const entries = readdirSync(join(root, 'components'))
    .filter((file) => /\.(js|tsx)$/.test(file) && !/\.test\./.test(file))
    .map((file) => ({
      name: file.replace(/\.(js|tsx)$/, ''),
      entry: `components/${file.replace(/\.tsx$/, '.js')}`,
    }));
  for (const name of ['charts', 'data-table']) {
    entries.push({ name, entry: `${name}/index.js` });
  }
  return entries.map(({ name, entry }) => ({
    name,
    files: moduleClosure(root, entry).map((file) => file.replace(/\.tsx?$/, '.js')),
  }));
}

export function sourcesStylesheet(name, files) {
  return (
    `/* skylcn-ui ${name}: the built files Tailwind scans for its classes (generated). */\n` +
    files.map((file) => `@source '../../${file}';`).join('\n') +
    '\n'
  );
}
