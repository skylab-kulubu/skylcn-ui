import type { ClubConsole } from '@skylab-kulubu/skylcn-ui';
import { Cloud, FileText, FlaskConical, Mail, ShieldCheck } from 'lucide-react';
import { HOSTED_IN_ADMIN } from './hosting';

/** The club consoles the demo shells switch between; only Playground and Forms exist here. */
const DEMO_CONSOLES: ClubConsole[] = [
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

// Read one by one so Next inlines them at build time
const REAL_URLS: Record<string, string | undefined> = {
  admin: process.env.NEXT_PUBLIC_ADMIN_URL,
  forms: process.env.NEXT_PUBLIC_FORMS_ADMIN_URL,
  mail: process.env.NEXT_PUBLIC_MAIL_URL,
};

/** In the admin panel only the consoles that environment runs, at their real addresses. */
export const CONSOLES: ClubConsole[] = HOSTED_IN_ADMIN
  ? DEMO_CONSOLES.flatMap((app) => {
      if (app.id === 'playground') return [app];
      const href = REAL_URLS[app.id];
      return href ? [{ ...app, href }] : [];
    })
  : DEMO_CONSOLES;
