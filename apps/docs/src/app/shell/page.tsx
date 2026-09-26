'use client';

import {
  AppShell,
  AppShellActions,
  Avatar,
  Badge,
  Breadcrumbs,
  ClubSwitcher,
  DataList,
  DataListBody,
  DataListCell,
  DataListColumnHeader,
  DataListEmpty,
  DataListHeader,
  DataListRow,
  DataListSkeleton,
  FilterPills,
  IconButton,
  PageHeader,
  Pagination,
  SearchInput,
  SidebarBrand,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
  SidebarSection,
  SidebarUser,
  Stat,
  StatusDot,
  type DataListColumn,
  type DataListSort,
} from '@skylab-kulubu/skylcn-ui';
import {
  BookOpen,
  Database,
  FilePlus,
  FileText,
  FileSearch,
  LayoutDashboard,
  LayoutTemplate,
  List,
  LogOut,
  Moon,
  Plus,
  RefreshCw,
  Sun,
  Workflow,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type Row = {
  id: string;
  name: string;
  open: boolean;
  workflow: string | null;
  updatedAt: string;
  responses: number;
  role: 'owner' | 'editor' | 'viewer';
};

const ROWS: Row[] = [
  {
    id: '1',
    name: 'Gece Kodu 2026 başvuru',
    open: true,
    workflow: 'Gece Kodu akışı',
    updatedAt: '2026-09-24',
    responses: 412,
    role: 'owner',
  },
  {
    id: '2',
    name: 'ARTLAB konuşmacı çağrısı',
    open: true,
    workflow: null,
    updatedAt: '2026-09-22',
    responses: 38,
    role: 'editor',
  },
  {
    id: '3',
    name: 'YıldızJam takım kaydı',
    open: false,
    workflow: 'Jam akışı',
    updatedAt: '2026-05-08',
    responses: 126,
    role: 'owner',
  },
  {
    id: '4',
    name: 'SKYDAYS gönüllü formu',
    open: false,
    workflow: null,
    updatedAt: '2026-03-12',
    responses: 57,
    role: 'viewer',
  },
  {
    id: '5',
    name: 'Kulüp üyelik anketi',
    open: true,
    workflow: null,
    updatedAt: '2026-09-01',
    responses: 903,
    role: 'editor',
  },
  {
    id: '6',
    name: 'Stant haftası geri bildirim',
    open: false,
    workflow: null,
    updatedAt: '2025-10-02',
    responses: 211,
    role: 'owner',
  },
];

const ROLE_BADGE = {
  owner: (
    <Badge tone="brand" size="xs">
      Sahip
    </Badge>
  ),
  editor: (
    <Badge tone="strong" size="xs">
      Editör
    </Badge>
  ),
  viewer: <Badge size="xs">Görüntüleyici</Badge>,
};

const COLUMNS: DataListColumn[] = [
  { id: 'status', width: '1.5rem', align: 'center' },
  { id: 'name', width: 'minmax(0,1.5fr)' },
  { id: 'workflow', width: 'minmax(0,1fr)', from: 'md' },
  { id: 'updatedAt', width: '7rem', from: 'sm', align: 'center' },
  { id: 'responses', width: '4rem', from: 'lg', align: 'center' },
  { id: 'role', width: '6.5rem', from: 'lg', align: 'center' },
];

function Sidebar() {
  return (
    <>
      <SidebarBrand name="SKY LAB Forms" subtitle="Yönetim" href="/shell" />
      <SidebarContent>
        <SidebarSection>
          <SidebarItem href="/shell" label="Dashboard" icon={LayoutDashboard} />
        </SidebarSection>
        <SidebarSection label="Platform">
          <SidebarGroup label="Formlar" icon={FileText} active>
            <SidebarItem href="/shell?new" label="Yeni form" icon={FilePlus} />
            <SidebarItem href="/shell" label="Formları görüntüle" icon={List} active />
            <SidebarItem href="/shell?db" label="Veritabanı" icon={Database} />
          </SidebarGroup>
          <SidebarGroup label="Akışlar" icon={Workflow}>
            <SidebarItem href="/shell?wf" label="Yeni akış" icon={Plus} />
            <SidebarItem href="/shell?wfs" label="Akışları görüntüle" icon={List} />
          </SidebarGroup>
          <SidebarItem href="/shell?tpl" label="Şablonlar" icon={LayoutTemplate} />
          <SidebarItem href="/shell?review" label="Onay bekleyenler" icon={FileSearch} badge={7} />
        </SidebarSection>
      </SidebarContent>
      <SidebarFooter>
        <SidebarItem href="/shell?help" label="Nasıl kullanılır" icon={BookOpen} />
        <ClubSwitcher
          consoles={[
            { id: 'admin', label: 'Yönetim', href: '#admin' },
            { id: 'mail', label: 'Mail', href: '#mail' },
          ]}
        />
        <SidebarUser
          name="Kaan Necip Kalp"
          email="kaan@example.com"
          subtitle="WebLab"
          action={<IconButton icon={LogOut} label="Çıkış yap" variant="ghost" size="icon-sm" />}
        />
      </SidebarFooter>
    </>
  );
}

export default function ShellDemo() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<'all' | 'open' | 'closed'>('all');
  const [sort, setSort] = useState<DataListSort>({ field: 'updatedAt', direction: 'desc' });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [light, setLight] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    const filtered = ROWS.filter(
      (r) =>
        (state === 'all' || (state === 'open') === r.open) &&
        (!q || r.name.toLocaleLowerCase('tr-TR').includes(q)),
    );
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const key = sort.field as keyof Row;
      const av = a[key] ?? '';
      const bv = b[key] ?? '';
      return (av > bv ? 1 : av < bv ? -1 : 0) * dir;
    });
  }, [query, state, sort]);

  const refresh = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1400);
  };

  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Breadcrumbs
          items={[
            { href: '/shell', label: 'Dashboard' },
            { href: '/shell', label: 'Formlar' },
          ]}
        />
      }
    >
      <AppShellActions>
        <IconButton
          icon={light ? Moon : Sun}
          label={light ? 'Koyu tema' : 'Açık tema'}
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            const next = !light;
            setLight(next);
            document.documentElement.dataset.theme = next ? 'light' : 'dark';
          }}
        />
      </AppShellActions>

      <div className="space-y-4">
        <PageHeader
          title="Formlar"
          description="Sahibi olduğun ya da paylaşılan formlar."
          actions={
            <div className="flex items-center gap-4">
              <Stat label="Açık" value={ROWS.filter((r) => r.open).length} />
              <Stat
                label="Yanıt"
                value={ROWS.reduce((n, r) => n + r.responses, 0).toLocaleString('tr-TR')}
              />
            </div>
          }
        >
          <SearchInput value={query} onValueChange={setQuery} placeholder="Form ara" />
          <FilterPills
            aria-label="Duruma göre"
            value={state}
            onValueChange={setState}
            options={[
              { value: 'all', label: 'Tümü', count: ROWS.length },
              { value: 'open', label: 'Açık', count: ROWS.filter((r) => r.open).length },
              { value: 'closed', label: 'Kapalı', count: ROWS.filter((r) => !r.open).length },
            ]}
          />
          <div className="ml-auto flex items-center gap-1.5">
            <IconButton icon={RefreshCw} label="Yenile" onClick={refresh} pending={loading} />
            <IconButton icon={Plus} label="Yeni form" variant="primary" />
          </div>
        </PageHeader>

        <DataList
          aria-label="Formlar"
          columns={COLUMNS}
          sort={sort}
          onSortChange={(field) =>
            setSort((prev) =>
              prev.field === field
                ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
                : { field, direction: 'desc' },
            )
          }
        >
          <DataListHeader>
            <DataListColumnHeader column="status" sortable />
            <DataListColumnHeader column="name">Form adı</DataListColumnHeader>
            <DataListColumnHeader column="workflow" sortable>
              Akış
            </DataListColumnHeader>
            <DataListColumnHeader column="updatedAt" sortable>
              Güncellendi
            </DataListColumnHeader>
            <DataListColumnHeader column="responses" sortable>
              Yanıt
            </DataListColumnHeader>
            <DataListColumnHeader column="role">Yetki</DataListColumnHeader>
          </DataListHeader>
          {loading ? (
            <DataListSkeleton rows={5} />
          ) : rows.length === 0 ? (
            <DataListEmpty
              icon={FileSearch}
              title="Eşleşen form yok"
              description="Aramayı ya da filtreyi değiştir."
            />
          ) : (
            <DataListBody key={`${query}-${state}-${sort.field}-${sort.direction}`}>
              {rows.map((row, index) => (
                <DataListRow
                  key={row.id}
                  href={`/shell?form=${row.id}`}
                  label={row.name}
                  index={index}
                >
                  <DataListCell column="status">
                    <StatusDot
                      tone={row.open ? 'success' : 'danger'}
                      title={row.open ? 'Açık' : 'Kapalı'}
                    />
                  </DataListCell>
                  <DataListCell column="name" className="gap-3">
                    <Avatar name={row.name} size="md" shape="square" />
                    <span className="truncate text-sm font-medium text-secondary-foreground group-hover/row:text-foreground-strong">
                      {row.name}
                    </span>
                  </DataListCell>
                  <DataListCell column="workflow" interactive>
                    {row.workflow ? (
                      <a
                        href="#workflow"
                        className="flex max-w-60 min-w-0 items-center gap-2 rounded-md border border-border bg-card px-2 py-1 transition-colors hover:border-border-strong hover:bg-muted"
                      >
                        <Workflow className="size-3 shrink-0 text-subtle-foreground" />
                        <span className="truncate text-2xs font-medium text-secondary-foreground">
                          {row.workflow}
                        </span>
                      </a>
                    ) : (
                      <span className="text-2xs text-faint-foreground">—</span>
                    )}
                  </DataListCell>
                  <DataListCell
                    column="updatedAt"
                    className="text-2xs text-muted-foreground tabular-nums"
                  >
                    {new Date(row.updatedAt).toLocaleDateString('tr-TR')}
                  </DataListCell>
                  <DataListCell
                    column="responses"
                    className="text-sm text-secondary-foreground tabular-nums"
                  >
                    {row.responses}
                  </DataListCell>
                  <DataListCell column="role">{ROLE_BADGE[row.role]}</DataListCell>
                </DataListRow>
              ))}
            </DataListBody>
          )}
        </DataList>

        <Pagination current={page} totalPages={3} onPageChange={setPage} />
      </div>
    </AppShell>
  );
}
