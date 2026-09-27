'use client';

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  DescriptionList,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  IconButton,
  MenuItem,
  MenuSeparator,
  StatusDot,
  Tab,
  Tabs,
  TabsList,
  TabsPanel,
  Timeline,
  ToggleRow,
  useToast,
} from '@skylab-kulubu/skylcn-ui';
import { BarChart } from '@skylab-kulubu/skylcn-ui/charts';
import {
  ArrowLeft,
  CalendarCheck,
  Mail,
  MoreHorizontal,
  PencilLine,
  Trophy,
  UserMinus,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MEMBERS, ROLE_LABEL, STATUS_LABEL } from '../../../../demo/members';

const DOT = { active: 'success', inactive: 'neutral', alumni: 'info' } as const;
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export function MemberDetail({ id }: { id: string }) {
  const member = MEMBERS.find((item) => item.id === id)!;
  const router = useRouter();
  const toast = useToast();
  const [removing, setRemoving] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [notify, setNotify] = useState(true);
  const monthly = ['Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl'].map((month, i) => ({
    month,
    events: Math.max(0, Math.round(((member.events * (i + 2)) % 7) - 1)),
  }));

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/playground/members"
        className="flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Üyeler
      </Link>

      <header className="flex flex-wrap items-center gap-4">
        <Avatar name={member.name} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold text-foreground">{member.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <StatusDot tone={DOT[member.status]} /> {STATUS_LABEL[member.status]}
            </span>
            <Badge>{member.team}</Badge>
            {member.role !== 'member' ? (
              <Badge tone="brand">{ROLE_LABEL[member.role]}</Badge>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button render={<a href={`mailto:${member.email}`} />}>
            <Mail /> E-posta
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger render={<IconButton icon={MoreHorizontal} label="İşlemler" />} />
            <DropdownMenuContent align="end">
              <MenuItem icon={PencilLine}>Düzenle</MenuItem>
              <MenuSeparator />
              <MenuItem icon={UserMinus} destructive onClick={() => setConfirm(true)}>
                Kulüpten çıkar
              </MenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Tabs defaultValue="overview">
        <TabsList>
          <Tab value="overview">Genel</Tab>
          <Tab value="activity">Etkinlikler</Tab>
          <Tab value="admin">Yönetim</Tab>
        </TabsList>
        <TabsPanel value="overview">
          <Card>
            <CardContent>
              <DescriptionList
                columns={3}
                items={[
                  { label: 'E-posta', value: member.email },
                  { label: 'Ekip', value: member.team },
                  { label: 'Rol', value: ROLE_LABEL[member.role] },
                  { label: 'Katıldı', value: formatDate(member.joined) },
                  { label: 'Katıldığı etkinlik', value: member.events },
                  { label: 'Durum', value: STATUS_LABEL[member.status] },
                ]}
              />
            </CardContent>
          </Card>
        </TabsPanel>
        <TabsPanel value="activity" className="grid gap-4 lg:grid-cols-2">
          <BarChart
            title="Aylık katılım"
            data={monthly}
            x="month"
            xLabel="Ay"
            series={{ events: { label: 'Etkinlik' } }}
            height={220}
          />
          <Card>
            <CardHeader>
              <CardTitle>Son etkinlikler</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline
                items={[
                  {
                    id: '1',
                    title: 'Gece Kodu 2026 başvurusu',
                    time: '3 gün önce',
                    icon: CalendarCheck,
                    tone: 'brand',
                  },
                  {
                    id: '2',
                    title: 'Web atölyesine katıldı',
                    time: '2 hafta önce',
                    icon: CalendarCheck,
                  },
                  {
                    id: '3',
                    title: 'YıldızJam’de ikinci oldu',
                    time: 'Mart',
                    icon: Trophy,
                    tone: 'success',
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsPanel>
        <TabsPanel value="admin" className="flex max-w-xl flex-col gap-3">
          <ToggleRow
            title="Duyuru e-postaları"
            description="Kulüp duyuruları bu üyeye gider."
            checked={notify}
            onCheckedChange={setNotify}
          />
          <Button variant="destructive" className="self-start" onClick={() => setConfirm(true)}>
            <UserMinus /> Kulüpten çıkar
          </Button>
        </TabsPanel>
      </Tabs>

      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={`${member.name} kulüpten çıkarılsın mı?`}
        description="Ekiplerden ve posta listelerinden de çıkar. Kayıtları arşivde kalır."
        actionLabel="Kulüpten çıkar"
        destructive
        pending={removing}
        onAction={() => {
          setRemoving(true);
          window.setTimeout(() => {
            setRemoving(false);
            setConfirm(false);
            toast.add({ title: `${member.name} kulüpten çıkarıldı`, type: 'info' });
            router.push('/playground/members');
          }, 800);
        }}
      />
    </div>
  );
}
