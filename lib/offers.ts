/**
 * Catalogue des offres vendues en ligne.
 *
 * Côté Stripe, le montant facturé vient du dashboard via `priceId`. Côté Mollie,
 * c'est le champ `price` ci-dessous qui est facturé. Si vous modifiez un tarif,
 * mettez à jour les deux pour éviter un écart entre la page, Stripe et Mollie.
 *
 * Chaque `priceId` peut être surchargé par une variable d'environnement
 * (ex. STRIPE_PRICE_LANDING_PAGE) pour basculer sur des prix de test sans
 * toucher au code.
 */

export type Offer = {
  /** Identifiant interne envoyé par le front à /api/checkout */
  id: string;
  name: string;
  tagline: string;
  /** Montant affiché et facturé par Mollie, en centimes d'euro */
  price: number;
  delivery: string;
  features: string[];
  /** Price ID Stripe (mode live) */
  priceId: string;
  featured?: boolean;
};

export type ServiceCategory = 'sites' | 'visibilite' | 'ia' | 'audit';

export const serviceCategories: { id: ServiceCategory; label: string }[] = [
  { id: 'sites', label: 'Sites & design' },
  { id: 'visibilite', label: 'SEO & visibilité' },
  { id: 'ia', label: 'IA & automatisation' },
  { id: 'audit', label: 'Audit & mesure' },
];

/**
 * Prestations ponctuelles vendues à la carte, affichées en liste compacte sous
 * les offres principales. Mêmes règles de prix que `offers`.
 */
export type Service = Omit<Offer, 'delivery' | 'features' | 'featured'> & {
  category: ServiceCategory;
};

export const offers: Offer[] = [
  {
    id: 'landing-page',
    name: 'Landing page',
    tagline: "Une page unique, pensée pour convertir. Le format le plus rapide pour exister en ligne.",
    price: 14900,
    delivery: 'Livrée en 24h',
    features: [
      '1 page web professionnelle',
      'Design moderne adapté à votre activité',
      'Formulaire de contact ou lien WhatsApp intégré',
      'Compatible mobile et ordinateur',
    ],
    priceId: 'price_1TKzCaAmS2hPu7V9SCM1mHwW',
  },
  {
    id: 'site-vitrine',
    name: 'Site vitrine',
    tagline: "Un site complet qui présente votre activité, vos services et votre positionnement.",
    price: 49900,
    delivery: 'Livré en 5 jours',
    features: [
      '3 à 5 pages : Accueil, Services, À propos, Contact',
      'Design moderne adapté à votre secteur',
      'Formulaire de contact intégré',
      'Compatible mobile et ordinateur',
    ],
    priceId: 'price_1TR99wAmS2hPu7V9lIRwflsz',
    featured: true,
  },
  {
    id: 'prototype-mvp',
    name: 'Prototype MVP',
    tagline: "Une application sur mesure réduite à l'essentiel, pour valider votre idée avant d'investir.",
    price: 250000,
    delivery: 'Cadrage sous 48h',
    features: [
      'Application SaaS MVP sur mesure',
      'Fonctionnalités essentielles au lancement',
      'Architecture moderne et évolutive',
      'Validation rapide de votre modèle',
    ],
    priceId: 'price_1Tr2g8AmS2hPu7V9G4IZyNvw',
  },
  {
    id: 'saas-standard',
    name: 'SaaS Standard',
    tagline: "Une application métier complète, conçue autour de vos processus réels.",
    price: 500000,
    delivery: 'Cadrage sous 48h',
    features: [
      'Développement sur mesure',
      'Interface moderne et fonctionnalités personnalisées',
      'Architecture évolutive',
      'Accompagnement jusqu’à la mise en production',
    ],
    priceId: 'price_1Tr0F6AmS2hPu7V9jqgOaWpe',
  },
  {
    id: 'saas-premium',
    name: 'SaaS Premium',
    tagline: "Le format le plus large : périmètre étendu, intégrations et accompagnement renforcé.",
    price: 1000000,
    delivery: 'Cadrage sous 48h',
    features: [
      'Développement sur mesure, périmètre étendu',
      'Intégrations avec vos outils existants',
      'Architecture évolutive et performante',
      'Accompagnement jusqu’à la mise en production',
    ],
    priceId: 'price_1Tr0IFAmS2hPu7V93n4J8ea1',
  },
];

