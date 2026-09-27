'use client';

import {
  AnimatedNumber,
  Avatar,
  Badge,
  BarList,
  Button,
  Checkbox,
  IconSwap,
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
  m,
  useReducedMotion,
} from '@skylab-kulubu/skylcn-ui';
import {
  Bell,
  BellOff,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  MoreHorizontal,
  Plus,
  Search,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { ENTRIES } from './catalog';

const noop = () => undefined;
const PERIOD = 1800;
const PRESS_AT = 560;

/**
 * Drives a preview's loop while it is on screen: `cycle` starts each round
 * (the cursor sets off), `count` ticks when the cursor presses. Reduced
 * motion stops the loop and the preview stands still.
 */
function useClickLoop(period = PERIOD) {
  const reduced = useReducedMotion();
  const [cycle, setCycle] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (reduced) return;
    let press: ReturnType<typeof setTimeout>;
    const round = setInterval(() => {
      setCycle((c) => c + 1);
      press = setTimeout(() => setCount((c) => c + 1), PRESS_AT);
    }, period);
    return () => {
      clearInterval(round);
      clearTimeout(press);
    };
  }, [period, reduced]);
  return { cycle, count, animate: !reduced };
}

/** A pointer that glides onto its target and presses it once per round. */
function Cursor({ cycle, show }: { cycle: number; show: boolean }) {
  if (!show || cycle === 0) return null;
  return (
    <m.svg
      key={cycle}
      aria-hidden
      viewBox="0 0 16 16"
      className="pointer-events-none absolute right-0 bottom-0 z-10 size-4 drop-shadow-[0_1px_2px_rgb(0_0_0/0.6)]"
      initial={{ x: 26, y: 20, opacity: 0, scale: 1 }}
      animate={{
        x: [26, 4, 4, 4, 10],
        y: [20, 4, 4, 4, 12],
        opacity: [0, 1, 1, 1, 0],
        scale: [1, 1, 0.8, 1, 1],
      }}
      transition={{ duration: 1.4, times: [0, 0.36, 0.42, 0.5, 1], ease: 'easeOut' }}
    >
      <path
        d="M2 1.5 L13 8.5 L8.2 9.4 L10.8 14.2 L8.9 15 L6.4 10.3 L2.9 13.3 Z"
        fill="white"
        stroke="black"
        strokeWidth="0.8"
      />
    </m.svg>
  );
}

/** Wraps a target so the cursor presses it. */
function Pressed({ cycle, show, children }: { cycle: number; show: boolean; children: ReactNode }) {
  return (
    <span className="relative inline-flex">
      {children}
      <Cursor cycle={cycle} show={show} />
    </span>
  );
}

function SwitchMini() {
  const { cycle, count, animate } = useClickLoop();
  return (
    <Pressed cycle={cycle} show={animate}>
      <Switch checked={count % 2 === 0} onCheckedChange={noop} aria-label="Önizleme" />
    </Pressed>
  );
}

function CheckboxMini() {
  const { cycle, count, animate } = useClickLoop();
  return (
    <span className="flex items-center gap-2 text-xs">
      <Pressed cycle={cycle} show={animate}>
        <Checkbox checked={count % 2 === 0} onCheckedChange={noop} aria-label="Önizleme" />
      </Pressed>
      Hatırlatmalar
    </span>
  );
}

function SegmentedMini() {
  const { cycle, count, animate } = useClickLoop();
  const value = count % 2 === 0 ? 'a' : 'b';
  return (
    <span className="relative inline-flex">
      <SegmentedControl
        aria-label="Önizleme"
        value={value}
        onValueChange={noop}
        options={[
          { value: 'a', label: 'Yeni' },
          { value: 'b', label: 'Eski' },
        ]}
      />
      <span className={`absolute bottom-0 ${value === 'a' ? 'right-2' : 'right-12'}`}>
        <Cursor cycle={cycle} show={animate} />
      </span>
    </span>
  );
}

function IconSwapMini() {
  const { cycle, count, animate } = useClickLoop();
  return (
    <Pressed cycle={cycle} show={animate}>
      <span className="grid size-9 place-items-center rounded-md border border-border">
        <IconSwap swapped={count % 2 === 1} icon={Bell} swappedIcon={BellOff} className="size-4" />
      </span>
    </Pressed>
  );
}

