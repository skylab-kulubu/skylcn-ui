import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { ChoiceMatrix, rowLayout } from './choice-matrix.js';

const rows = [
  { value: 'ulasim', label: 'Ulaşım' },
  { value: 'yemek', label: 'Yemek', description: 'Akşam yemeği dahil' },
];
const columns = [
  { value: 'kotu', label: 'Kötü' },
  { value: 'orta', label: 'Orta' },
  { value: 'iyi', label: 'İyi' },
];

// jsdom lays nothing out, so a matrix measures 0px wide unless it is given a width
function widen(width: number) {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return this.dataset.slot === 'choice-matrix' ? width : 0;
    },
  });
}

afterEach(() => {
  delete (HTMLElement.prototype as { clientWidth?: number }).clientWidth;
});

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

const layoutOf = (container: HTMLElement) =>
  container.querySelector('[data-slot="choice-matrix"]')?.getAttribute('data-layout');

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

  it('draws a table where it has 28rem and the table fits', async () => {
    widen(800);
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<Single onChange={onChange} />);
    expect(layoutOf(container)).toBe('table');
    const transport = screen.getByRole('radiogroup', { name: 'Ulaşım' });
    expect(within(transport).getByRole('button', { name: 'Seçimi temizle' })).toBeDisabled();
    await user.click(within(transport).getByRole('radio', { name: 'Orta' }));
    await user.click(within(transport).getByRole('button', { name: 'Seçimi temizle' }));
    expect(onChange).toHaveBeenLastCalledWith({});
    expect(within(transport).getByRole('radio', { name: 'Orta' })).not.toBeChecked();
  });

  it('lists each row’s answers under its name below 28rem, as chips where they fit', () => {
    // jsdom measures every chip 0px wide, so they always fit on one line
    widen(400);
    const { container } = render(<Single />);
    expect(layoutOf(container)).toBe('inline');
    const food = screen.getByRole('radiogroup', { name: 'Yemek' });
    expect(within(food).getAllByRole('radio')).toHaveLength(3);
    expect(within(food).getByRole('radio', { name: 'İyi' })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="radio-card"]')).toHaveLength(0);
  });

  it('stacks the answers as cards where nothing is measured', () => {
    const { container } = render(<Single />);
    expect(layoutOf(container)).toBe('list');
    expect(container.querySelectorAll('[data-slot="radio-card"]')).toHaveLength(6);
  });

  it('takes a row’s answer back on a second press or Space', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Single onChange={onChange} />);
    const transport = screen.getByRole('radiogroup', { name: 'Ulaşım' });
    await user.click(within(transport).getByText('Orta'));
    expect(onChange).toHaveBeenLastCalledWith({ ulasim: 'orta' });
    await user.click(within(transport).getByText('Orta'));
    expect(onChange).toHaveBeenLastCalledWith({});
    expect(within(transport).getByRole('radio', { name: 'Orta' })).not.toBeChecked();

    await user.click(within(transport).getByRole('radio', { name: 'İyi' }));
    expect(within(transport).getByRole('radio', { name: 'İyi' })).toHaveFocus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith({});
    expect(within(transport).getByRole('radio', { name: 'İyi' })).not.toBeChecked();
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
    widen(800);
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

  it('ticks several columns as chips too', async () => {
    widen(400);
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<Multiple onChange={onChange} />);
    expect(layoutOf(container)).toBe('inline');
    const food = screen.getByRole('group', { name: 'Yemek' });
    await user.click(within(food).getByText('İyi'));
    await user.click(within(food).getByText('Kötü'));
    expect(onChange).toHaveBeenLastCalledWith({ yemek: ['kotu', 'iyi'] });
    expect(within(food).getByRole('checkbox', { name: 'İyi' })).toBeChecked();
  });

  it('breaks no accessibility rules in either layout', async () => {
    for (const width of [0, 800]) {
      widen(width);
      const { container, unmount } = render(<Single invalid />);
      expect(await axeViolations(container)).toEqual([]);
      unmount();
      const multiple = render(<Multiple />);
      expect(await axeViolations(multiple.container)).toEqual([]);
      multiple.unmount();
    }
  });
});

