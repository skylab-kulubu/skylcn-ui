'use client';

import { PageHeader, StatCard } from '@skylab-kulubu/skylcn-ui';
import { AreaChart, DonutChart } from '@skylab-kulubu/skylcn-ui/charts';
import { CalendarDays, Users } from 'lucide-react';

// Made-up figures; replace with the page's own data.
const MONTHS = [
  { month: 'Haz', applications: 120 },
  { month: 'Tem', applications: 95 },
  { month: 'Ağu', applications: 140 },
  { month: 'Eyl', applications: 310 },
  { month: 'Eki', applications: 412 },
];

const MEMBERSHIP = [
  { key: 'active', label: 'Aktif', value: 85 },
  { key: 'passive', label: 'Pasif', value: 16 },
  { key: 'graduate', label: 'Mezun', value: 23 },
];

/** An overview page: a row of figures, a trend over time and a part-of-whole. */
export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Genel bakış" description="Kulübün bu dönemki durumu." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Aktif üye"
          value="85"
          delta="+18"
          deltaTone="positive"
          icon={Users}
          hint="Geçen döneme göre"
        />
        <StatCard label="Etkinlik" value="43" icon={CalendarDays} hint="Bu dönem" />
        <StatCard
          label="Açık başvuru"
          value="412"
          delta="+57"
          deltaTone="positive"
          hint="Son 7 gün"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <AreaChart
          className="lg:col-span-2"
          title="Başvurular"
          data={MONTHS}
          x="month"
          series={{ applications: { label: 'Başvuru' } }}
        />
        <DonutChart title="Üye durumu" data={MEMBERSHIP} />
      </div>
    </div>
  );
}
