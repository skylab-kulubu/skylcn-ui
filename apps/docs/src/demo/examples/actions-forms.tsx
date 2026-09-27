'use client';

import {
  Button,
  Checkbox,
  CopyButton,
  Field,
  IconButton,
  IconSwap,
  Input,
  SegmentedControl,
  Select,
  Switch,
  Textarea,
  ToggleRow,
} from '@skylab-kulubu/skylcn-ui';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  AtSign,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Example } from '../doc';

function ButtonExamples() {
  const [saving, setSaving] = useState(false);
  const [quick, setQuick] = useState(false);
  const run = (set: (value: boolean) => void, ms: number) => {
    set(true);
    window.setTimeout(() => set(false), ms);
  };
  return (
    <>
      <Example title="Görünümler">
        <Button variant="primary">Kaydet</Button>
        <Button variant="solid">
          <Plus /> Yeni etkinlik
        </Button>
        <Button>İptal</Button>
        <Button variant="ghost">Vazgeç</Button>
        <Button variant="destructive">
          <Trash2 /> Sil
        </Button>
        <Button variant="link">Tümünü gör</Button>
        <Button disabled>Kapalı</Button>
      </Example>
      <Example
        title="Üzerine gelince ikon"
        description="hoverIcon: yazı aşağı kayıp kaybolur, ikon yukarıdan gelir. Klavye odağında da çalışır."
      >
        <Button variant="primary" hoverIcon={ArrowRight}>
          Başvur
        </Button>
        <Button hoverIcon={Share2}>Paylaş</Button>
        <Button variant="destructive" hoverIcon={Trash2}>
          Sil
        </Button>
      </Example>
      <Example title="Boyutlar ve ikon butonları">
        <Button size="sm">Küçük</Button>
        <Button>Orta</Button>
        <Button size="lg">Büyük</Button>
        <IconButton icon={RefreshCw} label="Yenile" size="icon-sm" />
        <IconButton icon={Share2} label="Paylaş" variant="primary" />
        <IconButton icon={Trash2} label="Sil" variant="destructive" size="icon-lg" />
      </Example>
      <Example
        title="Bekleme"
        description="Yavaş iş yükleyiciyi gösterir; hızlı iş (80ms) hiç göstermez, buton yine de kilitlenir."
      >
        <Button variant="primary" pending={saving} onClick={() => run(setSaving, 1400)}>
          Yavaş kaydet
        </Button>
        <Button pending={quick} onClick={() => run(setQuick, 80)}>
          Hızlı kaydet
        </Button>
        <IconButton
          icon={RefreshCw}
          label="Yenile"
          pending={saving}
          onClick={() => run(setSaving, 1400)}
        />
      </Example>
    </>
  );
}

function IconSwapExamples() {
  const [bell, setBell] = useState(true);
  const [grid, setGrid] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <Example title="Durum ikonları" description="Tıkla: ikon bir sonrakine karışarak geçer.">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Bildirimler"
        aria-pressed={bell}
        onClick={() => setBell((v) => !v)}
      >
        <IconSwap swapped={!bell} icon={Bell} swappedIcon={BellOff} className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Görünüm"
        aria-pressed={grid}
        onClick={() => setGrid((v) => !v)}
      >
        <IconSwap swapped={grid} icon={List} swappedIcon={LayoutGrid} className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Şifreyi göster"
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
      >
        <IconSwap swapped={visible} icon={Eye} swappedIcon={EyeOff} className="size-4" />
      </Button>
    </Example>
  );
}

function CopyExamples() {
  return (
    <Example title="Bağlantı kopyalama">
      <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-input-background py-1 pr-1 pl-3">
        <span className="min-w-0 flex-1 truncate font-mono text-2xs text-secondary-foreground">
          https://forms.example.com/f/gece-kodu-2026
        </span>
        <CopyButton value="https://forms.example.com/f/gece-kodu-2026" label="Bağlantıyı kopyala" />
      </div>
    </Example>
  );
}

function SegmentedExamples() {
  const [sort, setSort] = useState('new');
  const [dir, setDir] = useState('desc');
  return (
    <>
      <Example title="Metinli">
        <SegmentedControl
          aria-label="Sıralama"
          value={sort}
          onValueChange={setSort}
          options={[
            { value: 'new', label: 'Yeni' },
            { value: 'old', label: 'Eski' },
            { value: 'all', label: 'Tümü' },
          ]}
        />
      </Example>
      <Example title="Yalnız ikonlu" description="Adı ipucu olarak görünür.">
        <SegmentedControl
          aria-label="Yön"
          value={dir}
          onValueChange={setDir}
          options={[
            { value: 'desc', label: 'Azalan', icon: ArrowDown },
            { value: 'asc', label: 'Artan', icon: ArrowUp },
          ]}
        />
      </Example>
    </>
  );
}

