'use client';

import {
  Avatar,
  Badge,
  BarList,
  Button,
  Checkbox,
  Input,
  Kbd,
  Meter,
  Notice,
  ProportionBar,
  SegmentedControl,
  Skeleton,
  SkylabLoader,
  SkylabMark,
  Sparkline,
  StatusDot,
  Switch,
  TrendBadge,
} from '@skylab-kulubu/skylcn-ui';
import { ChevronDown, ChevronRight, Copy, MoreHorizontal, Plus, Search, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { ENTRIES } from './catalog';

const noop = () => undefined;
const trend = [212, 348, 290, 164, 188, 402, 377, 455, 198, 96, 120, 431];

function Bars({ stacked = false }: { stacked?: boolean }) {
  return (
    <div className="flex h-16 items-end gap-2">
      {[40, 70, 55, 90, 65].map((h, i) => (
        <span key={i} className="flex w-4 flex-col justify-end gap-0.5" style={{ height: `${h}%` }}>
          {stacked ? <span className="h-1/3 rounded-t-sm bg-chart-2" /> : null}
          <span className={`flex-1 bg-chart-1 ${stacked ? '' : 'rounded-t-sm'}`} />
        </span>
      ))}
    </div>
  );
}

const MINIS: Record<string, () => ReactNode> = {
  colors: () => (
    <div className="grid grid-cols-4 gap-1.5">
      {[
        'skylab-300',
        'skylab-500',
        'skylab-800',
        'foreground',
        'chart-2',
        'chart-3',
        'chart-7',
        'destructive',
      ].map((t) => (
        <span
          key={t}
          className="size-6 rounded-md border border-border"
          style={{ background: `var(--${t})` }}
        />
      ))}
    </div>
  ),
  typography: () => (
    <div className="flex flex-col gap-0.5">
      <span className="text-lg font-semibold">Aa Space Grotesk</span>
      <span className="font-mono text-xs text-muted-foreground">Space Mono 0123</span>
    </div>
  ),
  motion: () => (
    <div className="flex h-6 w-44 items-center rounded-md bg-muted p-1">
      <span className="size-4 animate-pulse rounded bg-skylab-500" />
    </div>
  ),
  brand: () => (
    <div className="flex items-center gap-3">
      <SkylabMark size={28} />
      <SkylabLoader size={28} />
    </div>
  ),
  button: () => (
    <div className="flex gap-2">
      <Button size="sm" variant="primary">
        Kaydet
      </Button>
      <Button size="sm">İptal</Button>
    </div>
  ),
  'icon-swap': () => <X className="size-5" />,
  'copy-button': () => (
    <span className="flex items-center gap-2 rounded-md border border-border px-2 py-1 font-mono text-3xs">
      forms.example.com/f/… <Copy className="size-3" />
    </span>
  ),
  'segmented-control': () => (
    <SegmentedControl
      aria-label="Önizleme"
      value="a"
      onValueChange={noop}
      options={[
        { value: 'a', label: 'Yeni' },
        { value: 'b', label: 'Eski' },
      ]}
    />
  ),
  field: () => <Input icon={Search} placeholder="Ara…" aria-label="Ara" className="w-48" />,
  select: () => (
    <span className="flex h-8 w-40 items-center justify-between rounded-md border border-input px-2.5 text-xs">
      Editör <ChevronDown className="size-3.5 text-subtle-foreground" />
    </span>
  ),
  checkbox: () => (
    <span className="flex items-center gap-2 text-xs">
      <Checkbox defaultChecked aria-label="Önizleme" /> Hatırlatmalar
    </span>
  ),
  switch: () => <Switch defaultChecked aria-label="Önizleme" />,
  'radio-group': () => (
    <span className="flex items-center gap-2 text-xs">
      <span className="grid size-4 place-items-center rounded-full border border-skylab-400">
        <span className="size-2 rounded-full bg-skylab-400" />
      </span>{' '}
      Hemen gönder
    </span>
  ),
  dialog: () => (
    <div className="w-44 rounded-lg border border-border bg-background p-2 text-2xs shadow-overlay">
      <p className="font-semibold">Silinsin mi?</p>
      <div className="mt-2 flex justify-end gap-1">
        <span className="rounded border border-border px-1.5">Vazgeç</span>
        <span className="rounded border border-destructive/40 px-1.5 text-destructive">Sil</span>
      </div>
    </div>
  ),
  toast: () => (
    <div className="w-48 rounded-lg border border-border bg-background p-2 text-2xs shadow-overlay">
      Kaydedildi · <span className="text-muted-foreground">Geri al</span>
    </div>
  ),
  tooltip: () => (
    <span className="rounded-md border border-border bg-background px-2 py-1 text-2xs">
      Formu paylaş
    </span>
  ),
  popover: () => (
    <div className="h-14 w-40 rounded-lg border border-border-strong bg-background p-2 text-2xs">
      Filtreler
    </div>
  ),
  drawer: () => (
    <div className="flex h-16 w-44 justify-end rounded-md border border-border">
      <span className="w-16 rounded-r-md border-l border-border bg-background" />
    </div>
  ),
  menu: () => (
    <div className="flex w-36 flex-col gap-0.5 rounded-lg border border-border bg-background p-1 text-2xs">
      <span className="rounded bg-accent px-1.5 py-1">Düzenle</span>
      <span className="px-1.5 py-1 text-destructive">Sil</span>
    </div>
  ),
  'app-shell': () => (
    <div className="flex h-16 w-44 gap-1 rounded-md bg-sidebar p-1">
      <span className="w-8 rounded-sm bg-accent" />
      <span className="flex-1 rounded-sm border border-border-subtle bg-background" />
    </div>
  ),
  'side-nav': () => (
    <div className="flex w-32 flex-col gap-0.5 text-2xs">
      <span className="rounded bg-accent-strong px-1.5 py-1">Gelen kutusu</span>
      <span className="px-1.5 py-1 text-muted-foreground">Gönderilen</span>
    </div>
  ),
  tabs: () => (
    <div className="flex gap-3 border-b border-border text-2xs">
      <span className="border-b-2 border-skylab-400 pb-1">Genel</span>
      <span className="text-muted-foreground">Etkinlikler</span>
    </div>
  ),
  accordion: () => (
    <div className="flex w-44 items-center justify-between border-b border-border pb-1 text-2xs">
      Kimler başvurabilir? <ChevronDown className="size-3" />
    </div>
  ),
  breadcrumbs: () => (
    <span className="flex items-center gap-1 text-2xs text-muted-foreground">
      Formlar <ChevronRight className="size-3" /> <span className="text-foreground">Analitik</span>
    </span>
  ),
  pagination: () => (
    <span className="flex items-center gap-1 text-2xs">
      1 …{' '}
      <span className="rounded border border-skylab-400/40 bg-skylab-500/15 px-1.5 py-0.5 text-skylab-300">
        4
      </span>{' '}
      … 48
    </span>
  ),
  'page-header': () => (
    <div className="flex w-48 items-center justify-between">
      <span className="text-sm font-semibold">Formlar</span>
      <Plus className="size-4" />
    </div>
  ),
  'data-list': () => (
    <div className="flex w-48 flex-col divide-y divide-border-subtle text-2xs">
      {['Ece Kaya', 'Mert Işık'].map((n) => (
        <span key={n} className="flex items-center gap-2 py-1">
          <StatusDot tone="success" /> {n} <MoreHorizontal className="ml-auto size-3" />
        </span>
      ))}
    </div>
  ),
  'list-panel': () => <Skeleton className="h-10 w-44" />,
  card: () => (
    <div className="w-36 rounded-lg border border-border p-2">
      <p className="text-3xs tracking-label text-subtle-foreground uppercase">Aktif üye</p>
      <p className="text-lg font-semibold">86</p>
    </div>
  ),
  badge: () => (
    <div className="flex gap-1.5">
      <Badge tone="brand">Sahip</Badge>
      <Badge tone="success" size="pill">
        Açık
      </Badge>
    </div>
  ),
  avatar: () => (
    <div className="flex gap-1.5">
      <Avatar name="Mira Tunç" size="sm" />
      <Avatar name="WebLab" shape="square" size="sm" />
    </div>
  ),
  'bar-list': () => (
    <BarList
      className="w-48"
      items={[
        { key: 'a', label: 'Web', value: 231 },
        { key: 'b', label: 'Oyun', value: 118 },
      ]}
    />
  ),
  'proportion-bar': () => (
    <ProportionBar
      className="w-48"
      segments={[
        { key: 'a', label: 'Kayıtlı', value: 301 },
        { key: 'b', label: 'Anonim', value: 111 },
      ]}
    />
  ),
  trend: () => (
    <div className="flex w-44 flex-col gap-1">
      <TrendBadge value={12.5} />
      <Sparkline values={trend} />
    </div>
  ),
  'state-card': () => <SkylabLoader size={32} />,
  feedback: () => (
    <div className="flex w-52 flex-col gap-2">
      <Notice tone="warning" title="Bakımda" />
      <Meter label="Kontenjan" value={72} />
    </div>
  ),
  'area-chart': () => (
    <div className="w-48">
      <Sparkline values={trend} />
    </div>
  ),
  'line-chart': () => (
    <div className="w-48">
      <Sparkline values={trend.slice().reverse()} />
    </div>
  ),
  'bar-chart': () => <Bars stacked />,
  'donut-chart': () => (
    <span
      className="size-14 rounded-full"
      style={{
        background: 'conic-gradient(var(--chart-1) 0 69%, var(--chart-2) 0 82%, var(--chart-3) 0)',
        mask: 'radial-gradient(circle, transparent 55%, #000 56%)',
      }}
    />
  ),
  reveal: () => <Bars />,
  collapse: () => (
    <div className="flex w-40 flex-col gap-1">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  ),
  swap: () => <span className="text-xs">Adım 2 / 3</span>,
  'animated-number': () => <span className="text-2xl font-semibold">1.642</span>,
};

/** The small card shown beside a library link: a live glimpse, the name and one line. */
export function ComponentPreview({ slug }: { slug: string }) {
  const entry = ENTRIES.find((item) => item.slug === slug);
  const Mini = MINIS[slug];
  if (!entry) return null;
  return (
    <div className="flex flex-col gap-2.5">
      {Mini ? (
        <div
          inert
          className="pointer-events-none grid h-28 place-items-center overflow-hidden rounded-lg border border-border-subtle bg-card [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:12px_12px]"
        >
          <Mini />
        </div>
      ) : null}
      <div>
        <p className="text-sm font-medium text-foreground">{entry.name}</p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {entry.description}
        </p>
      </div>
      <p className="flex items-center gap-1 text-3xs text-subtle-foreground">
        Açmak için <Kbd>↵</Kbd>
      </p>
    </div>
  );
}
