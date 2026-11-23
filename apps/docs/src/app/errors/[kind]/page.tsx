import {
  Button,
  ErrorScene,
  errorSceneText,
  StatusPage,
  type ErrorSceneKind,
} from '@skylab-kulubu/skylcn-ui';
import { notFound } from 'next/navigation';

// Every error page as a product would show it: the kind's scene and default words on StatusPage
const KINDS: ErrorSceneKind[] = [
  'notFound',
  'error',
  'forbidden',
  'offline',
  'sessionExpired',
  'maintenance',
];

export function generateStaticParams() {
  return KINDS.map((kind) => ({ kind }));
}

export default async function ErrorPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!KINDS.includes(kind as ErrorSceneKind)) notFound();
  const text = errorSceneText(kind as ErrorSceneKind);
  return (
    <StatusPage
      scene={<ErrorScene kind={kind as ErrorSceneKind} />}
      code={text.code}
      title={text.title}
      description={text.description}
    >
      <Button variant="primary">{text.action}</Button>
    </StatusPage>
  );
}
