import BodyClass from '@/components/cine/BodyClass';
import Loader from '@/components/cine/Loader';
import CineNav from '@/components/cine/CineNav';
import HeroTableau from '@/components/cine/HeroTableau';
import Manifeste from '@/components/cine/Manifeste';
import ConvictionCine from '@/components/cine/ConvictionCine';
import Disciplines from '@/components/cine/Disciplines';
import MethodeCine from '@/components/cine/MethodeCine';
import CTACine from '@/components/cine/CTACine';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Powamekka",
  "url": "https://www.powamekka.com",
  "logo": "https://www.powamekka.com/logo-mark-bone.png",
  "description": "Agence spécialisée en intelligence artificielle et systèmes digitaux pour PME. Audit stratégique, automatisation, formation et intégration IA.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Rouen",
    "addressRegion": "Normandie",
    "addressCountry": "FR"
  },
  "areaServed": "France",
  "serviceType": [
    "Conseil en intelligence artificielle",
    "Automatisation des processus",
    "Audit stratégique digital",
    "Formation IA entreprise",
    "Développement de systèmes digitaux"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "French"
  },
  "sameAs": [
    "https://www.linkedin.com/company/powamekka"
  ]
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BodyClass name="cn-active" />
      <Loader />
      <CineNav />

      {/* Le récit : on entre dans le tableau, le manifeste se découvre
          derrière, puis la page redevient un scroll normal. */}
      <HeroTableau />
      <Manifeste />

      <ConvictionCine />
      <Disciplines />
      <MethodeCine />
      <CTACine />

      <Footer />
    </>
  );
}
