import ServicePage from '@/components/ServicePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IA & Automatisation : Powamekka',
  description: 'Automatisation des tâches répétitives et intégration IA pour PME. Devis, relances, rapports : libérez du temps pour ce qui compte vraiment.',
};

export default function IAPage() {
  return (
    <ServicePage
      kicker="IA & Automatisation"
      title="L'IA qui travaille à votre place."
      lede="Rédaction de devis, relances clients, tri des messages, rapports automatiques : l'IA prend en charge le répétitif pour que vous vous concentriez sur ce qui compte."
      intro="L'intelligence artificielle n'est pas un gadget. C'est un levier opérationnel concret : elle rédige, trie, relance, synthétise. Déployée sur vos processus réels, elle libère plusieurs heures par semaine pour chaque collaborateur : sans remplacer le jugement humain, mais en éliminant tout ce qui ne le nécessite pas."
      points={[
        { title: 'Automatisation administrative', desc: 'Génération automatique de devis, bons de commande, rapports d\'intervention. Vos modèles alimentés par vos données : zéro ressaisie, zéro oubli.' },
        { title: 'Assistants IA métier', desc: 'Un assistant entraîné sur votre vocabulaire, vos offres et vos clients. Il répond aux demandes courantes, rédige les premiers jets, classe les messages entrants.' },
        { title: 'Relances et suivi automatisés', desc: 'Devis sans retour, factures impayées, clients silencieux : les relances partent au bon moment, avec le bon message, sans que vous ayez à y penser.' },
        { title: 'Tableaux de bord décisionnels', desc: 'Une vue claire sur vos indicateurs clés : chiffre d\'affaires, taux de conversion, charge équipe. Les données agrégées automatiquement, disponibles en temps réel.' },
      ]}
      relatedServices={[
        { label: 'Audit Stratégique', href: '/services/audit' },
        { label: 'Systèmes Digitaux', href: '/services/systemes' },
        { label: 'Formation & Adoption', href: '/services/formation' },
        { label: 'Sites Premium', href: '/services/sites' },
      ]}
    />
  );
}
