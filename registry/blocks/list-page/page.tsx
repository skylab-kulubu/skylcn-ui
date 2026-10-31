'use client';

import {
  Avatar,
  Badge,
  Button,
  DataList,
  DataListTitle,
  PageHeader,
  Pagination,
  SearchInput,
  type DataListColumn,
} from '@skylab-kulubu/skylcn-ui';
import { UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';

type Member = { id: string; name: string; email: string; team: string; events: number };

// Made-up people; replace with the page's own data.
const MEMBERS: Member[] = [
  { id: '1', name: 'Ece Yıldırım', email: 'ece@example.com', team: 'WebLab', events: 12 },
  { id: '2', name: 'Mert Kaya', email: 'mert@example.com', team: 'GameLab', events: 7 },
  { id: '3', name: 'Zeynep Arslan', email: 'zeynep@example.com', team: 'AirLab', events: 15 },
  { id: '4', name: 'Can Öztürk', email: 'can@example.com', team: 'WebLab', events: 3 },
  { id: '5', name: 'Selin Bulut', email: 'selin@example.com', team: 'SkySec', events: 9 },
];

const PAGE_SIZE = 10;

const COLUMNS: DataListColumn<Member>[] = [
  {
    id: 'name',
    width: 'minmax(0,2fr)',
    header: 'Üye',
    sortValue: (member) => member.name,
    cell: (member) => (
      <DataListTitle
        leading={<Avatar name={member.name} size="sm" />}
        title={member.name}
        subtitle={member.email}
      />
    ),
  },
  {
    id: 'team',
    width: 'minmax(0,1fr)',
    from: 'sm',
    header: 'Ekip',
    sortValue: (member) => member.team,
    cell: (member) => <Badge>{member.team}</Badge>,
  },
  {
    id: 'events',
    width: '5rem',
    from: 'md',
    align: 'end',
    header: 'Etkinlik',
    sortValue: (member) => member.events,
    className: 'tabular-nums text-muted-foreground',
    cell: (member) => member.events,
  },
];

/** A list page: title and main action, a search, a sortable list and paging. */
export default function MembersPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const found = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    return q
      ? MEMBERS.filter((m) =>
          `${m.name} ${m.email} ${m.team}`.toLocaleLowerCase('tr-TR').includes(q),
        )
      : MEMBERS;
  }, [query]);
  const rows = found.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Üyeler"
        description="Kulübe kayıtlı herkes."
        actions={
          <Button variant="primary">
            <UserPlus aria-hidden />
            Üye ekle
          </Button>
        }
      >
        <SearchInput
          value={query}
          onValueChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Ad, e-posta ya da ekip"
          aria-label="Üye ara"
        />
      </PageHeader>
      <DataList
        aria-label="Üyeler"
        rows={rows}
        columns={COLUMNS}
        getRowId={(member) => member.id}
        rowLabel={(member) => member.name}
        rowHref={(member) => `/uyeler/${member.id}`}
        empty={{ title: 'Aramaya uyan üye yok.' }}
      />
      <Pagination
        current={page}
        totalPages={Math.ceil(found.length / PAGE_SIZE)}
        onPageChange={setPage}
        aria-label="Üye listesi sayfaları"
      />
    </div>
  );
}
