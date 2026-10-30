import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SkylcnProvider } from '../lib/provider.js';
import { axeViolations } from '../test/axe.js';
import { Calendar, DatePicker, DateTimePicker } from './calendar.js';

// June 2026 starts on a Monday and fits in five weeks, so a sixth row shows the height holding
const JUNE = new Date(2026, 5, 1);

describe('Calendar', () => {
  it('turns the month from its own header and always draws six weeks', async () => {
    const user = userEvent.setup();
    render(<Calendar mode="single" defaultMonth={JUNE} />);
    const grid = screen.getByRole('grid');
    // react-day-picker hides the weekday row from the tree, so these are the six weeks
    expect(within(grid).getAllByRole('row')).toHaveLength(6);
    expect(screen.getByRole('button', { name: 'Haziran 2026, Ay seç' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sonraki ay' }));
    expect(screen.getByRole('button', { name: 'Temmuz 2026, Ay seç' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Önceki ay' }));
    await user.click(screen.getByRole('button', { name: 'Önceki ay' }));
    expect(screen.getByRole('button', { name: 'Mayıs 2026, Ay seç' })).toBeInTheDocument();
  });

  it('stops at the months it is allowed to show', () => {
    render(
      <Calendar mode="single" defaultMonth={JUNE} startMonth={JUNE} endMonth={new Date(2026, 6)} />,
    );
    expect(screen.getByRole('button', { name: 'Önceki ay' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Sonraki ay' })).toBeEnabled();
  });

  it('zooms out to the months and comes back to the one picked, focus on the title', async () => {
    const user = userEvent.setup();
    render(
      <SkylcnProvider>
        <Calendar mode="single" defaultMonth={JUNE} />
      </SkylcnProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Haziran 2026, Ay seç' }));
    expect(await screen.findByRole('button', { name: '2026, Yıl seç' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Mart' }));
    const title = await screen.findByRole('button', { name: 'Mart 2026, Ay seç' });
    await waitFor(() => expect(title).toHaveFocus());
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Nisan' })).toBeNull());
  });

  it('breaks no accessibility rules', async () => {
    const { container } = render(
      <Calendar mode="single" defaultMonth={JUNE} selected={new Date(2026, 5, 12)} />,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('DateTimePicker', () => {
  it('sets the time of the chosen day from the hours and minutes columns', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DateTimePicker
        aria-label="Başlangıç"
        value={new Date(2026, 5, 12, 18, 0)}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Başlangıç' }));
    await user.click(within(await screen.findByRole('listbox', { name: 'Saat' })).getByText('20'));
    expect((onValueChange.mock.calls[0]?.[0] as Date).getHours()).toBe(20);
    await user.click(within(screen.getByRole('listbox', { name: 'Dakika' })).getByText('30'));
    const last = onValueChange.mock.calls.at(-1)?.[0] as Date;
    expect([last.getDate(), last.getMinutes()]).toEqual([12, 30]);
  });
});

describe('Picker pills', () => {
  it('write the day short, with the year only when it is not this one, and the time beside it', () => {
    const year = new Date().getFullYear();
    render(
      <SkylcnProvider locale="tr">
        <DatePicker
          variant="pill"
          aria-label="Kapanış"
          value={new Date(year, 9, 31)}
          onValueChange={() => {}}
        />
        <DatePicker
          variant="pill"
          aria-label="Geçen yıl"
          value={new Date(year - 1, 9, 31)}
          onValueChange={() => {}}
        />
        <DateTimePicker
          variant="pill"
          aria-label="Bitiş"
          value={new Date(year, 9, 31, 23, 59)}
          onValueChange={() => {}}
        />
      </SkylcnProvider>,
    );
    const pill = screen.getByRole('button', { name: 'Kapanış' });
    expect(pill).toHaveTextContent(/^31 Eki$/);
    expect(pill).toHaveClass('h-6.5');
    expect(pill).not.toHaveAttribute('data-size');
    expect(screen.getByRole('button', { name: 'Geçen yıl' })).toHaveTextContent(
      `31 Eki ${year - 1}`,
    );
    expect(screen.getByRole('button', { name: 'Bitiş' })).toHaveTextContent(/31 Eki.*23:59/);
  });
});

describe('DatePicker', () => {
  it('picks today from under the calendar', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Tarih" value={null} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Tarih' }));
    expect(screen.queryByRole('button', { name: 'Temizle' })).toBeNull();
    await user.click(await screen.findByRole('button', { name: 'Bugün' }));
    const picked = onValueChange.mock.calls[0]?.[0] as Date;
    expect(picked.toDateString()).toBe(new Date().toDateString());
  });

  it('clears a chosen day', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Tarih" value={new Date()} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Tarih' }));
    await user.click(await screen.findByRole('button', { name: 'Temizle' }));
    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it('opens a panel that breaks no accessibility rules', async () => {
    const user = userEvent.setup();
    render(
      <DatePicker aria-label="Tarih" value={new Date(2026, 5, 12)} onValueChange={() => {}} />,
    );
    await user.click(screen.getByRole('button', { name: 'Tarih' }));
    await screen.findByRole('grid');
    expect(await axeViolations()).toEqual([]);
  });

  it('locks Today when it falls outside the days allowed', async () => {
    const user = userEvent.setup();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    render(
      <DatePicker aria-label="Tarih" value={null} onValueChange={() => undefined} min={tomorrow} />,
    );
    await user.click(screen.getByRole('button', { name: 'Tarih' }));
    expect(await screen.findByRole('button', { name: 'Bugün' })).toBeDisabled();
  });
});