function CopyMini() {
  const { cycle, count, animate } = useClickLoop();
  return (
    <span className="flex items-center gap-2 rounded-md border border-border py-1 pr-1 pl-2 font-mono text-3xs">
      forms.example.com/f/…
      <Pressed cycle={cycle} show={animate}>
        <span className="grid size-6 place-items-center rounded">
          <IconSwap
            swapped={count > 0 && cycle === count}
            icon={Copy}
            swappedIcon={Check}
            className="size-3"
          />
        </span>
      </Pressed>
    </span>
  );
}

function ButtonMini() {
  const { cycle, count, animate } = useClickLoop(2400);
  const busy = count > 0 && cycle === count;
  return (
    <div className="flex gap-2">
      <Pressed cycle={cycle} show={animate}>
        <Button size="sm" variant="primary" pending={busy}>
          Kaydet
        </Button>
      </Pressed>
      <Button size="sm">İptal</Button>
    </div>
  );
}

function RadioMini() {
  const { cycle, count, animate } = useClickLoop();
  const first = count % 2 === 0;
  const dot = (on: boolean) => (
    <span
      className={`grid size-4 place-items-center rounded-full border transition-colors ${on ? 'border-skylab-400' : 'border-border-strong'}`}
    >
      <span
        className={`size-2 rounded-full bg-skylab-400 transition-[scale] duration-150 ${on ? 'scale-100' : 'scale-0'}`}
      />
    </span>
  );
  return (
    <div className="flex flex-col gap-2 text-xs">
      <span className="flex items-center gap-2">{dot(first)} Hemen gönder</span>
      <span className="flex items-center gap-2">
        <Pressed cycle={cycle} show={animate}>
          {dot(!first)}
        </Pressed>{' '}
        Zamanla
      </span>
    </div>
  );
}

