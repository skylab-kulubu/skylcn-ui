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
