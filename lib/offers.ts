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

import { GRID_2026, SERVICES_GRID_2026, SERVICE_SCHEDULE, VAT_RATE_PERCENT, formatEuros, scheduleAmounts, toTTC, type Tranche } from './pricing';

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
    delivery: 'Délai confirmé après cadrage',
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
    delivery: 'Délai confirmé après cadrage',
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
    delivery: 'Délai confirmé après cadrage',
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
    delivery: 'Délai confirmé après cadrage',
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
    delivery: 'Délai confirmé après cadrage',
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

/**
 * Offres et prestations vendues uniquement sur devis : jamais de commande ni de
 * paiement en ligne, et aucun prix affiché. Les projets (MVP, SaaS) sont facturés
 * en trois échéances (40 %, 40 %, 20 %) par facture et lien de paiement, hors du
 * site. Les prestations ci-dessous demandent un cadrage avant chiffrage. Liste
 * serveur unique : elle commande à la fois le refus dans l'API de paiement et
 * l'affichage « Sur devis » et du bouton « Demander un devis ». Les montants du
 * catalogue restent en place, inchangés, pour une éventuelle remise en vente.
 */
const QUOTE_ONLY_IDS: ReadonlySet<string> = new Set([
  'prototype-mvp',
  'saas-standard',
  'saas-premium',
  'refonte-site',
  'design-ui-page',
  'optimisation-page-vente',
  'charte-graphique',
  'migration-site',
  'redaction-seo',
  'strategie-instagram',
  'plan-automatisation',
  'integration-chatbot',
  'automatisation-emails',
  'formation-ia',
  'audit-performance',
  'tracking-analytics',
]);

/** Libellé affiché à la place du prix pour une offre sur devis. */
export const QUOTE_LABEL = 'Sur devis';

export function isQuoteOnly(id: string): boolean {
  return QUOTE_ONLY_IDS.has(id);
}

/* ------------------------------------------------------------------ */
/* Grille tarifaire 2026 (lib/pricing.ts)                              */
/* ------------------------------------------------------------------ */

/**
 * PRÉPARÉE, DÉSACTIVÉE PAR DÉFAUT. Tant que `PRICING_2026` n'est pas à « 1 », le site affiche et Mollie
 * encaisse les prix du catalogue ci-dessus, sans aucun changement. Activée, la grille 2026 de
 * `lib/pricing.ts` devient la source unique : affichage HT, TVA et TTC, et montant encaissé par Mollie =
 * montant TTC affiché. L'activation relève du responsable du projet (CGV publiées, outil de facturation
 * choisi, collecte des informations de facturation, tests Mollie en mode test).
 */
export function pricing2026Enabled(): boolean {
  return process.env.PRICING_2026 === '1';
}

type GridService = (typeof SERVICES_GRID_2026)[number];
const gridServiceOf = (id: string): GridService | undefined => SERVICES_GRID_2026.find((s) => s.id === id);

/** Prix HT (centimes) de la grille 2026 pour une offre ou une prestation, ou undefined. */
export function gridPriceHT(id: string): number | undefined {
  return GRID_2026.find((o) => o.id === id)?.priceHT ?? gridServiceOf(id)?.priceHT;
}

/** Échéancier de la grille pour une offre ou une prestation, ou undefined. */
function scheduleOf(id: string): Tranche[] | undefined {
  const offer = GRID_2026.find((o) => o.id === id);
  if (offer) return offer.schedule;
  return gridServiceOf(id) ? SERVICE_SCHEDULE : undefined;
}

/**
 * Montant TTC (centimes) dû à la commande en ligne : la première échéance de la grille.
 * Landing page et prestations à la carte : le total. Site vitrine : 50 % (594 € TTC).
 */
export function dueAtOrderTTC(id: string): number | undefined {
  const ht = gridPriceHT(id);
  const schedule = scheduleOf(id);
  if (ht === undefined || !schedule) return undefined;
  return scheduleAmounts(ht, schedule)[0].ttc;
}

/** Commande payée en plusieurs échéances : première échéance encaissée en ligne, le reste sur facture et lien de paiement. */
export type OrderPlan = {
  /** Nombre total d'échéances. */
  total: number;
  /** Total TTC de la commande (centimes). */
  totalTTC: number;
  /** Première échéance TTC, encaissée à la commande (centimes). */
  dueNowTTC: number;
  /** Reste à régler TTC (centimes). */
  remainingTTC: number;
};

/** Plan de paiement d'une commande en ligne en plusieurs échéances ; undefined si la grille est inactive ou si le paiement est unique. */
export function orderPlan(id: string): OrderPlan | undefined {
  if (!pricing2026Enabled() || isQuoteOnly(id)) return undefined;
  const ht = gridPriceHT(id);
  const schedule = scheduleOf(id);
  if (ht === undefined || !schedule || schedule.length < 2) return undefined;
  const amounts = scheduleAmounts(ht, schedule);
  const totalTTC = toTTC(ht);
  return { total: schedule.length, totalTTC, dueNowTTC: amounts[0].ttc, remainingTTC: totalTTC - amounts[0].ttc };
}

