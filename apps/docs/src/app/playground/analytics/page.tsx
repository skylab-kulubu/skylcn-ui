'use client';

import {
  BarList,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
  ProportionBar,
  Reveal,
  SegmentedControl,
  StatusDot,
  TrendBadge,
} from '@skylab-kulubu/skylcn-ui';
import { AreaChart, BarChart, DonutChart } from '@skylab-kulubu/skylcn-ui/charts';
import { useState } from 'react';
import { DAILY, HOURLY, QUESTIONS, TOTAL_RESPONSES, type Question } from '../../../demo/analytics';

const STATUS = [
  { key: 'total', label: 'Toplam', value: TOTAL_RESPONSES, tone: 'neutral' },
  { key: 'pending', label: 'Bekleyen', value: 57, tone: 'warning' },
  { key: 'approved', label: 'Onaylanan', value: 318, tone: 'success' },
  { key: 'rejected', label: 'Reddedilen', value: 37, tone: 'danger' },
] as const;

const KIND = { choice: 'Seçim', multi: 'Çoklu seçim', number: 'Sayı', toggle: 'Aç/Kapa' };

function QuestionBlock({ question, index }: { question: Question; index: number }) {
  const [view, setView] = useState<'bar' | 'donut'>('bar');
  const canDonut = question.kind === 'choice' || question.kind === 'toggle';
  return (
    <Reveal index={index} className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-foreground">{question.text}</h3>
          <p className="mt-0.5 text-2xs text-subtle-foreground">
            <span className="tracking-label uppercase">{KIND[question.kind]}</span> ·{' '}
            {question.answered} yanıt
          </p>
        </div>
        {canDonut ? (
          <SegmentedControl
            aria-label="Görünüm"
            value={view}
            onValueChange={(value) => setView(value as 'bar' | 'donut')}
            options={[
              { value: 'bar', label: 'Çubuk' },
              { value: 'donut', label: 'Halka' },
            ]}
          />
        ) : null}
      </div>
      {question.numeric ? (
        <dl className="flex flex-wrap gap-x-5 gap-y-1 text-2xs">
          {(
            [
              ['Ortalama', question.numeric.average],
              ['Medyan', question.numeric.median],
              ['En az', question.numeric.min],
              ['En çok', question.numeric.max],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex gap-1.5">
              <dt className="text-subtle-foreground">{label}</dt>
              <dd className="font-semibold text-foreground tabular-nums">
                {value.toLocaleString('tr-TR')}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      {view === 'donut' && canDonut ? (
        <DonutChart title={question.text} data={question.distribution} height={200} />
      ) : (
        <BarList
          items={question.distribution}
          max={question.kind === 'multi' ? question.answered : undefined}
        />
      )}
      {question.kind === 'multi' ? (
        <p className="text-2xs text-subtle-foreground">
          Çoklu seçim: yüzdeler yanıt verenlere göre, toplamları %100&apos;ü aşabilir.
        </p>
      ) : null}
    </Reveal>
  );
}

export default function Analytics() {
  const [open, setOpen] = useState<string[]>(['q1', 'q3']);
  const [mode, setMode] = useState<'daily' | 'hourly'>('daily');
  const toggle = (key: string) =>
    setOpen((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gece Kodu 2026 başvuru"
        description="Form analitiği: yanıtların durumu, akışı ve soru soru dağılımı."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Reveal index={0} size="lg">
          <Card className="h-full">
            <CardHeader>
              <div className="min-w-0">
                <CardTitle>Yanıtlar</CardTitle>
                <CardDescription>Onay akışındaki durumları.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {STATUS.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-2.5 rounded-lg border border-border-subtle bg-card px-3 py-2.5"
                >
                  <StatusDot tone={item.tone} />
                  <div className="min-w-0">
                    <p className="truncate text-2xs text-subtle-foreground">{item.label}</p>
                    <p className="text-lg leading-tight font-semibold text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </Reveal>

        <Reveal index={1} size="lg">
          <AreaChart
            compact
            markers
            className="h-full"
            title="Yanıt akışı"
            badge={<TrendBadge value={mode === 'daily' ? 37.5 : -12} />}
            description={mode === 'daily' ? 'Son 7 gün' : 'Bugün'}
            actions={
              <SegmentedControl
                aria-label="Aralık"
                value={mode}
                onValueChange={(value) => setMode(value as 'daily' | 'hourly')}
                options={[
                  { value: 'hourly', label: 'Saatlik' },
                  { value: 'daily', label: 'Günlük' },
                ]}
              />
            }
            data={mode === 'daily' ? DAILY : HOURLY}
            x="label"
            xLabel={mode === 'daily' ? 'Gün' : 'Saat'}
            series={{ count: { label: 'Yanıt' } }}
          />
        </Reveal>

        <Reveal index={2} size="lg">
          <Card className="h-full">
            <CardHeader>
              <div className="min-w-0">
                <CardTitle>Kaynak</CardTitle>
                <CardDescription>Giriş yaparak ya da anonim gelenler.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <ProportionBar
                segments={[
                  { key: 'registered', label: 'Kayıtlı', value: 301 },
                  { key: 'anonymous', label: 'Anonim', value: 111 },
                ]}
              />
              <BarChart
                compact
                title="Kanallar"
                data={[
                  { channel: 'Instagram', responses: 164 },
                  { channel: 'E-posta', responses: 121 },
                  { channel: 'WhatsApp', responses: 83 },
                  { channel: 'Etiketsiz', responses: 44 },
                ]}
                x="channel"
                xLabel="Kanal"
                series={{ responses: { label: 'Yanıt' } }}
                framed={false}
              />
            </CardContent>
          </Card>
        </Reveal>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="order-2 lg:order-1 lg:col-span-7">
          <CardHeader>
            <div className="min-w-0">
              <CardTitle>Sorular</CardTitle>
              <CardDescription>
                Sağdan seçtiğin sorular burada dağılımlarıyla açılır.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-border-subtle">
            {QUESTIONS.filter((q) => open.includes(q.id)).map((question, index) => (
              <QuestionBlock key={question.id} question={question} index={index} />
            ))}
            {open.length === 0 ? (
              <p className="py-10 text-center text-xs text-muted-foreground">
                Analiz için sağdan bir soru seç.
              </p>
            ) : null}
          </CardContent>
        </Card>
        <Card className="order-1 lg:order-2 lg:col-span-5">
          <CardHeader>
            <div className="min-w-0">
              <CardTitle>Cevaplanma oranı</CardTitle>
              <CardDescription>Açmak ya da kapatmak için soruya dokun.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <BarList
              items={QUESTIONS.map((q, i) => ({
                key: q.id,
                label: `S${i + 1} · ${q.text}`,
                value: q.answered,
              }))}
              max={TOTAL_RESPONSES}
              selected={open}
              onSelect={toggle}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
