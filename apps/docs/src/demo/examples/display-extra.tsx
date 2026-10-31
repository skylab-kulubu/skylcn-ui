'use client';

import {
  AvatarGroup,
  Badge,
  Banner,
  BulkBar,
  Button,
  Checkbox,
  DescriptionList,
  Carousel,
  Dropzone,
  FileUpload,
  type FileUploadItem,
  Kanban,
  MonthCalendar,
  ActivityHeatmap,
  RelativeTime,
  SortableList,
  StatusPage,
  Stepper,
  Swap,
  Timeline,
  Tree,
} from '@skylab-kulubu/skylcn-ui';
import { CheckCircle2, Mail, Send, Shield, Trash2, UserPlus, Users, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Example } from '../doc';
import { MemberTable } from '../member-table';
import { MEMBERS } from '../members';

// The demo plays an upload: progress, a virus scan, then ready; a file named with "virus" is refused
function useFakeUploads(initial: FileUploadItem[] = []) {
  const [files, setFiles] = useState<FileUploadItem[]>(initial);
  const timers = useRef(new Map<string, number>());
  useEffect(() => {
    const all = timers.current;
    return () => all.forEach((timer) => window.clearInterval(timer));
  }, []);
  const patch = (id: string, next: Partial<FileUploadItem>) =>
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, ...next } : file)));
  const start = (id: string, refuse: boolean) => {
    let progress = 0;
    const timer = window.setInterval(() => {
      progress += 20;
      if (progress < 100) return patch(id, { status: 'uploading', progress });
      window.clearInterval(timer);
      patch(id, { status: 'scanning', progress: undefined });
      timers.current.set(
        id,
        window.setTimeout(
          () =>
            patch(
              id,
              refuse
                ? { status: 'error', rejected: true, error: 'Taramada zararlı içerik bulundu.' }
                : { status: 'ready' },
            ),
          1200,
        ),
      );
    }, 300);
    timers.current.set(id, timer);
  };
  const add = (picked: File[], single: boolean) => {
    const items = picked.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      name: file.name,
      size: file.size,
      status: 'uploading' as const,
      progress: 0,
    }));
    setFiles((prev) => (single ? items.slice(0, 1) : [...prev, ...items]));
    items.forEach((item) => start(item.id, /virus/i.test(item.name)));
  };
  const remove = (id: string) => {
    window.clearInterval(timers.current.get(id));
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };
  const retry = (id: string) => {
    patch(id, { status: 'uploading', progress: 0, error: undefined, rejected: undefined });
    start(id, false);
  };
  return { files, add, remove, retry };
}

function FileUploadExamples() {
  const many = useFakeUploads([
    { id: 'a', name: 'sponsor-sunumu.pdf', size: 2_400_000, status: 'ready' },
    {
      id: 'b',
      name: 'afis-son.png',
      size: 820_000,
      status: 'error',
      error: 'Bağlantı koptu, dosya yarım kaldı.',
    },
  ]);
  const one = useFakeUploads();
  return (
    <>
      <Example
        title="Yükleme durumları"
        description="Uygulama durumu söyler, bileşen çizer: yükleniyor, taranıyor, hazır, hata. Adında virus geçen dosya reddedilir."
        align="start"
      >
        <FileUpload
          multiple
          maxFiles={4}
          className="w-full max-w-md"
          accept=".pdf,image/*"
          rules="PDF ya da görsel, en fazla 4 dosya"
          files={many.files}
          onFiles={(picked) => many.add(picked, false)}
          onRemove={many.remove}
          onRetry={many.retry}
        />
      </Example>
      <Example
        title="Tek dosyalı soru"
        description="Kompakt alan formdaki bir soruya sığar; seçilen dosya alanın yerini alır."
        align="start"
      >
        <FileUpload
          variant="compact"
          className="w-full max-w-md"
          aria-label="Öğrenci belgesi"
          rules="PDF, en fazla 10 MB"
          accept=".pdf"
          files={one.files}
          onFiles={(picked) => one.add(picked, true)}
          onRemove={one.remove}
          onRetry={one.retry}
        />
      </Example>
    </>
  );
}

