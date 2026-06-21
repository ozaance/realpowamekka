import ServicePage from '@/components/ServicePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audit Stratégique : Powamekka',
  description: 'Diagnostic complet de vos opérations, outils et flux de travail. Identifiez vos leviers de clarté, d\'efficacité et de croissance avec Powamekka.',
};

export default function AuditPage() {
  return (
    <ServicePage
      kicker="Audit Stratégique"
      title="Comprendre avant d'agir."
      lede="Avant toute solution, nous analysons votre réalité. Vos outils, vos flux, vos points de friction. Un diagnostic concret qui révèle où se cachent vos vrais leviers."
      intro="La plupart des entreprises investissent dans des outils avant de comprendre leurs problèmes. Nous faisons l'inverse : un audit rigoureux de vos opérations pour nommer précisément ce qui freine votre croissance : et dans quel ordre l'adresser."
      points={[
        { title: 'Diagnostic opérationnel', desc: 'Analyse complète de vos outils, processus et flux de travail actuels. On cartographie ce qui fonctionne, ce qui coûte et ce qui bloque.' },
        { title: 'Identification des leviers', desc: 'Chaque point de friction devient un levier. On priorise par impact : ce qui libère le plus de temps ou génère le plus de valeur passe en premier.' },
        { title: 'Plan d\'action structuré', desc: 'Un document clair avec des recommandations concrètes, priorisées et chiffrées. Pas un rapport théorique : une feuille de route que vous pouvez exécuter.' },
        { title: 'Restitution en visio', desc: 'On vous présente les résultats en direct, on répond à vos questions et on valide ensemble les priorités avant toute mise en œuvre.' },
      ]}
      relatedServices={[
        { label: 'Systèmes Digitaux', href: '/services/systemes' },
        { label: 'IA & Automatisation', href: '/services/ia' },
        { label: 'Formation & Adoption', href: '/services/formation' },
        { label: 'Sites Premium', href: '/services/sites' },
      ]}
    />
  );
}
