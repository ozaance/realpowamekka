// Test du garde-fou lui-même (tests/fake-payments.mjs) : il prouve que le verrouillage du réseau
// fonctionne AVANT de lancer le site. Exécuté par tests/run.mjs avec le garde-fou préchargé :
//   node --import tests/fake-payments.mjs tests/garde-fous.mjs
//
// Aucun accès réseau externe : les hôtes visés sont soit bloqués avant toute connexion, soit en
// « .invalid » (jamais résolu). Le SDK Stripe est pointé vers « stripe.invalid ».
import http from 'node:http';
import https from 'node:https';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const STATE = process.env.FAKE_PAYMENTS_STATE;
const calls = () => JSON.parse(readFileSync(STATE, 'utf8')).calls;
const Stripe = createRequire(import.meta.url)('stripe');

let fail = 0;
const check = (name, cond, detail = '') => {
  console.log(`  ${cond ? '✔' : '✘'} ${name}${cond ? '' : ' ' + detail}`);
  if (!cond) fail++;
};
const rejects = async (fn) => { try { await fn(); return false; } catch { return true; } };
const throws = (fn) => { try { fn(); return false; } catch { return true; } };

console.log('\n== Garde-fou réseau (avant le site)');

// 1. SDK Stripe réel : il passe par node:https, pas par fetch.
let n = calls().length;
const stripe = new Stripe('sk_test_fake', { host: 'stripe.invalid', maxNetworkRetries: 0 });
check('SDK Stripe : appel bloqué', await rejects(() => stripe.customers.list()));
const stripeCalls = calls().slice(n);
check('SDK Stripe : appel journalisé comme « stripe » (node:https)', stripeCalls.length === 1 && stripeCalls[0].api === 'stripe' && stripeCalls[0].via.startsWith('node:https'), JSON.stringify(stripeCalls));

// 2. fetch vers Stripe : réponse simulée, journalisée.
n = calls().length;
const r = await fetch('https://api.stripe.com/v1/checkout/sessions', { method: 'POST' });
check('fetch Stripe : 400 simulé, aucun envoi réel', r.status === 400);
check('fetch Stripe : journalisé', calls().slice(n).some((c) => c.api === 'stripe' && c.via === 'fetch'));

// 3. Tout autre hôte : bloqué par fetch, http et https.
n = calls().length;
check('fetch vers un hôte quelconque : bloqué', await rejects(() => fetch('https://exemple.invalid/')));
check('https.get vers un hôte quelconque : bloqué', throws(() => https.get('https://exemple.invalid/')));
check('https.request (options) : bloqué', throws(() => https.request({ hostname: 'exemple.invalid', path: '/' })));
check('http.request vers un hôte quelconque : bloqué', throws(() => http.request('http://exemple.invalid/')));
check('ces blocages sont journalisés comme « externe »', calls().slice(n).filter((c) => c.api === 'externe').length === 4, JSON.stringify(calls().slice(n)));

// 4. Mollie : clé non « test_ » refusée.
check('Mollie : clé « live_ » refusée', await rejects(() => fetch('https://api.mollie.com/v2/payments', { headers: { Authorization: 'Bearer live_x' } })));
const ok = await fetch('https://api.mollie.com/v2/payments/tr_inexistant', { headers: { Authorization: 'Bearer test_x' } });
check('Mollie : clé « test_ » acceptée (simulée, 404 attendu)', ok.status === 404);

// 5. Le réseau local reste ouvert (faux Resend, serveur de test).
const srv = http.createServer((_q, s) => s.end('ok'));
await new Promise((res) => srv.listen(0, '127.0.0.1', res));
const local = await fetch(`http://127.0.0.1:${srv.address().port}/`);
check('réseau local : fetch autorisé', (await local.text()) === 'ok');
const viaHttp = await new Promise((res, rej) => http.get(`http://127.0.0.1:${srv.address().port}/`, (m) => { m.resume(); res(m.statusCode); }).on('error', rej));
check('réseau local : node:http autorisé', viaHttp === 200);
srv.close();

console.log(fail ? `\n${fail} garde-fou(s) en échec` : '\nGarde-fou réseau OK');
process.exit(fail ? 1 : 0);