function DropzoneExamples() {
  return (
    <>
      <FileUploadExamples />
      <PlainDropzone />
    </>
  );
}

function PlainDropzone() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <Example title="Yalnız bırakma alanı" align="start">
      <Dropzone
        multiple
        className="max-w-md"
        accept=".pdf,image/*"
        hint="PDF ya da görsel, en fazla 5 MB"
        onFiles={(next) => setFiles((prev) => [...prev, ...next])}
      />
      {files.length ? (
        <ul className="flex max-w-md flex-col gap-1 text-xs text-secondary-foreground">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className="enter-fade truncate">
              {file.name} · {Math.max(1, Math.round(file.size / 1024))} KB
            </li>
          ))}
        </ul>
      ) : null}
    </Example>
  );
}

const STEPS = [
  { id: 'info', label: 'Bilgiler', description: 'Ad ve iletişim' },
  { id: 'team', label: 'Takım', description: 'Üyeler ve rol' },
  { id: 'interview', label: 'Görüşme', description: 'Gerekirse', uncertain: true },
  { id: 'review', label: 'Onay', description: 'Gözden geçir' },
];

function StepperExamples() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<-1 | 1>(1);
  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };
  return (
    <Example title="Başvuru adımları" align="start">
      <Stepper steps={STEPS} current={step} className="max-w-lg" />
      <Swap id={step} direction={dir} className="max-w-lg">
        <p className="rounded-lg border border-border-subtle p-4 text-sm text-muted-foreground">
          {STEPS[step]!.label}: {STEPS[step]!.description}.
        </p>
      </Swap>
      <div className="flex gap-2">
        <Button size="sm" disabled={step === 0} onClick={() => go(step - 1)}>
          Geri
        </Button>
        <Button
          size="sm"
          variant="primary"
          disabled={step === STEPS.length - 1}
          onClick={() => go(step + 1)}
        >
          İleri
        </Button>
      </div>
    </Example>
  );
}

function DescriptionExamples() {
  return (
    <>
      <Example title="Üye bilgileri" align="start">
        <DescriptionList
          className="max-w-xl"
          items={[
            { label: 'E-posta', value: 'deniz@example.com' },
            { label: 'Ekip', value: <Badge>WebLab</Badge> },
            { label: 'Katıldı', value: '12 Ekim 2024' },
            { label: 'Rol', value: 'Ekip lideri' },
          ]}
        />
      </Example>
      <Example title="Kişi grubu">
        <AvatarGroup people={MEMBERS.slice(0, 9).map((m) => ({ name: m.name }))} />
        <AvatarGroup people={MEMBERS.slice(0, 3).map((m) => ({ name: m.name }))} size="md" />
      </Example>
    </>
  );
}

function TimelineExamples() {
  return (
    <>
      <ApprovalTimeline />
      <Example
        title="Etkinlik akışı"
        description="marker adımın numarasını yazar, current şu anki adımı halkayla gösterir, upcoming gelecek adımları kesikli çizer."
        align="start"
      >
        <Timeline
          className="max-w-lg"
          items={[
            { id: 'a', marker: 1, title: 'Kayıt ve karşılama', time: '09.30', tone: 'success' },
            { id: 'b', marker: 2, title: 'Açılış konuşması', time: '10.00', tone: 'success' },
            {
              id: 'c',
              marker: 3,
              title: 'Atölye: Next.js ile panel',
              description: 'B-201, 40 kişi',
              time: '10.30',
              tone: 'brand',
              current: true,
            },
            { id: 'd', marker: 4, title: 'Öğle arası', time: '12.30', upcoming: true },
            {
              id: 'e',
              marker: 5,
              title: 'Proje sunumları',
              time: '13.30',
              tone: 'info',
              upcoming: true,
            },
          ]}
        />
      </Example>
    </>
  );
}

