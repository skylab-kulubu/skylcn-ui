import type { LucideIcon } from 'lucide-react';
import {
  CalendarDays,
  ChartPie,
  Globe,
  LayoutDashboard,
  LoaderCircle,
  Mail,
  OctagonAlert,
  Settings,
  Table2,
  Users,
} from 'lucide-react';

export type Scenario = { href: string; label: string; icon: LucideIcon; description: string };

/** The playground's scenarios, grouped as its sidebar shows them. */
export const SCENARIO_GROUPS: { label: string; scenarios: Scenario[] }[] = [
  {
    label: 'Senaryolar',
    scenarios: [
      {
        href: '/playground',
        label: 'Genel bakış',
        icon: LayoutDashboard,
        description: 'Bir konsolun giriş sayfası: sayılar ve kısa listeler.',
      },
      {
        href: '/playground/members',
        label: 'Üyeler',
        icon: Users,
        description: 'Arama, filtre, sıralama, sayfalama ve satır menüleriyle uzun bir liste.',
      },
      {
        href: '/playground/table',
        label: 'Üye tablosu',
        icon: Table2,
        description: 'DataTable: sayaçlı filtreler, sütunlar, toplu işlem, detay paneli.',
      },
      {
        href: '/playground/analytics',
        label: 'Form analitiği',
        icon: ChartPie,
        description: 'Yanıt akışı, kaynaklar ve soru soru dağılımlar.',
      },
      {
        href: '/playground/mail',
        label: 'Posta',
        icon: Mail,
        description: 'Skymail’in hedef görünümü: klasörler, gönderimler ve onay.',
      },
      {
        href: '/playground/calendar',
        label: 'Etkinlik takvimi',
        icon: CalendarDays,
        description: 'Ay ızgarasında etkinlikler, telefonda gün gün liste.',
      },
      {
        href: '/playground/settings',
        label: 'Ayarlar',
        icon: Settings,
        description: 'Profil alanları, bildirim anahtarları ve görünüm tercihleri.',
      },
    ],
  },
  {
    label: 'Siteler',
    scenarios: [
      {
        href: '/site',
        label: 'Kulüp sitesi',
        icon: Globe,
        description: 'Panel dışı kullanım: bir etkinliğin tanıtım sayfası.',
      },
    ],
  },
  {
    label: 'Durumlar',
    scenarios: [
      {
        href: '/playground/states',
        label: 'Durum ekranları',
        icon: LoaderCircle,
        description: 'Yükleniyor, boş, hata ve yetki yok ekranları.',
      },
      {
        href: '/playground/status',
        label: 'Hata ve yönlendirme',
        icon: OctagonAlert,
        description: '404, 403, 500 ve giriş yönlendirmesi.',
      },
    ],
  },
];

export const SCENARIOS = SCENARIO_GROUPS.flatMap((group) => group.scenarios);