/** Métadonnées ajoutées au paiement Mollie quand la grille est active : repère de grille et échéance. */
export function pricingMetadata(id: string): Record<string, string> {
  if (!pricing2026Enabled()) return {};
  const meta: Record<string, string> = { grille: '2026' };
  const plan = orderPlan(id);
  if (plan) {
    meta.echeance = `1/${plan.total}`;
    meta.total_ttc = (plan.totalTTC / 100).toFixed(2);
    meta.solde_ttc = (plan.remainingTTC / 100).toFixed(2);
  }
  return meta;
}

/** Libellés d'échéancier (grille active) : à la commande en ligne, ou sur devis. */
function scheduleDisplay(id: string): { scheduleLabel?: string; dueNowLabel?: string; balanceLabel?: string } {
  if (!pricing2026Enabled()) return {};
  const schedule = scheduleOf(id);
  const ht = gridPriceHT(id);
  if (!schedule || ht === undefined) return {};
  if (isQuoteOnly(id)) {
    return {
      scheduleLabel:
        schedule.length === 3
          ? `Paiement en 3 échéances : ${schedule[0].percent} % à l'acceptation du devis, ${schedule[1].percent} % après validation de la conception, ${schedule[2].percent} % avant la livraison finale.`
          : "Paiement intégral à l'acceptation du devis.",
    };
  }
  const plan = orderPlan(id);
  const ttc = (c: number) => `${formatEuros(c)} TTC`;
  if (plan) {
    return {
      scheduleLabel: `Acompte de ${ttc(plan.dueNowTTC)} à la commande, puis ${ttc(plan.remainingTTC)} avant la livraison.`,
      dueNowLabel: ttc(plan.dueNowTTC),
      balanceLabel: `Solde de ${ttc(plan.remainingTTC)} avant la livraison : facture et lien de paiement envoyés par e-mail.`,
    };
  }
  return { scheduleLabel: `Paiement de ${ttc(toTTC(ht))} à la commande.`, dueNowLabel: ttc(toTTC(ht)) };
}

/** Libellés de prix HT, TVA et TTC (grille 2026), ou aucun si la grille n'est pas active ou si l'offre est sur devis. */
function priceDisplay(id: string): { priceHTLabel: string; priceTTCLabel: string; vatLabel: string } | undefined {
  if (!pricing2026Enabled() || isQuoteOnly(id)) return undefined;
  const ht = gridPriceHT(id);
  if (ht === undefined) return undefined;
  const ttc = toTTC(ht);
  return {
    priceHTLabel: `${formatEuros(ht)} HT`,
    priceTTCLabel: `${formatEuros(ttc)} TTC`,
    vatLabel: `TVA ${VAT_RATE_PERCENT} % : ${formatEuros(ttc - ht)}`,
  };
}

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
  const base = override ? { ...offer, priceId: override } : offer;

  // Grille 2026 active : le montant encaissé est le montant TTC affiché, et le nom celui de la grille.
  if (pricing2026Enabled()) {
    const due = dueAtOrderTTC(base.id);
    if (due !== undefined) return { ...base, price: due, name: gridServiceOf(base.id)?.gridName ?? base.name };
  }
  return base;
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
  /** Grille 2026 active : prix HT, TTC et TVA (absents sinon). */
  priceHTLabel?: string;
  priceTTCLabel?: string;
  vatLabel?: string;
  /** Grille 2026 active : échéancier, montant dû maintenant et solde. */
  scheduleLabel?: string;
  dueNowLabel?: string;
  balanceLabel?: string;
  delivery: string;
  features: string[];
  featured: boolean;
  /** Vendue sur devis uniquement : pas de commande en ligne. */
  quoteOnly: boolean;
};

export function getOfferViews(): OfferView[] {
  return offers.map((o) => ({
    id: o.id,
    name: o.name,
    tagline: o.tagline,
    priceLabel: isQuoteOnly(o.id) ? QUOTE_LABEL : (priceDisplay(o.id)?.priceHTLabel ?? formatPrice(o.price)),
    ...priceDisplay(o.id),
    ...scheduleDisplay(o.id),
    delivery: o.delivery,
    features: o.features,
    featured: o.featured ?? false,
    quoteOnly: isQuoteOnly(o.id),
  }));
}

export type ServiceView = {
  id: string;
  name: string;
  tagline: string;
  priceLabel: string;
  /** Grille 2026 active : prix HT, TTC et TVA (absents sinon). */
  priceHTLabel?: string;
  priceTTCLabel?: string;
  vatLabel?: string;
  scheduleLabel?: string;
  dueNowLabel?: string;
  balanceLabel?: string;
  category: ServiceCategory;
  /** Vendue sur devis uniquement : pas de commande en ligne. */
  quoteOnly: boolean;
};

export function getServiceViews(): ServiceView[] {
  return services.map((s) => ({
    id: s.id,
    // Grille 2026 active : nom et description de la grille validée.
    name: pricing2026Enabled() ? (gridServiceOf(s.id)?.gridName ?? s.name) : s.name,
    tagline: pricing2026Enabled() ? (gridServiceOf(s.id)?.tagline ?? s.tagline) : s.tagline,
    priceLabel: isQuoteOnly(s.id) ? QUOTE_LABEL : (priceDisplay(s.id)?.priceHTLabel ?? formatPrice(s.price)),
    ...priceDisplay(s.id),
    ...scheduleDisplay(s.id),
    category: s.category,
    quoteOnly: isQuoteOnly(s.id),
  }));
}
