'use client';

import {
  AnimatedNumber,
  Avatar,
  Badge,
  BarList,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Collapse,
  DataList,
  DataListBody,
  DataListCell,
  DataListColumnHeader,
  DataListHeader,
  DataListRow,
  IconButton,
  ListItem,
  ListPanel,
  ProportionBar,
  Reveal,
  SegmentedControl,
  Skeleton,
  Sparkline,
  StatCard,
  StateCard,
  StatusDot,
  Swap,
  TrendBadge,
  listStatus,
  type DataListColumn,
  type DataListSort,
} from '@skylab-kulubu/skylcn-ui';
import { AreaChart, BarChart, DonutChart, LineChart } from '@skylab-kulubu/skylcn-ui/charts';
import { CalendarDays, ChevronDown, Inbox, MoreHorizontal, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Example } from '../doc';
import { MEMBERS, STATUS_LABEL } from '../members';
import { monthly } from '../metrics';

const COLUMNS: DataListColumn[] = [
  { id: 'status', width: '1.5rem', align: 'center' },
  { id: 'name', width: 'minmax(0,2fr)' },
  { id: 'team', width: 'minmax(0,1fr)', from: 'sm' },
  { id: 'events', width: '5rem', from: 'md', align: 'center' },
  { id: 'actions', width: '2rem', align: 'end' },
];
const DOT = { active: 'success', inactive: 'neutral', alumni: 'info' } as const;

function DataListExamples() {
  const [sort, setSort] = useState<DataListSort>({ field: 'events', direction: 'desc' });
  const rows = useMemo(() => {
    const direction = sort.direction === 'asc' ? 1 : -1;
    const key = sort.field as 'name' | 'team' | 'events';
    return MEMBERS.slice(0, 6).sort(
      (a, b) => String(a[key]).localeCompare(String(b[key]), 'tr', { numeric: true }) * direction,
    );
  }, [sort]);
  const toggle = (field: string) =>
    setSort((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'asc' },
    );
  return (
    <Example
      title="Sıralanabilir liste"
      description="Bir başlığa tıkla: satırlar yeni yerlerine kayar. Pencereyi daraltınca sütunlar gizlenir."
      align="start"
    >
      <DataList columns={COLUMNS} sort={sort} onSortChange={toggle}>
        <DataListHeader>
          <DataListColumnHeader column="status" label="Durum" />
          <DataListColumnHeader column="name" sortable>
            Üye
          </DataListColumnHeader>
          <DataListColumnHeader column="team" sortable>
            Ekip
          </DataListColumnHeader>
          <DataListColumnHeader column="events" sortable>
            Etkinlik
          </DataListColumnHeader>
          <DataListColumnHeader column="actions" label="İşlemler" />
        </DataListHeader>
        <DataListBody>
          {rows.map((member, index) => (
            <DataListRow
              key={member.id}
              href="#member"
              label={`${member.name} profilini aç`}
              index={index}
            >
              <DataListCell column="status">
                <StatusDot tone={DOT[member.status]} label={STATUS_LABEL[member.status]} />
              </DataListCell>
              <DataListCell column="name" className="gap-3">
                <Avatar name={member.name} size="sm" />
                <span className="truncate text-sm text-secondary-foreground">{member.name}</span>
              </DataListCell>
              <DataListCell column="team">
                <Badge>{member.team}</Badge>
              </DataListCell>
              <DataListCell column="events" className="text-xs text-muted-foreground tabular-nums">
                {member.events}
              </DataListCell>
              <DataListCell column="actions" interactive>
                <IconButton icon={MoreHorizontal} label="İşlemler" variant="ghost" size="icon-sm" />
              </DataListCell>
            </DataListRow>
          ))}
        </DataListBody>
      </DataList>
    </Example>
  );
}

