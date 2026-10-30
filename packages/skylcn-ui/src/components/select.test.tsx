import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { Select } from './select.js';

const interests = [
  { value: 'web', label: 'Web' },
  { value: 'ai', label: 'Yapay zekâ' },
  { value: 'game', label: 'Oyun' },
];

function Several({ onChange }: { onChange?: (value: string[]) => void }) {
  const [value, setValue] = useState<string[]>(['web']);
  return (
    <Select
      multiple
      aria-label="İlgi alanları"
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
      options={interests}
    />
  );
}

describe('Select', () => {
  // Base UI's select opens slowly in jsdom; with every file running at once it passes 5s
  it(
    'runs its action row from the list without changing the value',
    { timeout: 15_000 },
    async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const onSelect = vi.fn();
      render(
        <Select
          aria-label="Rol"
          value="editor"
          onValueChange={onValueChange}
          options={[
            { value: 'viewer', label: 'Görüntüleyici' },
            { value: 'editor', label: 'Editör' },
          ]}
          action={{ label: 'İzni kaldır', onSelect, destructive: true }}
        />,
      );
      await user.click(screen.getByRole('combobox', { name: 'Rol' }));
      await user.click(await screen.findByRole('option', { name: 'İzni kaldır' }));
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onValueChange).not.toHaveBeenCalled();
    },
  );

  it('rises its rows each time it opens, then settles', { timeout: 15_000 }, async () => {
    const user = userEvent.setup();
    render(
      <Select aria-label="İlgi" value={null} onValueChange={() => undefined} options={interests} />,
    );
    const trigger = screen.getByRole('combobox', { name: 'İlgi' });
    await user.click(trigger);
    await screen.findByRole('option', { name: 'Oyun' });
    const rows = () => document.querySelector('.list-rows');
    expect(rows()).not.toHaveAttribute('data-settled');
    await waitFor(() => expect(rows()).toHaveAttribute('data-settled'), { timeout: 2000 });

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('option', { name: 'Oyun' })).toBeNull());
    await user.click(trigger);
    await screen.findByRole('option', { name: 'Oyun' });
    expect(rows()).not.toHaveAttribute('data-settled');
  });

  it('draws a pill without a size of its own for dense rows', () => {
    render(
      <Select
        variant="pill"
        aria-label="Rol"
        value="editor"
        onValueChange={() => undefined}
        options={[{ value: 'editor', label: 'Editör' }]}
      />,
    );
    const trigger = screen.getByRole('combobox', { name: 'Rol' });
    expect(trigger).toHaveClass('h-6.5');
    expect(trigger).not.toHaveAttribute('data-size');
    expect(trigger).toHaveTextContent('Editör');
  });

  it(
    'keeps several picks, ticked, with the list open between them',
    { timeout: 15_000 },
    async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Several onChange={onChange} />);
      const trigger = screen.getByRole('combobox', { name: 'İlgi alanları' });
      expect(trigger).toHaveTextContent('Web');
      await user.click(trigger);
      await user.click(await screen.findByRole('option', { name: 'Yapay zekâ' }));
      expect(onChange).toHaveBeenLastCalledWith(['web', 'ai']);
      await user.click(screen.getByRole('option', { name: 'Web' }));
      expect(onChange).toHaveBeenLastCalledWith(['ai']);
      expect(screen.getByRole('option', { name: 'Yapay zekâ' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(await axeViolations(document.body)).toEqual([]);
    },
  );
});
