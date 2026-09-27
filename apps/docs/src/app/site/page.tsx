'use client';

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  AnimatedNumber,
  AvatarGroup,
  Badge,
  Button,
  Card,
  Combobox,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Field,
  IconButton,
  Input,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  Reveal,
  SkylabMark,
  Timeline,
  useToast,
} from '@skylab-kulubu/skylcn-ui';
import {
  ArrowRight,
  Brain,
  CalendarDays,
  Code2,
  Coffee,
  Gamepad2,
  Menu,
  Mic,
  Shield,
  Trophy,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MEMBERS, TEAMS } from '../../demo/members';

const TRACKS = [
  { icon: Code2, title: 'Web', text: 'Kulübün konsollarına katkı veren bir özellik.' },
  { icon: Brain, title: 'Yapay zekâ', text: 'Açık veriyle kampüs için bir yardımcı.' },
  { icon: Gamepad2, title: 'Oyun', text: 'Bir gecede oynanabilir bir prototip.' },
  { icon: Shield, title: 'Güvenlik', text: 'Kulübün kendi sistemlerinde yetkili bir av.' },
];

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link
          href="/site"
          className="flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          <SkylabMark size={22} /> SKY LAB
        </Link>
        <NavigationMenu aria-label="Site" className="hidden md:block">
          <NavigationMenuItem label="Etkinlikler">
            <NavigationMenuLink
              href="#program"
              icon={CalendarDays}
              title="Gece Kodu 2026"
              description="24 saatlik kodlama gecesi."
            />
            <NavigationMenuLink
              href="#"
              icon={Gamepad2}
              title="YıldızJam"
              description="Oyun geliştirme maratonu."
            />
            <NavigationMenuLink
              href="#"
              icon={Mic}
              title="ARTLAB"
              description="Teknoloji ve sanat buluşması."
            />
            <NavigationMenuLink
              href="#"
              icon={Trophy}
              title="SkySec CTF"
              description="Kulübün güvenlik yarışması."
            />
          </NavigationMenuItem>
          <NavigationMenuItem label="Ekipler">
            <NavigationMenuLink
              href="#"
              icon={Code2}
              title="WebLab"
              description="Kulübün konsolları ve siteleri."
            />
            <NavigationMenuLink
              href="#"
              icon={Shield}
              title="SkySec"
              description="Güvenlik ve altyapı."
            />
          </NavigationMenuItem>
          <NavigationMenuItem label="SSS" href="#sss" />
        </NavigationMenu>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="primary" size="sm" render={<a href="#basvur" />}>
            Başvur
          </Button>
          <IconButton
            icon={Menu}
            label="Menü"
            variant="ghost"
            className="md:hidden"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>
      <Drawer side="bottom" open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Menü</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="flex flex-col gap-1">
            {['Program', 'Parkurlar', 'SSS'].map((item) => (
              <a
                key={item}
                href={`#${item === 'SSS' ? 'sss' : item.toLocaleLowerCase('tr-TR')}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base text-foreground hover:bg-accent"
              >
                {item}
              </a>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </header>
  );
}

function Apply() {
  const toast = useToast();
  const [team, setTeam] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="primary" size="lg" />}>
        Başvur <ArrowRight />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gece Kodu 2026 başvurusu</DialogTitle>
          <DialogDescription>
            Başvurunu onay e-postasındaki bağlantıdan istediğin an geri çekebilirsin.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-3">
          <Field label="Ad soyad">
            <Input autoComplete="name" />
          </Field>
          <Field label="E-posta">
            <Input type="email" autoComplete="email" />
          </Field>
          <Field label="Parkur">
            <Combobox
              items={TEAMS.map((t) => ({ value: t, label: t }))}
              value={team}
              onValueChange={setTeam}
              placeholder="Seç ya da yaz"
            />
          </Field>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="primary"
            pending={sending}
            onClick={() => {
              setSending(true);
              window.setTimeout(() => {
                setSending(false);
                setOpen(false);
                toast.add({
                  title: 'Başvurun alındı',
                  description: 'Onay e-postası yolda.',
                  type: 'success',
                });
              }, 900);
            }}
          >
            Gönder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Site() {
  const [applied, setApplied] = useState(388);
  useEffect(() => {
    const timer = window.setInterval(() => setApplied((n) => n + 1), 4000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />
      <main>
        <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 pt-16 pb-20 sm:pt-24">
          <Reveal>
            <Badge tone="brand" size="pill">
              Başvurular açık
            </Badge>
          </Reveal>
          <Reveal index={1} size="lg" className="max-w-3xl">
            <h1 className="text-4xl leading-tight font-semibold text-balance sm:text-6xl">
              Bir gece, bir fikir, bir takım.
            </h1>
          </Reveal>
          <Reveal index={2} className="max-w-xl">
            <p className="text-base leading-relaxed text-muted-foreground">
              Gece Kodu 2026, 4–5 Ekim’de Davutpaşa’da. 24 saat, dört parkur, kahve ve mentörler
              kulüpten.
            </p>
          </Reveal>
          <Reveal index={3} className="flex flex-wrap items-center gap-3" id="basvur">
            <Apply />
            <Button size="lg" render={<a href="#program" />}>
              Programı gör
            </Button>
          </Reveal>
          <Reveal index={4} className="flex flex-wrap items-center gap-6 pt-6">
            <div>
              <p className="text-3xl font-semibold">
                <AnimatedNumber value={applied} />
              </p>
              <p className="text-xs text-muted-foreground">başvuru</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">24</p>
              <p className="text-xs text-muted-foreground">saat</p>
            </div>
            <AvatarGroup people={MEMBERS.slice(0, 8).map((m) => ({ name: m.name }))} max={5} />
          </Reveal>
        </section>

        <section id="parkurlar" className="border-t border-border-subtle">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <Reveal inView>
              <h2 className="text-2xl font-semibold">Parkurlar</h2>
            </Reveal>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {TRACKS.map((track, i) => (
                <Reveal key={track.title} inView index={i} size="lg">
                  <Card className="h-full gap-3 p-5">
                    <track.icon className="size-5 text-skylab-300" aria-hidden />
                    <p className="text-sm font-semibold">{track.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{track.text}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="program" className="border-t border-border-subtle">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
            <Reveal inView>
              <h2 className="text-2xl font-semibold">Program</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Cumartesi 18.00’de başlıyor, pazar 18.00’de ödüllerle bitiyor.
              </p>
            </Reveal>
            <Reveal inView index={1}>
              <Timeline
                items={[
                  {
                    id: '1',
                    title: 'Kayıt ve açılış',
                    time: 'Cmt 18.00',
                    icon: Users,
                    tone: 'brand',
                  },
                  { id: '2', title: 'Takımlar kodlamaya başlıyor', time: 'Cmt 19.00', icon: Code2 },
                  { id: '3', title: 'Gece yarısı kahvesi', time: 'Paz 00.00', icon: Coffee },
                  { id: '4', title: 'Sunumlar', time: 'Paz 15.00', icon: Mic },
                  { id: '5', title: 'Ödüller', time: 'Paz 17.30', icon: Trophy, tone: 'success' },
                ]}
              />
            </Reveal>
          </div>
        </section>

        <section id="sss" className="border-t border-border-subtle">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <Reveal inView>
              <h2 className="text-2xl font-semibold">Sık sorulan sorular</h2>
            </Reveal>
            <Reveal inView index={1} className="mt-6">
              <Accordion>
                {[
                  [
                    'Kimler katılabilir?',
                    'Üniversitenin tüm öğrencileri; takımlar en fazla beş kişi.',
                  ],
                  [
                    'Takımım yok, ne yapmalıyım?',
                    'Başvuruda parkurunu seç, açılışta takım eşleştirmesi yapıyoruz.',
                  ],
                  [
                    'Başvurumu nasıl geri çekerim?',
                    'Onay e-postasındaki bağlantıdan tek tıkla; soru sormadan.',
                  ],
                ].map(([q, a]) => (
                  <AccordionItem key={q} value={q}>
                    <AccordionTrigger>{q}</AccordionTrigger>
                    <AccordionPanel>{a}</AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="border-t border-border-subtle">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <SkylabMark size={16} /> SKY LAB · Yıldız Teknik Üniversitesi
          </span>
          <Link href="/playground" className="hover:text-foreground">
            Playground’a dön
          </Link>
        </div>
      </footer>
    </div>
  );
}
