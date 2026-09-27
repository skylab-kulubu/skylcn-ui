'use client';

import {
  Button,
  Card,
  DataList,
  DataListHeader,
  DataListColumnHeader,
  DataListSkeleton,
  PageHeader,
  SegmentedControl,
  Skeleton,
  StateCard,
  Badge,
  type DataListColumn,
} from '@skylab-kulubu/skylcn-ui';
import { CalendarX2, CloudOff, Lock, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const COLUMNS: DataListColumn[] = [
  { id: 'status', width: '1.5rem' },
  { id: 'name', width: 'minmax(0,2fr)' },
  { id: 'team', width: 'minmax(0,1fr)', from: 'sm' },
  { id: 'joined', width: '6.5rem', from: 'md' },
];

type Kind = 'loading' | 'empty' | 'error' | 'forbidden';

export default function States() {
  const [kind, setKind] = useState<Kind>('loading');
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Durum ekranları"
        description="Bir sayfanın içerik yerine gösterdiği her şey, aynı dille."
      >
        <SegmentedControl
          aria-label="Durum"
          value={kind}
          onValueChange={(value) => setKind(value as Kind)}
          options={[
            { value: 'loading', label: 'Yükleniyor' },
            { value: 'empty', label: 'Boş' },
            { value: 'error', label: 'Hata' },
            { value: 'forbidden', label: 'Yetki yok' },
          ]}
        />
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="min-h-80">
          {kind === 'loading' ? (
            <StateCard key={kind} loading description="Üye listesi getiriliyor." />
          ) : kind === 'empty' ? (
            <StateCard
              key={kind}
              icon={CalendarX2}
              title="Henüz etkinlik yok"
              description="İlk etkinliği oluşturduğunda burada listelenir."
            >
              <Button variant="primary" size="sm">
                Etkinlik oluştur
              </Button>
            </StateCard>
          ) : kind === 'error' ? (
            <StateCard
              key={kind}
              icon={CloudOff}
              tone="danger"
              title="Liste getirilemedi"
              description="Sunucuya ulaşılamadı. Bağlantın yerindeyse birazdan yeniden dene."
              meta={<Badge tone="danger">Hata kodu 503</Badge>}
            >
              <Button size="sm">
                <RefreshCw /> Yeniden dene
              </Button>
            </StateCard>
          ) : (
            <StateCard
              key={kind}
              icon={Lock}
              tone="warning"
              title="Bu sayfayı görme yetkin yok"
              description="Yönetim ekibinden birine erişim isteği gönderebilirsin."
            >
              <Button size="sm">Erişim iste</Button>
            </StateCard>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <p className="mb-3 text-3xs font-medium tracking-label text-subtle-foreground uppercase">
              Liste iskeleti
            </p>
            <DataList columns={COLUMNS}>
              <DataListHeader>
                <DataListColumnHeader column="status" label="Durum" />
                <DataListColumnHeader column="name">Üye</DataListColumnHeader>
                <DataListColumnHeader column="team">Ekip</DataListColumnHeader>
                <DataListColumnHeader column="joined">Katıldı</DataListColumnHeader>
              </DataListHeader>
              <DataListSkeleton rows={4} />
            </DataList>
          </Card>
          <Card className="flex flex-col gap-3 p-4">
            <p className="text-3xs font-medium tracking-label text-subtle-foreground uppercase">
              Kart iskeleti
            </p>
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3.5 w-40 max-w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
          </Card>
        </div>
      </div>
    </div>
  );
}
