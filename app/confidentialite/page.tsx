import LegalPage from '@/components/LegalPage';
import { politiqueConfidentialite } from '@/lib/legal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${politiqueConfidentialite.title} | Powamekka`,
  description: politiqueConfidentialite.description,
  alternates: { canonical: '/confidentialite' },
  openGraph: {
    title: `${politiqueConfidentialite.title} | Powamekka`,
    description: politiqueConfidentialite.description,
    url: 'https://www.powamekka.com/confidentialite',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Powamekka' }],
  },
};

export default function Page() {
  return <LegalPage doc={politiqueConfidentialite} />;
}
