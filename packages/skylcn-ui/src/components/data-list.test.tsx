import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { SkylcnProvider } from '../lib/provider.js';
import { StatusDot } from './badge.js';
import {
  DataList,
  DataListBody,
  DataListCell,
  DataListColumnHeader,
  DataListEmpty,
  DataListHeader,
  DataListSkeleton,
  DataListRow,
  useDataListPanelOpened,
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

  it('keeps table structure while loading and when empty', async () => {
    const { rerender } = render(
      <DataList columns={columns}>
        <DataListHeader>
          <DataListColumnHeader column="status" label="Durum" />
          <DataListColumnHeader column="name">Ad</DataListColumnHeader>
          <DataListColumnHeader column="role">Yetki</DataListColumnHeader>
        </DataListHeader>
        <DataListSkeleton rows={3} />
      </DataList>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Yükleniyor');
    expect(await axeViolations()).toEqual([]);

    rerender(
      <DataList columns={columns}>
        <DataListHeader>
          <DataListColumnHeader column="status" label="Durum" />
          <DataListColumnHeader column="name">Ad</DataListColumnHeader>
          <DataListColumnHeader column="role">Yetki</DataListColumnHeader>
        </DataListHeader>
        <DataListEmpty title="Eşleşen üye yok" />
      </DataList>,
    );
    expect(await axeViolations()).toEqual([]);
  });

  it('leaves out the header and cells of a column the list does not have', () => {
    render(
      <DataList columns={columns.filter((column) => column.id !== 'role')}>
        <DataListHeader>
          <DataListColumnHeader column="name">Ad</DataListColumnHeader>
          <DataListColumnHeader column="role">Yetki</DataListColumnHeader>
        </DataListHeader>
        <DataListBody>
          <DataListRow>
            <DataListCell column="name">Gece Kodu</DataListCell>
            <DataListCell column="role">Sahip</DataListCell>
          </DataListRow>
        </DataListBody>
      </DataList>,
    );
    expect(screen.queryByRole('columnheader', { name: 'Yetki' })).toBeNull();
    expect(screen.queryByText('Sahip')).toBeNull();
    expect(screen.getAllByRole('cell')).toHaveLength(1);
  });

  it('changes a column’s width by breakpoint and drops columns not shown yet', () => {
    render(
      <DataList
        columns={[
          { id: 'name', width: { base: 'minmax(0,1.5fr)', xl: 'minmax(0,22rem)' } },
          { id: 'role', width: '6rem', from: 'lg' },
          { id: 'actions', width: { base: 'auto', lg: '5rem' } },
        ]}
      >
        <DataListBody />
      </DataList>,
    );
    const style = screen.getByRole('table').style;
    expect(style.getPropertyValue('--dl-base')).toBe('minmax(0,1.5fr) auto');
    expect(style.getPropertyValue('--dl-md')).toBe('minmax(0,1.5fr) auto');
    expect(style.getPropertyValue('--dl-lg')).toBe('minmax(0,1.5fr) 6rem 5rem');
    expect(style.getPropertyValue('--dl-xl')).toBe('minmax(0,22rem) 6rem 5rem');
  });

  it('keeps the row link out of a lifted cell', () => {
    render(
      <DataList
        columns={[
          { id: 'pick', width: '1.5rem', interactive: true },
          { id: 'name', width: 'minmax(0,1fr)' },
        ]}
      >
        <DataListBody>
          <DataListRow href="/forms/1" label="Gece Kodu formunu aç">
            <DataListCell column="pick">
              <input type="checkbox" aria-label="Seç" />
            </DataListCell>
            <DataListCell column="name">Gece Kodu</DataListCell>
          </DataListRow>
        </DataListBody>
      </DataList>,
    );
    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveClass('z-10');
    expect(cells[1]).toContainElement(screen.getByRole('link', { name: 'Gece Kodu formunu aç' }));
  });
});

type Form = { id: string; title: string; owner: string; answers: number; deleted?: boolean };

const forms: Form[] = [
  { id: 'f1', title: 'Gece Kodu', owner: 'Elif', answers: 12 },
  { id: 'f2', title: 'Kış Kampı', owner: 'Mert', answers: 3 },
  { id: 'f3', title: 'Eski Anket', owner: 'Can', answers: 0, deleted: true },
];

const formColumns: DataListColumn<Form>[] = [
  { id: 'title', width: 'minmax(0,1fr)', header: 'Form', cell: (form) => form.title },
  { id: 'answers', width: '4rem', header: 'Yanıt', sortable: true, cell: (form) => form.answers },
];

