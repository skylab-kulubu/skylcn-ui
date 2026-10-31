'use client';

import {
  Button,
  Checkbox,
  CheckboxCard,
  ChoiceList,
  ChoiceMatrix,
  ControlSizeProvider,
  CopyButton,
  Field,
  IconButton,
  IconSwap,
  Input,
  OverflowActions,
  type OverflowAction,
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
      <Example
        title="Üç boy"
        description="sm 32, md 36, lg 38 piksel. ControlSizeProvider bir formun hepsini birden ayarlar."
        align="start"
      >
        <div className="grid max-w-xl gap-3">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <ControlSizeProvider key={size} size={size}>
              <div className="grid grid-cols-[2rem_1fr_1fr] items-center gap-3">
                <span className="font-mono text-2xs text-subtle-foreground">{size}</span>
                <Input placeholder="Ad soyad" aria-label={`Ad soyad, ${size}`} />
                <Select
                  aria-label={`Ekip, ${size}`}
                  placeholder="Ekip"
                  value={null}
                  onValueChange={() => {}}
                  options={['WebLab', 'GameLab', 'AILab']}
                />
              </div>
            </ControlSizeProvider>
          ))}
        </div>
      </Example>
      <QuestionExample />
    </>
  );
}

function QuestionExample() {
  const [why, setWhy] = useState('');
  return (
    <Example
      title="Soru"
      description="Doldurulan formlarda alan numaralı bir soru olur; metin kutusu karakterlerini sayar."
      align="start"
    >
      <ControlSizeProvider size="lg">
        <div className="flex max-w-xl flex-col gap-8">
          <Field
            variant="question"
            number={1}
            required
            label="Adın ve soyadın"
            hint="Sertifikada bu ad yazar."
          >
            <Input required placeholder="Deniz Yıldırım" />
          </Field>
          <Field
            variant="question"
            number={2}
            label="Neden katılmak istiyorsun?"
            description="Birkaç cümle yeter."
          >
            <Textarea
              showCount
              maxLength={280}
              rows={3}
              value={why}
              onChange={(event) => setWhy(event.target.value)}
            />
          </Field>
        </div>
      </ControlSizeProvider>
    </Example>
  );
}

function SelectExamples() {
  const [role, setRole] = useState<string | null>('editor');
  const [type, setType] = useState<string | null>(null);
  const [state, setState] = useState('open');
  const [days, setDays] = useState<string[]>(['Salı', 'Perşembe']);
  const [period, setPeriod] = useState('30');
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
      <Example
        title="Çoklu ve eylemli"
        description="multiple birkaç seçeneği işaretler, liste açık kalır. action listenin sonuna bir komut ekler."
      >
        <div className="w-64">
          <Select
            multiple
            aria-label="Toplantı günleri"
            placeholder="Gün seç"
            value={days}
            onValueChange={setDays}
            options={['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']}
          />
        </div>
        <div className="w-56">
          <Select
            aria-label="Etiket"
            placeholder="Etiket seç"
            value={type}
            onValueChange={setType}
            options={['Etkinlik', 'Duyuru', 'Atölye']}
            action={{ label: 'Yeni etiket oluştur', onSelect: () => {} }}
          />
        </div>
      </Example>
      <Example
        title="Hap"
        description="Yoğun satırlar ve araç çubukları için 26 piksellik görünüm."
      >
        <Select
          variant="pill"
          aria-label="Dönem"
          value={period}
          onValueChange={setPeriod}
          options={[
            { value: '7', label: 'Son 7 gün' },
            { value: '30', label: 'Son 30 gün' },
            { value: '90', label: 'Son 90 gün' },
          ]}
        />
      </Example>
    </>
  );
}

const TOPICS = [
  { value: 'web', label: 'Web', description: 'React, Next.js, tasarım sistemleri' },
  { value: 'game', label: 'Oyun', description: 'Unity, Godot, game jam' },
  { value: 'ai', label: 'Yapay zekâ', description: 'Model eğitimi ve uygulamaları' },
];
const PARTS = [
  { value: 'talks', label: 'Konuşmalar' },
  { value: 'workshop', label: 'Atölye' },
  { value: 'venue', label: 'Mekân' },
];
const SCORES = ['Zayıf', 'Orta', 'İyi', 'Çok iyi'].map((label) => ({ value: label, label }));