export const services: Service[] = [
  // Sites & design
  { id: 'refonte-site', category: 'sites', name: 'Refonte site web', tagline: 'Un site existant remis au goût du jour : design, structure et lisibilité.', price: 20500, priceId: 'price_1U3zXtAmS2hPu7V9v67jOgHV' },
  { id: 'design-ui-page', category: 'sites', name: "Design UI d'une page", tagline: "La maquette soignée d'une page clé, prête à être intégrée.", price: 20500, priceId: 'price_1U3zkJAmS2hPu7V9sLmYybQZ' },
  { id: 'optimisation-page-vente', category: 'sites', name: 'Optimisation de page de vente', tagline: 'Une page de vente retravaillée pour transformer plus de visiteurs en clients.', price: 25900, priceId: 'price_1UH3svAmS2hPu7V9SrWS1sjx' },
  { id: 'charte-graphique', category: 'sites', name: 'Charte graphique express', tagline: 'Couleurs, typographies et règles visuelles pour une image cohérente.', price: 26900, priceId: 'price_1UH3swAmS2hPu7V9YYX8fR69' },
  { id: 'migration-site', category: 'sites', name: 'Migration & mise en ligne de site', tagline: 'Votre site déplacé ou publié proprement : hébergement, domaine, redirections.', price: 20900, priceId: 'price_1UH3sbAmS2hPu7V9biDORJWr' },
  { id: 'maintenance-site', category: 'sites', name: 'Maintenance de site (1 mois)', tagline: 'Mises à jour, corrections et petites évolutions pendant un mois.', price: 22900, priceId: 'price_1UH3ssAmS2hPu7V9ecJPPHW3' },

  // SEO & visibilité
  { id: 'optimisation-seo', category: 'visibilite', name: 'Optimisation SEO', tagline: 'Les réglages techniques et éditoriaux pour mieux remonter sur Google.', price: 20500, priceId: 'price_1U3zZzAmS2hPu7V9fR09a1ZD' },
  { id: 'pack-seo-local', category: 'visibilite', name: 'Pack SEO Local', tagline: 'Être trouvé par les clients de votre zone quand ils cherchent votre métier.', price: 20500, priceId: 'price_1U3ziVAmS2hPu7V9EgimSWFd' },
  { id: 'google-business', category: 'visibilite', name: 'Optimisation Google Business', tagline: 'Une fiche Google complète et à jour, qui inspire confiance et génère des appels.', price: 20500, priceId: 'price_1U3zfCAmS2hPu7V9sFABeFAL' },
  { id: 'redaction-seo', category: 'visibilite', name: 'Rédaction de 5 pages web SEO', tagline: 'Cinq pages rédigées pour vos clients et optimisées pour les moteurs de recherche.', price: 27900, priceId: 'price_1UH3sxAmS2hPu7V9Aej1JQpb' },
  { id: 'strategie-instagram', category: 'visibilite', name: 'Stratégie de contenu Instagram', tagline: 'Une ligne éditoriale claire et un plan de publications adapté à votre activité.', price: 21900, priceId: 'price_1UH3srAmS2hPu7V94T9GBkjN' },

  // IA & automatisation
  { id: 'audit-ia', category: 'ia', name: "Audit IA de l'entreprise", tagline: "Où l'IA peut vous faire gagner du temps, concrètement, dans votre activité.", price: 20500, priceId: 'price_1U3znaAmS2hPu7V9H7V7Dpw3' },
  { id: 'plan-automatisation', category: 'ia', name: "Plan d'automatisation", tagline: 'Les tâches répétitives identifiées et un plan pour les automatiser.', price: 20500, priceId: 'price_1U3zp0AmS2hPu7V9KBnBVRM3' },
  { id: 'chatbot-ia-basique', category: 'ia', name: 'Chatbot IA basique', tagline: 'Un assistant qui répond aux questions fréquentes de vos clients.', price: 20500, priceId: 'price_1U3zm2AmS2hPu7V9opoqXI3U' },
  { id: 'integration-chatbot', category: 'ia', name: 'Intégration de chatbot IA sur site existant', tagline: 'Un chatbot IA ajouté à votre site actuel, sans refonte.', price: 28900, priceId: 'price_1UH3syAmS2hPu7V9sDHrCyKZ' },
  { id: 'automatisation-emails', category: 'ia', name: 'Automatisation e-mails & relances', tagline: 'Vos e-mails de suivi et relances envoyés automatiquement, au bon moment.', price: 24900, priceId: 'price_1UH3suAmS2hPu7V9Vje2nAcK' },
  { id: 'formation-ia', category: 'ia', name: 'Formation IA pour équipe (2 h en visio)', tagline: 'Deux heures pour que votre équipe utilise l’IA au quotidien, sur vos cas réels.', price: 29900, priceId: 'price_1UH3szAmS2hPu7V9HWej3eNz' },

  // Audit & mesure
  { id: 'audit-ux', category: 'audit', name: 'Audit UX & conversion', tagline: 'Ce qui freine vos visiteurs, et les corrections prioritaires pour y remédier.', price: 20500, priceId: 'price_1U3zd8AmS2hPu7V9JYMl1XYZ' },
  { id: 'audit-performance', category: 'audit', name: 'Audit performance & vitesse', tagline: 'Un diagnostic de la vitesse de votre site et les leviers pour l’accélérer.', price: 20500, priceId: 'price_1U3zgzAmS2hPu7V998tgeKaQ' },
  { id: 'tracking-analytics', category: 'audit', name: 'Tracking & analytics', tagline: 'Des mesures fiables pour savoir d’où viennent vos clients et ce qu’ils font.', price: 23900, priceId: 'price_1UH3stAmS2hPu7V9MYFoaFtZ' },
];

