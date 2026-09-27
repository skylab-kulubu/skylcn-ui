'use client';

import {
  Calendar,
  Combobox,
  DatePicker,
  type DateRange,
  DateRangePicker,
  Field,
  MultiSelect,
  NumberField,
  OTPField,
  Slider,
} from '@skylab-kulubu/skylcn-ui';
import { useState } from 'react';
import { Example } from '../doc';
import { MEMBERS, TEAMS } from '../members';

const PEOPLE = MEMBERS.slice(0, 40).map((m) => ({ value: m.id, label: m.name, hint: m.team }));
const TEAM_ITEMS = TEAMS.map((t) => ({ value: t, label: t }));

function ComboboxExamples() {
  const [person, setPerson] = useState<string | null>(null);
  const [teams, setTeams] = useState<string[]>(['WebLab']);
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
