'use client';

import { MonthCalendar, PageHeader, useToast } from '@skylab-kulubu/skylcn-ui';
import { EVENTS } from '../../../demo/events';

export default function CalendarScenario() {
  const toast = useToast();
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Etkinlik takvimi"
        description="Kulübün yaklaşan etkinlikleri; telefonda gün gün liste."
      />
      <MonthCalendar
        events={EVENTS}
        defaultMonth={new Date(2026, 9, 1)}
        onSelectEvent={(event) =>
          toast.add({ title: event.title, description: `${event.date} · ${event.time ?? ''}` })
        }
      />
    </div>
  );
}
