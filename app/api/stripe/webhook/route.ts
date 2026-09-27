import type Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { formatPrice } from '@/lib/offers';
import { notifyOrder, type PaidOrder } from '@/lib/notify-order';

/**
 * Webhook Stripe : notifie Powamekka dès qu'une commande est payée.
 *
 * À déclarer dans le dashboard Stripe sur https://www.powamekka.com/api/stripe/webhook
 * avec l'événement `checkout.session.completed`, puis renseigner le secret de
 * signature dans STRIPE_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET manquante');
    return NextResponse.json({ error: 'Webhook non configuré' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });
  }

  // La vérification de signature exige le corps brut, non parsé.
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(payload, signature, secret);
  } catch (err) {
    console.error('[webhook] signature invalide', err);
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Le compte Stripe est partagé avec d'autres produits (Ozance) : on ignore
    // les commandes qui ne proviennent pas de ce site.
    if (session.metadata?.source !== 'powamekka.com') {
      return NextResponse.json({ received: true, ignored: true });
    }

    try {
      await notifyOrder(toPaidOrder(session));
    } catch (err) {
      // On accuse quand même réception : le paiement est encaissé, seul l'email
      // a échoué. Stripe ne doit pas rejouer l'événement indéfiniment.
      console.error('[webhook] notification échouée', err);
    }
  }

  return NextResponse.json({ received: true });
}

function toPaidOrder(session: Stripe.Checkout.Session): PaidOrder {
  return {
    provider: 'Stripe',
    reference: session.id,
    offerName: session.metadata?.offer_name || 'Offre inconnue',
    amount: session.amount_total !== null ? formatPrice(session.amount_total) : '—',
    name: session.customer_details?.name || '—',
    email: session.customer_details?.email ?? null,
    phone: session.customer_details?.phone || '—',
    company: session.custom_fields?.find((f) => f.key === 'entreprise')?.text?.value || '—',
    dashboardUrl: 'https://dashboard.stripe.com/payments',
  };
}
