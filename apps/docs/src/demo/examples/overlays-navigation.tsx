'use client';

import {
  Breadcrumbs,
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  FilterPills,
  IconButton,
  MenuCheckboxItem,
  MenuGroup,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  PageHeader,
  Pagination,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
  SearchInput,
  SegmentedControl,
  SideNav,
  Stat,
  ToggleRow,
  Tooltip,
} from '@skylab-kulubu/skylcn-ui';
import {
  ArrowDownUp,
  Copy,
  ExternalLink,
  Filter,
  MoreHorizontal,
  PencilLine,
  Plus,
  Send,
  Share2,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Example } from '../doc';

function TooltipExamples() {
  return (
    <Example title="İpuçları" description="Birinden diğerine geçerken gecikme olmaz.">
      <Tooltip label="Formu paylaş">
        <IconButton icon={Share2} label="Paylaş" title="" variant="ghost" />
      </Tooltip>
      <Tooltip label="Kopyasını oluştur">
        <IconButton icon={Copy} label="Kopyala" title="" variant="ghost" />
      </Tooltip>
      <Tooltip label="Sil · geri alınamaz">
        <IconButton icon={Trash2} label="Sil" title="" variant="ghost" />
      </Tooltip>
    </Example>
  );
}

function PopoverExamples() {
  const [sort, setSort] = useState('new');
  return (
    <Example title="Filtre paneli">
      <Popover>
        <PopoverTrigger render={<Button />}>
          <Filter /> Filtrele
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-3">
          <div>
            <PopoverTitle className="text-sm font-semibold text-foreground">Filtreler</PopoverTitle>
            <PopoverDescription className="text-xs text-muted-foreground">
              Yanıtları duruma ve tarihe göre süz.
            </PopoverDescription>
          </div>
          <SegmentedControl
            aria-label="Sıralama"
            className="w-full"
            value={sort}
            onValueChange={setSort}
            options={[
              { value: 'new', label: 'Yeni' },
              { value: 'old', label: 'Eski' },
            ]}
          />
          <ToggleRow title="Yalnız bekleyenler" />
        </PopoverContent>
      </Popover>
    </Example>
  );
}

function DrawerExamples() {
  return (
    <>
      <Example
        title="Alt panel"
        description="Telefonda en rahat açılan hali; aşağı kaydırınca kapanır."
      >
        <Drawer side="bottom">
          <DrawerTrigger render={<Button />}>Alt paneli aç</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Paylaş</DrawerTitle>
              <DrawerDescription>Bağlantıyı kopyala ya da bir kanala gönder.</DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="flex flex-col gap-2">
              <ToggleRow title="Herkese açık bağlantı" defaultChecked />
              <ToggleRow title="Yanıtları e-postayla bildir" />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Example>
      <Example
        title="Ayar paneli"
        description="Yandan açılır; kenardaki sekme, Esc ya da sağa kaydırmak kapatır."
      >
        <Drawer>
          <DrawerTrigger render={<Button variant="primary" />}>Paneli aç</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Form ayarları</DrawerTitle>
              <DrawerDescription>Değişiklikler hemen kaydedilir.</DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="flex flex-col gap-2">
              <ToggleRow
                title="Birden fazla yanıt"
                description="Aynı kişi yeniden yanıtlayabilir."
              />
              <ToggleRow
                title="Elle onay"
                description="Yanıtlar onaydan sonra sayılır."
                defaultChecked
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Example>
    </>
  );
}

function RowMenu() {
  const [starred, setStarred] = useState(true);
  const [view, setView] = useState('list');
  return (
    <>
      <MenuGroup label="Form">
        <MenuItem icon={ExternalLink}>Aç</MenuItem>
        <MenuItem icon={PencilLine} shortcut="E">
          Düzenle
        </MenuItem>
        <MenuSub>
          <MenuSubTrigger icon={Send}>Paylaş</MenuSubTrigger>
          <MenuSubContent>
            <MenuItem>Bağlantıyı kopyala</MenuItem>
            <MenuItem>E-postayla gönder</MenuItem>
          </MenuSubContent>
        </MenuSub>
      </MenuGroup>
      <MenuSeparator />
      <MenuCheckboxItem checked={starred} onCheckedChange={setStarred}>
        Yıldızlı
      </MenuCheckboxItem>
      <MenuRadioGroup value={view} onValueChange={(value) => setView(value as string)}>
        <MenuRadioItem value="list">Liste görünümü</MenuRadioItem>
        <MenuRadioItem value="grid">Izgara görünümü</MenuRadioItem>
      </MenuRadioGroup>
      <MenuSeparator />
      <MenuItem icon={Trash2} destructive>
        Sil
      </MenuItem>
    </>
  );
}

function MenuExamples() {
  return (
    <>
      <Example title="Açılır menü" description="Gruplar, alt menü, onay ve seçim öğeleri, kısayol.">
        <DropdownMenu>
          <DropdownMenuTrigger render={<IconButton icon={MoreHorizontal} label="İşlemler" />} />
          <DropdownMenuContent>
            <RowMenu />
          </DropdownMenuContent>
        </DropdownMenu>
      </Example>
      <Example title="Sağ tık menüsü" description="Alana sağ tıkla; dokunmatik ekranda uzun bas.">
        <ContextMenu>
          <ContextMenuTrigger className="grid h-28 w-full max-w-sm place-items-center rounded-lg border border-dashed border-border-strong text-xs text-muted-foreground">
            Buraya sağ tıkla
          </ContextMenuTrigger>
          <ContextMenuContent>
            <RowMenu />
          </ContextMenuContent>
        </ContextMenu>
      </Example>
    </>
  );
}

