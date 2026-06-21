import ServicePage from '@/components/ServicePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Systèmes Digitaux : Powamekka',
  description: 'Architecture digitale sur-mesure pour PME. CRM, facturation, planning, communication : vos outils reliés en un système cohérent et automatisé.',
};

export default function SystemesPage() {
  return (
    <ServicePage
      kicker="Systèmes Digitaux"
      title="L'architecture qui relie tout."
      lede="CRM, facturation, planning, communication : vos outils travaillent enfin ensemble. Vos données circulent sans ressaisie, vos équipes avancent sans friction."
      intro="La plupart des PME utilisent 5 à 10 outils qui ne se parlent pas. Résultat : ressaisies manuelles, données perdues, décisions prises dans le flou. Nous construisons l'architecture qui connecte tout : pour que votre entreprise fonctionne comme un système, pas comme une collection d'outils."
      points={[
        { title: 'Connexion des outils existants', desc: 'On relie vos outils actuels entre eux : CRM, facturation, messagerie, planning. Pas besoin de tout changer : on fait parler ce que vous avez déjà.' },
        { title: 'Centralisation des données', desc: 'Une seule source de vérité pour vos données clients, devis et projets. Fini les versions multiples et les informations qui se perdent entre les équipes.' },
        { title: 'Automatisation des flux', desc: 'Les informations passent automatiquement d\'un outil à l\'autre. Une commande validée crée la facture, notifie l\'équipe et met à jour le planning.' },
        { title: 'Documentation du système', desc: 'Votre équipe reçoit une documentation claire du système mis en place. Chaque outil, chaque flux, chaque règle est documenté pour que la maîtrise reste en interne.' },
      ]}
      relatedServices={[
        { label: 'Audit Stratégique', href: '/services/audit' },
        { label: 'IA & Automatisation', href: '/services/ia' },
        { label: 'Formation & Adoption', href: '/services/formation' },
        { label: 'Sites Premium', href: '/services/sites' },
      ]}
    />
  );
}
