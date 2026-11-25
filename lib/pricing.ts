/**
 * Grille tarifaire 2026 de POWAMEKKA (clientèle exclusivement professionnelle).
 *
 * PRÉPARÉE, PAS ENCORE BRANCHÉE. Ce module n'est importé nulle part : le site
 * affiche et Mollie encaisse toujours les montants de `lib/offers.ts`. Le
 * branchement (affichage HT et TTC, échéanciers, montants Mollie) fera l'objet
 * de PR dédiées, après validation.
 *
 * Montants en centimes d'euro, HT. Le TTC est calculé (TVA 20 %) et vérifié
 * contre la grille de référence fournie.
 */

/** Taux de TVA facturé, en pourcentage. */
export const VAT_RATE_PERCENT = 20;

/** Montant TTC (centimes) à partir d'un montant HT (centimes). */
export function toTTC(centsHT: number): number {
  return Math.round((centsHT * (100 + VAT_RATE_PERCENT)) / 100);
}

const eurWhole = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const eurCents = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });

/** « 1 188 € » ou « 274,80 € » : centimes affichés seulement s'ils existent. */
export function formatEuros(cents: number): string {
  return (cents % 100 === 0 ? eurWhole : eurCents).format(cents / 100);
}

/** Libellés sans ambiguïté, prêts à afficher : « 390 € HT » et « 468 € TTC ». */
export function priceLabels(centsHT: number): { ht: string; ttc: string } {
  return { ht: `${formatEuros(centsHT)} HT`, ttc: `${formatEuros(toTTC(centsHT))} TTC` };
}

/* ------------------------------------------------------------------ */
/* Paiements                                                           */
/* ------------------------------------------------------------------ */

/** Une échéance de paiement : part du prix et moment où elle est due. */
export type Tranche = { percent: number; due: string };

const AT_ORDER = 'à la commande';

/** Règle commune aux projets en plusieurs échéances. */
export const FINAL_PAYMENT_RULE =
  'Le dernier paiement est encaissé avant la mise en production et la remise des accès définitifs.';

/** Projets sur devis uniquement (MVP, SaaS) : la commande en ligne est refusée ;
    la première échéance est due à l'acceptation du devis, non « à la commande ». */
const AT_QUOTE = "sur devis, à l'acceptation du devis";

const PROJECT_40_40_20: Tranche[] = [
  { percent: 40, due: AT_QUOTE },
  { percent: 40, due: 'après validation de la conception' },
  { percent: 20, due: 'avant livraison finale' },
];

/* ------------------------------------------------------------------ */
/* Offres principales                                                  */
/* ------------------------------------------------------------------ */

export type GridOffer = {
  /** Identifiant de l'offre dans `lib/offers.ts`. */
  id: 'landing-page' | 'site-vitrine' | 'prototype-mvp' | 'saas-standard' | 'saas-premium';
  priceHT: number;
  schedule: Tranche[];
  /** Mois d'hébergement inclus, le cas échéant. */
  hostingIncludedMonths?: number;
};

export const GRID_2026: GridOffer[] = [
  { id: 'landing-page', priceHT: 39000, schedule: [{ percent: 100, due: AT_ORDER }], hostingIncludedMonths: 12 },
  {
    id: 'site-vitrine',
    priceHT: 99000,
    schedule: [
      { percent: 50, due: AT_ORDER },
      { percent: 50, due: 'avant livraison' },
    ],
    hostingIncludedMonths: 12,
  },
  { id: 'prototype-mvp', priceHT: 300000, schedule: PROJECT_40_40_20 },
  { id: 'saas-standard', priceHT: 600000, schedule: PROJECT_40_40_20 },
  { id: 'saas-premium', priceHT: 1200000, schedule: PROJECT_40_40_20 },
];

/* ------------------------------------------------------------------ */
/* Prestations à la carte                                              */
/* ------------------------------------------------------------------ */

export type GridService = {
  /** Identifiant de la prestation dans `lib/offers.ts` (services). */
  id: string;
  /** Nom tel qu'il figure dans la grille validée (affiché à la bascule). */
  gridName: string;
  priceHT: number;
  /** Nouvelle description, lorsque le périmètre change ; sinon, la description
      actuelle de `lib/offers.ts` est conservée. */
  tagline?: string;
};

/** Paiement des prestations à la carte, lorsque le périmètre est défini. */
export const SERVICE_SCHEDULE: Tranche[] = [{ percent: 100, due: AT_ORDER }];