function ListPanelExamples() {
  const [state, setState] = useState<'loading' | 'empty' | 'ready'>('ready');
  const status = listStatus({
    loading: state === 'loading',
    rowCount: state === 'empty' ? 0 : 3,
    emptyMessage: 'Henüz duyuru yok',
  });
  return (
    <Example
      title="Durumlarıyla liste"
      description="Durumu değiştir: içerik birbirine solar."
      align="start"
    >
      <SegmentedControl
        aria-label="Durum"
        value={state}
        onValueChange={(value) => setState(value as typeof state)}
        options={[
          { value: 'ready', label: 'Dolu' },
          { value: 'loading', label: 'Yükleniyor' },
          { value: 'empty', label: 'Boş' },
        ]}
      />
      <div className="max-w-lg">
        <ListPanel
          status={status}
          emptyIcon={Inbox}
          emptyDescription="Yayınladığın duyurular burada listelenir."
        >
          {[
            'Gece Kodu başvuruları açıldı',
            'Web atölyesi salonu değişti',
            'Stant haftası gönüllüleri',
          ].map((title, i) => (
            <ListItem
              key={title}
              href="#"
              title={title}
              subtitle={`${i + 2} gün önce`}
              leading={<StatusDot tone="brand" />}
            />
          ))}
        </ListPanel>
      </div>
    </Example>
  );
}

function CardExamples() {
  const [value, setValue] = useState(86);
  return (
    <>
      <Example
        title="Sayı kartları"
        description="Değeri değiştir: sayı yeni değerine akar."
        align="start"
      >
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setValue((v) => v + 12)}>
            +12 üye
          </Button>
          <Button size="sm" onClick={() => setValue((v) => Math.max(0, v - 7))}>
            −7 üye
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Aktif üye"
            value={value}
            icon={Users}
            delta={<TrendBadge value={12.5} />}
            hint="Geçen döneme göre"
          />
          <StatCard
            label="Katılım"
            value={1677}
            icon={CalendarDays}
            hint="Son 12 ay"
            trend={monthly('12m').map((row) => row.attendance)}
          />
          <StatCard
            label="Bekleyen onay"
            value={13}
            delta={<TrendBadge value={-9.7} riseIsGood={false} />}
            hint="Düşüş iyi haber"
          />
        </div>
      </Example>
      <Example title="İçerik kartı" align="start">
        <Card className="max-w-md">
          <CardHeader>
            <div className="min-w-0">
              <CardTitle>Web atölyesi</CardTitle>
              <CardDescription>11 Ekim · Çevrim içi</CardDescription>
            </div>
            <CardAction>
              <Badge tone="brand">Kayıt açık</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed text-muted-foreground">
            Base UI ile erişilebilir formlar: alanlar, doğrulama ve hata mesajları.
          </CardContent>
          <CardFooter className="justify-end">
            <Button size="sm">Detay</Button>
            <Button size="sm" variant="primary">
              Kayıt ol
            </Button>
          </CardFooter>
        </Card>
      </Example>
    </>
  );
}

function BadgeExamples() {
  return (
    <>
      <Example title="Tonlar ve boyutlar">
        <Badge>Görüntüleyici</Badge>
        <Badge tone="strong">Editör</Badge>
        <Badge tone="brand">Sahip</Badge>
        <Badge tone="info">Taslak</Badge>
        <Badge tone="warning" size="md">
          Onay bekliyor
        </Badge>
        <Badge tone="success" size="pill">
          Açık
        </Badge>
        <Badge tone="danger" size="pill">
          Kapalı
        </Badge>
        <Badge tone="brand" size="xs">
          Yönetim
        </Badge>
      </Example>
      <Example
        title="Durum noktaları"
        description="Etiketli noktalar ekran okuyucuya durumunu söyler."
      >
        {(['success', 'warning', 'danger', 'info', 'brand', 'neutral'] as const).map((tone) => (
          <span key={tone} className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <StatusDot tone={tone} /> {tone}
          </span>
        ))}
      </Example>
    </>
  );
}

function AvatarExamples() {
  return (
    <Example title="Kişiler ve ekipler">
      <Avatar name="Mira Tunç" size="sm" />
      <Avatar name="İlayda Şahin" />
      <Avatar email="ozan@example.com" size="lg" />
      <Avatar />
      <Avatar name="WebLab" shape="square" />
      <Avatar name="Sky Sec" shape="square" size="lg" />
    </Example>
  );
}