function ApprovalTimeline() {
  return (
    <Example title="Onay geçmişi" align="start">
      <Timeline
        className="max-w-lg"
        items={[
          {
            id: '1',
            title: 'Gönderim onaya sunuldu',
            time: '10.42',
            person: { name: 'Deniz Aydın' },
          },
          {
            id: '2',
            title: 'Düzenlenip geri gönderildi',
            description: 'Konu satırı kısaltıldı.',
            time: '11.05',
            person: { name: 'Mira Tunç' },
          },
          { id: '3', title: 'Onaylandı', time: '11.20', icon: CheckCircle2, tone: 'success' },
          {
            id: '4',
            title: '412 kişiye gönderildi',
            description: '3 adres ulaşılamadı.',
            time: '11.21',
            icon: Send,
            tone: 'brand',
          },
          {
            id: '5',
            title: 'Bir alıcı listeden çıktı',
            time: '14.02',
            icon: XCircle,
            tone: 'warning',
          },
        ]}
      />
    </Example>
  );
}

function BulkExamples() {
  const [picked, setPicked] = useState<string[]>([]);
  const [banner, setBanner] = useState(true);
  const rows = MEMBERS.slice(0, 5);
  return (
    <>
      <Example
        title="Toplu işlem"
        description="Birkaç satır seç: çubuk alttan gelir."
        align="start"
      >
        <ul className="flex max-w-md flex-col divide-y divide-border-subtle rounded-lg border border-border">
          {rows.map((member) => (
            <li key={member.id}>
              <label className="flex items-center gap-3 px-3 py-2 text-sm text-secondary-foreground">
                <Checkbox
                  checked={picked.includes(member.id)}
                  onCheckedChange={(on) =>
                    setPicked((prev) =>
                      on ? [...prev, member.id] : prev.filter((id) => id !== member.id),
                    )
                  }
                />
                {member.name}
              </label>
            </li>
          ))}
        </ul>
        <BulkBar count={picked.length} onClear={() => setPicked([])}>
          <Button size="sm">
            <Mail /> E-posta
          </Button>
          <Button size="sm">
            <UserPlus /> Ekibe ekle
          </Button>
          <Button size="sm" variant="destructive">
            <Trash2 /> Çıkar
          </Button>
        </BulkBar>
      </Example>
      <Example title="Duyuru şeridi" align="start">
        {banner ? (
          <div className="overflow-hidden rounded-lg border border-border">
            <Banner onDismiss={() => setBanner(false)} action={<Button size="sm">İncele</Button>}>
              Yeni: Posta konsolunda onay geçmişi artık zaman çizelgesinde.
            </Banner>
          </div>
        ) : (
          <Button size="sm" className="self-start" onClick={() => setBanner(true)}>
            Şeridi geri getir
          </Button>
        )}
      </Example>
    </>
  );
}

function TreeExamples() {
  const [selected, setSelected] = useState<string | null>('weblab');
  return (
    <Example
      title="Kulüp grupları"
      description="Klavyeyle dene: oklar, Home, End, Enter."
      align="start"
    >
      <Tree
        aria-label="Gruplar"
        className="max-w-sm"
        selected={selected}
        onSelect={setSelected}
        defaultExpanded={['members', 'teams']}
        nodes={[
          { id: 'board', label: 'Yönetim kurulu', icon: Shield, meta: 7 },
          {
            id: 'members',
            label: 'Üyeler',
            icon: Users,
            meta: 124,
            children: [
              {
                id: 'teams',
                label: 'Ekipler',
                children: [
                  { id: 'weblab', label: 'WebLab', meta: 19 },
                  { id: 'skysec', label: 'SkySec', meta: 13 },
                  { id: 'game', label: 'Oyun', meta: 12 },
                ],
              },
              { id: 'alumni', label: 'Mezunlar', meta: 19 },
            ],
          },
        ]}
      />
    </Example>
  );
}

