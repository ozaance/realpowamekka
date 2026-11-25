// Chargé dans le serveur de test (node --import) : intercepte TOUS les appels
// vers l'API Mollie et l'API Stripe. Aucun appel réel ne peut partir, même si
// un fichier .env.local contient de vraies clés.
//
// Mollie est simulé (création, mise à jour, lecture d'un paiement). L'état est
// partagé avec les tests par un fichier JSON (FAKE_PAYMENTS_STATE) :
//   { payments: { tr_…: {...} }, calls: [...], failNext: false }
// Les tests peuvent y passer un paiement à « paid » ou forcer une erreur.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const STATE = process.env.FAKE_PAYMENTS_STATE;
if (!STATE) throw new Error('[fake-payments] FAKE_PAYMENTS_STATE manquant');

const load = () => (existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { payments: {}, calls: [], failNext: false });
const save = (s) => writeFileSync(STATE, JSON.stringify(s, null, 1));
const json = (code, obj) => new Response(JSON.stringify(obj), { status: code, headers: { 'content-type': 'application/json' } });

const realFetch = globalThis.fetch;
let counter = 0;

globalThis.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

  if (url.startsWith('https://api.stripe.com/')) {
    // Stripe n'est jamais appelé pendant les tests.
    const s = load(); s.calls.push({ api: 'stripe', url }); save(s);
    return json(400, { error: { message: 'Stripe bloqué pendant les tests' } });
  }

  if (!url.startsWith('https://api.mollie.com/')) return realFetch(input, init);

  // Garde-fou : seules les clés de test Mollie sont acceptées.
  const auth = new Headers(init.headers || {}).get('authorization') || '';
  if (!auth.startsWith('Bearer test_')) {
    throw new Error('[fake-payments] clé Mollie non « test_ » refusée pendant les tests');
  }

  const s = load();
  const method = (init.method || 'GET').toUpperCase();
  const path = url.replace('https://api.mollie.com/v2', '');
  const body = init.body ? JSON.parse(init.body) : null;
  s.calls.push({ api: 'mollie', method, path, body });

  if (s.failNext) { s.failNext = false; save(s); return json(500, { status: 500, title: 'Erreur simulée' }); }

  if (method === 'POST' && path === '/payments') {
    const id = `tr_fake${Date.now().toString(36)}${counter++}`;
    const p = { id, resource: 'payment', status: 'open', ...body, _links: { checkout: { href: `https://www.mollie.com/checkout/test-mode?fake=${id}` } } };
    s.payments[id] = p; save(s);
    return json(201, p);
  }

  const m = path.match(/^\/payments\/([^/?]+)$/);
  const id = m ? decodeURIComponent(m[1]) : null;
  const p = id ? s.payments[id] : null;
  if (!p) { save(s); return json(404, { status: 404, title: 'Not Found' }); }

  if (method === 'PATCH') { Object.assign(p, body); save(s); return json(200, p); }
  if (method === 'GET') { save(s); return json(200, p); }

  save(s);
  return json(405, { status: 405 });
};
