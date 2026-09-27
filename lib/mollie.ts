/**
 * Client Mollie minimal (API REST v2), sans dépendance supplémentaire.
 *
 * La clé est lue à la demande (et non à l'import) pour qu'une clé absente ne
 * fasse échouer que la requête concernée, pas le build. Une clé `test_...`
 * crée des paiements de test, une clé `live_...` encaisse réellement.
 */

const API = 'https://api.mollie.com/v2';

export type MolliePayment = {
  id: string;
  status: 'open' | 'canceled' | 'pending' | 'authorized' | 'expired' | 'failed' | 'paid';
  amount: { currency: string; value: string };
  description: string;
  metadata: Record<string, string> | null;
  _links: {
    checkout?: { href: string };
    refunds?: { href: string };
    chargebacks?: { href: string };
  };
};

async function mollie<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = process.env.MOLLIE_API_KEY;
  if (!key) {
    throw new Error(
      "MOLLIE_API_KEY est absente. Ajoutez-la dans .env.local (et dans les variables d'environnement de production)."
    );
  }

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Mollie ${init.method ?? 'GET'} ${path} → ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

/** Convertit des centimes en montant Mollie (« 149.00 »). */
export function toMollieAmount(cents: number) {
  return { currency: 'EUR', value: (cents / 100).toFixed(2) };
}

/** Convertit un montant Mollie (« 149.00 ») en centimes. */
export function fromMollieAmount(value: string): number {
  return Math.round(parseFloat(value) * 100);
}

export function createPayment(body: {
  amount: { currency: string; value: string };
  description: string;
  redirectUrl: string;
  cancelUrl?: string;
  webhookUrl?: string;
  metadata?: Record<string, string>;
}) {
  return mollie<MolliePayment>('/payments', {
    method: 'POST',
    body: JSON.stringify({ ...body, locale: 'fr_FR' }),
  });
}

export function updatePayment(id: string, body: { redirectUrl: string }) {
  return mollie<MolliePayment>(`/payments/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function getPayment(id: string) {
  return mollie<MolliePayment>(`/payments/${encodeURIComponent(id)}`);
}
