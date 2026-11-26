'use client';

import {
  ErrorScenePage,
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
  { value: 'unavailable', label: 'Ulaşılamıyor' },
  { value: 'linkExpired', label: '410 · Bağlantı doldu' },
  { value: 'tooManyRequests', label: '429 · Çok deneme' },
  { value: 'cookiesBlocked', label: 'Çerezler kapalı' },
  { value: 'formClosed', label: 'Form kapandı' },
  { value: 'redirect', label: 'Yönlendirme' },
] as const;

type Screen = (typeof SCREENS)[number]['value'];

export default function StatusScenario() {
  const [screen, setScreen] = useState<Screen>('notFound');
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Hata ve yönlendirme"
        description="Tam sayfa durumlar ve sahneleri; burada çerçeve içinde gösteriliyor. Her seçişte türün çizimlerinden biri rastgele gelir."
      >
        <Select
          aria-label="Ekran"
          value={screen}
          onValueChange={(value) => setScreen(value as Screen)}
          options={SCREENS}
        />
      </PageHeader>
      <div className="overflow-hidden rounded-xl border border-border">
        {screen !== 'redirect' ? (
          <ErrorScenePage
            as="div"
            key={screen}
            className="min-h-[32rem] py-10"
            kind={screen as ErrorSceneKind}
            onAction={() => undefined}
          />
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
