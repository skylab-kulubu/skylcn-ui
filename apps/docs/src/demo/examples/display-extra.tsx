'use client';

import {
  AvatarGroup,
  Badge,
  Banner,
  BulkBar,
  Button,
  Checkbox,
  DescriptionList,
  Dropzone,
  MonthCalendar,
  StatusPage,
  Stepper,
  Swap,
  Timeline,
  Tree,
} from '@skylab-kulubu/skylcn-ui';
import { CheckCircle2, Mail, Send, Shield, Trash2, UserPlus, Users, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Example } from '../doc';
import { MemberTable } from '../member-table';
import { MEMBERS } from '../members';

function DropzoneExamples() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <Example title="Dosya yükleme" align="start">
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
    <Example
      title="Üyeler"
      description="Bir satıra tıkla, sonra ↑ ve ↓ ile gez; birkaç satır seçince toplu işlem çubuğu gelir."
      align="start"
    >
      <MemberTable />
    </Example>
  );
}

export const DISPLAY_EXTRA_EXAMPLES = {
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
