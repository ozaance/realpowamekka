import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createPayment, toMollieAmount, updatePayment } from '@/lib/mollie';
import { getOffer } from '@/lib/offers';

type Offer = NonNullable<ReturnType<typeof getOffer>>;

/** Base URL utilisée pour les redirections de retour depuis Stripe / Mollie. */
function resolveOrigin(req: Request): string {
  const origin = req.headers.get('origin');
  if (origin) return origin;
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.powamekka.com';
}

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

export async function POST(req: Request) {
  try {
    const { offerId, provider, customer } = await req.json();

    // Le client n'envoie qu'un identifiant d'offre : le prix vient toujours du
    // catalogue serveur, jamais de la requête.
    const offer = getOffer(offerId);
    if (!offer) {
      return NextResponse.json({ error: 'Offre inconnue' }, { status: 400 });
    }

    const origin = resolveOrigin(req);

    if (provider === 'mollie') {
      const details = parseCustomer(customer);
      if (!details) {
        return NextResponse.json({ error: 'Nom et email valides requis' }, { status: 400 });
      }
      return NextResponse.json({ url: await mollieCheckout(offer, details, origin) });
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

async function mollieCheckout(offer: Offer, customer: Customer, origin: string): Promise<string> {
  // Mollie refuse un webhook injoignable depuis internet : en local, on s'en
  // passe (la page /merci relit de toute façon le statut du paiement).
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;
  const webhookUrl = /localhost|127\.0\.0\.1/.test(siteUrl)
    ? undefined
    : `${siteUrl}/api/mollie/webhook`;

  const payment = await createPayment({
    // Pour Mollie, le montant facturé est celui du catalogue (`offer.price`).
    amount: toMollieAmount(offer.price),
    description: `Powamekka — ${offer.name}`,
    redirectUrl: `${origin}/merci`,
    cancelUrl: `${origin}/offres?annule=1`,
    webhookUrl,
    metadata: {
      offer_id: offer.id,
      offer_name: offer.name,
      source: 'powamekka.com',
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
    },
  });

  // Mollie ne substitue pas l'identifiant dans redirectUrl comme Stripe : on
  // le renseigne une fois le paiement créé pour que /merci puisse le relire.
  await updatePayment(payment.id, { redirectUrl: `${origin}/merci?mollie_id=${payment.id}` });

  const url = payment._links.checkout?.href;
  if (!url) throw new Error('Paiement Mollie sans URL de paiement');
  return url;
}
