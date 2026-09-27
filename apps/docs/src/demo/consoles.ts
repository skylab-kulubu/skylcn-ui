import type { ClubConsole } from '@skylab-kulubu/skylcn-ui';
import { Cloud, FileText, FlaskConical, Mail, ShieldCheck } from 'lucide-react';

/** The club consoles the demo shells switch between; only Playground and Forms exist here. */
export const CONSOLES: ClubConsole[] = [
  {
    id: 'playground',
    label: 'Playground',
    href: '/playground',
    icon: FlaskConical,
    description: 'Bileşenler gerçek senaryolarda',
  },
  {
    id: 'forms',
    label: 'Forms',
    href: '/forms',
    icon: FileText,
    description: 'Formlar ve başvurular',
  },
  {
    id: 'admin',
    label: 'Yönetim',
    href: '#admin',
    icon: ShieldCheck,
    description: 'Üyeler, etkinlikler, duyurular',
  },
  {
    id: 'mail',
    label: 'Mail',
    href: '#mail',
    icon: Mail,
    description: 'Toplu e-posta ve listeler',
  },
  {
    id: 'cloud',
    label: 'Cloud',
    href: '#cloud',
    icon: Cloud,
    description: 'Dosyalar ve ortak belgeler',
  },
];