describe('DataList drawn from rows', () => {
  it('draws the header and cells from the column definitions, in their order', () => {
    const owner: DataListColumn<Form> = {
      id: 'owner',
      width: '8rem',
      header: 'Sahip',
      cell: (form) => form.owner,
    };
    const { rerender } = render(
      <DataList rows={forms} columns={formColumns} getRowId={(form) => form.id} />,
    );
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Form',
      'Yanıt',
    ]);

    rerender(
      <DataList
        rows={forms}
        columns={[formColumns[0]!, owner, formColumns[1]!]}
        getRowId={(form) => form.id}
      />,
    );
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Form',
      'Sahip',
      'Yanıt',
    ]);
    const firstRow = screen.getAllByRole('row')[1]!;
    expect([...firstRow.querySelectorAll('[role="cell"]')].map((cell) => cell.textContent)).toEqual(
      ['Gece Kodu', 'Elif', '12'],
    );
  });

  it('asks to sort by a sortable column', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataList
        rows={forms}
        columns={formColumns}
        getRowId={(form) => form.id}
        sort={{ field: 'answers', direction: 'asc' }}
        onSortChange={onSortChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Yanıt' }));
    expect(onSortChange).toHaveBeenCalledWith('answers');
    expect(screen.getByRole('columnheader', { name: 'Yanıt' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
  });

  it('sorts the rows itself by a sortValue, empty values last either way', async () => {
    const user = userEvent.setup();
    type Item = { id: string; name: string; score: number | null };
    const items: Item[] = [
      { id: 'a', name: 'Çağla', score: 3 },
      { id: 'b', name: 'Ali', score: null },
      { id: 'c', name: 'Zeynep', score: 10 },
      { id: 'd', name: 'Cem', score: 1 },
    ];
    render(
      <DataList
        rows={items}
        getRowId={(item) => item.id}
        columns={[
          {
            id: 'name',
            width: 'minmax(0,1fr)',
            header: 'Ad',
            sortValue: (item) => item.name,
            cell: (item) => item.name,
          },
          {
            id: 'score',
            width: '4rem',
            header: 'Puan',
            sortValue: (item) => item.score,
            cell: (item) => item.score ?? '—',
          },
        ]}
      />,
    );
    const names = () =>
      screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.querySelector('[role="cell"]')!.textContent);
    expect(names()).toEqual(['Çağla', 'Ali', 'Zeynep', 'Cem']);

    // Text goes A to Z first, in Turkish order
    await user.click(screen.getByRole('button', { name: 'Ad' }));
    expect(names()).toEqual(['Ali', 'Cem', 'Çağla', 'Zeynep']);

    // Figures go largest first, then turn over; the empty one stays last
    await user.click(screen.getByRole('button', { name: 'Puan' }));
    expect(names()).toEqual(['Zeynep', 'Çağla', 'Cem', 'Ali']);
    await user.click(screen.getByRole('button', { name: 'Puan' }));
    expect(names()).toEqual(['Cem', 'Çağla', 'Zeynep', 'Ali']);
    expect(screen.getByRole('columnheader', { name: 'Puan' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
  });

  it('comes in as one even wave on its first fill, no row lagging behind the rest', () => {
    const many = Array.from({ length: 20 }, (_, i) => ({ ...forms[0]!, id: `f${i}` }));
    const { container } = render(
      <DataList rows={many} columns={formColumns} getRowId={(form) => form.id} />,
    );
    const body = container.querySelector<HTMLElement>('[data-slot="data-list-body"]')!;
    // 150ms spread over the 19 gaps between 20 rows
    expect(body.style.getPropertyValue('--dl-step')).toContain('7.89ms');
    const rows = [...container.querySelectorAll<HTMLElement>('[data-slot="data-list-row-group"]')];
    expect(rows.every((row) => row.classList.contains('enter-rise'))).toBe(true);
    expect(rows.map((row) => row.style.animationDelay)).toEqual(
      rows.map((_, i) => `calc(var(--dl-step, 0ms) * ${i})`),
    );
  });

  it('draws a row again only when its row, the columns or its open state change', async () => {
    const user = userEvent.setup();
    const cell = vi.fn((form: Form) => form.title);
    const columns: DataListColumn<Form>[] = [
      { id: 'title', width: 'minmax(0,1fr)', header: 'Form', cell },
    ];
    function Page() {
      const [, setTick] = useState(0);
      return (
        <>
          <button type="button" onClick={() => setTick((tick) => tick + 1)}>
            Yenile
          </button>
          <DataList
            rows={forms}
            columns={columns}
            getRowId={(form) => form.id}
            rowLabel={(form) => form.title}
            renderPanel={(form) => <p>{form.title} paneli</p>}
          />
        </>
      );
    }
    render(<Page />);
    expect(cell).toHaveBeenCalledTimes(3);

    cell.mockClear();
    await user.click(screen.getByRole('button', { name: 'Yenile' }));
    expect(cell).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Kış Kampı' }));
    expect(cell.mock.calls.map(([form]) => form.id)).toEqual(['f2']);
  });

  it('shows skeleton rows while loading and a state card when empty', () => {
    const { rerender } = render(
      <DataList rows={[]} columns={formColumns} getRowId={(form: Form) => form.id} loading />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Yükleniyor');

    rerender(
      <DataList
        rows={[]}
        columns={formColumns}
        getRowId={(form: Form) => form.id}
        empty={{ title: 'Form bulunamadı' }}
      />,
    );
    expect(screen.getByText('Form bulunamadı')).toBeInTheDocument();
  });

  it('opens a row by pressing it and draws only the open row’s panel', async () => {
    const user = userEvent.setup();
    const renderPanel = vi.fn((form: Form) => <p>{form.title} paneli</p>);
    render(
      <DataList
        rows={forms}
        columns={formColumns}
        getRowId={(form) => form.id}
        rowLabel={(form) => form.title}
        renderPanel={renderPanel}
        canExpand={(form) => !form.deleted}
      />,
    );
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Ayrıntılar');
    expect(renderPanel).not.toHaveBeenCalled();

    const toggle = screen.getByRole('button', { name: 'Kış Kampı' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const panel = screen.getByText('Kış Kampı paneli').closest('[role="cell"]')!;
    expect(toggle).toHaveAttribute('aria-controls', panel.id);
    expect(renderPanel.mock.calls.every(([form]) => form.id === 'f2')).toBe(true);

    // A row that cannot open has no button to open it
    expect(screen.queryByRole('button', { name: 'Eski Anket' })).toBeNull();
    expect(await axeViolations()).toEqual([]);

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps one row open at a time, under the list’s control', async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    render(
      <DataList
        rows={forms}
        columns={formColumns}
        getRowId={(form) => form.id}
        rowLabel={(form) => form.title}
        renderPanel={(form) => <p>{form.title} paneli</p>}
        expandedId="f1"
        onExpandedChange={onExpandedChange}
      />,
    );
    expect(screen.getByText('Gece Kodu paneli')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Kış Kampı' }));
    expect(onExpandedChange).toHaveBeenCalledWith('f2');
    // Controlled: nothing moves until the list says so
    expect(screen.queryByText('Kış Kampı paneli')).toBeNull();
  });

  it('tells the panel content once the panel has finished opening', async () => {
    function Peek() {
      return <p>{useDataListPanelOpened() ? 'Açıldı' : 'Açılıyor'}</p>;
    }
    const list = (expandedId?: string) => (
      <SkylcnProvider>
        <DataList
          rows={forms}
          columns={formColumns}
          getRowId={(form) => form.id}
          rowLabel={(form) => form.title}
          renderPanel={() => <Peek />}
          expandedId={expandedId}
        />
      </SkylcnProvider>
    );

    // Open when it mounts: shown without motion, so already opened
    const { unmount } = render(list('f1'));
    expect(screen.getByText('Açıldı')).toBeInTheDocument();
    unmount();

    const user = userEvent.setup();
    render(list());
    await user.click(screen.getByRole('button', { name: 'Kış Kampı' }));
    expect(screen.getByText('Açılıyor')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Açıldı')).toBeInTheDocument(), {
      timeout: 2000,
    });
  });

  it('opens a linked row through its chevron and keeps the row a link', async () => {
    const user = userEvent.setup();
    render(
      <DataList
        rows={forms}
        columns={formColumns}
        getRowId={(form) => form.id}
        rowHref={(form) => `/forms/${form.id}`}
        rowLabel={(form) => form.title}
        renderPanel={(form) => <p>{form.title} paneli</p>}
      />,
    );
    expect(screen.getByRole('link', { name: 'Gece Kodu' })).toHaveAttribute('href', '/forms/f1');
    const chevron = screen.getByRole('button', { name: 'Gece Kodu ayrıntıları' });
    await user.click(chevron);
    expect(chevron).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Gece Kodu paneli')).toBeInTheDocument();
    expect(await axeViolations()).toEqual([]);
  });
});
