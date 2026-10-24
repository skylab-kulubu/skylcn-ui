import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppShell } from './app-shell.js';

describe('AppShell', () => {
  it('positions the scrolling content area, so absolute children scroll with it', () => {
    const { container } = render(
      <AppShell sidebar={<nav />} header={<span />}>
        <p>İçerik</p>
      </AppShell>,
    );
    const main = container.querySelector('#skylcn-main');
    expect(main).not.toBeNull();
    expect(main).toHaveClass('relative');
  });

  it('gives a page the panel’s full width, with no reading width to centre it in', () => {
    const { getByText } = render(
      <AppShell sidebar={<nav />} header={<span />}>
        <p>İçerik</p>
      </AppShell>,
    );
    const page = getByText('İçerik').parentElement;
    expect(page).toHaveClass('w-full');
    expect(page?.className).not.toMatch(/max-w-|mx-auto/);
  });
});
