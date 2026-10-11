import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Button } from './button.js';

describe('Button pending', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('locks at once but shows the loader only when the wait lasts', () => {
    render(<Button pending>Kaydet</Button>);
    const button = screen.getByRole('button', { name: 'Kaydet' });
    expect(button).toBeDisabled();
    expect(button).not.toHaveAttribute('aria-busy');

    act(() => vi.advanceTimersByTime(160));
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('[data-slot="skylab-loader"]')).not.toBeNull();
  });

  it('never flashes the loader for quick work', () => {
    const { rerender } = render(<Button pending>Kaydet</Button>);
    act(() => vi.advanceTimersByTime(80));
    rerender(<Button pending={false}>Kaydet</Button>);
    act(() => vi.advanceTimersByTime(500));
    const button = screen.getByRole('button', { name: 'Kaydet' });
    expect(button).not.toHaveAttribute('aria-busy');
    expect(button).toBeEnabled();
  });

  it('keeps a shown loader long enough to be read', () => {
    const { rerender } = render(<Button pending>Kaydet</Button>);
    act(() => vi.advanceTimersByTime(160));
    rerender(<Button pending={false}>Kaydet</Button>);
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    act(() => vi.advanceTimersByTime(250));
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
  });
});

describe('Button as a link', () => {
  it('stays a link with its address when rendered as an anchor', () => {
    render(
      <Button render={<a href="/etkinlikler" />} variant="primary">
        Etkinlikler
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Etkinlikler' });
    expect(link).toHaveAttribute('href', '/etkinlikler');
    expect(link).not.toHaveAttribute('role');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('keeps the look, the link’s own classes and its click handler', () => {
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <Button render={<a href="/x" className="own" />} className="extra" onClick={onClick}>
        Git
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Git' });
    expect(link).toHaveAttribute('data-slot', 'button');
    expect(link.className).toContain('own');
    expect(link.className).toContain('extra');
    expect(link.className).toContain('inline-flex');
    link.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('marks a disabled link and blocks its click', () => {
    const onClick = vi.fn();
    render(
      <Button render={<a href="/x" />} disabled onClick={onClick}>
        Git
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Git' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    link.click();
    expect(onClick).not.toHaveBeenCalled();
  });
});
