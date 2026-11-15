'use client';

import {
  Calendar,
  Combobox,
  DatePicker,
  type DateRange,
  DateRangePicker,
  DateTimePicker,
  Field,
  MultiSelect,
  NumberField,
  OTPField,
  Slider,
  TimePicker,
} from '@skylab-kulubu/skylcn-ui';
import { useRef, useState } from 'react';
import { Example } from '../doc';
import { MEMBERS, TEAMS } from '../members';

const PEOPLE = MEMBERS.slice(0, 40).map((m) => ({ value: m.id, label: m.name, hint: m.team }));
const TEAM_ITEMS = TEAMS.map((t) => ({ value: t, label: t }));

// Stands in for a server that searches people from two letters on
function ServerSearchExample() {
  const [person, setPerson] = useState<string | null>(null);
  const [found, setFound] = useState<typeof PEOPLE>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const search = (query: string) => {
    clearTimeout(timer.current);
    const typed = query.trim().toLocaleLowerCase('tr-TR');
    if (typed.length < 2) return;
    setLoading(true);
    timer.current = setTimeout(() => {
      setFound(PEOPLE.filter((p) => p.label.toLocaleLowerCase('tr-TR').includes(typed)));
      setLoading(false);
    }, 400);
  };
  return (
    <Field label="Yeni sahip" className="max-w-sm">
      <Combobox
        items={found}
        value={person}
        onValueChange={setPerson}
        onSearch={search}
        minSearch={2}
        loading={loading}
        placeholder="İsimle ara"
      />
    </Field>
  );
}

function ComboboxExamples() {
  const [person, setPerson] = useState<string | null>(null);
  const [teams, setTeams] = useState<string[]>(['WebLab']);
  const [tags, setTags] = useState([
    { value: 'react', label: 'React' },
    { value: 'oyun', label: 'Oyun' },
  ]);
  const [picked, setPicked] = useState<string[]>(['react']);
  return (
    <>
      <Example title="Kişi seç" description="Yazdıkça liste daralır." align="start">
        <Field label="Etkinlik sorumlusu" className="max-w-sm">
          <Combobox
            items={PEOPLE}
            value={person}
            onValueChange={setPerson}
            placeholder="İsim yaz"
            emptyText="Bu isimde üye yok"
          />
        </Field>
      </Example>
      <Example
        title="Sunucuda ara"
        description="onSearch ile alan bir arama kutusu olur: liste düğmesi yerine arama ikonu; liste minSearch harften sonra açılır."
        align="start"
      >
        <ServerSearchExample />
      </Example>
      <Example
        title="Çoklu seçim"
        description="Seçilenler çip olur; Backspace son çipi siler."
        align="start"
      >
        <Field label="Duyurunun gideceği ekipler" className="max-w-sm">
          <MultiSelect
            items={TEAM_ITEMS}
            value={teams}
            onValueChange={setTeams}
            placeholder="Ekip ekle"
          />
        </Field>
      </Example>
      <Example
        title="Yazılanı ekle"
        description="Listede olmayanı yazınca Oluştur satırı çıkar; yeni etiket hemen seçilir."
        align="start"
      >
        <Field label="Etiketler" className="max-w-sm">
          <Combobox
            multiple
            items={tags}
            value={picked}
            onValueChange={setPicked}
            placeholder="Etiket yaz"
            onCreate={(label) => {
              const value = label.toLocaleLowerCase('tr-TR');
              setTags((prev) => [...prev, { value, label }]);
              setPicked((prev) => [...prev, value]);
            }}
          />
        </Field>
      </Example>
      <Example
        title="Salt okunur"
        description="Değer kilitli ama okunur ve kopyalanır."
        align="start"
      >
        <Field label="Etkinliği açan" className="max-w-sm">
          <Combobox readOnly items={PEOPLE} value={PEOPLE[0]!.value} onValueChange={() => {}} />
        </Field>
      </Example>
    </>
  );
}

function NumberExamples() {
  const [size, setSize] = useState<number | null>(4);
  return (
    <>
      <Example title="Sayı alanı" align="start">
        <Field label="Takım kişi sayısı" description="1 ile 5 arası.">
          <NumberField value={size} onValueChange={setSize} min={1} max={5} />
        </Field>
      </Example>
      <Example title="Kaydırıcı" align="start">
        <div className="flex max-w-sm flex-col gap-6">
          <Slider label="Kontenjan" defaultValue={60} max={120} />
          <Slider label="Yaş aralığı" defaultValue={[18, 26]} min={16} max={35} />
          <Slider
            label="Atölye ne kadar zordu?"
            defaultValue={3}
            min={1}
            max={5}
            ends={['Çok kolay', 'Çok zor']}
          />
        </div>
      </Example>
    </>
  );
}

function OtpExamples() {
  return (
    <Example
      title="Doğrulama kodu"
      description="E-postaya gelen altı haneli kodu yaz ya da yapıştır."
      align="start"
    >
      <OTPField aria-label="Doğrulama kodu" />
    </Example>
  );
}

function DateExamples() {
  const [day, setDay] = useState<Date | null>(null);
  const [range, setRange] = useState<DateRange | undefined>();
  const [inline, setInline] = useState<Date | undefined>(new Date());
  const [start, setStart] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>('18:30');
  return (
    <>
      <Example title="Tarih alanı" align="start">
        <div className="grid max-w-xl gap-4 sm:grid-cols-2">
          <Field label="Etkinlik günü">
            <DatePicker
              value={day}
              onValueChange={setDay}
              min={new Date()}
              aria-label="Etkinlik günü"
            />
          </Field>
          <Field label="Rapor aralığı">
            <DateRangePicker value={range} onValueChange={setRange} aria-label="Rapor aralığı" />
          </Field>
        </div>
      </Example>
      <Example
        title="Tarih ve saat"
        description="Gün seçilince takvim açık kalır, saat ardından ayarlanır; Tamam kapatır."
        align="start"
      >
        <Field label="Başlangıç" className="max-w-xs">
          <DateTimePicker value={start} onValueChange={setStart} aria-label="Başlangıç" />
        </Field>
      </Example>
      <Example title="Saat" description="Saat ve dakika iki sütundan seçilir." align="start">
        <Field label="Kapı açılışı" className="max-w-xs">
          <TimePicker value={time} onValueChange={setTime} minuteStep={15} />
        </Field>
      </Example>
      <Example title="Takvim">
        <Calendar mode="single" selected={inline} onSelect={setInline} />
      </Example>
    </>
  );
}

export const FORM_EXTRA_EXAMPLES = {
  'date-picker': DateExamples,
  combobox: ComboboxExamples,
  'number-field': NumberExamples,
  'otp-field': OtpExamples,
};
