import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { ChoiceList } from './choice-list.js';

const options = [
  { value: 'web', label: 'Web geliştirme' },
  { value: 'ai', label: 'Yapay zekâ' },
  { value: 'game', label: 'Oyun geliştirme', description: 'Unity ya da Godot' },
];

describe('ChoiceList', () => {
  it('takes one answer with round radios by default', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ChoiceList
        aria-label="İlgi alanı"
        options={options}
        value={null}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole('radiogroup', { name: 'İlgi alanı' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    await user.click(screen.getByText('Unity ya da Godot'));
    expect(onValueChange).toHaveBeenCalledWith('game');
  });

  it('takes several answers with square checkboxes, kept in the options’ order', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ChoiceList
        multiple
        aria-label="İlgi alanların"
        options={options}
        value={['game']}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    expect(screen.getByRole('checkbox', { name: 'Oyun geliştirme' })).toBeChecked();
    await user.click(screen.getByText('Web geliştirme'));
    expect(onValueChange).toHaveBeenCalledWith(['web', 'game']);
  });

  it('draws every option in the error colour while invalid and says so', () => {
    const { container } = render(
      <ChoiceList
        multiple
        invalid
        aria-label="İlgi alanların"
        options={options}
        value={[]}
        onValueChange={() => undefined}
      />,
    );
    for (const card of container.querySelectorAll('[data-slot="checkbox-card"]')) {
      expect(card).toHaveClass('border-destructive/50');
    }
    expect(screen.getByRole('checkbox', { name: 'Web geliştirme' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('breaks no accessibility rules either way', async () => {
    const { container, rerender } = render(
      <ChoiceList
        aria-label="İlgi alanı"
        options={options}
        value="ai"
        onValueChange={() => undefined}
      />,
    );
    expect(await axeViolations(container)).toEqual([]);
    rerender(
      <ChoiceList
        multiple
        aria-label="İlgi alanların"
        options={options}
        value={['ai']}
        onValueChange={() => undefined}
      />,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
