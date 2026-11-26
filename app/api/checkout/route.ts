import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createPayment, toMollieAmount, updatePayment } from '@/lib/mollie';
import { getOffer, isQuoteOnly, orderPlan, pricingMetadata } from '@/lib/offers';
import { clientIp, rateLimit } from '@/lib/security';
import {
  CGV_VERSION,
  METADATA_MAX_BYTES,
  billingFieldsEnabled,
  billingMetadata,
  cgvAcceptanceEnabled,
  metadataBytes,
  parseBilling,
} from '@/lib/billing';

type Offer = NonNullable<ReturnType<typeof getOffer>>;

const CANONICAL_ORIGIN = 'https://www.powamekka.com';

/**
 * Origines autorisées pour les URL de retour Stripe / Mollie : production,
 * déploiement Vercel courant (Preview), et localhost hors production.
 * VERCEL_URL / VERCEL_BRANCH_URL sont fournies automatiquement par Vercel.
 */
function allowedOrigins(): Set<string> {
  const set = new Set<string>([CANONICAL_ORIGIN, 'https://powamekka.com']);
  if (process.env.NEXT_PUBLIC_SITE_URL) set.add(process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ''));
  if (process.env.VERCEL_URL) set.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.VERCEL_BRANCH_URL) set.add(`https://${process.env.VERCEL_BRANCH_URL}`);
  return set;
}

/**
 * Base URL utilisée pour les redirections de retour depuis Stripe / Mollie.
 * L'en-tête Origin n'est retenu que s'il figure dans la liste blanche : un
 * site tiers ne peut plus créer une session qui renvoie vers son domaine.
 */
function resolveOrigin(req: Request): string {
  const origin = req.headers.get('origin');
  if (origin) {
    if (allowedOrigins().has(origin)) return origin;
    if (process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return origin;
    }
  }
  return process.env.NEXT_PUBLIC_SITE_URL || CANONICAL_ORIGIN;
}

/** 10 ouvertures de paiement par IP et par tranche de 10 minutes. */
const RATE = { limit: 10, windowMs: 10 * 60 * 1000 };

type Customer = { name: string; email: string; phone: string; company: string };

/** Coordonnées saisies sur le site : Mollie, contrairement à Stripe, ne les collecte pas. */
function parseCustomer(raw: unknown): Customer | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? v.trim().slice(0, 200) : '');
  const customer = {
    name: str(r.name),
    email: str(r.email),
    phone: str(r.phone),
    company: str(r.company),
  };
  if (!customer.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return null;
  return customer;
}

/**
 * Stripe est temporairement fermé aux nouvelles commandes : ses prix sont ceux
 * de l'ancienne grille. L'intégration est conservée (fonction stripeCheckout,
 * webhook Stripe, confirmation des anciennes commandes sur /merci) ; il suffit
 * de repasser cette constante à true pour la rouvrir.
 */
const STRIPE_CHECKOUT_OPEN = false;

