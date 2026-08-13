/**
 * Catalogue des offres vendues en ligne.
 *
 * Le montant réellement facturé vient toujours de Stripe via `priceId` : le champ
 * `price` ci-dessous ne sert qu'à l'affichage. Si vous modifiez un tarif dans le
 * dashboard Stripe, pensez à mettre à jour `price` ici pour éviter un écart entre
 * la page et l'écran de paiement.
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
  /** Montant affiché, en centimes d'euro */
  price: number;
  delivery: string;
  features: string[];
  /** Price ID Stripe (mode live) */
  priceId: string;
  featured?: boolean;
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

/** Variable d'environnement de surcharge pour une offre donnée. */
function envPriceKey(id: string): string {
  return `STRIPE_PRICE_${id.toUpperCase().replace(/-/g, '_')}`;
}

/**
 * Retourne l'offre correspondante, ou undefined si l'identifiant est inconnu.
 * Sert de liste blanche : le client n'envoie jamais de price ID ni de montant.
 */
export function getOffer(id: unknown): Offer | undefined {
  if (typeof id !== 'string') return undefined;
  const offer = offers.find((o) => o.id === id);
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
