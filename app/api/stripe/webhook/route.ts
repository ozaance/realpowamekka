import type Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { formatPrice } from '@/lib/offers';
import { notifyOrder, type PaidOrder } from '@/lib/notify-order';
import { describeEmailError } from '@/lib/email';

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
      // Le paiement est encaissé mais Powamekka n'a pas été prévenu : on répond
      // en erreur pour que Stripe rejoue l'événement (jusqu'à 3 jours). La clé
      // d'idempotence de notifyOrder empêche tout doublon d'email.
      console.error('[webhook] notification échouée', session.id, describeEmailError(err));
      return NextResponse.json({ error: 'Notification échouée' }, { status: 500 });
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
