import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SaveStatus } from './save-status.js';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('SaveStatus', () => {
  it('says saving, then saved for a moment, then falls quiet', () => {
    const { rerender } = render(<SaveStatus state="saving" />);
    expect(screen.getByRole('status')).toHaveTextContent('Kaydediliyor…');

    rerender(<SaveStatus state="saved" savedFor={1000} />);
    expect(screen.getByRole('status')).toHaveTextContent('Kaydedildi');

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it('keeps a failure and its reason until the next save', () => {
    render(<SaveStatus state="error" error="Bağlantı koptu." />);
    act(() => vi.advanceTimersByTime(10_000));
    expect(screen.getByRole('status')).toHaveTextContent('Bağlantı koptu.');
  });
});
