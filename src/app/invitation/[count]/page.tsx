
import type { Metadata, ResolvingMetadata } from 'next';
import InvitationPageClient from '@/components/event/InvitationPageClient';

type Props = {
  params: Promise<{ count: string }>
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const count = parseInt(resolvedParams.count, 10) || 1
 
  return {
    title: 'Nuestra Boda - Kevin Zuniga & Alison Ney',
    description: `Nos casamos el 20 de diciembre de 2025 y queremos que seas parte de este día tan especial. Pase válido para ${count} persona${count > 1 ? 's' : ''}.`,
  }
}

export default async function InvitationPage({ params }: { params: Promise<{ count: string }> }) {
  const resolvedParams = await params;
  return <InvitationPageClient params={resolvedParams} />;
}
