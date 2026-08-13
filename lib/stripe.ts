import Stripe from 'stripe';

let client: Stripe | null = null;

/**
 * Client Stripe côté serveur. Instancié à la demande (et non à l'import) pour
 * qu'une clé absente ne fasse échouer que la requête concernée, pas le build.
 */
export function getStripe(): Stripe {
  if (client) return client;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY est absente. Ajoutez-la dans .env.local (et dans les variables d'environnement de production)."
    );
  }

  client = new Stripe(key, {
    appInfo: { name: 'Powamekka', url: 'https://powamekka.com' },
  });

  return client;
}
