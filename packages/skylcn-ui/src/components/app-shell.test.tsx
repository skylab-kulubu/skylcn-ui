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
});
