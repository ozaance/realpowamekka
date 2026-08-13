import type Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getStripe } from '@/lib/stripe';
import { formatPrice } from '@/lib/offers';

/**
 * Webhook Stripe : notifie Powamekka dès qu'une commande est payée.
 *
 * À déclarer dans le dashboard Stripe sur https://powamekka.com/api/stripe/webhook
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
      await notifyOrder(session);
    } catch (err) {
      // On accuse quand même réception : le paiement est encaissé, seul l'email
      // a échoué. Stripe ne doit pas rejouer l'événement indéfiniment.
      console.error('[webhook] notification échouée', err);
    }
  }

  return NextResponse.json({ received: true });
}

async function notifyOrder(session: Stripe.Checkout.Session) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[webhook] RESEND_API_KEY manquante, notification ignorée');
    return;
  }

  const offerName = session.metadata?.offer_name || 'Offre inconnue';
  const amount = session.amount_total !== null ? formatPrice(session.amount_total) : '—';
  const name = session.customer_details?.name || '—';
  const email = session.customer_details?.email || '—';
  const phone = session.customer_details?.phone || '—';
  const entreprise =
    session.custom_fields?.find((f) => f.key === 'entreprise')?.text?.value || '—';

  const rows: [string, string][] = [
    ['Offre', offerName],
    ['Montant', amount],
    ['Client', name],
    ['Email', email],
    ['Téléphone', phone],
    ['Entreprise', entreprise],
  ];

  await new Resend(apiKey).emails.send({
    from: 'Powamekka <onboarding@resend.dev>',
    to: 'contact@powamekka.com',
    replyTo: session.customer_details?.email || undefined,
    subject: `Commande payée — ${offerName} (${amount})`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#1c1813;margin-bottom:8px">Nouvelle commande payée</h2>
        <p style="color:#888;font-size:13px;margin-bottom:32px">Via powamekka.com — ${session.id}</p>
        <table style="width:100%;border-collapse:collapse">
          ${rows
            .map(
              ([label, value]) =>
                `<tr><td style="padding:12px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;width:120px">${label}</td><td style="padding:12px 0;border-bottom:1px solid #eee;color:#1c1813">${value}</td></tr>`
            )
            .join('')}
        </table>
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid #eee">
          <a href="https://dashboard.stripe.com/payments" style="background:#1c1813;color:#fff;padding:12px 24px;border-radius:18px;text-decoration:none;font-size:13px">Voir dans Stripe</a>
        </div>
      </div>
    `,
  });
}
