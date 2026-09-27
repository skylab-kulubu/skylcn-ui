import { notFound } from 'next/navigation';
import { MEMBERS } from '../../../../demo/members';
import { MemberDetail } from './member-detail';

export function generateStaticParams() {
  return MEMBERS.map((member) => ({ id: member.id }));
}

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = MEMBERS.find((item) => item.id === id);
  if (!member) notFound();
  return <MemberDetail id={member.id} />;
}
