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
  StatCard,
} from '@skylab-kulubu/skylcn-ui';
import { CalendarDays, FileText, Megaphone, Plus, Users } from 'lucide-react';
import { MEMBERS } from '../../demo/members';

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
  {
    id: 'e4',
    day: '02',
    month: 'Kas',
    title: 'YıldızJam tanıtım',
    place: 'Yıldız, Oditoryum',
    state: 'Taslak',
  },
];

const newest = [...MEMBERS].sort((a, b) => (a.joined < b.joined ? 1 : -1)).slice(0, 5);
const active = MEMBERS.filter((member) => member.status === 'active').length;

export default function Overview() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Genel bakış"
        description="Kulübün bu dönemki durumu: üyeler, etkinlikler ve bekleyen işler."
        actions={
          <Button variant="primary">
            <Plus /> Etkinlik oluştur
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Aktif üye"
          value={active}
          icon={Users}
          delta="+18"
          deltaTone="positive"
          hint="Bu dönem"
        />
        <StatCard
          label="Etkinlik"
          value={EVENTS.length}
          icon={CalendarDays}
          hint="Önümüzdeki 6 hafta"
        />
        <StatCard
          label="Açık başvuru"
          value={412}
          icon={FileText}
          delta="+57"
          deltaTone="positive"
          hint="Son 7 gün"
        />
        <StatCard label="Duyuru" value={3} icon={Megaphone} delta="-2" hint="Yayında" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
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
            </ListPanel>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="min-w-0">
              <CardTitle>Yeni katılanlar</CardTitle>
              <CardDescription>Son kaydolan beş üye.</CardDescription>
            </div>
          </CardHeader>
          <div className="p-2">
            <ListPanel status={{ kind: 'ready' }} framed={false}>
              {newest.map((member) => (
                <ListItem
                  key={member.id}
                  href="/playground/members"
                  title={member.name}
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
