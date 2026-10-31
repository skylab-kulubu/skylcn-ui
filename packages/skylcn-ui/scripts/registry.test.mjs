import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildRegistry } from '../../../scripts/build-registry.mjs';

// vitest runs from the package root
const root = join(process.cwd(), '../..');
const index = readFileSync(join(process.cwd(), 'src/index.ts'), 'utf8');
const charts = readFileSync(join(process.cwd(), 'src/charts/index.ts'), 'utf8');

describe('registry', () => {
  const { items } = buildRegistry(root);

  it('is built: registry/r matches the blocks, so run pnpm registry:build after a change', () => {
    for (const item of items) {
      const built = JSON.parse(readFileSync(join(root, 'registry/r', `${item.name}.json`), 'utf8'));
      expect(built).toEqual(item);
    }
  });

  it('builds items the shadcn CLI reads, all depending on the npm package', () => {
    for (const item of items) {
      expect(item.$schema).toBe('https://ui.shadcn.com/schema/registry-item.json');
      expect(item.type).toBe('registry:block');
      expect(item.dependencies).toContain('@skylab-kulubu/skylcn-ui');
      for (const file of item.files) expect(file.content.length).toBeGreaterThan(0);
    }
  });

  it('imports only what the package exports', () => {
    for (const item of items) {
      for (const file of item.files) {
        for (const [, names, from] of file.content.matchAll(
          /import\s*\{([^}]+)\}\s*from\s*'(@skylab-kulubu\/skylcn-ui(?:\/charts)?)'/g,
        )) {
          const exported = from.endsWith('/charts') ? charts : index;
          for (const raw of names.split(',')) {
            const name = raw.replace(/^\s*type\s+/, '').trim();
            if (name)
              expect(exported, `${item.name}: ${name}`).toMatch(new RegExp(`\\b${name}\\b`));
          }
        }
      }
    }
  });
});
