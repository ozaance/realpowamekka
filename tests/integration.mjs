// Tests d'intégration contre `next start` (APP_URL), le faux Resend (MOCK_URL)
// et le faux Mollie (fichier FAKE_PAYMENTS_STATE). Lancés par tests/run.mjs.
// Aucun appel à Stripe, Mollie ni Resend réels.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const Stripe = require('stripe');
const stripe = new Stripe('sk_test_fake');

const APP = process.env.APP_URL || 'http://127.0.0.1:3100';
const MOCK = process.env.MOCK_URL || 'http://127.0.0.1:4010';
const STATE = process.env.FAKE_PAYMENTS_STATE;
const WHSEC = 'whsec_test_fake';

let pass = 0, fail = 0;
const check = (name, cond, detail = '') => {
  if (cond) { pass++; console.log(`  ✔ ${name}`); }
  else { fail++; console.log(`  ✘ ${name} ${detail}`); }
};
const mock = async (path, body) => (await fetch(MOCK + path, { method: 'POST', body: JSON.stringify(body ?? {}) })).json();
const deliveries = async () => (await mock('/__state')).deliveries;
const fakeState = () => JSON.parse(readFileSync(STATE, 'utf8'));
const setFake = (fn) => { const s = fakeState(); fn(s); writeFileSync(STATE, JSON.stringify(s, null, 1)); };

