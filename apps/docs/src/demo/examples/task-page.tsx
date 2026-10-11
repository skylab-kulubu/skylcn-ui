'use client';

import {
  Badge,
  Button,
  Card,
  DescriptionList,
  Field,
  Input,
  Notice,
  SegmentedControl,
  TaskPage,
} from '@skylab-kulubu/skylcn-ui';
import { BadgeCheck, CircleAlert, Download, House, LogIn, LogOut, RotateCw } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Example } from '../doc';

/** The example's page sits in a frame; the docs page around it keeps the main landmark. */
function Frame({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-xl border border-border">{children}</div>;
}

const legal = (
  <>
    <a href="#gizlilik">Gizlilik</a>
    <a href="#yardim">Yardım</a>
  </>
);

function DoorExample() {
  return (
    <Example
      title="Kapıda giriş"
      description="Bir form: başlık sola yaslı, gövdede alanlar, altta eylem. Telefonda kart çerçevesi kalkar, sayfa tam genişlik olur."
      align="start"
    >
      <Frame>
        <TaskPage
          as="div"
          className="min-h-0"
          eyebrow="Etkinlik girişi"
          title="Web atölyesi"
          description="Bilgilerini yaz, girişin bu etkinliğe kaydedilsin."
          actions={
            <Button variant="primary" className="sm:flex-1">
              Girişimi kaydet
            </Button>
          }
          footer={<a href="#kvkk">Aydınlatma metni</a>}
        >
          <Field label="Ad soyad">
            <Input autoComplete="name" />
          </Field>
          <Field label="Okul e-postası" description="@std.yildiz.edu.tr ile biten adres.">
            <Input type="email" autoComplete="email" />
          </Field>
        </TaskPage>
      </Frame>
    </Example>
  );
}

type SignInState = 'redirecting' | 'failed' | 'signedOut';

const SIGN_IN_STATES = [
  { value: 'redirecting', label: 'Yönlendiriliyor' },
  { value: 'failed', label: 'Hata' },
  { value: 'signedOut', label: 'Çıkış yapıldı' },
] as const;

function SignInExample() {
  const [state, setState] = useState<SignInState>('redirecting');
  const signIn = (
    <Button variant="primary" onClick={() => setState('redirecting')}>
      <LogIn aria-hidden />
      SKY LAB ile giriş yap
    </Button>
  );
  const page =
    state === 'redirecting' ? (
      <TaskPage
        as="div"
        className="min-h-0"
        align="center"
        loading
        title="Yönlendiriliyor…"
        description="SKY LAB’ın güvenli giriş ekranına gidiyorsun."
        footer={legal}
      />
    ) : state === 'failed' ? (
      <TaskPage
        as="div"
        className="min-h-0"
        align="center"
        icon={CircleAlert}
        tone="danger"
        title="Giriş tamamlanamadı"
        description="Yetkilendirme kodu alınamadı. Lütfen yeniden dene."
        actions={
          <Button variant="primary" onClick={() => setState('redirecting')}>
            <RotateCw aria-hidden />
            Yeniden dene
          </Button>
        }
        footer={legal}
      />
    ) : (
      <TaskPage
        as="div"
        className="min-h-0"
        align="center"
        icon={LogOut}
        title="Çıkış yapıldı"
        description="Bu cihazdaki oturum kapatıldı."
        actions={signIn}
        footer={legal}
      />
    );
  return (
    <Example
      title="Giriş ve durumları"
      description="Ortalanmış giriş sayfası: yükleniyor, hata ve çıkış yapıldı. Yükleme bitince yeni başlık bir kez okunur, odak yerinde kalır."
      align="start"
    >
      <SegmentedControl
        aria-label="Giriş durumu"
        options={SIGN_IN_STATES}
        value={state}
        onValueChange={(value) => setState(value as SignInState)}
        className="self-start"
      />
      <Frame>{page}</Frame>
    </Example>
  );
}

function CertificateExample() {
  return (
    <Example
      title="Sertifika doğrulama"
      description="Bir kayıt: geniş (size lg), çerçevesiz (framed false); ayrıntılar gövdede kendi kartında."
      align="start"
    >
      <Frame>
        <TaskPage
          as="div"
          className="min-h-0"
          size="lg"
          framed={false}
          eyebrow="Sertifika sahibi"
          title="Ayşe Yılmaz"
          description="Bu sertifika SKY LAB kayıtlarıyla eşleşiyor ve geçerli."
          actions={
            <>
              <Button variant="primary">
                <Download aria-hidden />
                PDF sertifikayı indir
              </Button>
              <Button>
                <House aria-hidden />
                SKY LAB ana sayfası
              </Button>
            </>
          }
        >
          <Badge tone="success" size="md" className="self-start">
            <BadgeCheck aria-hidden />
            Geçerli sertifika
          </Badge>
          <Card className="p-5">
            <DescriptionList
              items={[
                { label: 'Etkinlik', value: 'Gece Kodu 2026' },
                { label: 'Düzenleyen', value: 'SKY LAB' },
                { label: 'Verilme tarihi', value: '11 Ekim 2026' },
                {
                  label: 'Sertifika kodu',
                  value: <span className="font-mono text-xs break-all">3F9A0C21B7D45E68</span>,
                },
              ]}
            />
          </Card>
          <Notice tone="info">Bağlantının tamamını paylaşan herkes bu sayfayı görebilir.</Notice>
        </TaskPage>
      </Frame>
    </Example>
  );
}

function TaskPageExamples() {
  return (
    <>
      <DoorExample />
      <SignInExample />
      <CertificateExample />
    </>
  );
}

export const TASK_PAGE_EXAMPLES = {
  'task-page': TaskPageExamples,
};