function MonthCalendarExamples() {
  return (
    <Example
      title="Etkinlikler"
      description="Tam hali: Senaryolar → Etkinlik takvimi."
      align="start"
    >
      <MonthCalendar
        defaultMonth={new Date(2026, 9, 1)}
        events={[
          { id: '1', date: '2026-10-04', title: 'Gece Kodu', time: '18.00' },
          { id: '2', date: '2026-10-11', title: 'Web atölyesi', time: '14.00', tone: 'info' },
        ]}
      />
    </Example>
  );
}

function StatusPageExamples() {
  return (
    <Example
      title="Bulunamadı"
      description="Diğerleri: Senaryolar → Hata ve yönlendirme."
      align="start"
    >
      <div className="overflow-hidden rounded-xl border border-border">
        <StatusPage
          as="div"
          className="min-h-80"
          code="404"
          title="Bu sayfa yok"
          description="Bağlantı eskimiş olabilir."
        >
          <Button variant="primary">Ana sayfaya dön</Button>
        </StatusPage>
      </div>
    </Example>
  );
}

function DataTableExamples() {
  return (
    <>
      <Example
        title="Üyeler"
        description="Bir satıra tıkla, sonra ↑ ve ↓ ile gez; birkaç satır seçince toplu işlem çubuğu gelir."
        align="start"
      >
        <MemberTable />
      </Example>
      <Example
        title="5.000 satır, sanal kaydırma"
        description="virtualHeight: sayfa yerine tek kaydırmalı gövde; yalnızca görünen satırlar çizilir."
        align="start"
      >
        <MemberTable virtual />
      </Example>
    </>
  );
}

function KanbanExamples() {
  const [cards, setCards] = useState([
    { id: 'a', column: 'todo', title: 'Afiş' },
    { id: 'b', column: 'todo', title: 'Sponsorlar' },
    { id: 'c', column: 'done', title: 'Salon' },
  ]);
  return (
    <Example
      title="Görev panosu"
      description="Tam hali: Senaryolar → Etkinlik hazırlığı."
      align="start"
    >
      <Kanban
        aria-label="Görevler"
        columns={[
          { id: 'todo', title: 'Yapılacak' },
          { id: 'done', title: 'Bitti' },
        ]}
        cards={cards}
        onMove={(id, column) =>
          setCards((prev) => prev.map((c) => (c.id === id ? { ...c, column } : c)))
        }
      />
    </Example>
  );
}

function CarouselExamples() {
  return (
    <Example title="Etkinlikler" align="start">
      <Carousel aria-label="Geçmiş etkinlikler" slideWidth="min(80%, 16rem)">
        {['Gece Kodu 2025', 'YıldızJam', 'ARTLAB', 'SkySec CTF', 'Stant haftası'].map(
          (title, i) => (
            <div
              key={title}
              className="grid h-36 place-items-end rounded-xl border border-border p-4"
              style={{
                background: `linear-gradient(135deg, var(--chart-${i + 1}) -60%, transparent 70%)`,
              }}
            >
              <span className="text-sm font-medium text-foreground">{title}</span>
            </div>
          ),
        )}
      </Carousel>
    </Example>
  );
}

const MINUTE = 60_000;

function RelativeTimeExamples() {
  const [opened] = useState(() => Date.now());
  const rows = [
    { who: 'Deniz Aydın', what: 'başvuru formunu düzenledi', at: opened - 20_000 },
    { who: 'Mira Tunç', what: 'etkinliği yayına aldı', at: opened - 42 * MINUTE },
    { who: 'Cem Kaya', what: '18 katılımcıyı onayladı', at: opened - 5 * 60 * MINUTE },
    { who: 'Ece Arslan', what: 'ekibe katıldı', at: opened - 26 * 60 * MINUTE },
    { who: 'Bora Şen', what: 'duyuru taslağı açtı', at: opened - 9 * 24 * 60 * MINUTE },
  ];
  return (
    <>
      <Example
        title="Etkinlik günlüğü"
        description="Üzerine gel: tam tarih ve saat görünür. Sayfa açık kaldıkça yazılar kendiliğinden ilerler."
        align="start"
      >
        <ul className="flex w-full max-w-md flex-col divide-y divide-border-subtle text-sm">
          {rows.map((row) => (
            <li key={row.who} className="flex items-baseline justify-between gap-4 py-2">
              <span className="min-w-0 truncate text-secondary-foreground">
                <span className="font-medium text-foreground">{row.who}</span> {row.what}
              </span>
              <RelativeTime date={row.at} className="shrink-0 text-xs text-subtle-foreground" />
            </li>
          ))}
        </ul>
      </Example>
      <Example
        title="İleriye dönük"
        description="Gelecekteki anlar da aynı dille söylenir."
        align="start"
      >
        <p className="text-sm text-muted-foreground">
          Başvurular{' '}
          <RelativeTime date={opened + 2 * 24 * 60 * MINUTE} className="text-foreground" />{' '}
          kapanıyor, etkinlik{' '}
          <RelativeTime date={opened + 3 * 7 * 24 * 60 * MINUTE} className="text-foreground" />.
        </p>
      </Example>
    </>
  );
}

