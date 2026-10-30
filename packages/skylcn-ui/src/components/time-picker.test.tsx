import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { TimePicker } from './time-picker.js';

const chosenIn = (list: HTMLElement) =>
  within(list)
    .getAllByRole('option')
    .find((option) => option.getAttribute('aria-selected') === 'true')?.textContent;

describe('TimePicker', () => {
  it('sets the time only once Select is pressed, starting in the hours', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimePicker aria-label="Mülakat saati" value="09:30" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Mülakat saati' }));
    const hours = await screen.findByRole('listbox', { name: 'Saat' });
    await waitFor(() => expect(hours).toHaveFocus());
    expect(chosenIn(hours)).toBe('09');
    await user.keyboard('{ArrowDown}');
    expect(chosenIn(hours)).toBe('10');
    const minutes = screen.getByRole('listbox', { name: 'Dakika' });
    await user.click(within(minutes).getByText('45'));
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Seç' }));
    expect(onValueChange).toHaveBeenCalledWith('10:45');
  });

  it('selects with Enter in a column and leaves the time as it was on Esc', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimePicker aria-label="Mülakat saati" value="09:30" onValueChange={onValueChange} />);
    const trigger = screen.getByRole('button', { name: 'Mülakat saati' });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('listbox', { name: 'Saat' })).toHaveFocus());
    await user.keyboard('{Home}{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('00:30');
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('listbox', { name: 'Saat' })).toHaveFocus());
    await user.keyboard('{End}{Escape}');
    expect(onValueChange).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('listbox', { name: 'Saat' })).toBeNull());
  });

  it('clears a set time, and offers no Clear without one', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <TimePicker aria-label="Mülakat saati" value={null} onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole('button', { name: 'Mülakat saati' }));
    await screen.findByRole('listbox', { name: 'Saat' });
    expect(screen.queryByRole('button', { name: 'Temizle' })).toBeNull();
    await user.keyboard('{Escape}');
    rerender(<TimePicker aria-label="Mülakat saati" value="14:00" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Mülakat saati' }));
    await user.click(await screen.findByRole('button', { name: 'Temizle' }));
    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it('offers minutes a step apart and keeps a time between them visible', async () => {
    const user = userEvent.setup();
    render(
      <TimePicker
        aria-label="Mülakat saati"
        value="09:07"
        minuteStep={15}
        onValueChange={() => {}}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Mülakat saati' }));
    const minutes = await screen.findByRole('listbox', { name: 'Dakika' });
    expect(
      within(minutes)
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual(['00', '07', '15', '30', '45']);
    expect(chosenIn(minutes)).toBe('07');
  });

  it('fits a dense row as a pill', () => {
    render(
      <TimePicker variant="pill" aria-label="Başlangıç" value="09:30" onValueChange={() => {}} />,
    );
    const pill = screen.getByRole('button', { name: 'Başlangıç' });
    expect(pill).toHaveTextContent('09:30');
    expect(pill).toHaveClass('h-6.5');
  });

  it('breaks no accessibility rules while open', async () => {
    const user = userEvent.setup();
    render(<TimePicker aria-label="Mülakat saati" value="09:30" onValueChange={() => {}} />);
    await user.click(screen.getByRole('button', { name: 'Mülakat saati' }));
    await screen.findByRole('listbox', { name: 'Saat' });
    expect(await axeViolations()).toEqual([]);
  });
});
