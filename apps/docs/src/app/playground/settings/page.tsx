'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  Input,
  PageHeader,
  SegmentedControl,
  Select,
  Textarea,
  ToggleRow,
  useMotionPreference,
  useTheme,
  type MotionPreference,
  type SkylcnLocale,
  type ThemePreference,
} from '@skylab-kulubu/skylcn-ui';
import { AtSign, Monitor, Moon, Sun } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useDemoLocale } from '../../providers';

function Section({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
      {footer ? <CardFooter className="justify-end">{footer}</CardFooter> : null}
    </Card>
  );
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { motion, setMotion } = useMotionPreference();
  const { locale, setLocale } = useDemoLocale();
  const [saving, setSaving] = useState(false);
  const [notify, setNotify] = useState({ events: true, forms: true, digest: false });

  const save = () => {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 1100);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <PageHeader title="Ayarlar" description="Profilin, bildirimlerin ve görünüm tercihlerin." />

      <Section
        title="Profil"
        description="Kulüp içinde görünen bilgilerin."
        footer={
          <Button variant="primary" pending={saving} onClick={save}>
            Kaydet
          </Button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ad soyad">
            <Input defaultValue="Deniz Aydın" autoComplete="name" />
          </Field>
          <Field label="E-posta" description="Duyurular bu adrese gider.">
            <Input
              icon={AtSign}
              type="email"
              defaultValue="deniz@example.com"
              autoComplete="email"
            />
          </Field>
        </div>
        <Field label="Hakkında">
          <Textarea rows={3} placeholder="Ekiplerin, ilgi alanların…" />
        </Field>
      </Section>

      <Section title="Bildirimler" description="Hangi durumlarda e-posta alacağını seç.">
        <ToggleRow
          title="Etkinlik hatırlatmaları"
          description="Kayıt olduğun etkinlikten bir gün önce."
          checked={notify.events}
          onCheckedChange={(events) => setNotify((prev) => ({ ...prev, events }))}
        />
        <ToggleRow
          title="Form yanıtları"
          description="Sahibi olduğun formlara yeni yanıt geldiğinde."
          checked={notify.forms}
          onCheckedChange={(forms) => setNotify((prev) => ({ ...prev, forms }))}
        />
        <ToggleRow
          title="Haftalık özet"
          description="Pazartesi sabahları kulüpte olanların kısa bir özeti."
          checked={notify.digest}
          onCheckedChange={(digest) => setNotify((prev) => ({ ...prev, digest }))}
        />
      </Section>

      <Section
        title="Görünüm"
        description="Bu tarayıcıda hatırlanır; sayfa açılırken titremeden uygulanır."
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-foreground">Tema</p>
            <p className="text-xs text-muted-foreground">Sistem, cihazının ayarını izler.</p>
          </div>
          <SegmentedControl
            aria-label="Tema"
            value={theme}
            onValueChange={(value) => setTheme(value as ThemePreference)}
            options={[
              { value: 'dark', label: 'Koyu', icon: Moon },
              { value: 'light', label: 'Açık', icon: Sun },
              { value: 'system', label: 'Sistem', icon: Monitor },
            ]}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-foreground">Hareketi azalt</p>
            <p className="text-xs text-muted-foreground">
              Kayma ve büyümeleri kaldırır, kısa solmaları bırakır.
            </p>
          </div>
          <SegmentedControl
            aria-label="Hareket"
            value={motion}
            onValueChange={(value) => setMotion(value as MotionPreference)}
            options={[
              { value: 'system', label: 'Sistem' },
              { value: 'reduced', label: 'Azaltılmış' },
            ]}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-foreground">Dil</p>
            <p className="text-xs text-muted-foreground">Bileşenlerin kendi metinleri.</p>
          </div>
          <div className="w-40">
            <Select
              aria-label="Dil"
              value={locale}
              onValueChange={(value) => setLocale(value as SkylcnLocale)}
              options={[
                { value: 'tr', label: 'Türkçe' },
                { value: 'en', label: 'English' },
              ]}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