export const SERVICES_GRID_2026: GridService[] = [
  // Sites & design
  {
    id: 'refonte-site',
    gridName: "Refonte d'une page existante",
    priceHT: 39000,
    tagline: 'Une page existante de votre site repensée : structure, design et lisibilité.',
  },
  { id: 'design-ui-page', gridName: "Design UI d'une page", priceHT: 25000 },
  { id: 'optimisation-page-vente', gridName: 'Optimisation page de vente', priceHT: 35000 },
  { id: 'charte-graphique', gridName: 'Charte graphique express', priceHT: 35000 },
  { id: 'migration-site', gridName: 'Migration et mise en ligne', priceHT: 25000 },
  {
    id: 'maintenance-site',
    gridName: 'Maintenance de site (1 mois)',
    priceHT: 22900,
    // Aucun volume horaire n'est inclus : ne jamais mentionner d'heures.
    tagline:
      "Une intervention ponctuelle d'un mois : mises à jour et corrections de votre site. Distincte de l'abonnement d'hébergement et de maintenance.",
  },
  // SEO & visibilité
  { id: 'optimisation-seo', gridName: 'Optimisation SEO', priceHT: 29000 },
  { id: 'pack-seo-local', gridName: 'Pack SEO local', priceHT: 25000 },
  { id: 'google-business', gridName: 'Optimisation Google Business', priceHT: 15000 },
  { id: 'redaction-seo', gridName: 'Rédaction de 5 pages SEO', priceHT: 49000 },
  { id: 'strategie-instagram', gridName: 'Stratégie de contenu Instagram', priceHT: 29000 },
  // IA & automatisation
  { id: 'audit-ia', gridName: "Audit IA d'entreprise", priceHT: 20500 },
  { id: 'plan-automatisation', gridName: "Plan d'automatisation", priceHT: 29000 },
  { id: 'chatbot-ia-basique', gridName: 'Chatbot IA basique', priceHT: 39000 },
  {
    id: 'integration-chatbot',
    gridName: "Intégration d'un chatbot",
    priceHT: 29000,
    tagline:
      "L'installation et la configuration sur votre site d'un chatbot déjà conçu. La conception du chatbot n'est pas comprise.",
  },
  { id: 'automatisation-emails', gridName: 'Automatisation e-mails et relances', priceHT: 39000 },
  {
    id: 'formation-ia',
    gridName: 'Formation IA de 2 heures',
    priceHT: 25000,
    // Format conservé : 2 heures en visioconférence, pour une équipe.
    tagline: "Deux heures en visioconférence pour que votre équipe utilise l'IA au quotidien, sur vos cas réels.",
  },
  // Audit & mesure
  { id: 'audit-ux', gridName: 'Audit UX et conversion', priceHT: 29000 },
  { id: 'audit-performance', gridName: 'Audit performance et vitesse', priceHT: 19000 },
  { id: 'tracking-analytics', gridName: 'Tracking et analytics', priceHT: 29000 },
];

/* ------------------------------------------------------------------ */
/* Hébergement et maintenance                                          */
/* ------------------------------------------------------------------ */

/**
 * Abonnement après les 12 mois d'hébergement inclus (Landing page, Site
 * vitrine). Distinct de la prestation ponctuelle « Maintenance de site
 * (1 mois) » du catalogue à la carte.
 */
export const HOSTING_SUBSCRIPTION = {
  appliesTo: ['landing-page', 'site-vitrine'] as const,
  includedMonths: 12,
  fromMonth: 13,
  monthlyHT: 14900,
  includes: [
    'Hébergement',
    'Suivi technique',
    'Sauvegardes, lorsque disponibles',
    "Petites corrections et mises à jour, dans la limite d'une heure par mois",
    'Support par e-mail',
  ],
  excludes: ['Nouvelles fonctionnalités', 'Refontes', 'Licences', 'Noms de domaine', "Consommations d'API"],
} as const;

/** Mention à faire figurer quand les coûts tiers ne sont pas inclus. */
export const THIRD_PARTY_EXCLUSION =
  'Coûts des services tiers (nom de domaine, licences, API) non inclus, sauf mention contraire.';

/* ------------------------------------------------------------------ */
/* Calculs                                                             */
/* ------------------------------------------------------------------ */

/**
 * Montants HT et TTC de chaque échéance. La dernière absorbe un éventuel
 * arrondi, pour que la somme des échéances égale exactement le total.
 */
export function scheduleAmounts(priceHT: number, schedule: Tranche[]): { percent: number; due: string; ht: number; ttc: number }[] {
  const totalTTC = toTTC(priceHT);
  let paidHT = 0;
  let paidTTC = 0;
  return schedule.map((t, i) => {
    const last = i === schedule.length - 1;
    const ht = last ? priceHT - paidHT : Math.round((priceHT * t.percent) / 100);
    const ttc = last ? totalTTC - paidTTC : Math.round((totalTTC * t.percent) / 100);
    paidHT += ht;
    paidTTC += ttc;
    return { percent: t.percent, due: t.due, ht, ttc };
  });
}
