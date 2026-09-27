'use client';

import { AvatarGroup, Badge, Kanban, PageHeader, type KanbanCard } from '@skylab-kulubu/skylcn-ui';
import { useState } from 'react';

const INITIAL: KanbanCard[] = [
  {
    id: 'c1',
    column: 'todo',
    title: 'Sponsor mektubu',
    meta: <Badge tone="warning">Bu hafta</Badge>,
  },
  {
    id: 'c2',
    column: 'todo',
    title: 'Mentör listesi',
    meta: <AvatarGroup people={[{ name: 'Mira Tunç' }, { name: 'Arda Tunç' }]} />,
  },
  { id: 'c3', column: 'doing', title: 'Başvuru formu', meta: <Badge tone="brand">Forms</Badge> },
  { id: 'c4', column: 'doing', title: 'Afiş tasarımı' },
  {
    id: 'c5',
    column: 'review',
    title: 'Duyuru e-postası',
    meta: <Badge tone="info">Onayda</Badge>,
  },
  {
    id: 'c6',
    column: 'done',
    title: 'Salon rezervasyonu',
    meta: <Badge tone="success">Tamam</Badge>,
  },
];

export default function Board() {
  const [cards, setCards] = useState(INITIAL);
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Etkinlik hazırlığı"
        description="Gece Kodu 2026 görevleri: sürükle ya da kartın taşı menüsünü kullan."
      />
      <Kanban
        aria-label="Görevler"
        columns={[
          { id: 'todo', title: 'Yapılacak' },
          { id: 'doing', title: 'Sürüyor' },
          { id: 'review', title: 'Onayda' },
          { id: 'done', title: 'Bitti' },
        ]}
        cards={cards}
        onMove={(id, column) =>
          setCards((prev) => [
            ...prev.filter((c) => c.id !== id),
            { ...prev.find((c) => c.id === id)!, column },
          ])
        }
      />
    </div>
  );
}