/** Variable d'environnement de surcharge pour une offre donnée. */
function envPriceKey(id: string): string {
  return `STRIPE_PRICE_${id.toUpperCase().replace(/-/g, '_')}`;
}

/**
 * Retourne l'offre correspondante, ou undefined si l'identifiant est inconnu.
 * Sert de liste blanche : le client n'envoie jamais de price ID ni de montant.
 */
export function getOffer(id: unknown): Pick<Offer, 'id' | 'name' | 'price' | 'priceId'> | undefined {
  if (typeof id !== 'string') return undefined;
  const offer = [...offers, ...services].find((o) => o.id === id);
  if (!offer) return undefined;

  const override = process.env[envPriceKey(offer.id)];
  return override ? { ...offer, priceId: override } : offer;
}

const eur = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formate un montant en centimes vers « 1 499 € ». */
export function formatPrice(cents: number): string {
  return eur.format(cents / 100);
}

/**
 * Projection destinée au composant client : ni price ID, ni logique serveur ne
 * partent dans le bundle navigateur.
 */
export type OfferView = {
  id: string;
  name: string;
  tagline: string;
  priceLabel: string;
  delivery: string;
  features: string[];
  featured: boolean;
};

export function getOfferViews(): OfferView[] {
  return offers.map((o) => ({
    id: o.id,
    name: o.name,
    tagline: o.tagline,
    priceLabel: formatPrice(o.price),
    delivery: o.delivery,
    features: o.features,
    featured: o.featured ?? false,
  }));
}

export type ServiceView = {
  id: string;
  name: string;
  tagline: string;
  priceLabel: string;
  category: ServiceCategory;
};

export function getServiceViews(): ServiceView[] {
  return services.map((s) => ({
    id: s.id,
    name: s.name,
    tagline: s.tagline,
    priceLabel: formatPrice(s.price),
    category: s.category,
  }));
}
