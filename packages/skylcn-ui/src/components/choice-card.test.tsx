import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { CheckboxCard } from './checkbox.js';
import { ControlSizeProvider } from './control.js';
import { RadioCard, RadioGroup } from './radio-group.js';

describe('Choice card sizes', () => {
  it('stands as tall as a box control of its size, taken from the surrounding provider', () => {
    const { container, rerender } = render(<CheckboxCard label="Web geliştirme" />);
    const card = () => container.querySelector('[data-slot="checkbox-card"]');
    expect(card()).toHaveClass('py-2.25');
    expect(screen.getByText('Web geliştirme')).toHaveClass('text-xs');
    rerender(
      <ControlSizeProvider size="lg">
        <CheckboxCard label="Web geliştirme" />
      </ControlSizeProvider>,
    );
    expect(card()).toHaveClass('py-2');
    expect(screen.getByText('Web geliştirme')).toHaveClass('text-sm');
  });
});

describe('CheckboxCard', () => {
  it('ticks its checkbox wherever the card is pressed and is named by its label', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <CheckboxCard
        label="Web geliştirme"
        description="Frontend ve backend"
        onCheckedChange={onCheckedChange}
      />,
    );
    await user.click(screen.getByText('Frontend ve backend'));
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
    expect(screen.getByRole('checkbox', { name: 'Web geliştirme' })).toHaveAccessibleDescription(
      'Frontend ve backend',
    );
  });

  it('draws the card in the error colour while invalid', () => {
    const { container } = render(<CheckboxCard label="Oyun" invalid />);
    expect(container.querySelector('[data-slot="checkbox-card"]')).toHaveClass(
      'border-destructive/50',
    );
  });
});

describe('RadioCard', () => {
  it('picks its choice in the group wherever the card is pressed', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Bölüm" onValueChange={onValueChange}>
        <RadioCard value="bm" label="Bilgisayar" />
        <RadioCard value="em" label="Elektronik" />
      </RadioGroup>,
    );
    await user.click(screen.getByText('Elektronik'));
    expect(onValueChange).toHaveBeenCalledWith('em', expect.anything());
  });

  it('breaks no accessibility rules', async () => {
    render(
      <RadioGroup aria-label="Bölüm" defaultValue="bm">
        <RadioCard value="bm" label="Bilgisayar" description="Davutpaşa" />
        <RadioCard value="em" label="Elektronik" />
      </RadioGroup>,
    );
    expect(await axeViolations()).toEqual([]);
  });
});
