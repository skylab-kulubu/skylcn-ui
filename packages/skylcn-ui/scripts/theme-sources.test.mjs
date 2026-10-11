import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { moduleClosure, sourcesStylesheet, themeSources } from './theme-sources.mjs';

// vitest runs from the package root
const src = join(process.cwd(), 'src');

describe('theme sources', () => {
  it('follows a component into the modules it imports', () => {
    const files = moduleClosure(src, 'components/button.js');
    expect(files).toContain('components/button.js');
    expect(files).toContain('components/skylab-loader.js');
    expect(files).toContain('lib/cn.js');
    expect(files).not.toContain('components/drawer.js');
  });

  it('gives every component, charts and data-table a stylesheet of built files', () => {
    const pieces = themeSources(src);
    const components = readdirSync(join(src, 'components')).filter(
      (file) => file.endsWith('.tsx') && !file.includes('.test.'),
    );
    expect(pieces.map((piece) => piece.name)).toEqual(
      expect.arrayContaining([
        ...components.map((file) => file.replace('.tsx', '')),
        'charts',
        'data-table',
      ]),
    );
    for (const piece of pieces) {
      expect(piece.files.every((file) => file.endsWith('.js'))).toBe(true);
    }
  });

  it('writes an @source per file, relative to dist/styles/sources', () => {
    expect(sourcesStylesheet('button', ['components/button.js', 'lib/cn.js'])).toContain(
      "@source '../../components/button.js';\n@source '../../lib/cn.js';\n",
    );
  });
});
