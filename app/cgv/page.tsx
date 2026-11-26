import LegalPage from '@/components/LegalPage';
import { conditionsGenerales } from '@/lib/legal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${conditionsGenerales.title} | Powamekka`,
  description: conditionsGenerales.description,
  alternates: { canonical: '/cgv' },
  openGraph: {
    title: `${conditionsGenerales.title} | Powamekka`,
    description: conditionsGenerales.description,
    url: 'https://www.powamekka.com/cgv',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Powamekka' }],
  },
};

export default function Page() {
  return <LegalPage doc={conditionsGenerales} />;
}
