import LegalPage from '@/components/LegalPage';
import { mentionsLegales } from '@/lib/legal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${mentionsLegales.title} | Powamekka`,
  description: mentionsLegales.description,
  alternates: { canonical: '/mentions-legales' },
  openGraph: {
    title: `${mentionsLegales.title} | Powamekka`,
    description: mentionsLegales.description,
    url: 'https://www.powamekka.com/mentions-legales',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Powamekka' }],
  },
};

export default function Page() {
  return <LegalPage doc={mentionsLegales} />;
}
