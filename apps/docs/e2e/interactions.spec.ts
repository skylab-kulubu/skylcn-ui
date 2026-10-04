import { expect, test } from '@playwright/test';

test('the theme setting switches the page between dark and light', async ({ page }) => {
  await page.goto('/playground');
  await page.getByRole('button', { name: 'Playground ayarları' }).click();
  await page.getByRole('group', { name: 'Tema' }).getByText('Açık').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('group', { name: 'Tema' }).getByText('Koyu').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('the command palette opens with Ctrl+K', async ({ page }) => {
  await page.goto('/playground');
  await page.waitForLoadState('networkidle');
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByPlaceholder('Sayfa ya da işlem ara…')).toBeFocused();
});

test('a DataTable keeps its search and sort in the address', async ({ page }) => {
  await page.goto('/playground/table?uye.sort=events:asc');
  const table = page.getByRole('table', { name: 'Üyeler' });
  await expect(table).toBeVisible();
  await page.getByPlaceholder('İsim ya da e-posta ara').fill('a');
  await expect(page).toHaveURL(/uye\.q=a/);
  await expect(page).toHaveURL(/uye\.sort=events%3Aasc|uye\.sort=events:asc/);
  await page.reload();
  await expect(page.getByPlaceholder('İsim ya da e-posta ara')).toHaveValue('a');
});

test('a virtual DataTable draws only the rows in view', async ({ page }) => {
  await page.goto('/playground/components/data-table');
  const table = page.getByRole('table', { name: 'Üyeler (5.000)' });
  await expect(table).toHaveAttribute('aria-rowcount', '5001');
  const rows = table.locator('tbody tr[aria-rowindex]');
  await expect(rows.first()).toBeVisible();
  expect(await rows.count()).toBeLessThan(60);
});

test('a Kanban card moves with its menu', async ({ page }) => {
  await page.goto('/playground/board');
  const card = page.getByRole('listitem').filter({ hasText: 'Sponsor mektubu' });
  await card.getByRole('button', { name: 'Kartı taşı' }).click();
  await page.getByRole('menuitem', { name: 'Bitti' }).click();
  await expect(
    page.getByRole('region', { name: 'Bitti' }).getByText('Sponsor mektubu'),
  ).toBeVisible();
});

test('the carousel steps one slide at a time', async ({ page }) => {
  await page.goto('/playground/components/carousel');
  const carousel = page.getByRole('region', { name: 'Geçmiş etkinlikler' });
  await carousel.getByRole('button', { name: 'Sonraki' }).click();
  await expect(carousel.locator('button[aria-current="true"]')).toHaveAccessibleName(/öğeden 2\./);
});

test('the page builder adds, edits, undoes and exports a block', async ({ page }) => {
  await page.goto('/playground/builder');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Şablon' }).click();
  await page.getByRole('menuitem', { name: /Boş sayfa/ }).click();
  await page
    .getByRole('button', { name: /Sayı kartı/ })
    .first()
    .click();
  await page.getByLabel('Etiket').fill('Gönüllü');
  const canvas = page.locator('[data-slot="builder-canvas"]');
  await expect(canvas.getByText('Gönüllü')).toBeVisible();

  await page.getByRole('button', { name: 'Kaldır (Delete)' }).click();
  await expect(canvas.getByText('Gönüllü')).toHaveCount(0);
  await page.keyboard.press('Control+z');
  await expect(canvas.getByText('Gönüllü')).toBeVisible();

  await page.getByRole('button', { name: 'Kodu al' }).click();
  const code = page.getByRole('dialog').locator('pre');
  await expect(code).toContainText('label="Gönüllü"');
  await expect(code).toContainText("from '@skylab-kulubu/skylcn-ui'");
});

test('the page builder moves a block into another column', async ({ page }) => {
  await page.goto('/playground/builder');
  await page.waitForLoadState('networkidle');
  const second = page.getByRole('region', { name: 'Bölüm 2' });
  await second.getByRole('button', { name: 'Sayı kartı bloğunu seç' }).first().click();
  await page.getByRole('button', { name: 'Sağdaki sütuna taşı' }).click();
  await expect(page.getByRole('button', { name: 'Soldaki sütuna taşı' })).toBeEnabled();
});
