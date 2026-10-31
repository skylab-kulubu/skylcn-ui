import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { OverflowActions } from './overflow-actions.js';

const ACTIONS = ['Düzenle', 'Kopyala', 'Arşivle'].map((label) => ({
  key: label,
  label,
  onSelect: vi.fn(),
}));

// jsdom lays nothing out, so the row and each measured button get set widths
function layout(room: number) {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.dataset.slot === 'overflow-actions' ? room : 0;
  });
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.getAttribute('aria-label') === '' ? 32 : 80;
  });
}

afterEach(() => vi.restoreAllMocks());

describe('OverflowActions', () => {
  it('keeps every action a button when they fit', () => {
    layout(400);
    render(<OverflowActions aria-label="Form eylemleri" actions={ACTIONS} />);
    const toolbar = screen.getByRole('toolbar', { name: 'Form eylemleri' });
    expect(toolbar.querySelectorAll(':scope > button')).toHaveLength(3);
    expect(screen.queryByRole('button', { name: 'Diğer eylemler' })).toBeNull();
  });

  it('folds the least important actions into a menu when the row is narrow', async () => {
    const user = userEvent.setup();
    layout(200);
    render(<OverflowActions aria-label="Form eylemleri" actions={ACTIONS} />);
    expect(screen.getByRole('button', { name: 'Düzenle' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Arşivle' })).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Diğer eylemler' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Arşivle' }));
    expect(ACTIONS[2]!.onSelect).toHaveBeenCalled();
  });

  it('has no axe violations', async () => {
    layout(200);
    const { container } = render(<OverflowActions aria-label="Form eylemleri" actions={ACTIONS} />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
