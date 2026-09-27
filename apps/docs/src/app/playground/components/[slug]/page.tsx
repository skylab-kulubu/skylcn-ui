import { notFound } from 'next/navigation';
import { ENTRIES } from '../../../../demo/catalog';
import { ComponentDoc } from '../../../../demo/doc';

export function generateStaticParams() {
  return ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!ENTRIES.some((entry) => entry.slug === slug)) notFound();
  return <ComponentDoc slug={slug} />;
}
