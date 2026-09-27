'use client';

import { Button, PageHeader, SegmentedControl, StatusPage } from '@skylab-kulubu/skylcn-ui';
import { useState } from 'react';

const SCREENS = {
  '404': {
    code: '404',
    title: 'Bu sayfa yok',
    description: 'Bağlantı eskimiş ya da yanlış yazılmış olabilir.',
    action: 'Ana sayfaya dön',
  },
  '403': {
    code: '403',
    title: 'Bu sayfayı görme yetkin yok',
    description: 'Yönetim ekibinden erişim isteyebilirsin.',
    action: 'Erişim iste',
  },
  '500': {
    code: '500',
    title: 'Bir şeyler ters gitti',
    description: 'Sorunu kaydettik. Birazdan yeniden dene.',
    action: 'Yeniden dene',
  },
  redirect: {
    title: 'Hesabına yönlendiriliyorsun',
    description: 'Kulüp hesabınla giriş yapman için güvenli sayfaya geçiyoruz.',
  },
} as const;

type Kind = keyof typeof SCREENS;

export default function StatusScenario() {
  const [kind, setKind] = useState<Kind>('404');
  const screen = SCREENS[kind];
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Hata ve yönlendirme"
        description="Tam sayfa durumlar; burada çerçeve içinde gösteriliyor."
      >
        <SegmentedControl
          aria-label="Ekran"
          value={kind}
          onValueChange={(value) => setKind(value as Kind)}
          options={[
            { value: '404', label: '404' },
            { value: '403', label: '403' },
            { value: '500', label: '500' },
            { value: 'redirect', label: 'Yönlendirme' },
          ]}
        />
      </PageHeader>
      <div className="overflow-hidden rounded-xl border border-border">
        <StatusPage
          as="div"
          key={kind}
          className="min-h-[28rem]"
          code={'code' in screen ? screen.code : undefined}
          loading={kind === 'redirect'}
          title={screen.title}
          description={screen.description}
        >
          {'action' in screen ? <Button variant="primary">{screen.action}</Button> : null}
        </StatusPage>
      </div>
    </div>
  );
}
