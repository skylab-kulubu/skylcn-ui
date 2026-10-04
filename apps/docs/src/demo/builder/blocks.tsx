'use client';

import {
  AvatarGroup,
  BarList,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DescriptionList,
  Field,
  Input,
  ListItem,
  ListPanel,
  Meter,
  Notice,
  PageHeader,
  Progress,
  SearchInput,
  SegmentedControl,
  Select,
  StatCard,
  StateCard,
  Textarea,
  Timeline,
  ToggleRow,
  Tab,
  Tabs,
  TabsList,
  TabsPanel,
  Badge,
  type TimelineItem,
} from '@skylab-kulubu/skylcn-ui';
import { AreaChart, BarChart, DonutChart } from '@skylab-kulubu/skylcn-ui/charts';
import {
  AlignLeft,
  AreaChart as AreaIcon,
  BarChart3,
  CalendarDays,
  CircleDashed,
  FileText,
  Gauge,
  Heading,
  Info,
  LayoutList,
  List,
  ListChecks,
  MousePointerClick,
  PieChart,
  Search,
  SlidersHorizontal,
  SquareStack,
  TextCursorInput,
  Ticket,
  ToggleLeft,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { MEMBERS, ROLE_LABEL } from '../members';
import { monthly } from '../metrics';
import type { BlockProps } from './model';

export type Category = 'page' | 'data' | 'charts' | 'forms' | 'actions' | 'states';

export const CATEGORY_LABEL: Record<Category, string> = {
  page: 'Sayfa',
  data: 'Veri',
  charts: 'Grafikler',
  forms: 'Form',
  actions: 'Eylemler',
  states: 'Durumlar',
};

export const CATEGORY_ORDER: Category[] = ['page', 'data', 'charts', 'forms', 'actions', 'states'];

export type FieldDef =
  | { key: string; label: string; kind: 'text' | 'textarea' }
  | { key: string; label: string; kind: 'number'; min?: number; max?: number }
  | { key: string; label: string; kind: 'boolean' }
  | { key: string; label: string; kind: 'select'; options: { value: string; label: string }[] };

/** What a block adds to the exported file. */
export type CodeOut = {
  jsx: string;
  /** Names from @skylab-kulubu/skylcn-ui. */
  imports?: string[];
  /** Names from @skylab-kulubu/skylcn-ui/charts. */
  charts?: string[];
  /** Names from lucide-react. */
  icons?: string[];
  /** Module-level constants by name, such as sample data. */
  constants?: Record<string, string>;
  /** Hooks the page component needs, by the line that declares them. */
  hooks?: string[];
};

export type BlockDef = {
  type: string;
  label: string;
  category: Category;
  icon: LucideIcon;
  description: string;
  defaults: BlockProps;
  fields: FieldDef[];
  Render: (props: { props: BlockProps }) => ReactNode;
  code: (props: BlockProps, id: string) => CodeOut;
};

/* Code helpers */

const quote = (value: unknown) => JSON.stringify(String(value ?? ''));
/** `name="value"`, or `name={"value"}` when the text needs escaping. */
export function attr(name: string, value: unknown): string {
  const text = String(value ?? '');
  return /^[^"{}<>\\\n]*$/.test(text) ? `${name}="${text}"` : `${name}={${quote(text)}}`;
}
const text = (value: unknown) => {
  const s = String(value ?? '');
  return /[{}<>]/.test(s) ? `{${quote(s)}}` : s;
};
/** An array of flat objects as readable source, one object per line. */
export function literal(rows: Record<string, unknown>[]): string {
  const value = (v: unknown) =>
    typeof v === 'string' ? `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'` : String(v);
  const line = (row: Record<string, unknown>) =>
    `  { ${Object.entries(row)
      .map(([k, v]) => `${k}: ${value(v)}`)
      .join(', ')} },`;
  return `[\n${rows.map(line).join('\n')}\n]`;
}
const str = (p: BlockProps, key: string) => String(p[key] ?? '');
const num = (p: BlockProps, key: string) => Number(p[key] ?? 0);
const bool = (p: BlockProps, key: string) => Boolean(p[key]);

const MONTHLY = monthly('6m');
const MONTHLY_CODE = literal(
  MONTHLY.map(({ month, attendance, workshops, talks }) => ({
    month,
    attendance,
    workshops,
    talks,
  })),
);

const ICONS: Record<string, LucideIcon> = { Users, CalendarDays, FileText, Ticket, Gauge };
const ICON_OPTIONS = Object.keys(ICONS).map((value) => ({ value, label: value }));

const TONES = [
  { value: 'info', label: 'Bilgi' },
  { value: 'success', label: 'Başarılı' },
  { value: 'warning', label: 'Uyarı' },
  { value: 'danger', label: 'Hata' },
];

const TIMELINE: TimelineItem[] = [
  { id: '1', title: 'Başvuru açıldı', time: '2 gün önce', tone: 'brand' },
  { id: '2', title: 'Kontenjanın yarısı doldu', time: 'dün', tone: 'success' },
  { id: '3', title: 'Salon onaylandı', time: '3 saat önce' },
  { id: '4', title: 'Afiş yayımlandı', time: '1 saat önce' },
  { id: '5', title: 'Jüri belirlendi', time: 'az önce' },
  { id: '6', title: 'Program yayımlandı', time: 'şimdi' },
];

const TEAM_SHARE = [
  { key: 'web', label: 'WebLab', value: 42 },
  { key: 'sec', label: 'SkySec', value: 31 },
  { key: 'game', label: 'Oyun', value: 24 },
  { key: 'ai', label: 'Yapay zekâ', value: 18 },
];
const TEAM_SHARE_CODE = literal(TEAM_SHARE);

/* Small stateful pieces, so form blocks respond in the preview */

function ToggleBlock({ props }: { props: BlockProps }) {
  const [on, setOn] = useState(bool(props, 'checked'));
  return (
    <ToggleRow
      title={str(props, 'title')}
      description={str(props, 'description') || undefined}
      checked={on}
      onCheckedChange={setOn}
    />
  );
}

function SelectBlock({ props }: { props: BlockProps }) {
  const options = str(props, 'options')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const [value, setValue] = useState<string | null>(null);
  return (
    <Field label={str(props, 'label')}>
      <Select value={value} onValueChange={setValue} options={options} placeholder="Seç" />
    </Field>
  );
}

function SegmentedBlock({ props }: { props: BlockProps }) {
  const options = str(props, 'options')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
    .map((o) => ({ value: o, label: o }));
  const [value, setValue] = useState(options[0]?.value ?? '');
  return (
    <SegmentedControl
      aria-label={str(props, 'label')}
      options={options}
      value={value}
      onValueChange={setValue}
    />
  );
}

function SearchBlock({ props }: { props: BlockProps }) {
  const [value, setValue] = useState('');
  return (
    <SearchInput value={value} onValueChange={setValue} placeholder={str(props, 'placeholder')} />
  );
}

/* The blocks */

export const BLOCKS: BlockDef[] = [
  {
    type: 'page-header',
    label: 'Sayfa başlığı',
    category: 'page',
    icon: Heading,
    description: 'Başlık, açıklama ve ana eylem.',
    defaults: {
      title: 'Etkinlikler',
      description: 'Dönemin etkinlikleri ve başvuruları.',
      action: 'Etkinlik oluştur',
    },
    fields: [
      { key: 'title', label: 'Başlık', kind: 'text' },
      { key: 'description', label: 'Açıklama', kind: 'textarea' },
      { key: 'action', label: 'Düğme (boşsa yok)', kind: 'text' },
    ],
    Render: ({ props }) => (
      <PageHeader
        title={str(props, 'title')}
        description={str(props, 'description') || undefined}
        actions={
          str(props, 'action') ? (
            <Button variant="primary">{str(props, 'action')}</Button>
          ) : undefined
        }
      />
    ),
    code: (p) => ({
      imports: ['PageHeader', ...(str(p, 'action') ? ['Button'] : [])],
      jsx: `<PageHeader
  ${attr('title', p.title)}${str(p, 'description') ? `\n  ${attr('description', p.description)}` : ''}${
    str(p, 'action') ? `\n  actions={<Button variant="primary">${text(p.action)}</Button>}` : ''
  }
/>`,
    }),
  },
  {
    type: 'notice',
    label: 'Bilgi notu',
    category: 'page',
    icon: Info,
    description: 'Sayfa içi bilgi, uyarı ya da hata.',
    defaults: {
      tone: 'info',
      title: 'Başvurular 20 Ekim’de kapanıyor',
      body: 'Kapanıştan sonra gelenler bekleme listesine düşer.',
    },
    fields: [
      { key: 'tone', label: 'Ton', kind: 'select', options: TONES },
      { key: 'title', label: 'Başlık', kind: 'text' },
      { key: 'body', label: 'Metin', kind: 'textarea' },
    ],
    Render: ({ props }) => (
      <Notice tone={str(props, 'tone') as 'info'} title={str(props, 'title') || undefined}>
        {str(props, 'body')}
      </Notice>
    ),
    code: (p) => ({
      imports: ['Notice'],
      jsx: `<Notice ${attr('tone', p.tone)} ${attr('title', p.title)}>\n  ${text(p.body)}\n</Notice>`,
    }),
  },
  {
    type: 'text-card',
    label: 'Metin kartı',
    category: 'page',
    icon: AlignLeft,
    description: 'Başlıklı, açıklamalı bir kart.',
    defaults: {
      title: 'Gece Kodu 2026',
      description: '24 saatlik kodlama gecesi',
      body: 'Takımlar cuma akşamı başlar, cumartesi öğlen jüriye sunar.',
    },
    fields: [
      { key: 'title', label: 'Başlık', kind: 'text' },
      { key: 'description', label: 'Alt başlık', kind: 'text' },
      { key: 'body', label: 'Metin', kind: 'textarea' },
    ],
    Render: ({ props }) => (
      <Card>
        <CardHeader>
          <CardTitle>{str(props, 'title')}</CardTitle>
          {str(props, 'description') ? (
            <CardDescription>{str(props, 'description')}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{str(props, 'body')}</p>
        </CardContent>
      </Card>
    ),
    code: (p) => ({
      imports: [
        'Card',
        'CardHeader',
        'CardTitle',
        'CardContent',
        ...(str(p, 'description') ? ['CardDescription'] : []),
      ],
      jsx: `<Card>
  <CardHeader>
    <CardTitle>${text(p.title)}</CardTitle>${str(p, 'description') ? `\n    <CardDescription>${text(p.description)}</CardDescription>` : ''}
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">${text(p.body)}</p>
  </CardContent>
</Card>`,
    }),
  },
  {
    type: 'tabs',
    label: 'Sekmeler',
    category: 'page',
    icon: SquareStack,
    description: 'İçeriği sekmelere böler.',
    defaults: { tabs: 'Genel, Başvurular, Ayarlar' },
    fields: [{ key: 'tabs', label: 'Sekmeler (virgülle)', kind: 'text' }],
    Render: ({ props }) => {
      const tabs = str(props, 'tabs')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      return (
        <Tabs defaultValue={tabs[0] ?? ''}>
          <TabsList>
            {tabs.map((t) => (
              <Tab key={t} value={t}>
                {t}
              </Tab>
            ))}
          </TabsList>
          {tabs.map((t) => (
            <TabsPanel key={t} value={t}>
              <p className="text-sm text-muted-foreground">{t} sekmesinin içeriği.</p>
            </TabsPanel>
          ))}
        </Tabs>
      );
    },
    code: (p) => {
      const tabs = str(p, 'tabs')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      return {
        imports: ['Tabs', 'TabsList', 'Tab', 'TabsPanel'],
        jsx: `<Tabs ${attr('defaultValue', tabs[0] ?? '')}>
  <TabsList>
${tabs.map((t) => `    <Tab ${attr('value', t)}>${text(t)}</Tab>`).join('\n')}
  </TabsList>
${tabs.map((t) => `  <TabsPanel ${attr('value', t)}>{/* ${t} */}</TabsPanel>`).join('\n')}
</Tabs>`,
      };
    },
  },
  {
    type: 'stat',
    label: 'Sayı kartı',
    category: 'data',
    icon: Gauge,
    description: 'Tek bir sayı, değişimi ve eğilimi.',
    defaults: {
      label: 'Aktif üye',
      value: 342,
      icon: 'Users',
      delta: '+18',
      tone: 'positive',
      hint: 'Geçen döneme göre',
      trend: true,
    },
    fields: [
      { key: 'label', label: 'Etiket', kind: 'text' },
      { key: 'value', label: 'Değer', kind: 'number' },
      { key: 'icon', label: 'İkon', kind: 'select', options: ICON_OPTIONS },
      { key: 'delta', label: 'Değişim', kind: 'text' },
      {
        key: 'tone',
        label: 'Değişimin anlamı',
        kind: 'select',
        options: [
          { value: 'positive', label: 'İyi' },
          { value: 'negative', label: 'Kötü' },
          { value: 'neutral', label: 'Nötr' },
        ],
      },
      { key: 'hint', label: 'Alt satır', kind: 'text' },
      { key: 'trend', label: 'Eğilim çizgisi', kind: 'boolean' },
    ],
    Render: ({ props }) => (
      <StatCard
        label={str(props, 'label')}
        value={num(props, 'value')}
        icon={ICONS[str(props, 'icon')]}
        delta={str(props, 'delta') || undefined}
        deltaTone={str(props, 'tone') as 'positive'}
        hint={str(props, 'hint') || undefined}
        trend={bool(props, 'trend') ? MONTHLY.map((r) => r.attendance) : undefined}
      />
    ),
    code: (p) => ({
      imports: ['StatCard'],
      icons: ICONS[str(p, 'icon')] ? [str(p, 'icon')] : [],
      constants: bool(p, 'trend') ? { MONTHLY: MONTHLY_CODE } : undefined,
      jsx: `<StatCard
  ${attr('label', p.label)}
  value={${num(p, 'value')}}${ICONS[str(p, 'icon')] ? `\n  icon={${str(p, 'icon')}}` : ''}${
    str(p, 'delta') ? `\n  ${attr('delta', p.delta)}\n  ${attr('deltaTone', p.tone)}` : ''
  }${str(p, 'hint') ? `\n  ${attr('hint', p.hint)}` : ''}${
    bool(p, 'trend') ? `\n  trend={MONTHLY.map((row) => row.attendance)}` : ''
  }
/>`,
    }),
  },
  {
    type: 'member-list',
    label: 'Kişi listesi',
    category: 'data',
    icon: List,
    description: 'Satırları tıklanan liste; yükleniyor ve boş halleriyle.',
    defaults: { count: 4, state: 'ready', empty: 'Henüz üye yok' },
    fields: [
      { key: 'count', label: 'Satır sayısı', kind: 'number', min: 1, max: 12 },
      {
        key: 'state',
        label: 'Durum',
        kind: 'select',
        options: [
          { value: 'ready', label: 'Dolu' },
          { value: 'loading', label: 'Yükleniyor' },
          { value: 'empty', label: 'Boş' },
        ],
      },
      { key: 'empty', label: 'Boş metni', kind: 'text' },
    ],
    Render: ({ props }) => {
      const state = str(props, 'state');
      return (
        <ListPanel
          status={
            state === 'loading'
              ? { kind: 'loading' }
              : state === 'empty'
                ? { kind: 'empty', message: str(props, 'empty') }
                : { kind: 'ready' }
          }
        >
          {MEMBERS.slice(0, Math.max(1, num(props, 'count'))).map((m) => (
            <ListItem
              key={m.id}
              href="#"
              title={m.name}
              subtitle={`${m.team} · ${ROLE_LABEL[m.role]}`}
            />
          ))}
        </ListPanel>
      );
    },
    code: (p) => ({
      imports: ['ListPanel', 'ListItem'],
      jsx: `<ListPanel status={{ kind: 'ready' }}>
  {members.map((member) => (
    <ListItem key={member.id} href={\`/members/\${member.id}\`} title={member.name} subtitle={member.team} />
  ))}
</ListPanel>`,
      constants: {
        members: literal(
          MEMBERS.slice(0, Math.max(1, num(p, 'count'))).map(({ id, name, team }) => ({
            id,
            name,
            team,
          })),
        ),
      },
    }),
  },
  {
    type: 'description-list',
    label: 'Bilgi listesi',
    category: 'data',
    icon: LayoutList,
    description: 'Etiketli bilgiler: e-posta, ekip, katılım.',
    defaults: { columns: '2' },
    fields: [
      {
        key: 'columns',
        label: 'Sütun',
        kind: 'select',
        options: ['1', '2', '3'].map((v) => ({ value: v, label: v })),
      },
    ],
    Render: ({ props }) => (
      <DescriptionList
        columns={Number(str(props, 'columns')) as 2}
        items={[
          { label: 'E-posta', value: 'deniz@example.com' },
          { label: 'Ekip', value: 'WebLab' },
          { label: 'Katılım', value: 'Eylül 2025' },
          { label: 'Rol', value: 'Lider' },
        ]}
      />
    ),
    code: (p) => ({
      imports: ['DescriptionList'],
      constants: { person: "{ email: 'deniz@example.com', team: 'WebLab' }" },
      jsx: `<DescriptionList
  columns={${Number(str(p, 'columns'))}}
  items={[
    { label: 'E-posta', value: person.email },
    { label: 'Ekip', value: person.team },
  ]}
/>`,
    }),
  },
  {
    type: 'timeline',
    label: 'Zaman çizelgesi',
    category: 'data',
    icon: ListChecks,
    description: 'Olayların sıralı akışı.',
    defaults: { count: 3 },
    fields: [{ key: 'count', label: 'Olay sayısı', kind: 'number', min: 1, max: 6 }],
    Render: ({ props }) => <Timeline items={TIMELINE.slice(0, Math.max(1, num(props, 'count')))} />,
    code: (p) => ({
      imports: ['Timeline'],
      constants: {
        events: literal(
          TIMELINE.slice(0, Math.max(1, num(p, 'count'))).map(({ id, title, time }) => ({
            id,
            title,
            time,
          })),
        ),
      },
      jsx: `<Timeline items={events} />`,
    }),
  },
  {
    type: 'progress',
    label: 'İlerleme',
    category: 'data',
    icon: Gauge,
    description: 'Bir işin ilerlemesi ya da sınırlı bir düzey.',
    defaults: { kind: 'progress', label: 'Kontenjan', value: 72 },
    fields: [
      {
        key: 'kind',
        label: 'Tür',
        kind: 'select',
        options: [
          { value: 'progress', label: 'İlerleme' },
          { value: 'meter', label: 'Düzey (uyarı renkli)' },
        ],
      },
      { key: 'label', label: 'Etiket', kind: 'text' },
      { key: 'value', label: 'Değer (%)', kind: 'number', min: 0, max: 100 },
    ],
    Render: ({ props }) =>
      str(props, 'kind') === 'meter' ? (
        <Meter label={str(props, 'label')} value={num(props, 'value')} />
      ) : (
        <Progress label={str(props, 'label')} value={num(props, 'value')} />
      ),
    code: (p) => {
      const name = str(p, 'kind') === 'meter' ? 'Meter' : 'Progress';
      return {
        imports: [name],
        jsx: `<${name} ${attr('label', p.label)} value={${num(p, 'value')}} />`,
      };
    },
  },
  {
    type: 'avatars',
    label: 'Kişi grubu',
    category: 'data',
    icon: UsersRound,
    description: 'Üst üste binen avatarlar ve kalan sayısı.',
    defaults: { count: 6, max: 4 },
    fields: [
      { key: 'count', label: 'Kişi', kind: 'number', min: 1, max: 20 },
      { key: 'max', label: 'Gösterilen', kind: 'number', min: 1, max: 8 },
    ],
    Render: ({ props }) => (
      <AvatarGroup
        max={num(props, 'max')}
        people={MEMBERS.slice(0, Math.max(1, num(props, 'count'))).map((m) => ({ name: m.name }))}
      />
    ),
    code: (p) => ({
      imports: ['AvatarGroup'],
      constants: {
        people: literal(
          MEMBERS.slice(0, Math.max(1, num(p, 'count'))).map(({ name }) => ({ name })),
        ),
      },
      jsx: `<AvatarGroup max={${num(p, 'max')}} people={people} />`,
    }),
  },
  {
    type: 'area-chart',
    label: 'Alan grafiği',
    category: 'charts',
    icon: AreaIcon,
    description: 'Zamana yayılan bir ya da birkaç seri.',
    defaults: { title: 'Katılım', description: 'Son altı ay', series: 'attendance' },
    fields: [
      { key: 'title', label: 'Başlık', kind: 'text' },
      { key: 'description', label: 'Açıklama', kind: 'text' },
      {
        key: 'series',
        label: 'Seriler',
        kind: 'select',
        options: [
          { value: 'attendance', label: 'Katılım' },
          { value: 'kinds', label: 'Atölye ve konuşma' },
        ],
      },
    ],
    Render: ({ props }) => (
      <AreaChart
        title={str(props, 'title')}
        description={str(props, 'description') || undefined}
        data={MONTHLY}
        x="month"
        series={
          str(props, 'series') === 'kinds'
            ? { workshops: { label: 'Atölye' }, talks: { label: 'Konuşma' } }
            : { attendance: { label: 'Katılım' } }
        }
      />
    ),
    code: (p) => ({
      charts: ['AreaChart'],
      constants: { MONTHLY: MONTHLY_CODE },
      jsx: `<AreaChart
  ${attr('title', p.title)}${str(p, 'description') ? `\n  ${attr('description', p.description)}` : ''}
  data={MONTHLY}
  x="month"
  series={${
    str(p, 'series') === 'kinds'
      ? "{ workshops: { label: 'Atölye' }, talks: { label: 'Konuşma' } }"
      : "{ attendance: { label: 'Katılım' } }"
  }}
/>`,
    }),
  },
  {
    type: 'bar-chart',
    label: 'Çubuk grafiği',
    category: 'charts',
    icon: BarChart3,
    description: 'Ay ay karşılaştırma; istenirse yığılmış.',
    defaults: { title: 'Etkinlik türleri', stacked: true },
    fields: [
      { key: 'title', label: 'Başlık', kind: 'text' },
      { key: 'stacked', label: 'Yığılmış', kind: 'boolean' },
    ],
    Render: ({ props }) => (
      <BarChart
        title={str(props, 'title')}
        data={MONTHLY}
        x="month"
        stacked={bool(props, 'stacked')}
        series={{ workshops: { label: 'Atölye' }, talks: { label: 'Konuşma' } }}
      />
    ),
    code: (p) => ({
      charts: ['BarChart'],
      constants: { MONTHLY: MONTHLY_CODE },
      jsx: `<BarChart
  ${attr('title', p.title)}
  data={MONTHLY}
  x="month"${bool(p, 'stacked') ? '\n  stacked' : ''}
  series={{ workshops: { label: 'Atölye' }, talks: { label: 'Konuşma' } }}
/>`,
    }),
  },
  {
    type: 'donut-chart',
    label: 'Halka grafiği',
    category: 'charts',
    icon: PieChart,
    description: 'Bir bütünün altıya kadar parçası.',
    defaults: { title: 'Ekiplere göre üyeler' },
    fields: [{ key: 'title', label: 'Başlık', kind: 'text' }],
    Render: ({ props }) => <DonutChart title={str(props, 'title')} data={TEAM_SHARE} />,
    code: (p) => ({
      charts: ['DonutChart'],
      constants: { TEAM_SHARE: TEAM_SHARE_CODE },
      jsx: `<DonutChart ${attr('title', p.title)} data={TEAM_SHARE} />`,
    }),
  },
  {
    type: 'bar-list',
    label: 'Sıralı çubuklar',
    category: 'charts',
    icon: BarChart3,
    description: 'Payları sıralı satırlar halinde gösterir.',
    defaults: { title: 'En çok katılan ekipler', percent: true },
    fields: [
      { key: 'title', label: 'Başlık', kind: 'text' },
      { key: 'percent', label: 'Yüzde göster', kind: 'boolean' },
    ],
    Render: ({ props }) => (
      <Card>
        <CardHeader>
          <CardTitle>{str(props, 'title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <BarList items={TEAM_SHARE} showPercent={bool(props, 'percent')} />
        </CardContent>
      </Card>
    ),
    code: (p) => ({
      imports: ['Card', 'CardHeader', 'CardTitle', 'CardContent', 'BarList'],
      constants: { TEAM_SHARE: TEAM_SHARE_CODE },
      jsx: `<Card>
  <CardHeader>
    <CardTitle>${text(p.title)}</CardTitle>
  </CardHeader>
  <CardContent>
    <BarList items={TEAM_SHARE}${bool(p, 'percent') ? ' showPercent' : ''} />
  </CardContent>
</Card>`,
    }),
  },
  {
    type: 'text-field',
    label: 'Metin alanı',
    category: 'forms',
    icon: TextCursorInput,
    description: 'Etiketli giriş alanı; çok satırlı olabilir.',
    defaults: {
      label: 'Etkinlik adı',
      placeholder: 'Gece Kodu 2026',
      description: '',
      multiline: false,
    },
    fields: [
      { key: 'label', label: 'Etiket', kind: 'text' },
      { key: 'placeholder', label: 'Yer tutucu', kind: 'text' },
      { key: 'description', label: 'Açıklama', kind: 'text' },
      { key: 'multiline', label: 'Çok satırlı', kind: 'boolean' },
    ],
    Render: ({ props }) => (
      <Field label={str(props, 'label')} description={str(props, 'description') || undefined}>
        {bool(props, 'multiline') ? (
          <Textarea placeholder={str(props, 'placeholder')} />
        ) : (
          <Input placeholder={str(props, 'placeholder')} />
        )}
      </Field>
    ),
    code: (p) => {
      const control = bool(p, 'multiline') ? 'Textarea' : 'Input';
      return {
        imports: ['Field', control],
        jsx: `<Field ${attr('label', p.label)}${str(p, 'description') ? ` ${attr('description', p.description)}` : ''}>
  <${control} ${attr('placeholder', p.placeholder)} />
</Field>`,
      };
    },
  },
  {
    type: 'select-field',
    label: 'Seçim alanı',
    category: 'forms',
    icon: SlidersHorizontal,
    description: 'Listeden tek seçim.',
    defaults: { label: 'Ekip', options: 'WebLab, SkySec, Oyun, Yapay zekâ' },
    fields: [
      { key: 'label', label: 'Etiket', kind: 'text' },
      { key: 'options', label: 'Seçenekler (virgülle)', kind: 'text' },
    ],
    Render: ({ props }) => <SelectBlock props={props} />,
    code: (p, id) => {
      const name = `value${id.replace(/\W/g, '').slice(-4)}`;
      const options = str(p, 'options')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
      return {
        imports: ['Field', 'Select'],
        hooks: [
          `const [${name}, set${name[0]!.toUpperCase()}${name.slice(1)}] = useState<string | null>(null);`,
        ],
        jsx: `<Field ${attr('label', p.label)}>
  <Select
    value={${name}}
    onValueChange={set${name[0]!.toUpperCase()}${name.slice(1)}}
    options={${JSON.stringify(options)}}
    placeholder="Seç"
  />
</Field>`,
      };
    },
  },
  {
    type: 'toggle',
    label: 'Anahtar satırı',
    category: 'forms',
    icon: ToggleLeft,
    description: 'Açıklamalı aç/kapa ayarı.',
    defaults: {
      title: 'Başvuru e-postası gönder',
      description: 'Her yeni başvuruda ekibe haber verir.',
      checked: true,
    },
    fields: [
      { key: 'title', label: 'Başlık', kind: 'text' },
      { key: 'description', label: 'Açıklama', kind: 'text' },
      { key: 'checked', label: 'Açık başlasın', kind: 'boolean' },
    ],
    Render: ({ props }) => <ToggleBlock props={props} />,
    code: (p, id) => {
      const name = `on${id.replace(/\W/g, '').slice(-4)}`;
      return {
        imports: ['ToggleRow'],
        hooks: [
          `const [${name}, set${name[0]!.toUpperCase()}${name.slice(1)}] = useState(${bool(p, 'checked')});`,
        ],
        jsx: `<ToggleRow
  ${attr('title', p.title)}${str(p, 'description') ? `\n  ${attr('description', p.description)}` : ''}
  checked={${name}}
  onCheckedChange={set${name[0]!.toUpperCase()}${name.slice(1)}}
/>`,
      };
    },
  },
  {
    type: 'segmented',
    label: 'Bölmeli seçim',
    category: 'forms',
    icon: SlidersHorizontal,
    description: 'Birkaç seçenekten biri, yan yana.',
    defaults: { label: 'Dönem', options: 'Son 3 ay, Son 6 ay, Son 12 ay' },
    fields: [
      { key: 'label', label: 'Erişilebilir ad', kind: 'text' },
      { key: 'options', label: 'Seçenekler (virgülle)', kind: 'text' },
    ],
    Render: ({ props }) => <SegmentedBlock props={props} />,
    code: (p, id) => {
      const name = `range${id.replace(/\W/g, '').slice(-4)}`;
      const options = str(p, 'options')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
      return {
        imports: ['SegmentedControl'],
        hooks: [
          `const [${name}, set${name[0]!.toUpperCase()}${name.slice(1)}] = useState(${quote(options[0] ?? '')});`,
        ],
        jsx: `<SegmentedControl
  ${attr('aria-label', p.label)}
  value={${name}}
  onValueChange={set${name[0]!.toUpperCase()}${name.slice(1)}}
  options={${JSON.stringify(options.map((o) => ({ value: o, label: o })))}}
/>`,
      };
    },
  },
  {
    type: 'search',
    label: 'Arama kutusu',
    category: 'forms',
    icon: Search,
    description: 'Listeyi süzen arama alanı.',
    defaults: { placeholder: 'Ad, ekip ya da e-posta ara' },
    fields: [{ key: 'placeholder', label: 'Yer tutucu', kind: 'text' }],
    Render: ({ props }) => <SearchBlock props={props} />,
    code: (p, id) => {
      const name = `query${id.replace(/\W/g, '').slice(-4)}`;
      return {
        imports: ['SearchInput'],
        hooks: [`const [${name}, set${name[0]!.toUpperCase()}${name.slice(1)}] = useState('');`],
        jsx: `<SearchInput value={${name}} onValueChange={set${name[0]!.toUpperCase()}${name.slice(1)}} ${attr('placeholder', p.placeholder)} />`,
      };
    },
  },
  {
    type: 'buttons',
    label: 'Düğmeler',
    category: 'actions',
    icon: MousePointerClick,
    description: 'Ana ve ikincil eylem yan yana.',
    defaults: { primary: 'Kaydet', secondary: 'Vazgeç', align: 'end' },
    fields: [
      { key: 'primary', label: 'Ana düğme', kind: 'text' },
      { key: 'secondary', label: 'İkincil düğme (boşsa yok)', kind: 'text' },
      {
        key: 'align',
        label: 'Hizalama',
        kind: 'select',
        options: [
          { value: 'start', label: 'Sola' },
          { value: 'end', label: 'Sağa' },
        ],
      },
    ],
    Render: ({ props }) => (
      <div className={`flex flex-wrap gap-2 ${str(props, 'align') === 'end' ? 'justify-end' : ''}`}>
        {str(props, 'secondary') ? <Button>{str(props, 'secondary')}</Button> : null}
        <Button variant="primary">{str(props, 'primary')}</Button>
      </div>
    ),
    code: (p) => ({
      imports: ['Button'],
      jsx: `<div className="flex flex-wrap gap-2${str(p, 'align') === 'end' ? ' justify-end' : ''}">${
        str(p, 'secondary') ? `\n  <Button>${text(p.secondary)}</Button>` : ''
      }
  <Button variant="primary">${text(p.primary)}</Button>
</div>`,
    }),
  },
  {
    type: 'badges',
    label: 'Rozetler',
    category: 'actions',
    icon: Ticket,
    description: 'Durum ya da etiket rozetleri.',
    defaults: { items: 'Aktif, Taslak, Kapandı' },
    fields: [{ key: 'items', label: 'Rozetler (virgülle)', kind: 'text' }],
    Render: ({ props }) => {
      const tones = ['success', 'neutral', 'danger', 'brand', 'warning', 'info'] as const;
      return (
        <div className="flex flex-wrap gap-1.5">
          {str(props, 'items')
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
            .map((t, i) => (
              <Badge key={t} tone={tones[i % tones.length]}>
                {t}
              </Badge>
            ))}
        </div>
      );
    },
    code: (p) => {
      const tones = ['success', 'neutral', 'danger', 'brand', 'warning', 'info'];
      const items = str(p, 'items')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      return {
        imports: ['Badge'],
        jsx: `<div className="flex flex-wrap gap-1.5">
${items.map((t, i) => `  <Badge tone="${tones[i % tones.length]}">${text(t)}</Badge>`).join('\n')}
</div>`,
      };
    },
  },
  {
    type: 'state',
    label: 'Durum ekranı',
    category: 'states',
    icon: CircleDashed,
    description: 'Boş, yükleniyor ya da hata hali.',
    defaults: {
      title: 'Henüz etkinlik yok',
      description: 'İlk etkinliği oluşturunca burada görünür.',
      tone: 'neutral',
      loading: false,
    },
    fields: [
      { key: 'title', label: 'Başlık', kind: 'text' },
      { key: 'description', label: 'Açıklama', kind: 'textarea' },
      {
        key: 'tone',
        label: 'Ton',
        kind: 'select',
        options: [
          { value: 'neutral', label: 'Nötr' },
          { value: 'brand', label: 'Marka' },
          { value: 'warning', label: 'Uyarı' },
          { value: 'danger', label: 'Hata' },
        ],
      },
      { key: 'loading', label: 'Yükleniyor', kind: 'boolean' },
    ],
    Render: ({ props }) => (
      <Card>
        <StateCard
          title={str(props, 'title')}
          description={str(props, 'description') || undefined}
          tone={str(props, 'tone') as 'neutral'}
          loading={bool(props, 'loading')}
          icon={CalendarDays}
        />
      </Card>
    ),
    code: (p) => ({
      imports: ['Card', 'StateCard'],
      icons: ['CalendarDays'],
      jsx: `<Card>
  <StateCard
    ${attr('title', p.title)}${str(p, 'description') ? `\n    ${attr('description', p.description)}` : ''}
    ${attr('tone', p.tone)}
    icon={CalendarDays}${bool(p, 'loading') ? '\n    loading' : ''}
  />
</Card>`,
    }),
  },
];

export const BLOCK_BY_TYPE = new Map(BLOCKS.map((b) => [b.type, b]));
