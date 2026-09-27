'use client';

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
  ListItem,
  ListPanel,
  PageHeader,
  SegmentedControl,
  StatCard,
} from '@skylab-kulubu/skylcn-ui';
import { AreaChart, BarChart, DonutChart, LineChart } from '@skylab-kulubu/skylcn-ui/charts';
import { CalendarDays, FileText, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { MEMBERS, TEAMS } from '../../demo/members';
import { monthly, sum, type Range } from '../../demo/metrics';

const EVENTS = [
  {
    id: 'e1',
    day: '04',
    month: 'Eki',
    title: 'Gece Kodu 2026',
    place: 'Davutpaşa, Kongre Merkezi',
    state: 'Başvuru açık',
  },
  {
    id: 'e2',
    day: '11',
    month: 'Eki',
    title: 'Web atölyesi: Base UI ile formlar',
    place: 'Çevrim içi',
    state: 'Kayıt açık',
  },
  {
    id: 'e3',
    day: '23',
    month: 'Eki',
    title: 'SkySec CTF hazırlık',
    place: 'B blok, 204',
    state: 'Taslak',
  },
];

const newest = [...MEMBERS].sort((a, b) => (a.joined < b.joined ? 1 : -1)).slice(0, 5);
const byStatus = (status: string) => MEMBERS.filter((member) => member.status === status).length;
const byTeam = TEAMS.map((team) => ({
  team,
  members: MEMBERS.filter((member) => member.team === team && member.status === 'active').length,
})).sort((a, b) => b.members - a.members);

export default function Overview() {
  const [range, setRange] = useState<Range>('6m');
  const data = monthly(range);
  const trend = monthly('12m').map((row) => row.attendance);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Genel bakış"
        description="Kulübün bu dönemki durumu: üyeler, etkinlikler ve başvurular."
        actions={
          <Button variant="primary">
            <Plus /> Etkinlik oluştur
          </Button>
        }
      >
        <SegmentedControl
          aria-label="Dönem"
          value={range}
          onValueChange={(value) => setRange(value as Range)}
          options={[
            { value: '3m', label: 'Son 3 ay' },
            { value: '6m', label: 'Son 6 ay' },
            { value: '12m', label: 'Son 12 ay' },
          ]}
        />
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Aktif üye"
          value={byStatus('active')}
          icon={Users}
          delta="+18"
          deltaTone="positive"
          hint="Geçen döneme göre"
        />
        <StatCard
          label="Katılım"
          value={sum(range, 'attendance').toLocaleString('tr-TR')}
          icon={CalendarDays}
          hint="Seçili dönemde"
          trend={trend}
        />
        <StatCard
          label="Etkinlik"
          value={sum(range, 'workshops') + sum(range, 'talks') + sum(range, 'contests')}
          icon={CalendarDays}
          hint="Atölye, konuşma, yarışma"
        />
        <StatCard
          label="Açık başvuru"
          value={412}
          icon={FileText}
          delta="+57"
          deltaTone="positive"
          hint="Son 7 gün"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <AreaChart
          className="xl:col-span-2"
          title="Etkinlik katılımı"
          description="Aylara göre toplam katılımcı"
          data={data}
          x="month"
          xLabel="Ay"
          series={{ attendance: { label: 'Katılımcı' } }}
        />
        <DonutChart
          title="Üye durumu"
          description="Kayıtlı 124 üye"
          data={[
            { key: 'active', label: 'Aktif', value: byStatus('active') },
            { key: 'inactive', label: 'Pasif', value: byStatus('inactive') },
            { key: 'alumni', label: 'Mezun', value: byStatus('alumni') },
          ]}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <BarChart
          stacked
          title="Etkinlik türleri"
          description="Ayda düzenlenen etkinlikler"
          data={data}
          x="month"
          xLabel="Ay"
          series={{
            workshops: { label: 'Atölye' },
            talks: { label: 'Konuşma' },
            contests: { label: 'Yarışma' },
          }}
        />
        <LineChart
          title="Form başvuruları"
          description="Etkinlik başvurularının aylık seyri"
          data={data}
          x="month"
          xLabel="Ay"
          series={{
            geceKodu: { label: 'Gece Kodu' },
            yildizJam: { label: 'YıldızJam' },
            artlab: { label: 'ARTLAB' },
          }}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <BarChart
          className="lg:col-span-2"
          orientation="horizontal"
          title="Ekiplere göre aktif üye"
          data={byTeam}
          x="team"
          xLabel="Ekip"
          height={260}
          series={{ members: { label: 'Aktif üye' } }}
        />
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="min-w-0">
              <CardTitle>Yaklaşan etkinlikler</CardTitle>
              <CardDescription>Tarihi yaklaşanlar önce.</CardDescription>
            </div>
            <CardAction>
              <Button variant="ghost" size="sm">
                Tümü
              </Button>
            </CardAction>
          </CardHeader>
          <div className="p-2">
            <ListPanel status={{ kind: 'ready' }} framed={false}>
              {EVENTS.map((event) => (
                <ListItem
                  key={event.id}
                  href="#event"
                  title={event.title}
                  subtitle={event.place}
                  leading={
                    <span className="grid w-10 shrink-0 place-items-center rounded-md border border-border py-1 leading-none">
                      <span className="text-sm font-semibold text-foreground tabular-nums">
                        {event.day}
                      </span>
                      <span className="mt-0.5 text-3xs text-subtle-foreground uppercase">
                        {event.month}
                      </span>
                    </span>
                  }
                  trailing={
                    <Badge tone={event.state === 'Taslak' ? 'neutral' : 'brand'}>
                      {event.state}
                    </Badge>
                  }
                />
              ))}
              {newest.slice(0, 2).map((member) => (
                <ListItem
                  key={member.id}
                  href="/playground/members"
                  title={`${member.name} kulübe katıldı`}
                  subtitle={member.team}
                  leading={<Avatar name={member.name} size="sm" />}
                />
              ))}
            </ListPanel>
          </div>
        </Card>
      </div>
    </div>
  );
}
