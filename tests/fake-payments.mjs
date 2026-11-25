// Chargé dans le serveur de test (node --import) : verrouille le réseau sortant.
//
// - Mollie est simulé (création, mise à jour, lecture d'un paiement) et refuse toute clé
//   qui ne commence pas par « test_ ».
// - Tout autre appel sortant est BLOQUÉ et journalisé : par `fetch` (Mollie, Resend, …) comme
//   par `node:http` / `node:https`. Cette seconde voie est celle du SDK Stripe, qui n'utilise
//   pas `fetch` : sans elle, un appel Stripe partirait réellement (avec une fausse clé).
// - Seul le réseau local (127.0.0.1, localhost) passe : faux Resend, serveur de test.
//
// L'état est partagé avec les tests par un fichier JSON (FAKE_PAYMENTS_STATE) :
//   { payments: { tr_…: {...} }, calls: [...], failNext: false }
// `calls` contient chaque appel simulé ou bloqué : { api: 'mollie' | 'stripe' | 'externe', … }.
import http from 'node:http';
import https from 'node:https';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const STATE = process.env.FAKE_PAYMENTS_STATE;
if (!STATE) throw new Error('[fake-payments] FAKE_PAYMENTS_STATE manquant');

const load = () => (existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { payments: {}, calls: [], failNext: false });
const save = (s) => writeFileSync(STATE, JSON.stringify(s, null, 1));
const json = (code, obj) => new Response(JSON.stringify(obj), { status: code, headers: { 'content-type': 'application/json' } });

const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost', '::1']);
const cleanHost = (h) => String(h || '').replace(/^\[|\]$/g, '').replace(/:\d+$/, '').toLowerCase();
const isLocal = (host) => LOCAL_HOSTS.has(cleanHost(host));

/** Journalise un appel sortant bloqué ; Stripe est classé à part pour les assertions des tests. */
function block(host, via) {
  const s = load();
  s.calls.push({ api: /stripe/i.test(host) ? 'stripe' : 'externe', host: cleanHost(host), via });
  save(s);
  return new Error(`[fake-payments] appel réseau sortant bloqué vers ${host} (${via})`);
}

// ── node:http / node:https : voie du SDK Stripe ──────────────────────────────────────────────
function hostFromRequestArgs(args) {
  const [a0, a1] = args;
  try {
    if (typeof a0 === 'string') return new URL(a0).hostname;
    if (a0 instanceof URL) return a0.hostname;
    const o = { ...(a0 || {}), ...(a1 && typeof a1 === 'object' ? a1 : {}) };
    if (o.hostname || o.host) return o.hostname || o.host;
    if (o.href) return new URL(o.href).hostname;
  } catch {
    return 'inconnu';
  }
  return 'localhost'; // Node utilise localhost par défaut
}

for (const [mod, via] of [[http, 'node:http'], [https, 'node:https']]) {
  for (const fn of ['request', 'get']) {
    const real = mod[fn];
    mod[fn] = function (...args) {
      const host = hostFromRequestArgs(args);
      if (!isLocal(host)) throw block(host, `${via}.${fn}`);
      return real.apply(this, args);
    };
  }
}

// ── fetch : Mollie simulé, Stripe et tout le reste bloqués ───────────────────────────────────
const realFetch = globalThis.fetch;
let counter = 0;

globalThis.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const host = new URL(url).hostname;

  if (isLocal(host)) return realFetch(input, init);

  if (/(^|\.)stripe\.com$/i.test(host)) {
    // Stripe n'est jamais appelé pendant les tests.
    block(host, 'fetch');
    return json(400, { error: { message: 'Stripe bloqué pendant les tests' } });
  }

  if (host !== 'api.mollie.com') throw block(host, 'fetch');

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
