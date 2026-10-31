'use client';

import { Button, Field, Input, PageHeader, Section, ToggleRow } from '@skylab-kulubu/skylcn-ui';
import { useState } from 'react';

/** A settings page: groups as frameless sections, switches as rows, one save at the end. */
export default function SettingsPage() {
  const [name, setName] = useState('Gece Kodu 2026');
  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <PageHeader title="Ayarlar" description="Formun genel ayarları ve yanıt kuralları." />
      <Section title="Genel">
        <div className="flex flex-col gap-4">
          <Field label="Form adı">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
        </div>
      </Section>
      <Section
        title="Yanıtlar"
        description="Kimin yanıt verebileceği ve yanıtların nasıl sayılacağı."
      >
        <div className="flex flex-col gap-2">
          <ToggleRow
            title="Anonim yanıt"
            description="Giriş yapmadan yanıtlanabilir."
            defaultChecked
          />
          <ToggleRow title="Elle onay" description="Yanıtlar onaydan sonra sayılır." />
        </div>
      </Section>
      <div className="flex justify-end">
        <Button variant="primary">Kaydet</Button>
      </div>
    </div>
  );
}
