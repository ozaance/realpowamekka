// Test optionnel contre l'API Mollie en MODE TEST (aucun argent réel).
// Crée une commande Landing page via le site local, puis relit le paiement
// chez Mollie pour vérifier montant, libellé et métadonnées.
//
// Usage : MOLLIE_TEST_API_KEY=test_xxx npm run test:mollie
// Refuse de s'exécuter avec une clé qui ne commence pas par « test_ ».
// Prérequis : un build de production (npm run build).
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const KEY = process.env.MOLLIE_TEST_API_KEY || '';
if (!KEY.startsWith('test_')) {
  console.error('MOLLIE_TEST_API_KEY doit être une clé de TEST Mollie (commençant par « test_ »). Arrêt.');
  process.exit(1);
}
const ROOT = new URL('..', import.meta.url).pathname;
if (!existsSync(join(ROOT, '.next', 'BUILD_ID'))) { console.error('Lancez d’abord « npm run build ».'); process.exit(1); }

const PORT = 3191;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const app = spawn(join(ROOT, 'node_modules', '.bin', 'next'), ['start', '-p', String(PORT)], {
  cwd: ROOT,
  stdio: 'ignore',
  // Clé de test imposée ; Resend et Stripe neutralisés.
  env: { ...process.env, MOLLIE_API_KEY: KEY, RESEND_API_KEY: 're_test_fake', RESEND_BASE_URL: 'http://127.0.0.1:9', STRIPE_SECRET_KEY: 'sk_test_fake', STRIPE_WEBHOOK_SECRET: 'whsec_test_fake' },
});
const stop = () => { try { app.kill(); } catch {} };
process.on('exit', stop);

let ok = false;
for (let i = 0; i < 80 && !ok; i++) { await wait(250); try { ok = (await fetch(`http://127.0.0.1:${PORT}/robots.txt`)).ok; } catch {} }
if (!ok) { console.error('Le serveur n’a pas démarré.'); process.exit(1); }

const catalogue = readFileSync(join(ROOT, 'lib', 'offers.ts'), 'utf8');
const price = Number(catalogue.match(/id: 'landing-page',[\s\S]*?price: (\d+),/)[1]);

const res = await fetch(`http://127.0.0.1:${PORT}/api/checkout`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ offerId: 'landing-page', provider: 'mollie', customer: { name: 'Test Mode', email: 'test@exemple.fr', phone: '', company: 'Test' } }),
});
const body = await res.json();
console.log('commande :', res.status, body.url ? 'adresse de paiement reçue' : JSON.stringify(body));
const id = new URL(body.url || 'https://x/').searchParams.get('id');

// Le paiement est relu chez Mollie (mode test) à partir de la liste récente.
const list = await (await fetch('https://api.mollie.com/v2/payments?limit=5', { headers: { Authorization: `Bearer ${KEY}` } })).json();
const p = list._embedded?.payments?.find((x) => x.metadata?.email === 'test@exemple.fr');
const checks = [
  ['paiement créé en mode test', p?.mode === 'test'],
  ['montant = prix du catalogue', p?.amount?.value === (price / 100).toFixed(2)],
  ['libellé', typeof p?.description === 'string' && p.description.startsWith('Powamekka : ')],
  ['métadonnées', p?.metadata?.offer_id === 'landing-page' && p?.metadata?.source === 'powamekka.com'],
];
let failed = 0;
for (const [n, c] of checks) { console.log(`  ${c ? '✔' : '✘'} ${n}`); if (!c) failed++; }
if (id) console.log('identifiant indiqué dans l’adresse :', id);
stop();
process.exit(failed ? 1 : 0);
