import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { ChoiceMatrix } from './choice-matrix.js';

const rows = [
  { value: 'ulasim', label: 'Ulaşım' },
  { value: 'yemek', label: 'Yemek', description: 'Akşam yemeği dahil' },
];
const columns = [
  { value: 'kotu', label: 'Kötü' },
  { value: 'orta', label: 'Orta' },
  { value: 'iyi', label: 'İyi' },
];

function Single({
  onChange,
  invalid = false,
}: {
  onChange?: (value: unknown) => void;
  invalid?: boolean;
}) {
  const [value, setValue] = useState<Record<string, string>>({});
  return (
    <ChoiceMatrix
      aria-label="Etkinliği değerlendir"
      rows={rows}
      columns={columns}
      value={value}
      invalid={invalid}
      required
      onValueChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

function Multiple({ onChange }: { onChange?: (value: unknown) => void }) {
  const [value, setValue] = useState<Record<string, string[]>>({});
  return (
    <ChoiceMatrix
      multiple
      aria-label="Hangi günler"
      rows={rows}
      columns={columns}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

describe('ChoiceMatrix', () => {
  it('asks each row as a radio group named by the row, its radios named by the columns', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Single onChange={onChange} />);
    const food = screen.getByRole('radiogroup', { name: 'Yemek' });
    expect(food).toHaveAccessibleDescription('Akşam yemeği dahil');
    await user.click(within(food).getByRole('radio', { name: 'İyi' }));
    expect(onChange).toHaveBeenLastCalledWith({ yemek: 'iyi' });
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Ulaşım' })).getByRole('radio', {
        name: 'Kötü',
      }),
    );
    expect(onChange).toHaveBeenLastCalledWith({ yemek: 'iyi', ulasim: 'kotu' });
  });

  it('clears a chosen row again and offers no clearing on an empty one', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Single onChange={onChange} />);
    const transport = screen.getByRole('radiogroup', { name: 'Ulaşım' });
    // Wide and narrow layouts each carry the button; the hidden one leaves the tree
    for (const button of within(transport).getAllByRole('button', { hidden: true })) {
      expect(button).toBeDisabled();
    }
    await user.click(within(transport).getByRole('radio', { name: 'Orta' }));
    const [clear] = within(transport).getAllByRole('button', {
      name: 'Seçimi temizle',
      hidden: true,
    });
    await user.click(clear!);
    expect(onChange).toHaveBeenLastCalledWith({});
    expect(within(transport).getByRole('radio', { name: 'Orta' })).not.toBeChecked();
  });

  it('moves along a row with the arrow keys and leaves the row with Tab', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Single onChange={onChange} />);
    await user.tab();
    expect(
      within(screen.getByRole('radiogroup', { name: 'Ulaşım' })).getByRole('radio', {
        name: 'Kötü',
      }),
    ).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith({ ulasim: 'orta' });
  });

  it('marks only the rows still unanswered while invalid', async () => {
    const user = userEvent.setup();
    render(<Single invalid />);
    const transport = screen.getByRole('radiogroup', { name: 'Ulaşım' });
    const food = screen.getByRole('radiogroup', { name: 'Yemek' });
    expect(transport).toHaveAttribute('aria-invalid', 'true');
    expect(transport).toHaveAttribute('aria-required', 'true');
    await user.click(within(food).getByRole('radio', { name: 'Orta' }));
    expect(food).not.toHaveAttribute('aria-invalid');
    expect(transport).toHaveClass('bg-destructive/5');
    expect(food).not.toHaveClass('bg-destructive/5');
  });

  it('takes several columns per row with multiple, kept in column order', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Multiple onChange={onChange} />);
    const food = screen.getByRole('group', { name: 'Yemek' });
    await user.click(within(food).getByRole('checkbox', { name: 'İyi' }));
    await user.click(within(food).getByRole('checkbox', { name: 'Kötü' }));
    expect(onChange).toHaveBeenLastCalledWith({ yemek: ['kotu', 'iyi'] });
    await user.click(within(food).getByRole('checkbox', { name: 'İyi' }));
    await user.click(within(food).getByRole('checkbox', { name: 'Kötü' }));
    // A row with nothing ticked is dropped, so it reads as unanswered
    expect(onChange).toHaveBeenLastCalledWith({});
  });

  it('breaks no accessibility rules', async () => {
    const { container, unmount } = render(<Single invalid />);
    expect(await axeViolations(container)).toEqual([]);
    unmount();
    const multiple = render(<Multiple />);
    expect(await axeViolations(multiple.container)).toEqual([]);
  });
});
