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
    slug: 'combobox',
    name: 'Combobox ve MultiSelect',
    category: 'forms',
    description:
      'Uzun listeden yazarak seçim; çoklu seçimde seçilenler kaldırılabilir çipler olur.',
    imports: ['Combobox', 'MultiSelect'],
    a11y: [
      'Liste yazdıkça daralır; ok tuşları gezinir, Enter seçer, Esc kapatır.',
      'Çipler Backspace ile silinir ve her birinin kaldırma düğmesi adını söyler.',
    ],
    motion: ['Liste tetikleyiciden büyüyerek açılır, eklenen çip solarak gelir.'],
  },
  {
    slug: 'number-field',
    name: 'NumberField ve Slider',
    category: 'forms',
    description: 'Adımlı sayı alanı; tek değer ya da iki uçlu aralık için kaydırıcı.',
    imports: ['NumberField', 'Slider'],
    a11y: [
      'Ok tuşları bir, Shift ile on adım değiştirir; yazılan değer sınırlar içinde tutulur.',
      'Etiketi görünmeyen kaydırıcı tutamaçları thumbLabels ile adlandırılır.',
    ],
  },
  {
    slug: 'date-picker',
    name: 'DatePicker ve Calendar',
    category: 'forms',
    description: 'Takvimle gün ya da aralık seçimi; aralıkta hazır seçenekler önce gelir.',
    imports: ['DatePicker', 'DateRangePicker', 'Calendar'],
    a11y: [
      'Ok tuşları günler, PageUp ve PageDown aylar arasında gezer.',
      'Türkçede hafta pazartesi başlar; tarih okura kendi dilinde yazılır.',
    ],
  },
  {
    slug: 'dropzone',
    name: 'Dropzone',
    category: 'forms',
    description: 'Dosya bırakma alanı; tıklayınca dosya seçici açılır.',
    imports: ['Dropzone'],
    a11y: ['Sürükleyip bırakmak tek yol değildir; alan bir dosya seçicisine bağlı etiket taşır.'],
    motion: ['Dosya üstünde tutulunca çerçeve ve ikon canlanır.'],
  },
  {
    slug: 'otp-field',
    name: 'OTPField',
    category: 'forms',
    description: 'Tek kullanımlık kod; her karakter için bir kutu.',
    imports: ['OTPField'],
    a11y: [
      'Kodun tamamı yapıştırılabilir ve şifre yöneticileri doldurabilir; yapıştırma engellenmez.',
      'Her kutu kaçıncı karakter olduğunu söyler.',
    ],
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
    slug: 'command',
    name: 'CommandPalette',
    category: 'overlays',
    description: 'Ctrl/⌘+K ile açılan, uygulamanın tüm sayfa ve işlemlerinde arama.',
    imports: ['CommandPalette', 'useCommandShortcut'],
    a11y: [
      'Ok tuşları gezer, Enter açar, Esc kapatır; etkin satır ekran okuyucuya bildirilir.',
      'Arama aksanları ve noktasız ı’yı eşit sayar: "uyeler" yazmak "Üyeler"i bulur.',
    ],
    motion: ['Hafif büyüyerek açılır.'],
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
    description:
      'Sağdan, soldan ya da alttan kayan panel: detaylar, ayarlar, paylaşım; kaydırarak kapanır.',
    imports: [
      'Drawer',
      'DrawerTrigger',
      'DrawerContent',
      'DrawerHeader',
      'DrawerTitle',
      'DrawerBody',
    ],
    a11y: ['Odak panelin içinde kalır, Esc kapatır, kapanınca odak tetikleyiciye döner.'],
    motion: [
      'Yay eğrisiyle açılır; kaydırırken parmağı izler, bırakınca kaydırmanın hızıyla kapanır.',
      'Hareketi azaltınca kaymadan solarak açılıp kapanır.',
    ],
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
    slug: 'navigation-menu',
    name: 'NavigationMenu',
    category: 'navigation',
    description:
      'Tanıtım sitelerinin üst menüsü: öğeler bağlantı panelleri açar, panel öğeler arasında kayar.',
    imports: ['NavigationMenu', 'NavigationMenuItem', 'NavigationMenuLink'],
    a11y: ['Ok tuşları öğeler arasında gezer; Esc paneli kapatır ve odağı öğeye döndürür.'],
    motion: [
      'Panel boyutunu değiştirerek bir öğeden diğerine kayar; hareketi azaltınca yalnızca solar.',
    ],
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
    slug: 'stepper',
    name: 'Stepper',
    category: 'navigation',
    description: 'Çok adımlı bir işin nerede olduğu: tamamlananlar işaretli, geçerli olan halkalı.',
    imports: ['Stepper'],
    a11y: ['Geçerli adım aria-current="step" taşır.'],
    motion: [
      'Adımlar arasındaki çizgi ilerledikçe dolar; içerik için Swap ile birlikte kullanılır.',
    ],
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
    slug: 'description-list',
    name: 'DescriptionList ve AvatarGroup',
    category: 'data',
    description: 'Detay sayfaları için etiketli bilgiler ve üst üste binen kişi avatarları.',
    imports: ['DescriptionList', 'AvatarGroup'],
  },
  {
    slug: 'tree',
    name: 'Tree',
    category: 'data',
    description: 'İç içe öğeler: Keycloak grupları, klasörler, ekip yapısı.',
    imports: ['Tree'],
    a11y: [
      'Sekmeyle tek satır odak alır; oklar gezer, sağ ok açar ya da içeri girer, sol ok kapatır ya da üste çıkar.',
      'Home ve End ilk ve son satıra gider, Enter seçer.',
    ],
    motion: ['Dal doğal yüksekliğine açılır, ok döner.'],
  },
  {
    slug: 'month-calendar',
    name: 'MonthCalendar',
    category: 'data',
    description: 'Etkinlikleri ay ızgarasında gösteren takvim; telefonda gün gün liste.',
    imports: ['MonthCalendar'],
    motion: ['Aylar gidilen yöne kayar.'],
  },
  {
    slug: 'status-page',
    name: 'StatusPage',
    category: 'data',
    description: 'Tam sayfa durumlar: bulunamadı, yetki yok, sunucu hatası, yönlendirme.',
    imports: ['StatusPage'],
    a11y: ['Yönlendirme sürerken durum ekran okuyucuya bildirilir.'],
  },
  {
    slug: 'timeline',
    name: 'Timeline',
    category: 'data',
    description: 'Olanların sırası: onay geçmişi, üye etkinliği, etkinlik programı.',
    imports: ['Timeline'],
    a11y: ['Sıralı bir liste olarak okunur; tonlar ikon ya da metinle birlikte kullanılır.'],
  },
  {
    slug: 'bulk-bar',
    name: 'BulkBar ve Banner',
    category: 'data',
    description: 'Seçilen satırlar için alttan gelen işlem çubuğu ve sayfa üstü duyuru şeridi.',
    imports: ['BulkBar', 'Banner'],
    a11y: ['BulkBar bir araç çubuğudur ve kaç öğenin seçili olduğunu adında söyler.'],
    motion: ['Seçim olunca yayla yükselir, seçim temizlenince aşağı iner.'],
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
    slug: 'feedback',
    name: 'Notice, Progress ve Meter',
    category: 'data',
    description:
      'Sayfa içi uyarılar, bir işin ilerlemesi ve sınırları belli bir düzey; kısayollar için Kbd.',
    imports: ['Notice', 'Progress', 'Meter', 'Kbd', 'Separator'],
    a11y: [
      'Notice tonunu ikonla da söyler; tehlike tonu ekran okuyucuya hemen duyurulur.',
      'Meter değerini her zaman yazar; eşik renkleri tek başına anlam taşımaz.',
    ],
    motion: ['Dolgular yeni değerlerine uzar.'],
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