function BarListExamples() {
  const [chosen, setChosen] = useState(['q1']);
  return (
    <>
      <Example title="Dağılım" align="start">
        <BarList
          className="max-w-lg"
          items={[
            { key: 'web', label: 'Web', value: 231 },
            { key: 'ai', label: 'Yapay zekâ', value: 204 },
            { key: 'game', label: 'Oyun', value: 118 },
            { key: 'sec', label: 'Güvenlik', value: 96 },
          ]}
        />
      </Example>
      <Example
        title="Seçilebilir oranlar"
        description="Satıra dokun: seçim açılır ya da kapanır."
        align="start"
      >
        <BarList
          className="max-w-lg"
          max={412}
          selected={chosen}
          onSelect={(key) =>
            setChosen((prev) =>
              prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
            )
          }
          items={[
            { key: 'q1', label: 'S1 · Hangi bölümde okuyorsun?', value: 409 },
            { key: 'q2', label: 'S2 · Takımın kaç kişi?', value: 352 },
            { key: 'q3', label: 'S3 · Konaklama gerekiyor mu?', value: 188 },
          ]}
        />
      </Example>
    </>
  );
}

function ProportionExamples() {
  return (
    <Example title="Kaynak" align="start">
      <ProportionBar
        className="max-w-md"
        segments={[
          { key: 'registered', label: 'Kayıtlı', value: 301 },
          { key: 'anonymous', label: 'Anonim', value: 111 },
        ]}
      />
      <ProportionBar
        className="max-w-md"
        segments={[
          { key: 'active', label: 'Aktif', value: 85 },
          { key: 'inactive', label: 'Pasif', value: 16 },
          { key: 'alumni', label: 'Mezun', value: 23 },
        ]}
      />
    </Example>
  );
}

function TrendExamples() {
  return (
    <Example title="Değişim ve trend">
      <TrendBadge value={12.5} />
      <TrendBadge value={-9.7} />
      <TrendBadge value={-4} riseIsGood={false} />
      <TrendBadge value={0} />
      <div className="w-40">
        <Sparkline values={monthly('12m').map((row) => row.attendance)} />
      </div>
    </Example>
  );
}

function StateExamples() {
  return (
    <>
      <Example title="Durum ekranları" align="start">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-border">
            <StateCard loading description="Üyeler getiriliyor." />
          </div>
          <div className="rounded-lg border border-border">
            <StateCard
              icon={Inbox}
              title="Henüz yanıt yok"
              description="Form yayında; ilk yanıt burada görünür."
            >
              <Button variant="primary" size="sm">
                Paylaş
              </Button>
            </StateCard>
          </div>
        </div>
      </Example>
      <Example title="İskelet" align="start">
        <div className="flex max-w-lg flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border-subtle px-3 py-2.5"
            >
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="ml-auto h-4 w-14" />
            </div>
          ))}
        </div>
      </Example>
    </>
  );
}

function ChartExamples({ kind }: { kind: 'area' | 'line' | 'bar' | 'donut' }) {
  const data = monthly('12m');
  if (kind === 'area')
    return (
      <>
        <Example
          title="Tek seri"
          description="Marka lilası ve kaybolan dolgu; üstünde gezin, tablo görünümüne geç."
          align="start"
        >
          <AreaChart
            title="Etkinlik katılımı"
            description="Son 12 ay"
            data={data}
            x="month"
            xLabel="Ay"
            series={{ attendance: { label: 'Katılımcı' } }}
          />
        </Example>
        <Example
          title="Küçük trend"
          description="Kart içinde: eksensiz, noktalı, başlığın yanında değişim."
          align="start"
        >
          <div className="max-w-sm">
            <AreaChart
              compact
              markers
              title="Haftalık yanıt"
              badge={<TrendBadge value={-12.2} />}
              data={data.slice(-8)}
              x="month"
              series={{ geceKodu: { label: 'Yanıt' } }}
            />
          </div>
        </Example>
      </>
    );
  if (kind === 'line')
    return (
      <Example
        title="Üç seri"
        description="Göstergedeki bir seriye tıkla: gizlenir, renkler yerinde kalır."
        align="start"
      >
        <LineChart
          title="Form başvuruları"
          data={data}
          x="month"
          xLabel="Ay"
          series={{
            geceKodu: { label: 'Gece Kodu' },
            yildizJam: { label: 'YıldızJam' },
            artlab: { label: 'ARTLAB' },
          }}
        />
      </Example>
    );
  if (kind === 'bar')
    return (
      <>
        <Example title="Yığılmış" description="Parçalar 2px boşlukla ayrılır." align="start">
          <BarChart
            stacked
            title="Etkinlik türleri"
            data={data}
            x="month"
            xLabel="Ay"
            series={{
              workshops: { label: 'Atölye' },
              talks: { label: 'Konuşma' },
              contests: { label: 'Yarışma' },
            }}
          />
        </Example>
        <Example title="Yatay" description="Uzun kategori adları için." align="start">
          <BarChart
            orientation="horizontal"
            title="Ekiplere göre üye"
            data={[
              { team: 'WebLab', members: 19 },
              { team: 'Yapay zekâ', members: 15 },
              { team: 'Etkinlik', members: 14 },
              { team: 'SkySec', members: 13 },
            ]}
            x="team"
            xLabel="Ekip"
            series={{ members: { label: 'Üye' } }}
          />
        </Example>
      </>
    );
  return (
    <Example
      title="Parça bütün"
      description="Göstergede paylar yazılıdır; halka en fazla altı parça alır."
      align="start"
    >
      <div className="max-w-md">
        <DonutChart
          title="Üye durumu"
          data={[
            { key: 'active', label: 'Aktif', value: 85 },
            { key: 'inactive', label: 'Pasif', value: 16 },
            { key: 'alumni', label: 'Mezun', value: 23 },
          ]}
        />
      </div>
    </Example>
  );
}

