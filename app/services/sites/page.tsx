import ServicePage from '@/components/ServicePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sites Premium : Powamekka',
  description: 'Création de sites web premium pour PME et artisans. Design sur-mesure, développement Next.js, intégration avec vos outils internes. Basé à Rouen.',
};

export default function SitesPage() {
  return (
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
  );
}
