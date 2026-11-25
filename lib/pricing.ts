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
 *
 * Restent à fournir avant branchement :
 * - la grille des prestations à la carte ;
 * - le périmètre de la maintenance ;
 * - le moment de chaque échéance de paiement (à la commande, à la livraison…).
 */

/** Taux de TVA facturé, en pourcentage. */
export const VAT_RATE_PERCENT = 20;

/** Montant TTC (centimes) à partir d'un montant HT (centimes). */
export function toTTC(centsHT: number): number {
  return Math.round((centsHT * (100 + VAT_RATE_PERCENT)) / 100);
}

/** Une échéance de paiement : part du prix, et moment où elle est due. */
export type Tranche = {
  percent: number;
  /** null tant que le moment de l'échéance n'a pas été précisé. */
  due: string | null;
};

export type GridOffer = {
  /** Identifiant de l'offre dans `lib/offers.ts`. */
  id: 'landing-page' | 'site-vitrine' | 'prototype-mvp' | 'saas-standard' | 'saas-premium';
  priceHT: number;
  schedule: Tranche[];
  /** Hébergement inclus, le cas échéant. */
  hostingIncludedMonths?: number;
};

/** Hébergement après la période incluse (Landing page et Site vitrine). */
export const HOSTING_AFTER_INCLUDED = {
  monthlyHT: 14900,
  fromMonth: 13,
} as const;

/** Mention à faire figurer quand les coûts tiers ne sont pas inclus. */
export const THIRD_PARTY_EXCLUSION =
  'Coûts des services tiers (nom de domaine, API, abonnements) non inclus, sauf mention contraire.';

export const GRID_2026: GridOffer[] = [
  {
    id: 'landing-page',
    priceHT: 39000,
    schedule: [{ percent: 100, due: 'à la commande' }],
    hostingIncludedMonths: 12,
  },
  {
    id: 'site-vitrine',
    priceHT: 99000,
    schedule: [
      { percent: 50, due: null },
      { percent: 50, due: null },
    ],
    hostingIncludedMonths: 12,
  },
  {
    id: 'prototype-mvp',
    priceHT: 300000,
    schedule: [
      { percent: 40, due: null },
      { percent: 40, due: null },
      { percent: 20, due: null },
    ],
  },
  {
    id: 'saas-standard',
    priceHT: 600000,
    schedule: [
      { percent: 40, due: null },
      { percent: 40, due: null },
      { percent: 20, due: null },
    ],
  },
  {
    id: 'saas-premium',
    priceHT: 1200000,
    schedule: [
      { percent: 40, due: null },
      { percent: 40, due: null },
      { percent: 20, due: null },
    ],
  },
];

/**
 * Montants HT et TTC de chaque échéance. La dernière absorbe un éventuel
 * arrondi, pour que la somme des échéances égale exactement le total.
 */
export function scheduleAmounts(offer: GridOffer): { percent: number; due: string | null; ht: number; ttc: number }[] {
  const totalTTC = toTTC(offer.priceHT);
  let paidHT = 0;
  let paidTTC = 0;
  return offer.schedule.map((t, i) => {
    const last = i === offer.schedule.length - 1;
    const ht = last ? offer.priceHT - paidHT : Math.round((offer.priceHT * t.percent) / 100);
    const ttc = last ? totalTTC - paidTTC : Math.round((totalTTC * t.percent) / 100);
    paidHT += ht;
    paidTTC += ttc;
    return { percent: t.percent, due: t.due, ht, ttc };
  });
}