function TabsMini() {
  const { count } = useClickLoop();
  const active = count % 3;
  const tabs = ['Genel', 'Etkinlik', 'Ayarlar'];
  return (
    <div className="relative flex gap-4 border-b border-border text-2xs">
      {tabs.map((tab, i) => (
        <span
          key={tab}
          className={`relative pb-1.5 transition-colors ${i === active ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          {tab}
          {i === active ? (
            <m.span
              layoutId="mini-tab"
              className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-skylab-400"
            />
          ) : null}
        </span>
      ))}
    </div>
  );
}

function AccordionMini() {
  const { cycle, count, animate } = useClickLoop(2200);
  const open = count % 2 === 1;
  return (
    <div className="w-48 text-2xs">
      <Pressed cycle={cycle} show={animate}>
        <span className="flex w-48 items-center justify-between border-b border-border pb-1">
          Kimler başvurabilir?
          <ChevronDown
            className={`size-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </Pressed>
      <m.p
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden pt-1 text-muted-foreground"
      >
        Tüm öğrenciler, en fazla beş kişilik takımlar.
      </m.p>
    </div>
  );
}

function PaginationMini() {
  const { count } = useClickLoop();
  const page = 3 + (count % 3);
  return (
    <span className="flex items-center gap-1.5 text-2xs tabular-nums">
      1 …
      {[page - 1, page, page + 1].map((n) => (
        <span key={n} className="relative grid size-6 place-items-center">
          {n === page ? (
            <m.span
              layoutId="mini-page"
              className="absolute inset-0 rounded border border-skylab-400/40 bg-skylab-500/15"
            />
          ) : null}
          <span className={`relative ${n === page ? 'text-skylab-300' : ''}`}>{n}</span>
        </span>
      ))}
      … 48
    </span>
  );
}

function MenuMini() {
  const { count } = useClickLoop(1200);
  const items = ['Aç', 'Düzenle', 'Sil'];
  const active = count % 3;
  return (
    <div className="flex w-36 flex-col gap-0.5 rounded-lg border border-border bg-background p-1 text-2xs">
      {items.map((item, i) => (
        <span
          key={item}
          className={`relative rounded px-1.5 py-1 ${item === 'Sil' ? 'text-destructive' : ''}`}
        >
          {i === active ? (
            <m.span layoutId="mini-menu" className="absolute inset-0 rounded bg-accent" />
          ) : null}
          <span className="relative">{item}</span>
        </span>
      ))}
    </div>
  );
}

function NumberMini() {
  const { count } = useClickLoop(1600);
  return (
    <span className="text-2xl font-semibold">
      <AnimatedNumber value={1642 + count * 137} />
    </span>
  );
}

function ToastMini() {
  const { count, animate } = useClickLoop(2200);
  return (
    <div className="relative h-16 w-52">
      <m.div
        key={count}
        initial={animate ? { y: 24, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        className="absolute inset-x-0 bottom-0 rounded-lg border border-border bg-background p-2 text-2xs shadow-overlay"
      >
        Kaydedildi · <span className="text-muted-foreground">Geri al</span>
      </m.div>
    </div>
  );
}

function DataListMini() {
  const { count } = useClickLoop(2000);
  const rows = ['Ece Kaya', 'Mert Işık', 'Arda Tunç'];
  const order = count % 2 === 0 ? rows : [...rows].reverse();
  return (
    <div className="flex w-48 flex-col text-2xs">
      <span className="flex items-center gap-1 pb-1 text-3xs tracking-label text-subtle-foreground uppercase">
        Üye {count % 2 === 0 ? '↑' : '↓'}
      </span>
      {order.map((n) => (
        <m.span
          layout
          key={n}
          className="flex items-center gap-2 border-t border-border-subtle py-1"
        >
          <StatusDot tone="success" /> {n} <MoreHorizontal className="ml-auto size-3" />
        </m.span>
      ))}
    </div>
  );
}

function SwapMini() {
  const { count } = useClickLoop();
  const step = (count % 3) + 1;
  return (
    <m.span
      key={step}
      initial={{ x: 12, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="text-xs"
    >
      Adım {step} / 3
    </m.span>
  );
}

function CollapseMini() {
  const { count } = useClickLoop(2000);
  const open = count % 2 === 0;
  return (
    <div className="flex w-40 flex-col gap-1">
      <Skeleton className="h-3 w-full" />
      <m.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        className="flex flex-col gap-1 overflow-hidden"
      >
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </m.div>
    </div>
  );
}
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
  button: ButtonMini,
  'icon-swap': IconSwapMini,
  'copy-button': CopyMini,
  'segmented-control': SegmentedMini,
  switch: SwitchMini,
  field: () => <Input icon={Search} placeholder="Ara…" aria-label="Ara" className="w-48" />,
  select: () => (
    <span className="flex h-8 w-40 items-center justify-between rounded-md border border-input px-2.5 text-xs">
      Editör <ChevronDown className="size-3.5 text-subtle-foreground" />
    </span>
  ),
  checkbox: CheckboxMini,
  'radio-group': RadioMini,
  dialog: () => (
    <div className="w-44 rounded-lg border border-border bg-background p-2 text-2xs shadow-overlay">
      <p className="font-semibold">Silinsin mi?</p>
      <div className="mt-2 flex justify-end gap-1">
        <span className="rounded border border-border px-1.5">Vazgeç</span>
        <span className="rounded border border-destructive/40 px-1.5 text-destructive">Sil</span>
      </div>
    </div>
  ),
  toast: ToastMini,
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
  menu: MenuMini,
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
  tabs: TabsMini,
  accordion: AccordionMini,
  breadcrumbs: () => (
    <span className="flex items-center gap-1 text-2xs text-muted-foreground">
      Formlar <ChevronRight className="size-3" /> <span className="text-foreground">Analitik</span>
    </span>
  ),
  pagination: PaginationMini,
  'page-header': () => (
    <div className="flex w-48 items-center justify-between">
      <span className="text-sm font-semibold">Formlar</span>
      <Plus className="size-4" />
    </div>
  ),
  'data-list': DataListMini,
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
  combobox: () => (
    <span className="flex h-8 w-44 items-center gap-1 rounded-md border border-input px-1.5 text-2xs">
      <span className="rounded border border-skylab-400/30 bg-skylab-500/10 px-1.5 text-skylab-300">
        WebLab
      </span>
      <span className="rounded border border-skylab-400/30 bg-skylab-500/10 px-1.5 text-skylab-300">
        SkySec
      </span>
    </span>
  ),
  'number-field': () => (
    <span className="flex h-8 w-28 items-center justify-between rounded-md border border-input px-2 text-xs">
      − <span className="tabular-nums">4</span> +
    </span>
  ),
  'date-picker': () => (
    <span className="grid grid-cols-7 gap-0.5 text-3xs tabular-nums">
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          className={`grid size-5 place-items-center rounded ${i === 9 ? 'bg-skylab-500 text-primary-foreground' : 'text-muted-foreground'}`}
        >
          {i + 8}
        </span>
      ))}
    </span>
  ),
  'otp-field': () => (
    <span className="flex gap-1">
      {['4', '8', '1', '', '', ''].map((c, i) => (
        <span
          key={i}
          className="grid size-7 place-items-center rounded border border-input font-mono text-xs"
        >
          {c}
        </span>
      ))}
    </span>
  ),
  collapse: CollapseMini,
  swap: SwapMini,
  'animated-number': NumberMini,
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
