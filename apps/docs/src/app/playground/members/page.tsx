'use client';

import {
  Avatar,
  Badge,
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  DataList,
  DataListBody,
  DataListCell,
  DataListColumnHeader,
  DataListEmpty,
  DataListHeader,
  DataListRow,
  DataListSkeleton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  FilterPills,
  IconButton,
  MenuItem,
  MenuSeparator,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Stat,
  StatusDot,
  type DataListColumn,
  type DataListSort,
} from '@skylab-kulubu/skylcn-ui';
import {
  Mail,
  MoreHorizontal,
  PencilLine,
  RefreshCw,
  SearchX,
  UserMinus,
  UserPlus,
  UserRound,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  MEMBERS,
  ROLE_LABEL,
  STATUS_LABEL,
  TEAMS,
  type Member,
  type MemberStatus,
} from '../../../demo/members';

const PAGE_SIZE = 10;
const DOT = { active: 'success', inactive: 'neutral', alumni: 'info' } as const;

const COLUMNS: DataListColumn[] = [
  { id: 'status', width: '1.5rem', align: 'center' },
  { id: 'name', width: 'minmax(0,2fr)' },
  { id: 'team', width: 'minmax(0,1fr)', from: 'sm' },
  { id: 'role', width: '7rem', from: 'md' },
  { id: 'joined', width: '6.5rem', from: 'lg', align: 'center' },
  { id: 'events', width: '5rem', from: 'xl', align: 'center' },
  { id: 'actions', width: '2rem', align: 'end' },
];

function MemberActions({ member }: { member: Member }) {
  return (
    <>
      <MenuItem icon={UserRound}>Profili aç</MenuItem>
      <MenuItem icon={PencilLine} shortcut="E">
        Düzenle
      </MenuItem>
      <MenuItem icon={Mail}>E-posta gönder</MenuItem>
      <MenuSeparator />
      <MenuItem icon={UserMinus} destructive disabled={member.role === 'board'}>
        Kulüpten çıkar
      </MenuItem>
    </>
  );
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Members() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | MemberStatus>('all');
  const [team, setTeam] = useState<string>('all');
  const [sort, setSort] = useState<DataListSort>({ field: 'joined', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const counts = useMemo(() => {
    const byStatus = { all: MEMBERS.length, active: 0, inactive: 0, alumni: 0 };
    for (const member of MEMBERS) byStatus[member.status] += 1;
    return byStatus;
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    const filtered = MEMBERS.filter(
      (member) =>
        (status === 'all' || member.status === status) &&
        (team === 'all' || member.team === team) &&
        (!q || member.name.toLocaleLowerCase('tr-TR').includes(q) || member.email.includes(q)),
    );
    const direction = sort.direction === 'asc' ? 1 : -1;
    const key = sort.field as keyof Member;
    return filtered.sort(
      (a, b) => String(a[key]).localeCompare(String(b[key]), 'tr', { numeric: true }) * direction,
    );
  }, [query, status, team, sort]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const filtered = query !== '' || status !== 'all' || team !== 'all';

  const toggleSort = (field: string) =>
    setSort((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'asc' },
    );
  const reset = () => {
    setQuery('');
    setStatus('all');
    setTeam('all');
    setPage(1);
  };
  const refresh = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Üyeler"
        description="Kulübe kayıtlı herkes; ekip, rol ve durumlarıyla."
        actions={
          <div className="flex items-center gap-4">
            <Stat label="Aktif" value={counts.active} />
            <Stat label="Ekip" value={TEAMS.length} />
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={query}
            onValueChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="İsim ya da e-posta ara"
            className="w-full sm:w-64"
          />
          <FilterPills
            aria-label="Durum"
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={[
              { value: 'all', label: 'Tümü', count: counts.all },
              { value: 'active', label: 'Aktif', count: counts.active },
              { value: 'inactive', label: 'Pasif', count: counts.inactive },
              { value: 'alumni', label: 'Mezun', count: counts.alumni },
            ]}
          />
          <div className="w-40">
            <Select
              aria-label="Ekip"
              size="sm"
              value={team}
              onValueChange={(value) => {
                setTeam(value);
                setPage(1);
              }}
              options={[{ value: 'all', label: 'Tüm ekipler' }, ...TEAMS]}
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <IconButton icon={RefreshCw} label="Yenile" variant="ghost" onClick={refresh} />
            <Button variant="primary">
              <UserPlus /> Üye ekle
            </Button>
          </div>
        </div>
      </PageHeader>

      <DataList columns={COLUMNS} sort={sort} onSortChange={toggleSort}>
        <DataListHeader>
          <DataListColumnHeader column="status" sortable label="Durum" />
          <DataListColumnHeader column="name" sortable>
            Üye
          </DataListColumnHeader>
          <DataListColumnHeader column="team" sortable>
            Ekip
          </DataListColumnHeader>
          <DataListColumnHeader column="role">Rol</DataListColumnHeader>
          <DataListColumnHeader column="joined" sortable>
            Katıldı
          </DataListColumnHeader>
          <DataListColumnHeader column="events" sortable>
            Etkinlik
          </DataListColumnHeader>
          <DataListColumnHeader column="actions" label="İşlemler" />
        </DataListHeader>

        {loading ? (
          <DataListSkeleton rows={PAGE_SIZE} />
        ) : visible.length === 0 ? (
          <DataListEmpty
            icon={SearchX}
            title="Eşleşen üye yok"
            description="Aramayı ya da filtreleri değiştirip yeniden dene."
          >
            {filtered ? (
              <Button size="sm" onClick={reset}>
                Filtreleri temizle
              </Button>
            ) : null}
          </DataListEmpty>
        ) : (
          <DataListBody>
            {visible.map((member, index) => (
              <ContextMenu key={member.id}>
                <ContextMenuTrigger
                  render={
                    <DataListRow
                      href={`/playground/members?id=${member.id}`}
                      label={`${member.name} profilini aç`}
                      index={index}
                    />
                  }
                >
                  <DataListCell column="status">
                    <StatusDot tone={DOT[member.status]} label={STATUS_LABEL[member.status]} />
                  </DataListCell>
                  <DataListCell column="name" className="gap-3">
                    <Avatar name={member.name} size="md" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-secondary-foreground group-hover/row:text-foreground-strong">
                        {member.name}
                      </span>
                      <span className="block truncate text-2xs text-subtle-foreground">
                        {member.email}
                      </span>
                    </span>
                  </DataListCell>
                  <DataListCell column="team">
                    <Badge>{member.team}</Badge>
                  </DataListCell>
                  <DataListCell column="role" className="text-xs text-muted-foreground">
                    {member.role === 'member' ? (
                      ROLE_LABEL.member
                    ) : (
                      <Badge tone={member.role === 'board' ? 'brand' : 'strong'} size="xs">
                        {ROLE_LABEL[member.role]}
                      </Badge>
                    )}
                  </DataListCell>
                  <DataListCell
                    column="joined"
                    className="text-xs text-muted-foreground tabular-nums"
                  >
                    {formatDate(member.joined)}
                  </DataListCell>
                  <DataListCell
                    column="events"
                    className="text-xs text-muted-foreground tabular-nums"
                  >
                    {member.events}
                  </DataListCell>
                  <DataListCell column="actions" interactive>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <IconButton
                            icon={MoreHorizontal}
                            label="İşlemler"
                            variant="ghost"
                            size="icon-sm"
                          />
                        }
                      />
                      <DropdownMenuContent align="end">
                        <MemberActions member={member} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </DataListCell>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <MemberActions member={member} />
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </DataListBody>
        )}
      </DataList>

      <Pagination current={current} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
