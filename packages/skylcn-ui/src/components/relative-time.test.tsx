import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SkylcnProvider } from '../lib/provider.js';
import { formatRelativeTime, RelativeTime } from './relative-time.js';

const NOW = new Date('2026-10-31T12:00:00Z');
const ago = (seconds: number) => new Date(NOW.getTime() - seconds * 1000);

describe('formatRelativeTime', () => {
  it('says the largest whole unit, in Turkish', () => {
    expect(formatRelativeTime(ago(20), NOW, 'tr-TR')).toBe('şimdi');
    expect(formatRelativeTime(ago(5 * 60), NOW, 'tr-TR')).toBe('5 dakika önce');
    expect(formatRelativeTime(ago(3 * 3600), NOW, 'tr-TR')).toBe('3 saat önce');
    expect(formatRelativeTime(ago(26 * 3600), NOW, 'tr-TR')).toBe('dün');
    expect(formatRelativeTime(ago(-2 * 86400), NOW, 'tr-TR')).toBe('öbür gün');
    expect(formatRelativeTime(ago(40 * 86400), NOW, 'tr-TR')).toBe('geçen ay');
  });

  it('speaks English under an English provider', () => {
    expect(formatRelativeTime(ago(3 * 3600), NOW, 'en-US')).toBe('3 hours ago');
  });
});

describe('RelativeTime', () => {
  it('keeps the exact moment for machines and shows the full date in a tooltip', async () => {
    const user = userEvent.setup();
    render(<RelativeTime date={ago(3 * 3600)} now={NOW} />);
    const time = screen.getByText('3 saat önce');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('datetime', '2026-10-31T09:00:00.000Z');
    expect(time).not.toHaveAttribute('title');
    await user.hover(time);
    expect(await screen.findByText(/31 Ekim 2026/)).toBeInTheDocument();
  });

  it('falls back to the title without a tooltip', () => {
    render(<RelativeTime date={ago(3 * 3600)} now={NOW} tooltip={false} />);
    expect(screen.getByText('3 saat önce').getAttribute('title')).toMatch(/31 Ekim 2026/);
  });

  it('follows the provider locale', () => {
    render(
      <SkylcnProvider locale="en">
        <RelativeTime date={ago(60 * 60)} now={NOW} />
      </SkylcnProvider>,
    );
    expect(screen.getByText('1 hour ago')).toBeInTheDocument();
  });
});
