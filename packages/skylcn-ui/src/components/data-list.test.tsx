import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { StatusDot } from './badge.js';
import {
  DataList,
  DataListBody,
  DataListCell,
  DataListColumnHeader,
  DataListHeader,
  DataListRow,
  type DataListColumn,
} from './data-list.js';

const columns: DataListColumn[] = [
  { id: 'status', width: '1.5rem' },
  { id: 'name', width: 'minmax(0,1fr)' },
  { id: 'role', width: '6rem', from: 'md' },
];

function List({ onSortChange }: { onSortChange?: (field: string) => void }) {
  return (
    <DataList
      columns={columns}
      sort={{ field: 'name', direction: 'desc' }}
      onSortChange={onSortChange}
    >
      <DataListHeader>
        <DataListColumnHeader column="status" sortable label="Durum" />
        <DataListColumnHeader column="name" sortable>
          Ad
        </DataListColumnHeader>
        <DataListColumnHeader column="role">Yetki</DataListColumnHeader>
      </DataListHeader>
      <DataListBody>
        <DataListRow href="/forms/1" label="Gece Kodu formunu aç" index={0}>
          <DataListCell column="status">
            <StatusDot tone="success" label="Açık" />
          </DataListCell>
          <DataListCell column="name">Gece Kodu</DataListCell>
          <DataListCell column="role">Sahip</DataListCell>
        </DataListRow>
      </DataListBody>
    </DataList>
  );
}

describe('DataList', () => {
  it('puts the row link inside the first column that never hides', () => {
    render(<List />);
    const link = screen.getByRole('link', { name: 'Gece Kodu formunu aç' });
    expect(link).toHaveAttribute('href', '/forms/1');
    const cell = link.closest('[role="cell"]');
    expect(cell).not.toBeNull();
    expect(cell).toContainElement(screen.getByRole('img', { name: 'Açık' }));
  });

  it('names sortable headers, including icon-only ones, and reports the sort', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<List onSortChange={onSortChange} />);

    await user.click(screen.getByRole('button', { name: 'Durum' }));
    expect(onSortChange).toHaveBeenCalledWith('status');
    expect(
      screen.getByRole('button', { name: 'Ad' }).closest('[role="columnheader"]'),
    ).toHaveAttribute('aria-sort', 'descending');
  });

  it('breaks no accessibility rules', async () => {
    render(<List onSortChange={() => undefined} />);
    expect(await axeViolations()).toEqual([]);
  });
});