function AppShellExamples() {
  return (
    <Example
      title="Bu sayfanın kendisi"
      description="Playground bir AppShell: sol üstteki konsol seçici, alttaki profil menüsü, Ctrl/⌘+B ile daralan kenar çubuğu."
      align="start"
    >
      <ul className="flex list-disc flex-col gap-1 pl-5 text-xs text-muted-foreground">
        <li>
          Başlıktaki düğme ya da Ctrl/⌘+B kenar çubuğunu ikon şeridine indirir; tercih hatırlanır.
        </li>
        <li>Telefonda üst çubuktaki menü, kenar çubuğunu soldan kayan bir çekmecede açar.</li>
        <li>
          Sayfa eylemleri AppShellActions ile başlığa taşınır; sağ üstteki ayar düğmesi böyle geldi.
        </li>
      </ul>
    </Example>
  );
}

function NavigationMenuExamples() {
  return (
    <Example title="Site menüsü" description="Tam örnek için Senaryolar → Kulüp sitesi.">
      <NavigationMenu aria-label="Örnek site menüsü">
        <NavigationMenuItem label="Etkinlikler">
          <NavigationMenuLink
            href="#"
            title="Gece Kodu 2026"
            description="24 saatlik kodlama gecesi."
          />
          <NavigationMenuLink href="#" title="YıldızJam" description="Oyun geliştirme maratonu." />
        </NavigationMenuItem>
        <NavigationMenuItem label="Ekipler">
          <NavigationMenuLink href="#" title="WebLab" description="Konsollar ve siteler." />
          <NavigationMenuLink href="#" title="SkySec" description="Güvenlik ve altyapı." />
        </NavigationMenuItem>
        <NavigationMenuItem label="SSS" href="#" />
      </NavigationMenu>
    </Example>
  );
}

function SideNavExamples() {
  const [active, setActive] = useState('#inbox');
  return (
    <Example
      title="Posta kutusu klasörleri"
      description="Sol sütundaki bileşen listesi de bir SideNav."
      align="start"
    >
      <div
        className="max-w-56"
        onClickCapture={(event) => {
          const link = (event.target as HTMLElement).closest('a');
          if (link) {
            event.preventDefault();
            setActive(link.getAttribute('href') ?? '#inbox');
          }
        }}
      >
        <SideNav
          aria-label="Klasörler"
          activeHref={active}
          className="static max-h-none"
          sections={[
            {
              items: [
                {
                  href: '#inbox',
                  label: 'Gelen kutusu',
                  badge: <span className="text-3xs text-subtle-foreground tabular-nums">12</span>,
                },
                { href: '#starred', label: 'Yıldızlı' },
                { href: '#sent', label: 'Gönderilen' },
              ],
            },
            {
              label: 'Listeler',
              items: [
                { href: '#members', label: 'Tüm üyeler' },
                { href: '#weblab', label: 'WebLab' },
                { href: '#alumni', label: 'Mezunlar' },
              ],
            },
          ]}
        />
      </div>
    </Example>
  );
}

function BreadcrumbsExamples() {
  return (
    <Example title="Sayfa yolu" align="start">
      <Breadcrumbs
        aria-label="Örnek sayfa yolu"
        items={[
          { href: '#', label: 'Formlar' },
          { href: '#', label: 'Gece Kodu 2026 başvuru' },
          { href: '#', label: 'Analitik' },
        ]}
      />
    </Example>
  );
}

function PaginationExamples() {
  const [short, setShort] = useState(2);
  const [long, setLong] = useState(4);
  return (
    <>
      <Example title="Kısa liste" description="Tüm sayfalar görünür.">
        <Pagination
          aria-label="Kısa liste sayfaları"
          current={short}
          totalPages={5}
          onPageChange={setShort}
        />
      </Example>
      <Example
        title="Uzun liste"
        description="Geçerli sayfaya tıkla ve numara yaz; 0 ilk, sınırdan büyük son sayfaya gider."
      >
        <Pagination
          aria-label="Uzun liste sayfaları"
          current={long}
          totalPages={48}
          onPageChange={setLong}
        />
      </Example>
    </>
  );
}

function PageHeaderExamples() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'open' | 'closed'>('all');
  return (
    <Example title="Liste başlığı" align="start">
      <PageHeader
        title="Formlar"
        description="Sahibi olduğun ya da seninle paylaşılan formlar."
        actions={
          <div className="flex items-center gap-4">
            <Stat label="Açık" value={3} />
            <Stat label="Yanıt" value="1.747" />
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput value={query} onValueChange={setQuery} placeholder="Form ara" />
          <FilterPills
            aria-label="Durum"
            value={status}
            onValueChange={setStatus}
            options={[
              { value: 'all', label: 'Tümü', count: 6 },
              { value: 'open', label: 'Açık', count: 3 },
              { value: 'closed', label: 'Kapalı', count: 3 },
            ]}
          />
          <div className="ml-auto flex items-center gap-2">
            <IconButton icon={ArrowDownUp} label="Sırala" variant="ghost" />
            <Button variant="primary">
              <Plus /> Yeni form
            </Button>
          </div>
        </div>
      </PageHeader>
      <p className="text-2xs text-subtle-foreground">
        Arama kutusuna yazınca temizle düğmesi solarak gelir ve gider; filtre hapının dolgusu seçime
        kayar.
      </p>
    </Example>
  );
}

export const OVERLAY_NAVIGATION_EXAMPLES = {
  tooltip: TooltipExamples,
  popover: PopoverExamples,
  drawer: DrawerExamples,
  menu: MenuExamples,
  'app-shell': AppShellExamples,
  'navigation-menu': NavigationMenuExamples,
  'side-nav': SideNavExamples,
  breadcrumbs: BreadcrumbsExamples,
  pagination: PaginationExamples,
  'page-header': PageHeaderExamples,
};
