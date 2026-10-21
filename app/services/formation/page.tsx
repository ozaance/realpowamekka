import ServicePage from '@/components/ServicePage';
import { breadcrumbJsonLd, jsonLdScript, serviceJsonLd } from '@/lib/schema';
import type { Metadata } from 'next';

const TITLE = 'Formation & Adoption : Powamekka';
const DESCRIPTION = 'Formation IA et outils digitaux pour équipes PME. Accompagnement post-déploiement pour ancrer les nouvelles pratiques durablement.';

export const metadata: Metadata = {
  alternates: { canonical: '/services/formation' },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    url: '/services/formation',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Powamekka — Formation & Adoption' }],
  },
};

const serviceSchema = serviceJsonLd({
  name: 'Formation & Adoption',
  description: DESCRIPTION,
  url: '/services/formation',
  serviceType: 'Formation IA entreprise',
});

const breadcrumbSchema = breadcrumbJsonLd([
  { name: 'Accueil', url: '/' },
  { name: 'Formation & Adoption', url: '/services/formation' },
]);

export default function FormationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript([serviceSchema, breadcrumbSchema]) }}
      />
      <ServicePage
      kicker="Formation & Adoption"
      title="La maîtrise qui reste en interne."
      lede="Un système n'a de valeur que si vos équipes le maîtrisent. Nous formons, documentons et accompagnons : pour que les bonnes habitudes s'installent durablement."
      intro="Le déploiement n'est pas la fin : c'est le début. Trop souvent, les outils sont livrés mais pas adoptés. Nous restons présents après la mise en œuvre pour former vos équipes sur le terrain, répondre aux questions réelles et ancrer les nouvelles pratiques jusqu'à ce qu'elles deviennent naturelles."
      points={[
        { title: 'Formations pratiques sur vos outils', desc: 'On forme vos collaborateurs directement sur les outils déployés dans votre entreprise : pas sur des cas génériques. Chaque session est ancrée dans votre réalité.' },
        { title: 'Documentation de référence', desc: 'Guides visuels, procédures pas-à-pas, fiches récapitulatives. Vos équipes ont toujours une référence claire quand une question se pose, sans dépendre de vous.' },
        { title: 'Accompagnement post-déploiement', desc: 'On reste disponibles les semaines suivant la livraison. Questions, ajustements, blocages : on répond en temps réel pour que rien ne freine l\'adoption.' },
        { title: 'Montée en autonomie progressive', desc: 'L\'objectif n\'est pas que vous dépendiez de nous : c\'est que vos équipes maîtrisent. On mesure la progression et on ajuste l\'accompagnement jusqu\'à l\'autonomie complète.' },
      ]}
      relatedServices={[
        { label: 'Audit Stratégique', href: '/services/audit' },
        { label: 'Systèmes Digitaux', href: '/services/systemes' },
        { label: 'IA & Automatisation', href: '/services/ia' },
        { label: 'Sites Premium', href: '/services/sites' },
      ]}
      />
    </>
  );
}
