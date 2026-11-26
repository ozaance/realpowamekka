/**
 * Informations de facturation d'un client professionnel (commande en ligne).
 *
 * PRÉPARÉ, DÉSACTIVÉ PAR DÉFAUT. Tant que `BILLING_FIELDS_ENABLED` n'est pas à « 1 », la fenêtre de
 * commande et la route de paiement se comportent exactement comme avant : mêmes champs, même requête
 * envoyée à Mollie. L'activation relève du responsable du projet : elle suppose que la politique de
 * confidentialité soit mise à jour (nouvelles données collectées) et que les CGV soient publiées.
 *
 * Module sans dépendance : les mêmes contrôles servent dans le navigateur et sur le serveur. Le serveur
 * reste l'autorité : rien de ce qui est vérifié ici n'est cru sans être revérifié côté serveur.
 */

/** Version des CGV acceptées, enregistrée avec la commande quand l'acceptation est active. */
export const CGV_VERSION = '1.0';

/** Collecte des informations de facturation. Désactivée sauf BILLING_FIELDS_ENABLED=1. */
export function billingFieldsEnabled(): boolean {
  return process.env.BILLING_FIELDS_ENABLED === '1';
}

/** Case d'acceptation des CGV. Désactivée sauf CGV_ACCEPTANCE_ENABLED=1 (CGV publiées et validées). */
export function cgvAcceptanceEnabled(): boolean {
  return process.env.CGV_ACCEPTANCE_ENABLED === '1';
}

export type Billing = {
  companyName: string;
  siren: string;
  vatNumber: string;
  street: string;
  street2: string;
  postalCode: string;
  city: string;
};

export type BillingField = keyof Billing | 'acceptCgv';
export type BillingResult =
  | { ok: true; value: Billing }
  | { ok: false; error: string; field: BillingField };

export const BILLING_LIMITS = { companyName: 100, street: 120, street2: 80, city: 60 };

const clean = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) : '';

/** Clé de Luhn (algorithme de contrôle du SIREN) : détecte les fautes de frappe, pas les entreprises inexistantes. */
export function luhnValid(digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/** SIREN sans espaces (y compris insécables), ou null s'il n'a pas 9 chiffres. */
export function normalizeSiren(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const s = raw.replace(/[\s  .]/g, '');
  return /^\d{9}$/.test(s) ? s : null;
}

/** Numéro de TVA français normalisé en majuscules, sans espaces. */
export function normalizeVat(raw: unknown): string {
  return typeof raw === 'string' ? raw.replace(/[\s  .]/g, '').toUpperCase().slice(0, 13) : '';
}

/** TVA intracommunautaire française : « FR », clé sur deux caractères, puis le SIREN saisi. */
export function vatMatchesSiren(vat: string, siren: string): boolean {
  const m = /^FR([0-9A-Z]{2})(\d{9})$/.exec(vat);
  if (!m || m[2] !== siren) return false;
  if (/^\d{2}$/.test(m[1])) {
    const key = (12 + 3 * (Number(siren) % 97)) % 97;
    return Number(m[1]) === key;
  }
  return true; // clé alphanumérique : seule la cohérence avec le SIREN est contrôlable
}

/**
 * Contrôle les informations de facturation. Retourne le premier champ en erreur avec un message clair en
 * français. Le pays est fixé à la France (entreprises françaises uniquement) : il n'est pas saisi.
 */
export function parseBilling(raw: unknown): BillingResult {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  const companyName = clean(r.companyName, BILLING_LIMITS.companyName);
  if (companyName.length < 2) {
    return { ok: false, field: 'companyName', error: "Indiquez le nom de l'entreprise ou du professionnel." };
  }

  const siren = normalizeSiren(r.siren);
  if (!siren) return { ok: false, field: 'siren', error: 'Le numéro SIREN comporte 9 chiffres.' };
  if (!luhnValid(siren)) {
    return { ok: false, field: 'siren', error: 'Numéro SIREN invalide : vérifiez les 9 chiffres.' };
  }

  const vatNumber = normalizeVat(r.vatNumber);
  if (vatNumber && !vatMatchesSiren(vatNumber, siren)) {
    return {
      ok: false,
      field: 'vatNumber',
      error: 'Numéro de TVA invalide : il doit commencer par FR et contenir votre SIREN. Laissez ce champ vide si vous ne le connaissez pas.',
    };
  }

  const street = clean(r.street, BILLING_LIMITS.street);
  if (street.length < 3) return { ok: false, field: 'street', error: "Indiquez l'adresse de facturation." };

  const street2 = clean(r.street2, BILLING_LIMITS.street2);

  const postalCode = typeof r.postalCode === 'string' ? r.postalCode.replace(/\s/g, '') : '';
  if (!/^\d{5}$/.test(postalCode)) {
    return { ok: false, field: 'postalCode', error: 'Le code postal comporte 5 chiffres.' };
  }

  const city = clean(r.city, BILLING_LIMITS.city);
  if (!city) return { ok: false, field: 'city', error: 'Indiquez la ville.' };

  return { ok: true, value: { companyName, siren, vatNumber, street, street2, postalCode, city } };
}

/** Métadonnées Mollie ajoutées à un paiement quand la collecte est active : rien d'autre n'est conservé. */
export function billingMetadata(b: Billing): Record<string, string> {
  const meta: Record<string, string> = {
    siren: b.siren,
    adresse: b.street2 ? `${b.street}, ${b.street2}` : b.street,
    cp: b.postalCode,
    ville: b.city,
  };
  if (b.vatNumber) meta.tva = b.vatNumber;
  return meta;
}

/** Mollie limite les métadonnées à environ 1 ko : on refuse plutôt que de tronquer en silence. */
export const METADATA_MAX_BYTES = 1000;

export function metadataBytes(meta: Record<string, unknown>): number {
  return new TextEncoder().encode(JSON.stringify(meta)).length;
}
