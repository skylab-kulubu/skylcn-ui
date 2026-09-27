'use client';

import {
  Badge,
  Button,
  Card,
  IconButton,
  Notice,
  ProportionBar,
  SearchInput,
  StatusDot,
  Swap,
  Timeline,
  useToast,
} from '@skylab-kulubu/skylcn-ui';
import {
  ArrowLeft,
  CheckCircle2,
  Inbox,
  PenSquare,
  Send as SendIcon,
  Undo2,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { FOLDERS, LISTS, SENDS, STATE_LABEL, STATE_TONE, type Send } from '../../../demo/mail';

function count(folder: string) {
  return folder === 'all' ? SENDS.length : SENDS.filter((send) => send.state === folder).length;
}

function Folders({ folder, onFolder }: { folder: string; onFolder: (id: string) => void }) {
  const groups = ['Gönderimler', 'Onaylar'];
  return (
    <nav aria-label="Klasörler" className="flex flex-col gap-4">
      <Button variant="primary" className="w-full">
        <PenSquare /> Yeni gönderim
      </Button>
      {groups.map((group) => (
        <div key={group} className="flex flex-col gap-0.5">
          <p className="px-2 pb-1 text-3xs font-medium tracking-label text-subtle-foreground uppercase">
            {group}
          </p>
          {FOLDERS.filter((f) => f.group === group).map((f) => {
            const active = f.id === folder;
            const n = count(f.id);
            return (
              <button
                key={f.id}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => onFolder(f.id)}
                className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm outline-hidden transition-colors focus-visible:ring-2 focus-visible:ring-ring ${active ? 'bg-accent-strong text-foreground-strong' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
              >
                {f.label}
                {n ? (
                  <span
                    className={`text-3xs tabular-nums ${f.id === 'pending' ? 'rounded bg-warning/15 px-1.5 text-warning' : 'text-subtle-foreground'}`}
                  >
                    {n}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ))}
      <div className="flex flex-col gap-0.5">
        <p className="px-2 pb-1 text-3xs font-medium tracking-label text-subtle-foreground uppercase">
          Listeler
        </p>
        {LISTS.map((list) => (
          <span
            key={list.id}
            className="flex items-center justify-between px-2 py-1.5 text-sm text-muted-foreground"
          >
            {list.label}
            <span className="text-3xs text-subtle-foreground tabular-nums">{list.count}</span>
          </span>
        ))}
      </div>
    </nav>
  );
}

function Detail({ send, onBack }: { send: Send; onBack: () => void }) {
  const toast = useToast();
  const decide = (title: string) => toast.add({ title, type: 'success' });
  return (
    <article className="flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <IconButton
          icon={ArrowLeft}
          label="Listeye dön"
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={onBack}
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground">{send.subject}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {send.author} · {send.audience} · {send.when}
          </p>
        </div>
        <Badge tone={STATE_TONE[send.state]}>{STATE_LABEL[send.state]}</Badge>
      </div>

      {send.state === 'pending' || send.state === 'returned' ? (
        <Notice
          tone={send.state === 'pending' ? 'warning' : 'info'}
          title={send.state === 'pending' ? 'Onayını bekliyor' : 'Düzenlenip sana geri döndü'}
          action={
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() =>
                  decide(
                    send.state === 'pending'
                      ? 'Onaylandı ve kuyruğa girdi'
                      : 'Düzenleme kabul edildi',
                  )
                }
              >
                <CheckCircle2 /> {send.state === 'pending' ? 'Onayla ve gönder' : 'Kabul et'}
              </Button>
              <Button size="sm" onClick={() => decide('Düzenleyip geri gönderdin')}>
                <Undo2 /> Düzenleyip geri gönder
              </Button>
              <Button size="sm" variant="destructive" onClick={() => decide('Reddedildi')}>
                <XCircle /> Reddet
              </Button>
            </div>
          }
        />
      ) : null}

      {send.sent + send.failed > 0 ? (
        <ProportionBar
          segments={[
            { key: 'sent', label: 'Teslim edildi', value: send.sent },
            { key: 'failed', label: 'Ulaşılamadı', value: send.failed },
          ]}
        />
      ) : null}

      <Card className="p-5">
        <p className="text-3xs tracking-label text-subtle-foreground uppercase">Önizleme</p>
        <p className="mt-3 text-sm font-medium text-foreground">{send.subject}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{send.preview}</p>
      </Card>

      <div>
        <p className="mb-3 text-3xs tracking-label text-subtle-foreground uppercase">Geçmiş</p>
        <Timeline
          items={[
            { id: 'a', title: 'Onaya sunuldu', time: send.when, person: { name: send.author } },
            ...(send.state === 'returned'
              ? [
                  {
                    id: 'b',
                    title: 'Düzenlenip geri gönderildi',
                    description: 'Konu satırı kısaltıldı.',
                    person: { name: 'Mira Tunç' },
                  },
                ]
              : []),
            ...(send.sent
              ? [
                  {
                    id: 'c',
                    title: `${send.sent} kişiye gönderildi`,
                    icon: SendIcon,
                    tone: 'brand' as const,
                  },
                ]
              : []),
            ...(send.state === 'failed'
              ? [
                  {
                    id: 'd',
                    title: 'Gönderim yarıda kaldı',
                    icon: XCircle,
                    tone: 'danger' as const,
                  },
                ]
              : []),
            ...(send.state === 'rejected'
              ? [{ id: 'e', title: 'Reddedildi', icon: XCircle, tone: 'neutral' as const }]
              : []),
          ]}
        />
      </div>
    </article>
  );
}

export default function Mail() {
  const [folder, setFolder] = useState('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>('s1');
  const sends = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    return SENDS.filter(
      (send) =>
        (folder === 'all' || send.state === folder) &&
        (!q ||
          `${send.subject} ${send.audience} ${send.author}`.toLocaleLowerCase('tr-TR').includes(q)),
    );
  }, [folder, query]);
  const open = SENDS.find((send) => send.id === openId) ?? null;

  return (
    <div className="grid gap-4 lg:h-[calc(100dvh-7.5rem)] lg:grid-cols-[13rem_20rem_minmax(0,1fr)]">
      <h1 className="sr-only">Posta</h1>
      <div className={`lg:block ${open ? 'hidden' : ''}`}>
        <Folders
          folder={folder}
          onFolder={(id) => {
            setFolder(id);
            setOpenId(null);
          }}
        />
      </div>

      <section
        aria-label="Gönderimler"
        className={`flex min-h-0 flex-col gap-3 lg:flex ${open ? 'hidden' : 'flex'}`}
      >
        <div>
          <SearchInput
            value={query}
            onValueChange={setQuery}
            placeholder="Konu, liste ya da kişi"
            className="max-w-none"
          />
        </div>
        <ul className="flex scrollbar min-h-0 flex-col gap-1 overflow-y-auto">
          {sends.map((send) => {
            const active = send.id === openId;
            return (
              <li key={send.id}>
                <button
                  type="button"
                  aria-current={active ? 'true' : undefined}
                  onClick={() => setOpenId(send.id)}
                  className={`flex w-full flex-col gap-1 rounded-lg border px-3 py-2.5 text-left outline-hidden transition-colors focus-visible:ring-2 focus-visible:ring-ring ${active ? 'border-skylab-400/40 bg-skylab-500/10' : 'border-transparent hover:bg-accent'}`}
                >
                  <span className="flex items-center gap-2">
                    <StatusDot tone={STATE_TONE[send.state]} label={STATE_LABEL[send.state]} />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                      {send.subject}
                    </span>
                    <span
                      className={`shrink-0 text-2xs ${active ? 'text-muted-foreground' : 'text-subtle-foreground'}`}
                    >
                      {send.when}
                    </span>
                  </span>
                  <span className="truncate pl-3.5 text-2xs text-muted-foreground">
                    {send.audience} · {send.author}
                  </span>
                </button>
              </li>
            );
          })}
          {sends.length === 0 ? (
            <li className="flex flex-col items-center gap-2 py-10 text-center text-xs text-muted-foreground">
              <Inbox className="size-5" /> Bu klasörde gönderim yok
            </li>
          ) : null}
        </ul>
      </section>

      <section
        aria-label="Gönderim"
        className={`scrollbar min-h-0 overflow-y-auto lg:block lg:border-l lg:border-border-subtle lg:pl-6 ${open ? 'block' : 'hidden'}`}
      >
        {open ? (
          <Swap id={open.id}>
            <Detail send={open} onBack={() => setOpenId(null)} />
          </Swap>
        ) : (
          <p className="grid h-full place-items-center text-xs text-muted-foreground">
            Soldan bir gönderim seç.
          </p>
        )}
      </section>
    </div>
  );
}