function FieldExamples() {
  const [email, setEmail] = useState('deniz@');
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  return (
    <>
      <Example
        title="Etiket, açıklama, hata"
        description="E-postayı düzeltince hata yüksekliğiyle kapanır."
        align="start"
      >
        <div className="grid max-w-xl gap-4 sm:grid-cols-2">
          <Field label="Etkinlik adı" description="Katılımcılar bu adı görür.">
            <Input placeholder="Gece Kodu 2026" />
          </Field>
          <Field label="E-posta" error={valid ? undefined : 'Geçerli bir e-posta yaz.'}>
            <Input icon={AtSign} value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
        </div>
      </Example>
      <Example title="Boyutlar ve ikon" align="start">
        <div className="grid max-w-xl gap-3 sm:grid-cols-2">
          <Input icon={Search} placeholder="Ara…" aria-label="Ara" />
          <Input inputSize="sm" placeholder="Küçük alan" aria-label="Küçük alan" />
          <Textarea
            className="sm:col-span-2"
            placeholder="Açıklama"
            aria-label="Açıklama"
            rows={3}
          />
        </div>
      </Example>
    </>
  );
}

function SelectExamples() {
  const [role, setRole] = useState<string | null>('editor');
  const [type, setType] = useState<string | null>(null);
  const [state, setState] = useState('open');
  return (
    <>
      <Example title="Kutu" description="İpuçlu ve devre dışı seçenekler.">
        <div className="w-56">
          <Select
            aria-label="Yetki"
            value={role}
            onValueChange={setRole}
            options={[
              { value: 'owner', label: 'Sahip' },
              { value: 'editor', label: 'Editör', hint: '3 kişi' },
              { value: 'viewer', label: 'Görüntüleyici' },
              { value: 'none', label: 'Erişim yok', disabled: true },
            ]}
          />
        </div>
        <div className="w-44">
          <Select
            aria-label="Tür"
            size="sm"
            placeholder="Tür seç"
            value={type}
            onValueChange={setType}
            options={['Etkinlik', 'Duyuru', 'Atölye']}
          />
        </div>
      </Example>
      <Example title="Satır içi" description="Cümlenin içindeki bir değer.">
        <span className="text-xs text-muted-foreground">
          Başvurular şu an{' '}
          <Select
            variant="inline"
            aria-label="Durum"
            value={state}
            onValueChange={setState}
            tone={state === 'open' ? 'text-success' : 'text-destructive'}
            options={[
              { value: 'open', label: 'açık' },
              { value: 'closed', label: 'kapalı' },
            ]}
          />
        </span>
      </Example>
    </>
  );
}

function CheckboxExamples() {
  return (
    <Example title="Durumlar">
      <label className="flex items-center gap-2 text-sm text-secondary-foreground">
        <Checkbox defaultChecked /> Etkinlik hatırlatmaları
      </label>
      <label className="flex items-center gap-2 text-sm text-secondary-foreground">
        <Checkbox /> Haftalık özet
      </label>
      <label className="flex items-center gap-2 text-sm text-secondary-foreground">
        <Checkbox indeterminate /> Tüm bildirimler
      </label>
      <label className="flex items-center gap-2 text-sm text-subtle-foreground">
        <Checkbox disabled /> Devre dışı
      </label>
    </Example>
  );
}

function SwitchExamples() {
  return (
    <>
      <Example title="Anahtar">
        <Switch defaultChecked aria-label="Bildirimler" />
        <Switch aria-label="Otomatik kaydet" />
        <Switch disabled aria-label="Devre dışı" />
      </Example>
      <Example title="Ayar satırı" align="start">
        <div className="flex max-w-md flex-col gap-2">
          <ToggleRow
            title="Anonim yanıt"
            description="Giriş yapmadan yanıtlanabilir."
            defaultChecked
          />
          <ToggleRow title="Elle onay" description="Yanıtlar onaydan sonra sayılır." />
        </div>
      </Example>
    </>
  );
}

export const ACTION_FORM_EXAMPLES = {
  button: ButtonExamples,
  'icon-swap': IconSwapExamples,
  'copy-button': CopyExamples,
  'segmented-control': SegmentedExamples,
  field: FieldExamples,
  select: SelectExamples,
  checkbox: CheckboxExamples,
  switch: SwitchExamples,
};
