import ServicePage from '@/components/ServicePage';
import { breadcrumbJsonLd, jsonLdScript, serviceJsonLd } from '@/lib/schema';
import type { Metadata } from 'next';

const TITLE = 'Sites Premium : Powamekka';
const DESCRIPTION = 'Création de sites web premium pour PME et artisans. Design sur-mesure, développement Next.js, intégration avec vos outils internes. Basé à Rouen.';

export const metadata: Metadata = {
  alternates: { canonical: '/services/sites' },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    url: '/services/sites',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Powamekka — Sites Premium' }],
  },
};

const serviceSchema = serviceJsonLd({
  name: 'Sites Premium',
  description: DESCRIPTION,
  url: '/services/sites',
  serviceType: 'Développement de sites web',
});

const breadcrumbSchema = breadcrumbJsonLd([
  { name: 'Accueil', url: '/' },
  { name: 'Sites Premium', url: '/services/sites' },
]);

export default function SitesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript([serviceSchema, breadcrumbSchema]) }}
      />
      <ServicePage
      kicker="Sites Premium"
      title="Une vitrine à la hauteur de votre système."
      lede="Votre site n'est pas un dépliant en ligne. C'est la vitrine de votre système : rapide, crédible, pensé pour convertir et relié directement à vos outils."
      intro="Un site générique ne vous représente pas. Nous construisons des sites qui reflètent la réalité de votre entreprise : votre positionnement, vos offres, votre processus. Et on les relie à vos outils internes pour que chaque demande entrante arrive exactement là où il faut, sans friction."
      points={[
        { title: 'Design sur-mesure', desc: 'Chaque site est pensé pour votre secteur et votre positionnement. Pas de template générique : une identité visuelle qui inspire confiance dès le premier regard.' },
        { title: 'Développement Next.js', desc: 'Stack moderne, performances maximales. Votre site charge vite, s\'indexe bien sur Google et tient la charge. Code propre, maintenable, évolutif.' },
        { title: 'Intégration outils internes', desc: 'Le formulaire de contact alimente votre CRM. La prise de rendez-vous se synchronise avec votre agenda. Chaque demande entrante déclenche le bon processus automatiquement.' },
        { title: 'SEO et visibilité locale', desc: 'Structure sémantique, métadonnées, vitesse de chargement, données structurées : votre site est optimisé pour apparaître quand vos clients vous cherchent.' },
      ]}
      relatedServices={[
        { label: 'Audit Stratégique', href: '/services/audit' },
        { label: 'Systèmes Digitaux', href: '/services/systemes' },
        { label: 'IA & Automatisation', href: '/services/ia' },
        { label: 'Formation & Adoption', href: '/services/formation' },
      ]}
      />
    </>
  );
}
