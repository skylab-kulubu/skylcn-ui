'use client';

import { PageHeader } from '@skylab-kulubu/skylcn-ui';
import { MemberTable } from '../../../demo/member-table';

export default function TableScenario() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Üye tablosu"
        description="Yönetim tablosu: filtreler, sütunlar, toplu işlem ve ↑/↓ ile gezilen detay paneli."
      />
      <MemberTable urlKey="uye" />
    </div>
  );
}
