import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { LIBRARY, SCENARIOS } from './pages';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'];

async function open(page: Page, path: string, theme: 'dark' | 'light') {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.addInitScript((value) => localStorage.setItem('skylcn:theme', value), theme);
  await page.goto(path, { waitUntil: 'networkidle' });
  // Entrance animations finish before contrast is measured
  await page.waitForTimeout(800);
  return errors;
}

async function check(page: Page, path: string, theme: 'dark' | 'light') {
  const errors = await open(page, path, theme);
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const summary = violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    targets: v.nodes.slice(0, 3).map((node) => node.target.join(' ')),
  }));
  expect(summary, `axe on ${path} (${theme})`).toEqual([]);
  expect(errors, `console errors on ${path} (${theme})`).toEqual([]);
}

for (const path of [...SCENARIOS, ...LIBRARY]) {
  test(`${path} dark`, async ({ page }) => check(page, path, 'dark'));
}

// Light theme picks its own tones, so every scenario is checked in it too
for (const path of SCENARIOS) {
  test(`${path} light`, async ({ page }) => check(page, path, 'light'));
}
