import {
  ERROR_SCENE_KINDS,
  ERROR_SCENE_VARIANTS,
  ErrorScenePage,
  type ErrorSceneKind,
  type ErrorSceneVariant,
} from '@skylab-kulubu/skylcn-ui';
import { notFound } from 'next/navigation';

// One drawing of a kind, fixed, for reviews and screenshots
export function generateStaticParams() {
  return ERROR_SCENE_KINDS.flatMap((kind) =>
    ERROR_SCENE_VARIANTS[kind].map((variant) => ({ kind, variant })),
  );
}

export default async function ErrorVariantPage({
  params,
}: {
  params: Promise<{ kind: string; variant: string }>;
}) {
  const { kind, variant } = await params;
  const variants: readonly string[] = ERROR_SCENE_VARIANTS[kind as ErrorSceneKind] ?? [];
  if (!variants.includes(variant)) notFound();
  return (
    <ErrorScenePage
      kind={kind as ErrorSceneKind}
      variant={variant as ErrorSceneVariant}
      href="/errors"
    />
  );
}
