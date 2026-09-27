'use client';

import {
  Avatar,
  Badge,
  Button,
  DescriptionList,
  StatusDot,
  useToast,
} from '@skylab-kulubu/skylcn-ui';
import { DataTable, type DataTableColumn } from '@skylab-kulubu/skylcn-ui/data-table';
import { Mail, UserPlus } from 'lucide-react';
import { MEMBERS, ROLE_LABEL, STATUS_LABEL, type Member } from './members';

const DOT = { active: 'success', inactive: 'neutral', alumni: 'info' } as const;
const date = (iso: string) =>
  new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });

const COLUMNS: DataTableColumn<Member>[] = [
  {
    id: 'name',
    header: 'Üye',
    value: (m) => m.name,
    sortable: true,
    hideable: false,
    cell: (m) => (
      <span className="flex items-center gap-2.5">
        <Avatar name={m.name} size="sm" />
        <span className="min-w-0">
          <span className="block truncate text-foreground">{m.name}</span>
          <span className="block truncate text-2xs text-subtle-foreground">{m.email}</span>
        </span>
      </span>
    ),
  },
  {
    id: 'status',
    header: 'Durum',
    value: (m) => m.status,
    sortable: true,
    from: 'sm',
    cell: (m) => (
      <span className="flex items-center gap-2 text-xs">
        <StatusDot tone={DOT[m.status]} /> {STATUS_LABEL[m.status]}
      </span>
    ),
  },
  {
    id: 'team',
    header: 'Ekip',
    value: (m) => m.team,
    sortable: true,
    from: 'md',
    cell: (m) => <Badge>{m.team}</Badge>,
  },
  { id: 'role', header: 'Rol', value: (m) => ROLE_LABEL[m.role], sortable: true, from: 'lg' },
  {
    id: 'joined',
    header: 'Katıldı',
    value: (m) => m.joined,
    sortable: true,
    from: 'lg',
    cell: (m) => date(m.joined),
  },
  {
    id: 'events',
    header: 'Etkinlik',
    value: (m) => m.events,
    sortable: true,
    from: 'xl',
    align: 'end',
  },
];

/** The member list as an admin DataTable: facets, bulk actions and a detail panel. */
// 5,000 rows for the virtual example: the demo members repeated with new ids
const MANY: Member[] = Array.from({ length: 5000 }, (_, i) => ({
  ...MEMBERS[i % MEMBERS.length]!,
  id: `v${i}`,
}));

export function MemberTable({ urlKey, virtual = false }: { urlKey?: string; virtual?: boolean }) {
  const toast = useToast();
  return (
    <DataTable
      aria-label={virtual ? 'Üyeler (5.000)' : 'Üyeler'}
      urlKey={urlKey}
      data={virtual ? MANY : MEMBERS}
      virtualHeight={virtual ? 520 : undefined}
      columns={COLUMNS}
      getRowId={(m) => m.id}
      searchPlaceholder="İsim ya da e-posta ara"
      facets={[
        {
          column: 'status',
          label: 'Durum',
          format: (v) => STATUS_LABEL[v as Member['status']] ?? v,
        },
        { column: 'team', label: 'Ekip' },
        { column: 'role', label: 'Rol' },
      ]}
      bulkActions={(rows, clear) => (
        <>
          <Button
            size="sm"
            onClick={() => {
              toast.add({ title: `${rows.length} üyeye e-posta taslağı açıldı` });
              clear();
            }}
          >
            <Mail /> E-posta
          </Button>
          <Button
            size="sm"
            onClick={() => {
              toast.add({ title: `${rows.length} üye ekibe eklendi`, type: 'success' });
              clear();
            }}
          >
            <UserPlus /> Ekibe ekle
          </Button>
        </>
      )}
      detailTitle={(m) => m.name}
      renderDetail={(m) => (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Avatar name={m.name} size="lg" />
            <div>
              <p className="text-sm font-medium text-foreground">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.email}</p>
            </div>
          </div>
          <DescriptionList
            columns={2}
            items={[
              { label: 'Durum', value: STATUS_LABEL[m.status] },
              { label: 'Ekip', value: m.team },
              { label: 'Rol', value: ROLE_LABEL[m.role] },
              { label: 'Katıldı', value: date(m.joined) },
              { label: 'Etkinlik', value: m.events },
            ]}
          />
        </div>
      )}
    />
  );
}
