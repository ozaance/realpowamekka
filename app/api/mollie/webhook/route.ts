import { NextResponse } from 'next/server';
import { fromMollieAmount, getPayment } from '@/lib/mollie';
import { formatPrice } from '@/lib/offers';
import { notifyOrder } from '@/lib/notify-order';
import { describeEmailError } from '@/lib/email';

/**
 * Webhook Mollie : notifie Powamekka dès qu'une commande est payée.
 *
 * L'URL est transmise automatiquement à chaque paiement (webhookUrl), rien à
 * déclarer dans le dashboard. Mollie n'envoie que l'identifiant du paiement,
 * sans signature : on relit le paiement via l'API, ce qui garantit que le
 * statut ne peut pas être falsifié par un tiers.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const id = form.get('id');
  if (typeof id !== 'string' || !id.startsWith('tr_')) {
    return NextResponse.json({ error: 'Identifiant manquant' }, { status: 400 });
  }

  let payment;
  try {
    payment = await getPayment(id);
  } catch (err) {
    // Réponse en erreur : Mollie rejouera l'appel plus tard.
    console.error('[mollie-webhook] paiement illisible', err);
    return NextResponse.json({ error: 'Paiement illisible' }, { status: 500 });
  }

  const meta = payment.metadata ?? {};

  // Mollie rappelle aussi le webhook lors d'un remboursement ou d'un
  // rejet de paiement (le statut reste « paid ») : on ne notifie qu'une fois.
  const firstPaid =
    payment.status === 'paid' && !payment._links.refunds && !payment._links.chargebacks;

  if (firstPaid && meta.source === 'powamekka.com') {
    try {
      await notifyOrder({
        provider: 'Mollie',
        reference: payment.id,
        offerName: meta.offer_name || 'Offre inconnue',
        amount: formatPrice(fromMollieAmount(payment.amount.value)),
        name: meta.name || 'Non renseigné',
        email: meta.email || null,
        phone: meta.phone || 'Non renseigné',
        company: meta.company || 'Non renseigné',
        dashboardUrl: `https://my.mollie.com/dashboard/payments/${payment.id}`,
      });
    } catch (err) {
      // Le paiement est encaissé mais Powamekka n'a pas été prévenu : on répond
      // en erreur pour que Mollie rejoue l'appel (10 tentatives sur ~26 h). La
      // clé d'idempotence de notifyOrder empêche tout doublon d'email.
      console.error('[mollie-webhook] notification échouée', payment.id, describeEmailError(err));
      return NextResponse.json({ error: 'Notification échouée' }, { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