export async function POST(req: Request) {
  if (!rateLimit(`checkout:${clientIp(req)}`, RATE.limit, RATE.windowMs)) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
      { status: 429 }
    );
  }

  try {
    const { offerId, provider, customer, billing, acceptCgv } = await req.json();

    // Le client n'envoie qu'un identifiant d'offre : le prix vient toujours du
    // catalogue serveur, jamais de la requête.
    const offer = getOffer(offerId);
    if (!offer) {
      return NextResponse.json({ error: 'Offre inconnue' }, { status: 400 });
    }

    // Prototype MVP et SaaS : sur devis uniquement. Refus avant tout appel à
    // Mollie ou Stripe, quel que soit le moyen de paiement demandé.
    if (isQuoteOnly(offer.id)) {
      return NextResponse.json(
        { error: 'Cette offre se commande sur devis. Demandez un devis depuis la page Offres.' },
        { status: 403 }
      );
    }

    const origin = resolveOrigin(req);

    if (provider === 'mollie') {
      const details = parseCustomer(customer);
      if (!details) {
        return NextResponse.json({ error: 'Nom et email valides requis' }, { status: 400 });
      }

      // Informations de facturation et acceptation des CGV : désactivées par défaut. Tant qu'elles le sont,
      // `extra` reste vide et la requête envoyée à Mollie est strictement celle d'avant.
      let extra: Record<string, string> = {};
      if (billingFieldsEnabled()) {
        const parsed = parseBilling(billing);
        if (!parsed.ok) {
          return NextResponse.json({ error: parsed.error, field: parsed.field }, { status: 400 });
        }
        details.company = parsed.value.companyName;
        extra = billingMetadata(parsed.value);
      }
      if (cgvAcceptanceEnabled()) {
        if (acceptCgv !== true) {
          return NextResponse.json(
            { error: "Acceptez les conditions générales de vente pour continuer.", field: 'acceptCgv' },
            { status: 400 }
          );
        }
        extra = { ...extra, cgv_version: CGV_VERSION, cgv_accepted_at: new Date().toISOString() };
      }

      // Grille 2026 active : repère de grille et échéance dans les métadonnées (vide sinon : rien ne change).
      extra = { ...extra, ...pricingMetadata(offer.id) };

      if (Object.keys(extra).length > 0) {
        const size = metadataBytes({ ...mollieMetadata(offer, details), ...extra });
        if (size > METADATA_MAX_BYTES) {
          return NextResponse.json({ error: 'Certaines informations sont trop longues. Raccourcissez-les.' }, { status: 400 });
        }
      }

      return NextResponse.json({ url: await mollieCheckout(offer, details, origin, extra) });
    }

    // Toute autre demande que Mollie relève de Stripe : refusée sans appel à Stripe.
    if (!STRIPE_CHECKOUT_OPEN) {
      return NextResponse.json(
        { error: 'Ce moyen de paiement est temporairement indisponible.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ url: await stripeCheckout(offer, origin) });
  } catch (err) {
    console.error('[checkout]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

async function stripeCheckout(offer: Offer, origin: string): Promise<string> {
  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    locale: 'fr',
    line_items: [{ price: offer.priceId, quantity: 1 }],
    success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/offres?annule=1`,
    billing_address_collection: 'required',
    phone_number_collection: { enabled: true },
    custom_fields: [
      {
        key: 'entreprise',
        label: { type: 'custom', custom: 'Nom de votre entreprise' },
        type: 'text',
        optional: true,
      },
    ],
    metadata: {
      offer_id: offer.id,
      offer_name: offer.name,
      source: 'powamekka.com',
    },
  });

  if (!session.url) throw new Error('Session Stripe sans URL de paiement');
  return session.url;
}

/** Métadonnées d'un paiement Mollie : identiques à l'ancien parcours, auxquelles s'ajoutent `extra` si actif. */
function mollieMetadata(offer: Offer, customer: Customer): Record<string, string> {
  return {
    offer_id: offer.id,
    offer_name: offer.name,
    source: 'powamekka.com',
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    company: customer.company,
  };
}

async function mollieCheckout(
  offer: Offer,
  customer: Customer,
  origin: string,
  extra: Record<string, string> = {}
): Promise<string> {
  // Mollie refuse un webhook injoignable depuis internet : en local, on s'en
  // passe (la page /merci relit de toute façon le statut du paiement).
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;
  const webhookUrl = /localhost|127\.0\.0\.1/.test(siteUrl)
    ? undefined
    : `${siteUrl}/api/mollie/webhook`;

  const plan = orderPlan(offer.id);
  const payment = await createPayment({
    // Pour Mollie, le montant facturé est celui du catalogue (`offer.price`).
    amount: toMollieAmount(offer.price),
    // Commande en plusieurs échéances (grille 2026 active) : la première échéance est repérée dans le libellé.
    description: `Powamekka : ${offer.name}${plan ? ` (acompte 1/${plan.total})` : ''}`,
    redirectUrl: `${origin}/merci`,
    cancelUrl: `${origin}/offres?annule=1`,
    webhookUrl,
    metadata: { ...mollieMetadata(offer, customer), ...extra },
  });

  // Mollie ne substitue pas l'identifiant dans redirectUrl comme Stripe : on
  // le renseigne une fois le paiement créé pour que /merci puisse le relire.
  await updatePayment(payment.id, { redirectUrl: `${origin}/merci?mollie_id=${payment.id}` });

  const url = payment._links.checkout?.href;
  if (!url) throw new Error('Paiement Mollie sans URL de paiement');
  return url;
}
