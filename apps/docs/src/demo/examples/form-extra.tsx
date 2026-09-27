'use client';

import {
  Combobox,
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

export const FORM_EXTRA_EXAMPLES = {
  combobox: ComboboxExamples,
  'number-field': NumberExamples,
  'otp-field': OtpExamples,
};
