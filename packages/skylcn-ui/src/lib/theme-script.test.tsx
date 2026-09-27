import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { THEME_STORAGE_KEY, ThemeScript } from './theme-script.js';

describe('ThemeScript', () => {
  it('reads the remembered theme before paint and carries the CSP nonce', () => {
    const html = renderToStaticMarkup(<ThemeScript nonce="abc" />);
    expect(html).toContain('nonce="abc"');
    expect(html).toContain(THEME_STORAGE_KEY);
    expect(html).toContain('dataset.theme');
  });
});
