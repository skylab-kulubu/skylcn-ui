/** Every page of the component library in the playground, in the order the side navigation lists them. */

export type Category =
  'foundations' | 'actions' | 'forms' | 'overlays' | 'navigation' | 'data' | 'charts' | 'motion';

export const CATEGORY_LABEL: Record<Category, string> = {
  foundations: 'Temeller',
  actions: 'Eylemler',
  forms: 'Form',
  overlays: 'Katmanlar',
  navigation: 'Gezinme',
  data: 'Veri',
  charts: 'Grafikler',
  motion: 'Hareket',
};

export type Entry = {
  slug: string;
  name: string;
  category: Category;
  description: string;
  /** Names imported from the package; empty for foundation pages. */
  imports: string[];
  /** Imported from the charts entry point instead of the main one. */
  charts?: boolean;
  a11y?: string[];
  motion?: string[];
};

export const ENTRIES: Entry[] = [
  {
    slug: 'colors',
    name: 'Renkler',
    category: 'foundations',
    description:
      'Yüzeyler, metin tonları, marka lilası, durum renkleri ve grafik paleti. Her değer iki temada ayrı seçildi.',
    imports: [],
    a11y: [
      'Okunacak her metin tonu her yüzeyde en az 4.5:1 kontrastta.',
      'faint yalnızca süs ve devre dışı öğeler için; okunacak metinde kullanılmaz.',
      'Yüksek kontrast isteyen okura sessiz metin ve çizgiler bir kademe güçlenir.',
    ],
  },
  {
    slug: 'typography',
    name: 'Tipografi',
    category: 'foundations',
    description:
      'Space Grotesk ve Space Mono; Tailwind ölçeğinin altında etiketler için küçük bir ölçek.',
    imports: [],
    a11y: ['En küçük metin 10px; bu boyutta yalnızca büyük harfli etiketler ve sayaçlar yazılır.'],
  },
  {
    slug: 'motion',
    name: 'Hareket',
    category: 'foundations',
    description:
      'Süreler, eğriler, yay ve mesafeler token olarak tanımlı; CSS ve motion aynı değerleri kullanır.',
    imports: ['motionTokens', 'transitions', 'useMotionPreference'],
    motion: [
      'Hareket yalnızca bir şeyin nereden gelip nereye gittiğini ya da durumunun değiştiğini anlatıyorsa kullanılır.',
      'Hareketi azalt tercihinde kısa solmalar kalır; kayma, büyüme ve yer değiştirme kalkar.',
      'Tercih sistemden gelir ya da ürün içinden data-motion="reduced" ile açılır.',
    ],
  },
  {
    slug: 'brand',
    name: 'Marka ve yükleyici',
    category: 'foundations',
    description: 'SKY LAB işareti ve merkezden dışa doğru yanan yükleme göstergesi.',
    imports: ['SkylabMark', 'SkylabLoader'],
    motion: ['Yükleyici hareketi azalt tercihinde durur ve işaret sabit görünür.'],
  },
  {
    slug: 'button',
    name: 'Button',
    category: 'actions',
    description:
      'Birincil, dolu, çerçeveli, sade, yıkıcı ve bağlantı görünümlü butonlar; bekleme durumuyla.',
    imports: ['Button', 'IconButton'],
    a11y: [
      'IconButton adını label ile zorunlu alır; ekran okuyucu ve ipucu aynı adı okur.',
      'Beklerken aria-busy taşır ve kilitlenir, çift gönderim olmaz.',
      'Dokunmatik ekranda yükseklik büyür.',
    ],
    motion: [
      'Yükleyici ancak bekleme 150ms sürerse görünür, göründüyse en az 400ms kalır; buton genişliği değişmez.',
      'Basınca bir piksel iner.',
    ],
  },
  {
    slug: 'icon-swap',
    name: 'IconSwap',
    category: 'actions',
    description: 'Aynı yerde iki ikon: durum değişince birbirine karışarak geçer.',
    imports: ['IconSwap'],
    motion: ['Solma, küçülme ve hafif bulanıklıkla geçer; hareketi azaltınca yalnızca solar.'],
  },
  {
    slug: 'copy-button',
    name: 'CopyButton',
    category: 'actions',
    description: 'Bir değeri panoya kopyalar, bir an tik gösterir.',
    imports: ['CopyButton'],
    a11y: ['Kopyalandığında ekran okuyucuya bir kez "Kopyalandı" söyler.'],
  },
  {
    slug: 'segmented-control',
    name: 'SegmentedControl',
    category: 'actions',
    description: 'Birbirini dışlayan birkaç seçenek; seçili olanın vurgusu kayar.',
    imports: ['SegmentedControl'],
    a11y: ['Yalnız ikonlu seçenekler adını ipucu ve erişilebilir ad olarak taşır.'],
    motion: ['Vurgu seçime doğru kayar.'],
  },
  {
    slug: 'field',
    name: 'Field ve Input',
    category: 'forms',
    description:
      'Etiket, alan, açıklama ve hata tek yerde; alanlar ikonlu ve küçük boyutlu olabilir.',
    imports: ['Field', 'Input', 'Textarea', 'Label'],
    a11y: [
      'Etiket, açıklama ve hata alana bağlıdır; hata varken alan geçersiz olarak işaretlenir.',
      'Dokunmatik ekranda yazı 16px olur, iOS alana yakınlaşmaz.',
    ],
    motion: ['Hata mesajı yüksekliğiyle açılır ve kapanır; kapanırken metni boşalmaz.'],
  },
  {
    slug: 'select',
    name: 'Select',
    category: 'forms',
    description: 'Kutu ya da satır içi görünümde, ipuçlu ve devre dışı seçenekli açılır liste.',
    imports: ['Select'],
    a11y: ['Görünür etiketi olmayan her Select aria-label alır.'],
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    category: 'forms',
    description:
      'Seçili, seçili değil ve kısmen seçili durumlarıyla onay kutusu; dokunma alanı büyütülmüş.',
    imports: ['Checkbox'],
    a11y: [
      'Onay kutuları hiçbir zaman izin ya da abonelik için varsayılan olarak işaretli gelmez.',
    ],
  },
  {
    slug: 'switch',
    name: 'Switch ve ToggleRow',
    category: 'forms',
    description: 'Aç/kapa anahtarı ve başlığı, açıklaması olan ayar satırı.',
    imports: ['Switch', 'ToggleRow'],
    a11y: ['Tek başına kullanılan Switch aria-label alır; ToggleRow başlığını ad olarak verir.'],
  },
  {
    slug: 'radio-group',
    name: 'RadioGroup',
    category: 'forms',
    description: 'Birbirini dışlayan birkaç seçenek, açıklamalarıyla alt alta.',
    imports: ['RadioGroup', 'Radio'],
    a11y: ['Grup bir ad alır; ok tuşları seçenekler arasında gezer, satırın tamamı tıklanır.'],
  },
  {
    slug: 'dialog',
    name: 'Dialog ve ConfirmDialog',
    category: 'overlays',
    description:
      'Kısa bir iş için pencere; geri alınamaz eylemler için eylemini adıyla söyleyen onay penceresi.',
    imports: [
      'Dialog',
      'DialogTrigger',
      'DialogContent',
      'DialogHeader',
      'DialogTitle',
      'ConfirmDialog',
    ],
    a11y: [
      'Odak pencerenin içinde kalır, Esc kapatır, kapanınca tetikleyiciye döner.',
      'ConfirmDialog odağı Vazgeç’te başlatır; eylem düğmesi ne olacağını söyler ("Formu sil"), asla "Tamam" değil.',
      'Geri alınabilen işlerde soru yerine "Geri al" düğmeli bir bildirim tercih edilir.',
    ],
    motion: ['Geniş ekranda ortada hafif büyüyerek, telefonda alttan kayarak açılır.'],
  },
  {
    slug: 'toast',
    name: 'Toast',
    category: 'overlays',
    description: 'Bir işin sonucunu söyleyen kısa bildirim; istenirse geri alma düğmesiyle.',
    imports: ['ToastProvider', 'useToast'],
    a11y: [
      'Bildirimler ekran okuyucuya duyurulur; üzerine gelince ya da odaklanınca süre durur.',
      'Hata ve eylem içeren bildirimler kendiliğinden kaybolmaz.',
    ],
    motion: [
      'Alttan yığılarak gelir, üzerine gelince açılır; sağa ya da aşağı kaydırılarak kapatılır.',
    ],
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    category: 'overlays',
    description: 'Kısa bir ipucu; aynı sağlayıcı altındaki ipuçları arasında gecikmesiz geçilir.',
    imports: ['Tooltip', 'TooltipProvider'],
    a11y: ['İpucu yalnızca ek bilgi taşır; bir kontrolün tek adı olmaz.'],
    motion: ['Tetikleyiciden büyüyerek ve açıldığı yönden süzülerek gelir.'],
  },
  {
    slug: 'popover',
    name: 'Popover',
    category: 'overlays',
    description: 'Filtreler, paylaşım seçenekleri gibi yüzen paneller.',
    imports: ['Popover', 'PopoverTrigger', 'PopoverContent', 'PopoverTitle'],
    motion: ['Tetikleyiciden büyüyerek açılır; hareketi azaltınca yalnızca solar.'],
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    category: 'overlays',
    description: 'Kenardan kayan panel: detaylar, ayarlar, telefonda gezinme.',
    imports: [
      'Drawer',
      'DrawerTrigger',
      'DrawerContent',
      'DrawerHeader',
      'DrawerTitle',
      'DrawerBody',
    ],
    a11y: ['Odak panelin içinde kalır, Esc kapatır, kapanınca odak tetikleyiciye döner.'],
    motion: ['Yay eğrisiyle açılır, çıkış eğrisiyle daha hızlı kapanır.'],
  },
  {
    slug: 'menu',
    name: 'Menu',
    category: 'overlays',
    description:
      'Açılır menü ve sağ tık menüsü aynı öğelerle: ikon, kısayol, grup, alt menü, onay ve seçim.',
    imports: [
      'DropdownMenu',
      'DropdownMenuTrigger',
      'DropdownMenuContent',
      'ContextMenu',
      'MenuItem',
    ],
    a11y: ['Ok tuşlarıyla gezilir; yıkıcı öğeler renginin yanında ikonuyla da ayrılır.'],
  },
  {
    slug: 'app-shell',
    name: 'AppShell',
    category: 'navigation',
    description:
      'Konsolların ortak çerçevesi: daralan kenar çubuğu, konsol seçici, profil menüsü, telefonda çekmece.',
    imports: ['AppShell', 'SidebarBrand', 'SidebarItem', 'SidebarUser'],
    a11y: [
      '"İçeriğe geç" bağlantısı ilk Tab ile görünür.',
      'Ctrl/⌘+B kenar çubuğunu daraltır; yazı alanlarında kalın yazı kısayoluna dokunmaz.',
    ],
    motion: ['Aktif öğenin vurgusu sayfa değişince yeni öğeye süzülür.'],
  },
  {
    slug: 'side-nav',
    name: 'SideNav',
    category: 'navigation',
    description:
      'Sayfanın kendi gezinmesi: bu listedeki gibi bileşenler, bir posta kutusunun klasörleri, ayar bölümleri.',
    imports: ['SideNav', 'SideNavLayout'],
    a11y: ['Geniş ekranda yapışkan sütun, dar ekranda paneli açan bir buton.'],
    motion: ['Aktif vurgu seçilen öğeye süzülür.'],
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    category: 'navigation',
    description: 'Aynı sayfanın bölümleri arasında geçiş; sığmayınca yana kayar.',
    imports: ['Tabs', 'TabsList', 'Tab', 'TabsPanel'],
    a11y: ['Ok tuşlarıyla sekmeler arasında gezilir; seçili sekme ekran okuyucuya söylenir.'],
    motion: ['Alt çizgi seçilen sekmeye kayar, içerik solarak gelir.'],
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    category: 'navigation',
    description: 'Başlıkları altında açılan bölümler: sık sorulan sorular, uzun ayarlar.',
    imports: ['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionPanel'],
    motion: ['Bölüm doğal yüksekliğine açılır, ok döner.'],
  },
  {
    slug: 'breadcrumbs',
    name: 'Breadcrumbs',
    category: 'navigation',
    description: 'Sayfa yolu; dar ekranda üst sayfaya dönen tek bir bağlantıya kısalır.',
    imports: ['Breadcrumbs'],
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    category: 'navigation',
    description:
      'Geçerli sayfanın çevresini gösteren sayfalama; geçerli sayfaya numara yazılabilir.',
    imports: ['Pagination'],
    a11y: [
      'Yazılabilir alan yalnızca rakam alır, ilk ve son sayfa arasında tutulur; Esc eski değere döner.',
      'Dar ekranda "4 / 12" görünümüne geçer.',
    ],
  },
  {
    slug: 'page-header',
    name: 'PageHeader',
    category: 'navigation',
    description: 'Başlık, açıklama, eylemler ve arama, filtre hapları gibi araçlar.',
    imports: ['PageHeader', 'SearchInput', 'FilterPills', 'Stat'],
    motion: ['Filtre hapının dolgusu seçime doğru kayar, sayılar akar.'],
  },
  {
    slug: 'data-list',
    name: 'DataList',
    category: 'data',
    description:
      'Sütunları ekran genişliğine göre gizlenen, sıralanabilir başlıklı, satırları bağlantı olabilen liste.',
    imports: [
      'DataList',
      'DataListHeader',
      'DataListColumnHeader',
      'DataListBody',
      'DataListRow',
      'DataListCell',
    ],
    a11y: [
      'Tablo rolleriyle okunur; satır bağlantısı ilk görünür hücrenin içindedir.',
      'Yalnız ikonlu sütun başlıkları label ile adlandırılır.',
    ],
    motion: [
      'Liste ilk dolduğunda satırlar sırayla gelir; sonraki arama ve sayfa değişimleri yerinde olur.',
      'Sıralama değişince satırlar yeni yerlerine kayar.',
    ],
  },
  {
    slug: 'list-panel',
    name: 'ListPanel',
    category: 'data',
    description: 'Kendi yükleniyor ve boş durumunu gösteren basit satır listesi.',
    imports: ['ListPanel', 'ListItem', 'listStatus'],
    motion: ['Yükleniyor, boş ve dolu durumları birbirine solar.'],
  },
  {
    slug: 'card',
    name: 'Card ve StatCard',
    category: 'data',
    description: 'İçerik kartı ve pano sayı kartı: etiket, değer, değişim ve trend çizgisi.',
    imports: ['Card', 'CardHeader', 'CardTitle', 'CardContent', 'StatCard'],
    a11y: ['CardTitle başlık seviyesini sayfanın düzenine göre alır.'],
    motion: ['StatCard değeri değişince yeni değerine akar.'],
  },
  {
    slug: 'badge',
    name: 'Badge ve StatusDot',
    category: 'data',
    description: 'Rol, sayı, durum etiketleri ve canlı durumlar için parlayan nokta.',
    imports: ['Badge', 'StatusDot'],
    a11y: ['StatusDot label alır; durum yalnızca renkle anlatılmaz.'],
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    category: 'data',
    description: 'Fotoğraf, yoksa baş harfler, yoksa kişi ikonu. Kişiler yuvarlak, ekipler köşeli.',
    imports: ['Avatar'],
  },
  {
    slug: 'bar-list',
    name: 'BarList',
    category: 'data',
    description:
      'Uzun etiketli kategoriler ince çubuklarla: bir sorunun cevapları, soruların cevaplanma oranı.',
    imports: ['BarList'],
    motion: ['Çubuklar yeni değerlerine uzar.'],
  },
  {
    slug: 'proportion-bar',
    name: 'ProportionBar',
    category: 'data',
    description: 'Bir bütünün birkaç parçası tek çubukta, altında sayılar ve paylarla.',
    imports: ['ProportionBar'],
  },
  {
    slug: 'trend',
    name: 'TrendBadge ve Sparkline',
    category: 'data',
    description: 'Önceki döneme göre değişim ve eksensiz küçük trend çizgisi.',
    imports: ['TrendBadge', 'Sparkline'],
    a11y: ['Yön okla da gösterilir; artışın iyi mi kötü mü olduğu riseIsGood ile belirlenir.'],
  },
  {
    slug: 'state-card',
    name: 'StateCard ve Skeleton',
    category: 'data',
    description: 'Yükleniyor, boş, hata ve yetki yok ekranları; içerik yerine iskelet.',
    imports: ['StateCard', 'Skeleton'],
    motion: ['Hareketi azaltınca iskeletin parıltısı durur.'],
  },
  {
    slug: 'area-chart',
    name: 'AreaChart',
    category: 'charts',
    description: 'Zaman içindeki değişim; tek seride marka lilasıyla kaybolan bir dolgu.',
    imports: ['AreaChart'],
    charts: true,
    a11y: [
      'Her grafik tablo görünümüne geçebilir; değerler fareye ya da tooltip’e bağlı kalmaz.',
      'Grafik klavyeyle odaklanır, ok tuşları noktalar arasında gezer.',
    ],
    motion: ['Çizim animasyonu hareketi azalt tercihinde kapanır.'],
  },
  {
    slug: 'line-chart',
    name: 'LineChart',
    category: 'charts',
    description: 'Aynı zaman aralığında birkaç serinin eğilimi.',
    imports: ['LineChart'],
    charts: true,
    a11y: ['İki ve daha fazla seride gösterge vardır; seriye tıklamak onu gizler.'],
  },
  {
    slug: 'bar-chart',
    name: 'BarChart',
    category: 'charts',
    description: 'Yan yana, yığılmış ya da yatay çubuklar.',
    imports: ['BarChart'],
    charts: true,
  },
  {
    slug: 'donut-chart',
    name: 'DonutChart',
    category: 'charts',
    description: 'En fazla altı parçalı bütün; fazlası "Diğer"e katlanır.',
    imports: ['DonutChart'],
    charts: true,
  },
  {
    slug: 'reveal',
    name: 'Reveal',
    category: 'motion',
    description:
      'Bir kez, kardeşleriyle sırayla yükselerek gelen içerik; istenirse görünür olunca.',
    imports: ['Reveal'],
  },
  {
    slug: 'collapse',
    name: 'Collapse',
    category: 'motion',
    description: 'Doğal yüksekliğine açılan ve kapanan içerik.',
    imports: ['Collapse'],
  },
  {
    slug: 'swap',
    name: 'Swap',
    category: 'motion',
    description: 'İçeriği yön duyarlı bir geçişle değiştirir: sekmeler, adımlar, aylar.',
    imports: ['Swap'],
  },
  {
    slug: 'animated-number',
    name: 'AnimatedNumber',
    category: 'motion',
    description: 'Değeri değişince yeni değerine akan sayı; ilk görünüşte akmaz.',
    imports: ['AnimatedNumber'],
    a11y: ['Ekran okuyucu ara değerleri değil yalnızca son değeri duyar.'],
  },
];

export const ORDER: Category[] = [
  'foundations',
  'actions',
  'forms',
  'overlays',
  'navigation',
  'data',
  'charts',
  'motion',
];

export const entryHref = (slug: string) => `/playground/components/${slug}`;
