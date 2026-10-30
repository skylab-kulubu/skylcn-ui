import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ToggleRow } from './switch.js';

describe('ToggleRow', () => {
  it('shows its nested settings while on, under the title for that state', async () => {
    const user = userEvent.setup();
    render(
      <ToggleRow title="Süre sınırı yok" checkedTitle="Süre sınırı var">
        <p>Süre: 30 dk</p>
      </ToggleRow>,
    );
    expect(screen.queryByText('Süre: 30 dk')).toBeNull();
    await user.click(screen.getByRole('switch'));
    expect(await screen.findByText('Süre: 30 dk')).toBeInTheDocument();
    expect(screen.getByText('Süre sınırı var')).toBeInTheDocument();
  });

  it('keeps a press inside the nested settings from flipping the switch', async () => {
    const user = userEvent.setup();
    render(
      <ToggleRow title="Süre" defaultChecked>
        <button type="button">Ayarla</button>
      </ToggleRow>,
    );
    await user.click(screen.getByRole('button', { name: 'Ayarla' }));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});
