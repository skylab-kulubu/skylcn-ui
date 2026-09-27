'use client';

import {
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Field,
  IconButton,
  Input,
  Pagination,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
  SegmentedControl,
  Select,
  Skeleton,
  SkylabLoader,
  StateCard,
  StatusDot,
  Switch,
  Textarea,
  ToggleRow,
  Tooltip,
} from '@skylab-kulubu/skylcn-ui';
import { ArrowDown, ArrowUp, Filter, Inbox, Plus, RefreshCw, Search, Share2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3" id={title.toLowerCase().replace(/\s+/g, '-')}>
      <h2 className="text-3xs font-medium tracking-label text-subtle-foreground uppercase">
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

function Gallery() {
  const [role, setRole] = useState<string | null>('editor');
  const [sort, setSort] = useState('desc');
  const [page, setPage] = useState(4);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <div className="space-y-8">
      <Section title="Buttons">
        <Button variant="primary">Kaydet</Button>
        <Button variant="primary" pending>
          Kaydediliyor…
        </Button>
        <Button>İptal</Button>
        <Button variant="ghost">Vazgeç</Button>
        <Button variant="solid">
          <Plus /> Yeni form
        </Button>
        <Button variant="destructive">Sil</Button>
        <Button variant="link">Tümünü gör</Button>
        <Button disabled>Kapalı</Button>
        <IconButton icon={RefreshCw} label="Yenile" />
        <IconButton icon={Share2} label="Paylaş" variant="primary" />
        <IconButton
          icon={RefreshCw}
          label="Yenile"
          pending={pending}
          onClick={() => setPending((v) => !v)}
        />
      </Section>

      <Section title="Loader">
        <SkylabLoader size={16} />
        <SkylabLoader size={24} />
        <SkylabLoader size={48} />
        <SkylabLoader size={80} />
        <p className="shimmer-text text-sm font-semibold text-muted-foreground">Yükleniyor…</p>
      </Section>

      <Section title="Badges">
        <Badge>Görüntüleyici</Badge>
        <Badge tone="strong">Editör</Badge>
        <Badge tone="brand">Sahip</Badge>
        <Badge tone="brand" size="xs">
          YK
        </Badge>
        <Badge tone="success" size="pill">
          Açık
        </Badge>
        <Badge tone="danger" size="pill">
          Kapalı
        </Badge>
        <Badge tone="warning" size="md">
          Onay bekliyor
        </Badge>
        <span className="inline-flex items-center gap-2 text-2xs text-muted-foreground">
          <StatusDot tone="success" /> Aktif
        </span>
        <span className="inline-flex items-center gap-2 text-2xs text-muted-foreground">
          <StatusDot tone="danger" /> Pasif
        </span>
      </Section>

      <Section title="Avatar">
        <Avatar name="Yusuf Açmacı" size="sm" />
        <Avatar name="İlayda Şahin" />
        <Avatar email="fatih@example.com" size="lg" />
        <Avatar size="md" />
        <Avatar name="WebLab" shape="square" />
        <Avatar name="Sky Sec" shape="square" size="lg" />
      </Section>

      <Section title="Fields">
        <div className="grid w-full max-w-xl grid-cols-2 gap-3">
          <Field label="Form adı" description="Katılımcılar bu adı görür.">
            <Input placeholder="Gece Kodu 2026 başvuru" />
          </Field>
          <Field label="E-posta" error="Geçerli bir e-posta yaz.">
            <Input defaultValue="yusuf@" />
          </Field>
          <Input icon={Search} placeholder="Ara…" />
          <Input inputSize="sm" placeholder="Küçük" />
          <Textarea className="col-span-2" placeholder="Açıklama" />
        </div>
      </Section>

      <Section title="Select">
        <div className="w-56">
          <Select
            value={role}
            onValueChange={setRole}
            options={[
              { value: 'owner', label: 'Sahip' },
              { value: 'editor', label: 'Editör', hint: '3 kişi' },
              { value: 'viewer', label: 'Görüntüleyici' },
              { value: 'none', label: 'Erişim yok', disabled: true },
            ]}
            aria-label="Yetki"
          />
        </div>
        <div className="w-40">
          <Select
            value={null}
            onValueChange={() => undefined}
            options={['Etkinlik', 'Duyuru']}
            size="sm"
            aria-label="Tür"
          />
        </div>
        <span className="text-2xs text-muted-foreground">
          Durum:{' '}
          <Select
            variant="inline"
            value="open"
            onValueChange={() => undefined}
            tone="text-success"
            aria-label="Durum"
            options={[
              { value: 'open', label: 'Açık' },
              { value: 'closed', label: 'Kapalı' },
            ]}
          />
        </span>
      </Section>

      <Section title="Segmented">
        <div className="w-56">
          <SegmentedControl
            aria-label="Sıralama"
            value={sort}
            onValueChange={setSort}
            options={[
              { value: 'desc', label: 'Azalan', icon: ArrowDown },
              { value: 'asc', label: 'Artan', icon: ArrowUp },
            ]}
          />
        </div>
        <div className="w-72">
          <SegmentedControl
            value={sort}
            onValueChange={setSort}
            options={[
              { value: 'desc', label: 'Yeni' },
              { value: 'asc', label: 'Eski' },
              { value: 'all', label: 'Tümü' },
            ]}
          />
        </div>
      </Section>

      <Section title="Switch">
        <Switch defaultChecked aria-label="Bildirimler" />
        <Switch aria-label="Otomatik kaydet" />
        <Checkbox defaultChecked aria-label="Seçili" />
        <Checkbox aria-label="Seçili değil" />
        <Checkbox indeterminate aria-label="Kısmen seçili" />
        <div className="w-80">
          <ToggleRow
            title="Anonim cevap"
            description="Giriş yapmadan cevaplanabilir."
            defaultChecked
          />
        </div>
      </Section>

      <Section title="Overlays">
        <Tooltip label="Formu paylaş">
          <IconButton icon={Share2} label="Paylaş" title="" />
        </Tooltip>
        <Popover>
          <PopoverTrigger render={<Button />}>
            <Filter /> Filtrele
          </PopoverTrigger>
          <PopoverContent>
            <PopoverTitle>Filtreler</PopoverTitle>
            <PopoverDescription>Yanıtları duruma göre süz.</PopoverDescription>
            <div className="mt-3">
              <SegmentedControl
                value={sort}
                onValueChange={setSort}
                options={[
                  { value: 'desc', label: 'Azalan', icon: ArrowDown },
                  { value: 'asc', label: 'Artan', icon: ArrowUp },
                ]}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger render={<Button variant="primary" />}>Paneli aç</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Ayarlar</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="space-y-3">
              <ToggleRow
                title="Birden fazla cevap"
                description="Aynı kişi tekrar cevaplayabilir."
              />
              <ToggleRow
                title="Manuel onay"
                description="Cevaplar onaydan sonra sayılır."
                defaultChecked
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Section>

      <Section title="Navigation">
        <Breadcrumbs
          items={[
            { href: '/', label: 'Dashboard' },
            { href: '/forms', label: 'Formlar' },
            { href: '/forms/1', label: 'Gece Kodu 2026 başvuru' },
          ]}
        />
        <Pagination current={page} totalPages={12} onPageChange={setPage} />
        <Pagination current={page} totalPages={48} onPageChange={setPage} />
      </Section>

      <Section title="States">
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="rounded-lg border border-border">
            <StateCard loading />
          </div>
          <div className="rounded-lg border border-border">
            <StateCard
              icon={Inbox}
              title="Henüz cevap yok"
              description="Form yayında; ilk cevap burada görünür."
            >
              <Button variant="primary">
                <Share2 /> Paylaş
              </Button>
            </StateCard>
          </div>
        </div>
      </Section>

      <Section title="Skeleton">
        <div className="w-full space-y-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border-subtle px-3 py-2.5"
            >
              <Skeleton className="size-9 rounded-lg" />
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="ml-auto h-4 w-14" />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

export default function Page() {
  return (
    <main className="grid min-h-dvh grid-cols-1 bg-sidebar xl:grid-cols-2">
      <h1 className="sr-only">skylcn-ui bileşenleri</h1>
      {(['dark', 'light'] as const).map((theme) => (
        <div key={theme} data-theme={theme} className="bg-sidebar p-2" id={`theme-${theme}`}>
          <div className="rounded-xl border border-border-subtle bg-background p-6 text-foreground">
            <p className="mb-6 font-mono text-2xs text-subtle-foreground">
              data-theme=&quot;{theme}&quot;
            </p>
            <Gallery />
          </div>
        </div>
      ))}
    </main>
  );
}
