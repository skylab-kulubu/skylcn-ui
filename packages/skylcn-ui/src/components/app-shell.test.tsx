import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppShell, AppShellActions, SidebarBrand } from './app-shell.js';

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

describe('AppShellActions', () => {
  const shell = (
    <AppShell sidebar={<nav />} header={<span />}>
      <AppShellActions phone={<button type="button">Diğer işlemler</button>}>
        <button type="button">Kaydet</button>
      </AppShellActions>
    </AppShell>
  );

  it('puts its actions in the header row on desktop', () => {
    render(shell);
    expect(screen.getByRole('button', { name: 'Kaydet' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Diğer işlemler' })).toBeNull();
  });

  it('gives the phone bar its phone actions instead, mounting only those', () => {
    const phone = vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          addListener: () => undefined,
          removeListener: () => undefined,
          dispatchEvent: () => false,
        }) as MediaQueryList,
    );
    render(shell);
    expect(screen.getByRole('button', { name: 'Diğer işlemler' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Kaydet' })).toBeNull();
    phone.mockRestore();
  });
});

describe('SidebarBrand', () => {
  it('sets the club as a small line over the name and a credit beside the name', () => {
    render(<SidebarBrand eyebrow="SKY LAB" name="Forms" credit="by Deniz Aydın" href="/forms" />);
    expect(screen.getByText('SKY LAB')).toHaveClass('uppercase', 'tracking-label');
    const credit = screen.getByText('by Deniz Aydın');
    expect(credit).toHaveClass('text-subtle-foreground', 'font-normal');
    expect(credit.parentElement).toHaveTextContent(/^Forms\s*by Deniz Aydın$/);
  });

  it('keeps one strong title and its subtitle without an eyebrow', () => {
    render(<SidebarBrand name="SKY LAB Forms" subtitle="Form yönetimi" href="/forms" />);
    expect(screen.getByText('SKY LAB Forms')).toHaveClass('font-semibold');
    expect(screen.getByText('Form yönetimi')).toBeInTheDocument();
  });
});
