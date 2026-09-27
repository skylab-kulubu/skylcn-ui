import type { LucideIcon } from 'lucide-react';
import { ChartPie, LayoutDashboard, LoaderCircle, Settings, Users } from 'lucide-react';

export type Scenario = { href: string; label: string; icon: LucideIcon; description: string };

/** The playground's scenarios, grouped as its sidebar shows them. */
export const SCENARIO_GROUPS: { label: string; scenarios: Scenario[] }[] = [
  {
    label: 'Sayfalar',
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
        href: '/playground/analytics',
        label: 'Form analitiği',
        icon: ChartPie,
        description: 'Yanıt akışı, kaynaklar ve soru soru dağılımlar.',
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
    label: 'Durumlar',
    scenarios: [
      {
        href: '/playground/states',
        label: 'Durum ekranları',
        icon: LoaderCircle,
        description: 'Yükleniyor, boş, hata ve yetki yok ekranları.',
      },
    ],
  },
];

export const SCENARIOS = SCENARIO_GROUPS.flatMap((group) => group.scenarios);