function RevealExamples() {
  const [round, setRound] = useState(0);
  return (
    <Example title="Sırayla gelen kartlar" align="start">
      <Button size="sm" className="self-start" onClick={() => setRound((r) => r + 1)}>
        Yeniden oynat
      </Button>
      <div key={round} className="grid gap-3 sm:grid-cols-3">
        {['Atölye', 'Konuşma', 'Yarışma'].map((title, index) => (
          <Reveal key={title} index={index} size="lg">
            <Card className="p-4 text-sm text-foreground">{title}</Card>
          </Reveal>
        ))}
      </div>
    </Example>
  );
}

function CollapseExamples() {
  const [open, setOpen] = useState(false);
  return (
    <Example title="Açılan bölüm" align="start">
      <Button
        size="sm"
        className="self-start"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Gelişmiş ayarlar
        <ChevronDown
          className={`transition-transform duration-(--motion-duration-base) ${open ? 'rotate-180' : ''}`}
        />
      </Button>
      <Collapse open={open}>
        <div className="flex max-w-md flex-col gap-2 pt-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Yanıt sınırı, bitiş tarihi ve e-posta bildirimleri. İçerik doğal yüksekliğine açılır.
          </p>
          <Skeleton className="h-9 w-full" />
        </div>
      </Collapse>
    </Example>
  );
}

function SwapExamples() {
  const steps = ['Bilgiler', 'Takım', 'Onay'];
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<-1 | 1>(1);
  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };
  return (
    <Example
      title="Adım adım"
      description="İleri ve geri: içerik gittiği yöne kayar."
      align="start"
    >
      <Swap id={step} direction={direction} className="max-w-md">
        <Card className="p-4">
          <p className="text-3xs tracking-label text-subtle-foreground uppercase">
            Adım {step + 1} / 3
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">{steps[step]}</p>
        </Card>
      </Swap>
      <div className="flex gap-2">
        <Button size="sm" disabled={step === 0} onClick={() => go(step - 1)}>
          Geri
        </Button>
        <Button size="sm" variant="primary" disabled={step === 2} onClick={() => go(step + 1)}>
          İleri
        </Button>
      </div>
    </Example>
  );
}

function NumberExamples() {
  const [value, setValue] = useState(1642);
  return (
    <Example title="Akan sayı">
      <p className="text-4xl font-semibold text-foreground">
        <AnimatedNumber value={value} />
      </p>
      <Button size="sm" onClick={() => setValue((v) => v + Math.round(Math.random() * 400) + 20)}>
        Yanıt geldi
      </Button>
    </Example>
  );
}

export const DATA_EXAMPLES = {
  'data-list': DataListExamples,
  'list-panel': ListPanelExamples,
  card: CardExamples,
  badge: BadgeExamples,
  avatar: AvatarExamples,
  'bar-list': BarListExamples,
  'proportion-bar': ProportionExamples,
  trend: TrendExamples,
  'state-card': StateExamples,
  'area-chart': () => <ChartExamples kind="area" />,
  'line-chart': () => <ChartExamples kind="line" />,
  'bar-chart': () => <ChartExamples kind="bar" />,
  'donut-chart': () => <ChartExamples kind="donut" />,
  reveal: RevealExamples,
  collapse: CollapseExamples,
  swap: SwapExamples,
  'animated-number': NumberExamples,
};
