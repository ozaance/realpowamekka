import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getOffer } from '@/lib/offers';

/** Base URL utilisée pour les redirections de retour depuis Stripe. */
function resolveOrigin(req: Request): string {
  const origin = req.headers.get('origin');
  if (origin) return origin;
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.powamekka.com';
}

export async function POST(req: Request) {
  try {
    const { offerId } = await req.json();

    // Le client n'envoie qu'un identifiant d'offre : le prix vient toujours du
    // catalogue serveur, jamais de la requête.
    const offer = getOffer(offerId);
    if (!offer) {
      return NextResponse.json({ error: 'Offre inconnue' }, { status: 400 });
    }

    const origin = resolveOrigin(req);

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

    if (!session.url) {
      return NextResponse.json({ error: 'Session sans URL de paiement' }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
