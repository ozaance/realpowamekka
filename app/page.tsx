import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import Conviction from '@/components/Conviction';
import Services from '@/components/Services';
import Methode from '@/components/Methode';
import CTAFinal from '@/components/CTAFinal';
import Footer from '@/components/Footer';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Powamekka",
  "url": "https://powamekka.com",
  "logo": "https://powamekka.com/logo-mark-bone.png",
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
      <Navbar />
      <Hero />
      <Mission />
      <Conviction />
      <Services />
      <Methode />
      <CTAFinal />
      <Footer />
    </>
  );
}
