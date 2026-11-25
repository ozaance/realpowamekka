import { sendMail } from '@/lib/email';
import { escapeHtml } from '@/lib/security';

export type PaidOrder = {
  provider: 'Stripe' | 'Mollie';
  reference: string;
  offerName: string;
  amount: string;
  name: string;
  email: string | null;
  phone: string;
  company: string;
  dashboardUrl: string;
};

/**
 * Envoie à contact@powamekka.com le récapitulatif d'une commande payée.
 *
 * Lève une erreur si l'email n'est pas parti (clé absente ou refus de Resend) :
 * le webhook appelant répond alors en erreur pour que Stripe / Mollie rejouent
 * l'événement. La clé d'idempotence, dérivée de la référence du paiement,
 * garantit qu'un rejeu (ou un événement livré deux fois) n'envoie pas de
 * doublon pendant 24 h.
 */
export async function notifyOrder(order: PaidOrder) {
  const rows: [string, string][] = [
    ['Offre', order.offerName],
    ['Montant', order.amount],
    ['Paiement', order.provider],
    ['Client', order.name],
    ['Email', order.email || 'Non renseigné'],
    ['Téléphone', order.phone],
    ['Entreprise', order.company],
  ];

  return sendMail({
    idempotencyKey: `commande-payee/${order.provider}/${order.reference}`,
    replyTo: order.email || undefined,
    subject: `Commande payée : ${order.offerName} (${order.amount})`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#1c1813;margin-bottom:8px">Nouvelle commande payée</h2>
        <p style="color:#888;font-size:13px;margin-bottom:32px">Via powamekka.com, référence ${escapeHtml(order.reference)}</p>
        <table style="width:100%;border-collapse:collapse">
          ${rows
            .map(
              ([label, value]) =>
                `<tr><td style="padding:12px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;width:120px">${label}</td><td style="padding:12px 0;border-bottom:1px solid #eee;color:#1c1813">${escapeHtml(value)}</td></tr>`
            )
            .join('')}
        </table>
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid #eee">
          <a href="${order.dashboardUrl}" style="background:#1c1813;color:#fff;padding:12px 24px;border-radius:18px;text-decoration:none;font-size:13px">Voir dans ${order.provider}</a>
        </div>
      </div>
    `,
  });
}
