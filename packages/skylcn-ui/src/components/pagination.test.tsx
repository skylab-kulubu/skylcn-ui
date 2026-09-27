import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { Pagination, pageSlots } from './pagination.js';

function Harness({ total, start = 4 }: { total: number; start?: number }) {
  const [page, setPage] = useState(start);
  return <Pagination current={page} totalPages={total} onPageChange={setPage} />;
}

describe('pageSlots', () => {
  it('lists every page when there are few', () => {
    expect(pageSlots(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('folds the pages far from the current one', () => {
    expect(pageSlots(10, 48)).toEqual([1, 'gap-start', 9, 10, 11, 'gap-end', 48]);
  });

  it('keeps the window inside the first and last page', () => {
    expect(pageSlots(1, 48)).toEqual([1, 2, 3, 4, 'gap-end', 48]);
    expect(pageSlots(48, 48)).toEqual([1, 'gap-start', 45, 46, 47, 48]);
  });
});

describe('Pagination', () => {
  it('renders nothing for a single page', () => {
    const { container } = render(
      <Pagination current={1} totalPages={1} onPageChange={() => undefined} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the current page as plain text when every page is listed', () => {
    render(<Harness total={5} start={2} />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getAllByText('Sayfa 2')[0]!.closest('[aria-current="page"]')).not.toBeNull();
  });

  it('jumps to a typed page and holds it within the first and last page', async () => {
    const user = userEvent.setup();
    render(<Harness total={48} />);
    const input = screen.getAllByRole('textbox', { name: 'Sayfa numarası (1–48)' })[0]!;

    await user.click(input);
    await user.keyboard('30{Enter}');
    expect(input).toHaveValue('30');

    await user.keyboard('99{Enter}');
    expect(input).toHaveValue('48');

    await user.keyboard('0{Enter}');
    expect(input).toHaveValue('1');
  });

  it('takes digits only, no more than the last page has', async () => {
    const user = userEvent.setup();
    render(<Harness total={48} />);
    const input = screen.getAllByRole('textbox')[0]!;

    await user.click(input);
    await user.keyboard('1a2b3');
    expect(input).toHaveValue('12');
  });

  it('puts the current page back on Escape or an empty field', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination current={4} totalPages={48} onPageChange={onPageChange} />);
    const input = screen.getAllByRole('textbox')[0]!;

    await user.click(input);
    await user.keyboard('17{Escape}');
    expect(input).toHaveValue('4');

    await user.keyboard('{Backspace}');
    await user.tab();
    expect(input).toHaveValue('4');
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('breaks no accessibility rules', async () => {
    render(<Harness total={48} />);
    expect(await axeViolations()).toEqual([]);
  });
});