const AGENDA = [
  { id: 'a', title: 'Kayıt ve karşılama', time: '09.30' },
  { id: 'b', title: 'Açılış konuşması', time: '10.00' },
  { id: 'c', title: 'Atölye: Next.js ile panel', time: '10.30' },
  { id: 'd', title: 'Öğle arası', time: '12.30' },
  { id: 'e', title: 'Proje sunumları', time: '13.30' },
];

function SortableExamples() {
  const [agenda, setAgenda] = useState(AGENDA);
  return (
    <Example
      title="Etkinlik akışı"
      description="Tutamaktan sürükle ya da tutamağa odaklanıp ok tuşlarına bas. Sürüklerken Esc vazgeçer."
      align="start"
    >
      <SortableList
        aria-label="Etkinlik akışı"
        className="w-full max-w-md"
        items={agenda}
        getId={(step) => step.id}
        getLabel={(step) => step.title}
        onReorder={setAgenda}
        renderItem={(step) => (
          <span className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-foreground">{step.title}</span>
            <span className="shrink-0 text-xs text-subtle-foreground tabular-nums">
              {step.time}
            </span>
          </span>
        )}
      />
    </Example>
  );
}

// Made-up attendance: busier on weekday evenings and in the weeks of the term's events
function attendance(weeks: number) {
  const today = new Date();
  return Array.from({ length: weeks * 7 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const weekday = date.getDay();
    const base = weekday === 0 || weekday === 6 ? 0 : (date.getDate() * 7 + weekday * 3) % 9;
    const eventWeek = Math.floor(i / 7) % 5 === 1 ? 4 : 0;
    return { date, count: base > 4 ? base - 4 + eventWeek : 0 };
  });
}

function HeatmapExamples() {
  const [data] = useState(() => attendance(26));
  return (
    <>
      <Example
        title="Dönem boyu katılım"
        description="Bir güne gel ya da odaklanıp ok tuşlarıyla gez: altındaki satır o günü okur."
        align="start"
      >
        <ActivityHeatmap
          aria-label="Son 26 haftada atölye katılımı"
          data={data}
          formatCount={(n) => `${n} katılım`}
          className="max-w-full"
        />
      </Example>
      <Example title="Üye sayfasında" description="weeks ile kısa bir dönem." align="start">
        <ActivityHeatmap
          aria-label="Deniz Aydın'ın son 12 haftası"
          data={data}
          weeks={12}
          formatCount={(n) => `${n} etkinlik`}
        />
      </Example>
    </>
  );
}

export const DISPLAY_EXTRA_EXAMPLES = {
  'activity-heatmap': HeatmapExamples,
  'sortable-list': SortableExamples,
  'relative-time': RelativeTimeExamples,
  kanban: KanbanExamples,
  carousel: CarouselExamples,
  'data-table': DataTableExamples,
  'month-calendar': MonthCalendarExamples,
  'status-page': StatusPageExamples,
  tree: TreeExamples,
  dropzone: DropzoneExamples,
  stepper: StepperExamples,
  'description-list': DescriptionExamples,
  timeline: TimelineExamples,
  'bulk-bar': BulkExamples,
};
