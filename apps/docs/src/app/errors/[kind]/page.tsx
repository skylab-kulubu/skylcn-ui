import { ERROR_SCENE_KINDS, ErrorScenePage, type ErrorSceneKind } from '@skylab-kulubu/skylcn-ui';
import { notFound } from 'next/navigation';

// Every error page as a product shows it: a random drawing of the kind on each visit
export function generateStaticParams() {
  return ERROR_SCENE_KINDS.map((kind) => ({ kind }));
}

export default async function ErrorPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!ERROR_SCENE_KINDS.includes(kind as ErrorSceneKind)) notFound();
  return <ErrorScenePage kind={kind as ErrorSceneKind} href="/" />;
}
