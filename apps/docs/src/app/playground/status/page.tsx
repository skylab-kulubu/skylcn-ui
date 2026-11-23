'use client';

import {
  Button,
  ErrorScene,
  errorSceneText,
  PageHeader,
  Select,
  StatusPage,
  type ErrorSceneKind,
} from '@skylab-kulubu/skylcn-ui';
import { useState } from 'react';

const SCREENS = [
  { value: 'notFound', label: '404 · Bulunamadı' },
  { value: 'error', label: '500 · Sunucu hatası' },
  { value: 'forbidden', label: '403 · Yetki yok' },
  { value: 'offline', label: 'Çevrimdışı' },
  { value: 'sessionExpired', label: 'Oturum doldu' },
  { value: 'maintenance', label: 'Bakım' },
  { value: 'redirect', label: 'Yönlendirme' },
] as const;

type Screen = (typeof SCREENS)[number]['value'];

export default function StatusScenario() {
  const [screen, setScreen] = useState<Screen>('notFound');
  const text = screen === 'redirect' ? null : errorSceneText(screen as ErrorSceneKind);
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Hata ve yönlendirme"
        description="Tam sayfa durumlar ve sahneleri; burada çerçeve içinde gösteriliyor."
      >
        <Select
          aria-label="Ekran"
          value={screen}
          onValueChange={(value) => setScreen(value as Screen)}
          options={SCREENS}
        />
      </PageHeader>
      <div className="overflow-hidden rounded-xl border border-border">
        {text ? (
          <StatusPage
            as="div"
            key={screen}
            className="min-h-[32rem] py-10"
            scene={<ErrorScene kind={screen as ErrorSceneKind} />}
            code={text.code}
            title={text.title}
            description={text.description}
          >
            <Button variant="primary">{text.action}</Button>
          </StatusPage>
        ) : (
          <StatusPage
            as="div"
            className="min-h-[32rem]"
            loading
            title="Hesabına yönlendiriliyorsun"
            description="Kulüp hesabınla giriş yapman için güvenli sayfaya geçiyoruz."
          />
        )}
      </div>
    </div>
  );
}
