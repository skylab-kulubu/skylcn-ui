// Builds the shadcn registry: one JSON per block under registry/r, each carrying its files'
// source, as `shadcn build` would, without needing the CLI. The blocks are compositions of
// the npm package's components, which stay in the package (ADR 0055).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ITEM_SCHEMA = 'https://ui.shadcn.com/schema/registry-item.json';

export function buildRegistry(root) {
  const registry = JSON.parse(readFileSync(join(root, 'registry/registry.json'), 'utf8'));
  const items = registry.items.map((item) => ({
    $schema: ITEM_SCHEMA,
    ...item,
    files: item.files.map((file) => ({
      ...file,
      content: readFileSync(join(root, file.path), 'utf8'),
    })),
  }));
  return { registry, items };
}

export function writeRegistry(root) {
  const { registry, items } = buildRegistry(root);
  const out = join(root, 'registry/r');
  mkdirSync(out, { recursive: true });
  for (const item of items) {
    writeFileSync(join(out, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`);
  }
  writeFileSync(join(out, 'registry.json'), `${JSON.stringify(registry, null, 2)}\n`);
  return items.map((item) => item.name);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  console.log(`registry/r: ${writeRegistry(root).join(', ')}`);
}