describe('ChoiceMatrix readOnly', () => {
  const answers = { yemek: 'iyi' };

  it('lists each row beside its answer where the table does not fit', () => {
    render(
      <ChoiceMatrix readOnly aria-label="Puanlar" rows={rows} columns={columns} value={answers} />,
    );
    const terms = screen.getAllByRole('term').map((term) => term.textContent);
    const answersRead = screen.getAllByRole('definition').map((answer) => answer.textContent);
    expect(terms).toEqual(['Ulaşım', 'Yemek']);
    expect(answersRead).toEqual(['Cevap yok', 'İyi']);
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
  });

  it('marks the chosen cell of a table and says so to screen readers', () => {
    widen(800);
    render(
      <ChoiceMatrix readOnly aria-label="Puanlar" rows={rows} columns={columns} value={answers} />,
    );
    expect(screen.getAllByRole('columnheader').map((cell) => cell.textContent)).toEqual([
      'Kötü',
      'Orta',
      'İyi',
    ]);
    const food = screen.getAllByRole('row')[2]!;
    expect(within(food).getByRole('rowheader')).toHaveTextContent('Yemek');
    expect(within(food).getAllByRole('cell')[2]).toHaveTextContent('Seçili');
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
  });

  it('joins several answers of a row', () => {
    render(
      <ChoiceMatrix
        readOnly
        multiple
        aria-label="Günler"
        rows={rows}
        columns={columns}
        value={{ ulasim: ['kotu', 'iyi'] }}
      />,
    );
    expect(screen.getAllByRole('definition')[0]).toHaveTextContent('Kötü, İyi');
  });

  it('breaks no accessibility rules in either layout', async () => {
    for (const width of [0, 800]) {
      widen(width);
      const { container, unmount } = render(
        <ChoiceMatrix
          readOnly
          aria-label="Puanlar"
          rows={rows}
          columns={columns}
          value={answers}
        />,
      );
      expect(await axeViolations(container)).toEqual([]);
      unmount();
    }
  });
});

describe('rowLayout', () => {
  const always = () => true;
  const never = () => false;

  it('keeps answers on one line when their chips fit', () => {
    expect(rowLayout([60, 60, 60], 188, never)).toEqual({ mode: 'inline' });
  });

  it('turns them into equal cells, all in one line, when each label fits two lines', () => {
    expect(rowLayout([90, 90, 90], 200, always)).toEqual({ mode: 'grid', perRow: 3 });
  });

  it('takes half per line from six answers when a full line of cells is too narrow', () => {
    const widths = Array.from({ length: 6 }, () => 80);
    expect(rowLayout(widths, 220, (cell) => cell >= 70)).toEqual({ mode: 'grid', perRow: 3 });
  });

  it('stacks them as cards when no cells fit or a cell would be under 40px', () => {
    expect(rowLayout([90, 90, 90], 200, never)).toEqual({ mode: 'list' });
    expect(rowLayout([90, 90, 90, 90, 90], 180, always)).toEqual({ mode: 'list' });
    expect(rowLayout([90, 90], 0, always)).toEqual({ mode: 'list' });
  });
});

describe('ChoiceMatrix control', () => {
  it('frames the table on the box controls’ surface', () => {
    widen(800);
    const { container } = render(
      <ChoiceMatrix
        variant="control"
        aria-label="Etkinliği değerlendir"
        rows={rows}
        columns={columns}
        value={{}}
        onValueChange={() => undefined}
      />,
    );
    expect(layoutOf(container)).toBe('table');
    const table = screen.getByRole('radiogroup', { name: 'Ulaşım' }).parentElement;
    expect(table).toHaveClass('border', 'border-input', 'bg-background/60');
    expect(table).not.toHaveClass('border-y');
  });
});