// Prix du catalogue, lus dans lib/offers.ts : référence des montants encaissés.
const catalogue = readFileSync(new URL('../lib/offers.ts', import.meta.url), 'utf8');
// Seules les offres et prestations (identifiant suivi d'un nom) ; les catégories ont un « label ».
const prices = Object.fromEntries([...catalogue.matchAll(/id: '([^']+)',(?: category: '[^']+',)?\s*name: [\s\S]*?price: (\d+),/g)].map((m) => [m[1], Number(m[2])]));
const names = Object.fromEntries([...catalogue.matchAll(/id: '([^']+)',(?: category: '[^']+',)?\s*name: (['"])(.+?)\2/g)].map((m) => [m[1], m[3]]));

const contact = (body, ip) =>
  fetch(`${APP}/api/contact`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

const valid = { name: 'Jean <b>Dupont</b>', email: 'jean@exemple.fr', message: 'Bonjour\n<script>alert(1)</script>', service: 'IA & Automatisation' };

console.log('\n== /api/contact');
await mock('/__reset'); await mock('/__mode', { mode: 'ok' });
let r = await contact(valid, '10.0.0.1');
let d = await deliveries();
check('succès Resend → 200', r.status === 200, `(reçu ${r.status})`);
check('un email transmis à Resend', d.length === 1);
const html = d[0]?.payload.html ?? '';
check('HTML échappé (nom)', html.includes('Jean &#60;b&#62;Dupont&#60;/b&#62;') && !html.includes('<b>Dupont'));
check('HTML échappé (message)', html.includes('&#60;script&#62;') && !html.includes('<script>'));
check('expéditeur = notifications@powamekka.com', d[0]?.payload.from === 'Powamekka <notifications@powamekka.com>');
check('destinataire = contact@powamekka.com', JSON.stringify(d[0]?.payload.to).includes('contact@powamekka.com'));

await mock('/__mode', { mode: 'fail' });
r = await contact(valid, '10.0.0.2');
check('refus Resend → 502 (plus de faux succès)', r.status === 502, `(reçu ${r.status})`);
await mock('/__mode', { mode: 'ok' });

r = await contact({ name: 'A', email: '', message: 'x' }, '10.0.0.3');
check('champ manquant → 400', r.status === 400);
r = await contact({ ...valid, email: 'pas-un-email' }, '10.0.0.3');
check('email invalide → 400', r.status === 400);
r = await contact({ ...valid, message: 'x'.repeat(5001) }, '10.0.0.3');
check('message trop long → 400', r.status === 400);
r = await contact({ ...valid, name: 'n'.repeat(101) }, '10.0.0.3');
check('nom trop long → 400', r.status === 400);
r = await contact('{pas du json', '10.0.0.4');
check('JSON invalide → 400', r.status === 400);

await mock('/__reset');
r = await contact({ ...valid, hp_extra: 'http://spam.example' }, '10.0.0.5');
check('honeypot (hp_extra) rempli → 200 sans envoi', r.status === 200 && (await deliveries()).length === 0);
r = await contact({ ...valid, website: 'https://mon-site.fr' }, '10.0.0.9');
check('champ « website » (autoremplissage) ne bloque plus un vrai visiteur', r.status === 200 && (await deliveries()).length === 1);

const statuses = [];
for (let i = 0; i < 6; i++) statuses.push((await contact(valid, '10.0.0.6')).status);
check('6e demande d’une même IP → 429', statuses.slice(0, 5).every((s) => s === 200) && statuses[5] === 429, JSON.stringify(statuses));

console.log('\n== /api/stripe/webhook');
const session = (over = {}) => ({
  id: 'cs_test_' + Math.random().toString(36).slice(2),
  object: 'checkout.session',
  payment_status: 'paid',
  amount_total: 14900,
  metadata: { source: 'powamekka.com', offer_id: 'landing-page', offer_name: 'Landing page' },
  customer_details: { name: 'Client Test', email: 'client@exemple.fr', phone: null },
  custom_fields: [],
  ...over,
});
const hook = async (type, obj, { badSig = false } = {}) => {
  const payload = JSON.stringify({ id: 'evt_test_' + Math.random().toString(36).slice(2), object: 'event', type, data: { object: obj } });
  const header = badSig ? 't=1,v1=deadbeef' : stripe.webhooks.generateTestHeaderString({ payload, secret: WHSEC });
  return fetch(`${APP}/api/stripe/webhook`, { method: 'POST', headers: { 'stripe-signature': header }, body: payload });
};

await mock('/__reset'); await mock('/__mode', { mode: 'ok' });
r = await hook('checkout.session.completed', session(), { badSig: true });
check('signature invalide → 400', r.status === 400);
r = await hook('checkout.session.completed', session({ payment_status: 'unpaid' }));
check('completed + unpaid → 200 sans notification', r.status === 200 && (await deliveries()).length === 0);
const paidSession = session();
r = await hook('checkout.session.completed', paidSession);
d = await deliveries();
check('completed + paid → 200 et notification', r.status === 200 && d.length === 1);
check('clé d’idempotence posée', d[0]?.key === `commande-payee/Stripe/${paidSession.id}`, d[0]?.key);
r = await hook('checkout.session.completed', paidSession);
check('événement rejoué → pas de second email', r.status === 200 && (await deliveries()).length === 1);
r = await hook('checkout.session.async_payment_succeeded', paidSession);
check('async_payment_succeeded même session → pas de doublon', r.status === 200 && (await deliveries()).length === 1);
r = await hook('checkout.session.async_payment_succeeded', session({ payment_status: 'paid' }));
check('async_payment_succeeded → notification', r.status === 200 && (await deliveries()).length === 2);
r = await hook('checkout.session.async_payment_failed', session({ payment_status: 'unpaid' }));
check('async_payment_failed → 200 sans notification', r.status === 200 && (await deliveries()).length === 2);
r = await hook('checkout.session.completed', session({ metadata: { source: 'ozance' } }));
check('autre produit du compte → ignoré', r.status === 200 && (await r.json()).ignored === true);
await mock('/__mode', { mode: 'fail' });
r = await hook('checkout.session.completed', session());
check('refus Resend → 500 (Stripe rejouera)', r.status === 500, `(reçu ${r.status})`);
await mock('/__mode', { mode: 'ok' });

console.log('\n== /api/checkout (erreurs, sans paiement)');
const co = (body, ip) => fetch(`${APP}/api/checkout`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify(body) });
r = await co({ offerId: 'inexistante', provider: 'stripe' }, '10.1.0.1');
check('offre inconnue → 400', r.status === 400);
r = await co({ offerId: 'landing-page', provider: 'mollie', customer: { name: '', email: 'x' } }, '10.1.0.1');
check('Mollie sans coordonnées valides → 400', r.status === 400);
const cs = [];
for (let i = 0; i < 11; i++) cs.push((await co({ offerId: 'inexistante' }, '10.1.0.2')).status);
check('11e tentative d’une même IP → 429', cs.slice(0, 10).every((s) => s === 400) && cs[10] === 429, JSON.stringify(cs));

console.log('\n== Commande Mollie (faux Mollie, clé de test)');
const customer = { name: 'Claire Martin', email: 'claire.martin@entreprise.fr', phone: '0600000000', company: 'Entreprise Test' };
r = await co({ offerId: 'landing-page', provider: 'mollie', customer }, '10.2.0.1');
const body = await r.json();
let st = fakeState();
const created = Object.values(st.payments).at(-1);
check('commande Mollie → 200 et adresse de paiement Mollie', r.status === 200 && body.url?.startsWith('https://www.mollie.com/checkout/'), JSON.stringify(body));
check('montant envoyé à Mollie = prix du catalogue (Landing page)', created?.amount?.value === (prices['landing-page'] / 100).toFixed(2) && created?.amount?.currency === 'EUR', JSON.stringify(created?.amount));
check('libellé Mollie', created?.description === `Powamekka : ${names['landing-page']}`, created?.description);
check('métadonnées : offre et source', created?.metadata?.offer_id === 'landing-page' && created?.metadata?.source === 'powamekka.com');
check('retour vers /merci avec l’identifiant du paiement', created?.redirectUrl?.endsWith(`/merci?mollie_id=${created?.id}`), created?.redirectUrl);
check('aucun appel à Stripe', !st.calls.some((c) => c.api === 'stripe'));

// Offres sur devis uniquement : jamais de commande en ligne (voir la section suivante).
const QUOTE_ONLY = [
  'prototype-mvp', 'saas-standard', 'saas-premium', // projets
  'refonte-site', 'design-ui-page', 'optimisation-page-vente', 'charte-graphique', 'migration-site', 'redaction-seo', 'strategie-instagram', // prestations sur devis
  'plan-automatisation', 'integration-chatbot', 'automatisation-emails', 'formation-ia', 'audit-performance', 'tracking-analytics',
];

// Garde-fou de la grille : chaque offre et prestation commandable en ligne encaisse exactement son
// prix de catalogue. Les offres sur devis sont exclues de ce contrôle, elles sont refusées.
const ids = Object.keys(prices);
const orderable = ids.filter((id) => !QUOTE_ONLY.includes(id));
const mismatches = [];
let ip = 10;
for (const id of orderable) {
  const before = Object.keys(fakeState().payments).length;
  const res = await co({ offerId: id, provider: 'mollie', customer }, `10.3.${ip++}.1`);
  const after = fakeState();
  const p = Object.values(after.payments).at(-1);
  if (res.status !== 200 || Object.keys(after.payments).length !== before + 1 || p.amount.value !== (prices[id] / 100).toFixed(2)) mismatches.push(`${id}: ${res.status} ${p?.amount?.value}`);
}
check(`catalogue : ${ids.length} identifiants, dont ${QUOTE_ONLY.length} offres sur devis`, ids.length === 25 && QUOTE_ONLY.every((id) => ids.includes(id)));
check(`montant encaissé = prix du catalogue pour les ${orderable.length} offres et prestations commandables en ligne`, orderable.length === 9 && mismatches.length === 0, JSON.stringify(mismatches) + ` (${orderable.length} identifiants)`);

console.log('\n== Offres et prestations sur devis uniquement (3 projets et 13 prestations)');
const beforeQuote = fakeState();
const quoteRefused = [];
let qip = 10;
for (const id of QUOTE_ONLY) {
  for (const body of [
    { offerId: id, provider: 'mollie', customer },
    { offerId: id, provider: 'stripe' },
    { offerId: id },
    { offerId: id, provider: 'paypal', customer },
    { offerId: id, provider: ['mollie'], customer },
    { offerId: id, provider: 'MOLLIE', customer },
    // Tentatives de contournement par les paramètres : le serveur n'en lit aucun autre que l'identifiant.
    { offerId: id, provider: 'mollie', customer, amount: 1, price: 100, priceId: 'price_x', price_data: { unit_amount: 100 }, quoteOnly: false },
  ]) {
    const res = await co(body, `10.5.${qip++}.1`);
    const json = await res.json().catch(() => ({}));
    if (res.status !== 403 || typeof json.error !== 'string' || json.url) quoteRefused.push(`${id} ${JSON.stringify(Object.keys(body))}: ${res.status}`);
  }
}
const afterQuote = fakeState();
check(`${QUOTE_ONLY.length} offres x 7 types de requête (Mollie, Stripe, sans moyen, autres prestataires, paramètres falsifiés) → 403 sans adresse de paiement`, quoteRefused.length === 0, JSON.stringify(quoteRefused));
check('aucun paiement créé pour ces refus', Object.keys(afterQuote.payments).length === Object.keys(beforeQuote.payments).length);
check('aucun appel à Mollie ni à Stripe pour ces refus', afterQuote.calls.length === beforeQuote.calls.length, JSON.stringify(afterQuote.calls.slice(beforeQuote.calls.length)));

// Identifiants approchants : refusés comme offre inconnue (liste blanche stricte), jamais acceptés.
const variants = ['PROTOTYPE-MVP', ' prototype-mvp', 'prototype-mvp ', 'prototype-mvp\u0000', 'saas-standard/', 'Saas-Premium', ['prototype-mvp'], { id: 'prototype-mvp' }, null];
const variantStatus = [];
for (const v of variants) variantStatus.push((await co({ offerId: v, provider: 'mollie', customer }, `10.6.${qip++}.1`)).status);
const afterVariants = fakeState();
check('identifiants approchants (casse, espaces, tableau, objet, null) → 400 offre inconnue', variantStatus.every((x) => x === 400), JSON.stringify(variantStatus));
check('aucun appel à Mollie ni à Stripe pour ces variantes', afterVariants.calls.length === afterQuote.calls.length && Object.keys(afterVariants.payments).length === Object.keys(afterQuote.payments).length);

// Les autres offres restent commandables, et le montant ne vient jamais de la requête.
const callsBeforeOthers = fakeState().calls.length;
r = await co({ offerId: 'site-vitrine', provider: 'mollie', customer, amount: 1, price: 100, priceId: 'price_x' }, '10.7.0.1');
const vitrine = Object.values(fakeState().payments).at(-1);
check('Site vitrine reste commandable (200) et le montant de la requête est ignoré', r.status === 200 && vitrine.amount.value === (prices['site-vitrine'] / 100).toFixed(2), `${r.status} ${vitrine?.amount?.value}`);
check('Landing page reste commandable', (await co({ offerId: 'landing-page', provider: 'mollie', customer }, '10.7.1.1')).status === 200);
check('une prestation à la carte reste commandable', (await co({ offerId: 'audit-ia', provider: 'mollie', customer }, '10.7.2.1')).status === 200);
check('ces commandes passent bien par Mollie, pas par Stripe', fakeState().calls.slice(callsBeforeOthers).every((c) => c.api === 'mollie'));

console.log('\n== Stripe fermé aux nouvelles commandes (offre commandable)');
{
  const stripeCalls = () => fakeState().calls.filter((c) => c.api === 'stripe').length;
  const before = stripeCalls();
  const nb = Object.keys(fakeState().payments).length;
  let res = await co({ offerId: 'landing-page', provider: 'stripe' }, '10.8.0.1');
  const j = await res.json();
  check('demande Stripe → 403 et message clair', res.status === 403 && j.error === 'Ce moyen de paiement est temporairement indisponible.', `(reçu ${res.status} ${JSON.stringify(j)})`);
  res = await co({ offerId: 'landing-page' }, '10.8.0.2');
  check('demande sans moyen de paiement → 403 (jamais Stripe par défaut)', res.status === 403, `(reçu ${res.status})`);
  res = await co({ offerId: 'landing-page', provider: 'paypal' }, '10.8.0.3');
  check('prestataire inconnu → 403, pas de repli sur Stripe', res.status === 403, `(reçu ${res.status})`);
  check('aucun appel à l’API Stripe (SDK Stripe verrouillé par le garde-fou)', stripeCalls() === before, JSON.stringify(fakeState().calls.filter((c) => c.api === 'stripe')));
  check('aucun appel sortant inattendu pendant toute la suite', !fakeState().calls.some((c) => c.api === 'externe'), JSON.stringify(fakeState().calls.filter((c) => c.api === 'externe')));
  res = await co({ offerId: 'landing-page', provider: 'mollie', customer }, '10.8.0.4');
  check('Mollie fonctionne toujours', res.status === 200 && Object.keys(fakeState().payments).length === nb + 1);
}

setFake((s) => { s.failNext = true; });
r = await co({ offerId: 'site-vitrine', provider: 'mollie', customer }, '10.4.0.1');
check('erreur Mollie → réponse d’erreur propre', r.status >= 500 && typeof (await r.json()).error === 'string', `(reçu ${r.status})`);

console.log('\n== /merci (faux Mollie)');
setFake((s) => { s.payments[created.id].status = 'paid'; });
let page = await (await fetch(`${APP}/merci?mollie_id=${created.id}`)).text();
check('paiement payé → confirmation', page.includes('Merci, tout est en ordre.'));
check('e-mail masqué (c•••@entreprise.fr)', page.includes('c•••@entreprise.fr'));
check('adresse complète absente de la page', !page.includes('claire.martin@entreprise.fr'));
const callsBefore = fakeState().calls.length;
page = await (await fetch(`${APP}/merci?mollie_id=../customers`)).text();
check('identifiant invalide → message générique sans appel à Mollie', page.includes('Merci pour votre commande.') && fakeState().calls.length === callsBefore);

console.log('\n== /api/mollie/webhook (faux Mollie)');
const fd = new FormData(); fd.set('id', 'pas-un-id');
r = await fetch(`${APP}/api/mollie/webhook`, { method: 'POST', body: fd });
check('identifiant invalide → 400', r.status === 400);
await mock('/__reset');
const wh = (id) => { const f = new FormData(); f.set('id', id); return fetch(`${APP}/api/mollie/webhook`, { method: 'POST', body: f }); };
r = await wh(created.id);
d = await deliveries();
check('paiement payé → 200 et notification de commande', r.status === 200 && d.length === 1);
check('notification : offre et montant', d[0]?.payload.subject === `Commande payée : ${names['landing-page']} (${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(prices['landing-page'] / 100)})`, d[0]?.payload.subject);
r = await wh(created.id);
check('webhook rejoué → pas de second email', r.status === 200 && (await deliveries()).length === 1);
const open = Object.values(fakeState().payments).find((p) => p.status === 'open');
r = await wh(open.id);
check('paiement non payé → 200 sans notification', r.status === 200 && (await deliveries()).length === 1);

console.log('\n== Pages');
for (const p of ['/', '/offres', '/faq', '/vision', '/blog', '/services/ia', '/services/audit', '/merci', '/sitemap.xml', '/robots.txt']) {
  r = await fetch(APP + p);
  check(`GET ${p} → 200`, r.status === 200, `(reçu ${r.status})`);
}
r = await fetch(APP + '/');
check('en-têtes de sécurité présents', r.headers.get('x-frame-options') === 'DENY' && r.headers.get('x-content-type-options') === 'nosniff');

console.log('\n== Page Offres : boutons de commande');
{
  const html = await (await fetch(APP + '/offres')).text();
  const count = (needle) => html.split(needle).length - 1;
  check('16 boutons « Demander un devis » (3 projets et 13 prestations)', count('Demander un devis <') === 16, `(trouvés ${count('Demander un devis <')})`);
  check('9 boutons « Commander » (Landing page, Site vitrine, 7 prestations à la carte)', count('Commander <') === 9, `(trouvés ${count('Commander <')})`);
  const norm = (s) => s.replace(/[\s\u00a0\u202f]+/g, ' ');
  const text = norm(html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' '));
  check('aucun prix affiché pour les projets sur devis (2 500, 5 000, 10 000 €)', !/2 500 €|5 000 €|10 000 €/.test(text) && count('Sur devis<') + count('Sur devis ') >= 16, `(« Sur devis » : ${count('Sur devis<')})`);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).find((j) => j['@type'] === 'OfferCatalog');
  const ldPrices = (ld?.itemListElement ?? []).map((o) => o.price).filter(Boolean);
  check('balisage JSON-LD : seuls Landing page et Site vitrine ont un prix', JSON.stringify(ldPrices) === JSON.stringify(['149.00', '499.00']), JSON.stringify(ldPrices));
  const quoteLinks = [...html.matchAll(/href="(https:\/\/wa\.me\/33635097980\?text=[^"]+)"/g)].map((m) => decodeURIComponent(m[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'")));
  check('chaque offre sur devis a sa demande de devis WhatsApp pré-remplie', QUOTE_ONLY.every((id) => quoteLinks.some((l) => l.includes('demander un devis pour votre offre ' + names[id]))), JSON.stringify(quoteLinks.map((l) => l.slice(0, 120))));
}

console.log(`\n${pass} réussis, ${fail} échoués`);
process.exit(fail ? 1 : 0);