function CheckboxExamples() {
  const [topics, setTopics] = useState<string[]>(['web']);
  const [level, setLevel] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, string>>({ talks: 'İyi' });
  return (
    <>
      <CheckboxStates />
      <Example
        title="Seçenek kartları"
        description="Yuvarlak işaret tek, kare işaret birden çok yanıt alır; şekil okura bunu baştan söyler."
        align="start"
      >
        <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
          <ChoiceList
            multiple
            aria-label="İlgi alanları"
            options={TOPICS}
            value={topics}
            onValueChange={setTopics}
          />
          <ChoiceList
            aria-label="Deneyim"
            options={[
              { value: 'new', label: 'Yeni başlıyorum' },
              { value: 'some', label: 'Birkaç proje yaptım' },
              { value: 'pro', label: 'İş deneyimim var' },
            ]}
            value={level}
            onValueChange={setLevel}
          />
        </div>
      </Example>
      <Example title="Tek kart" align="start">
        <CheckboxCard
          className="max-w-md"
          label="KVKK aydınlatma metnini okudum"
          description="Bilgilerin yalnızca etkinlik için kullanılır."
        />
      </Example>
      <Example
        title="Matris"
        description="Aynı yanıtlar birkaç satıra sorulur. Telefonda her satır kendi seçeneklerini alt alta dizer."
        align="start"
      >
        <ChoiceMatrix
          className="w-full max-w-2xl"
          aria-label="Etkinliği puanla"
          rows={PARTS}
          columns={SCORES}
          value={ratings}
          onValueChange={setRatings}
        />
      </Example>
    </>
  );
}

function CheckboxStates() {
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
      <Example
        title="Açınca gelen ayarlar"
        description="Anahtar açıkken satırın altında bağlı ayarlar görünür. checkedTitle durumu söyleyen satırlar için."
        align="start"
      >
        <div className="flex max-w-md flex-col gap-2">
          <ToggleRow title="Kontenjan sınırı" description="Dolunca başvuru kapanır." defaultChecked>
            <Field label="Kişi sayısı">
              <Input type="number" defaultValue={40} inputSize="sm" />
            </Field>
          </ToggleRow>
          <ToggleRow
            title="Fotoğraf iznini vermedim"
            checkedTitle="Fotoğraf iznini verdim"
            description="Etkinlik fotoğraflarında görünebilirsin."
          />
        </div>
      </Example>
    </>
  );
}

const FORM_ACTIONS: OverflowAction[] = [
  { key: 'share', label: 'Paylaş', icon: Share2, variant: 'primary', onSelect: () => {} },
  { key: 'preview', label: 'Önizle', icon: Eye, onSelect: () => {} },
  { key: 'refresh', label: 'Yanıtları yenile', icon: RefreshCw, onSelect: () => {} },
  { key: 'notify', label: 'Bildirimleri kapat', icon: BellOff, onSelect: () => {} },
  { key: 'delete', label: 'Sil', icon: Trash2, destructive: true, onSelect: () => {} },
];

function OverflowExamples() {
  const [width, setWidth] = useState(100);
  return (
    <>
      <Example
        title="Daralan araç çubuğu"
        description="Genişliği değiştir: en sondaki eylemler önce menüye geçer, yer açılınca geri gelir."
        align="start"
      >
        <SegmentedControl
          aria-label="Genişlik"
          value={String(width)}
          onValueChange={(value) => setWidth(Number(value))}
          options={[
            { value: '100', label: 'Geniş' },
            { value: '60', label: 'Orta' },
            { value: '35', label: 'Dar' },
          ]}
        />
        <div
          className="flex items-center gap-3 rounded-lg border border-border-subtle p-3 transition-[width] duration-(--motion-duration-base) ease-enter"
          style={{ width: `${width}%` }}
        >
          <span className="shrink-0 text-sm font-medium text-foreground">Kayıt formu</span>
          <OverflowActions aria-label="Form eylemleri" size="sm" actions={FORM_ACTIONS} />
        </div>
      </Example>
    </>
  );
}

export const ACTION_FORM_EXAMPLES = {
  'overflow-actions': OverflowExamples,
  button: ButtonExamples,
  'icon-swap': IconSwapExamples,
  'copy-button': CopyExamples,
  'segmented-control': SegmentedExamples,
  field: FieldExamples,
  select: SelectExamples,
  checkbox: CheckboxExamples,
  switch: SwitchExamples,
};
