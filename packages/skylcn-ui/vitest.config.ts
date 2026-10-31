import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);
// The registry blocks live outside the package and import it by name, like an app would
const fromHere = (name: string) => dirname(require.resolve(`${name}/package.json`));

export default defineConfig({
  resolve: {
    alias: [
      { find: '@skylab-kulubu/skylcn-ui/charts', replacement: resolve('src/charts/index.ts') },
      { find: /^@skylab-kulubu\/skylcn-ui$/, replacement: resolve('src/index.ts') },
      ...['react', 'react-dom', 'lucide-react', 'recharts'].map((name) => ({
        find: new RegExp(`^${name}(/.*)?$`),
        replacement: `${fromHere(name)}$1`,
      })),
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.mjs'],
    css: { include: [/tokens\.css/] },
  },
});
