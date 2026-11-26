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

console.log('\n== Informations de facturation et CGV (désactivées par défaut, activées sur un second serveur de test)');
{
  const APP2 = process.env.APP2_URL;
  const co2 = (body, ip) => fetch(`${APP2}/api/checkout`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify(body) });
  // SIREN d'exemple valide pour la clé de Luhn, et TVA calculée avec une copie indépendante de la formule.
  const SIREN = '123456782';
  const vatKey = String((12 + 3 * (Number(SIREN) % 97)) % 97).padStart(2, '0');
  const VAT = `FR${vatKey}${SIREN}`;
  const bill = { companyName: 'Entreprise Test SAS', siren: '123 456 782', vatNumber: '', street: '12 rue des Lilas', street2: '', postalCode: '68100', city: 'Mulhouse' };
  const nPayments = () => Object.keys(fakeState().payments).length;
  const lastPayment = () => Object.values(fakeState().payments).at(-1);

  // 1. Production : tout est désactivé, la requête envoyée à Mollie est celle d'avant.
  const KEYS = ['company', 'email', 'name', 'offer_id', 'offer_name', 'phone', 'source'];
  r = await co({ offerId: 'landing-page', provider: 'mollie', customer, billing: bill, acceptCgv: true }, '10.8.0.1');
  let p = lastPayment();
  check('collecte désactivée : informations de facturation ignorées, métadonnées Mollie identiques à l\'ancien parcours', r.status === 200 && JSON.stringify(Object.keys(p.metadata).sort()) === JSON.stringify(KEYS) && p.metadata.company === customer.company, JSON.stringify(p.metadata));
  const offresOff = await (await fetch(APP + '/offres')).text();
  const offresOn = await (await fetch(APP2 + '/offres')).text();
  check('page Offres : options de collecte désactivées sur le serveur principal, activées sur le second', /fields\\?":false/.test(offresOff) && /fields\\?":true/.test(offresOn));

  // 2. Collecte activée : erreurs claires, aucun paiement créé.
  const refused = [
    ['informations de facturation absentes', { customer }, 'companyName'],
    ['SIREN à 8 chiffres', { customer, billing: { ...bill, siren: '12345678' } }, 'siren'],
    ['SIREN avec une faute de frappe (clé de Luhn)', { customer, billing: { ...bill, siren: '123456783' } }, 'siren'],
    ['SIREN avec des lettres', { customer, billing: { ...bill, siren: '12345678A' } }, 'siren'],
    ['numéro de TVA qui ne correspond pas au SIREN', { customer, billing: { ...bill, vatNumber: 'FR00987654321' } }, 'vatNumber'],
    ['code postal à 4 chiffres', { customer, billing: { ...bill, postalCode: '6810' } }, 'postalCode'],
    ['adresse vide', { customer, billing: { ...bill, street: ' ' } }, 'street'],
    ['ville vide', { customer, billing: { ...bill, city: '' } }, 'city'],
    ['nom d\'entreprise trop court', { customer, billing: { ...bill, companyName: 'A' } }, 'companyName'],
    ['CGV non acceptées', { customer, billing: bill }, 'acceptCgv'],
    ['CGV refusées (false)', { customer, billing: bill, acceptCgv: false }, 'acceptCgv'],
    ['CGV « acceptées » avec une valeur non booléenne', { customer, billing: bill, acceptCgv: 'true' }, 'acceptCgv'],
  ];
  const before = nPayments();
  const wrong = [];
  let ipn = 1;
  for (const [nom, extra, champ] of refused) {
    const res = await co2({ offerId: 'landing-page', provider: 'mollie', ...extra }, `10.9.0.${ipn++}`);
    const j = await res.json().catch(() => ({}));
    if (res.status !== 400 || j.field !== champ || typeof j.error !== 'string' || j.url) wrong.push(`${nom}: ${res.status} ${j.field}`);
  }
  check('collecte activée : 12 saisies invalides → 400, champ désigné, message en français', wrong.length === 0, JSON.stringify(wrong));
  check('aucun paiement créé pour ces refus', nPayments() === before);

  // 3. Saisie valide : le prix ne bouge pas, les informations suivent le paiement et rien d'autre.
  r = await co2({ offerId: 'landing-page', provider: 'mollie', customer, billing: { ...bill, vatNumber: VAT.toLowerCase(), street2: 'Bâtiment B' }, acceptCgv: true }, '10.9.1.1');
  p = lastPayment();
  const m = p.metadata;
  check('saisie valide → 200 et paiement créé', r.status === 200 && p.id.startsWith('tr_'));
  check('montant encaissé inchangé (prix du catalogue)', p.amount.value === (prices['landing-page'] / 100).toFixed(2), p.amount.value);
  check('métadonnées : SIREN normalisé, TVA normalisée, adresse, code postal, ville', m.siren === SIREN && m.tva === VAT && m.adresse === '12 rue des Lilas, Bâtiment B' && m.cp === '68100' && m.ville === 'Mulhouse', JSON.stringify(m));
  check('métadonnées : la dénomination remplace le champ entreprise', m.company === 'Entreprise Test SAS');
  check('métadonnées : acceptation des CGV (version et date)', m.cgv_version === '1.0' && /^\d{4}-\d{2}-\d{2}T/.test(m.cgv_accepted_at ?? ''));
  check('métadonnées : aucune autre donnée que celles attendues', JSON.stringify(Object.keys(m).sort()) === JSON.stringify([...KEYS, 'adresse', 'cgv_accepted_at', 'cgv_version', 'cp', 'siren', 'tva', 'ville'].sort()), JSON.stringify(Object.keys(m)));
  check('métadonnées sous la limite de 1 000 octets', new TextEncoder().encode(JSON.stringify(m)).length <= 1000);

  // 4. Garde-fous qui restent vrais.
  const nb = nPayments();
  r = await co2({ offerId: 'prototype-mvp', provider: 'mollie', customer, billing: bill, acceptCgv: true }, '10.9.2.1');
  check('offre sur devis : toujours refusée (403), même avec des informations valides', r.status === 403 && nPayments() === nb);
  r = await co2({ offerId: 'landing-page', provider: 'stripe', customer, billing: bill, acceptCgv: true }, '10.9.2.2');
  check('Stripe : toujours fermé (403)', r.status === 403 && nPayments() === nb);
  const long = 'x'.repeat(200);
  r = await co2({ offerId: 'landing-page', provider: 'mollie', customer: { name: long, email: `${'a'.repeat(190)}@exemple.fr`, phone: long, company: long }, billing: { ...bill, companyName: 'y'.repeat(100), street: 'z'.repeat(120), street2: 'w'.repeat(80), vatNumber: VAT }, acceptCgv: true }, '10.9.2.3');
  check('métadonnées trop volumineuses → 400, rien n\'est tronqué ni envoyé à Mollie', r.status === 400 && nPayments() === nb, `(reçu ${r.status})`);

  // 5. Le webhook transmet les informations dans la notification interne, une seule fois.
  setFake((s) => { s.payments[p.id].status = 'paid'; });
  await mock('/__reset');
  const f2 = new FormData(); f2.set('id', p.id);
  r = await fetch(`${APP2}/api/mollie/webhook`, { method: 'POST', body: f2 });
  d = await deliveries();
  const mail = d[0]?.payload.html ?? '';
  check('notification : SIREN, TVA, adresse de facturation et acceptation des CGV', r.status === 200 && d.length === 1 && ['SIREN', SIREN, 'TVA intracom.', VAT, 'Adresse de facturation', '12 rue des Lilas, Bâtiment B, 68100 Mulhouse', 'CGV acceptées', 'version 1.0'].every((x) => mail.includes(x)));
  const f3 = new FormData(); f3.set('id', p.id);
  r = await fetch(`${APP2}/api/mollie/webhook`, { method: 'POST', body: f3 });
  check('webhook rejoué → toujours un seul e-mail', r.status === 200 && (await deliveries()).length === 1);

  // 6. Ancien parcours : la notification d'une commande sans informations de facturation n'a pas de nouvelle ligne.
  await mock('/__reset');
  setFake((s) => { s.payments[created.id].status = 'paid'; });
  r = await wh(created.id);
  d = await deliveries();
  check('notification de l\'ancien parcours : aucune ligne SIREN ni CGV', d.length === 1 && !(d[0].payload.html).includes('SIREN') && !(d[0].payload.html).includes('CGV'));
}

console.log('\n== Grille tarifaire 2026 (désactivée par défaut, activée sur un troisième serveur de test)');
{
  const APP3 = process.env.APP3_URL;
  const co3 = (body, ip) => fetch(`${APP3}/api/checkout`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify(body) });
  const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/[\s  ]+/g, ' ');
  // Grille validée, recopiée INDÉPENDAMMENT du code testé (euros HT). TTC = HT x 1,20.
  const GRILLE_LIGNE = { 'landing-page': 390, 'site-vitrine': 990, 'maintenance-site': 229, 'audit-ia': 205, 'optimisation-seo': 290, 'pack-seo-local': 250, 'google-business': 150, 'chatbot-ia-basique': 390, 'audit-ux': 290 };
  const ttcCents = (ht) => Math.round(ht * 100 * 1.2);
  const nPay = () => Object.keys(fakeState().payments).length;

  // 1. Production : aucune trace de la grille 2026 sur le serveur par défaut.
  const off1 = strip(await (await fetch(APP + '/offres')).text());
  check('grille désactivée : aucun prix HT ou TTC, anciens prix affichés', !/ HT\b|TTC/.test(off1) && ['149 €', '499 €'].every((x) => off1.includes(x)), '');

  // 2. Grille active : le montant encaissé est le TTC affiché, pour chaque offre commandable.
  const ecarts = [];
  let ipx = 1;
  for (const [id, ht] of Object.entries(GRILLE_LIGNE)) {
    const res = await co3({ offerId: id, provider: 'mollie', customer }, `10.10.0.${ipx++}`);
    const pay = Object.values(fakeState().payments).at(-1);
    // Site vitrine : seule la première échéance (50 %) est encaissée en ligne ; les autres : le total TTC.
    const attendu = ((id === 'site-vitrine' ? ttcCents(ht) / 2 : ttcCents(ht)) / 100).toFixed(2);
    if (res.status !== 200 || pay.amount.value !== attendu || pay.amount.currency !== 'EUR') ecarts.push(`${id}: ${res.status} ${pay.amount?.value} (attendu ${attendu})`);
  }
  check('grille active : montant envoyé à Mollie = prix TTC (HT x 1,20), première échéance (50 %) pour le Site vitrine, pour les 9 offres commandables', ecarts.length === 0, JSON.stringify(ecarts));
  const aux = Object.values(fakeState().payments).filter((p) => p.metadata?.offer_id === 'audit-ux').at(-1);
  check('grille active : libellé Mollie = nom de la grille', aux?.description === 'Powamekka : Audit UX et conversion', aux?.description);

  // 3. Garde-fous inchangés.
  const nb = nPay();
  const refus = [];
  for (const id of QUOTE_ONLY) {
    const res = await co3({ offerId: id, provider: 'mollie', customer }, `10.10.1.${ipx++}`);
    if (res.status !== 403) refus.push(`${id}: ${res.status}`);
  }
  check('grille active : les 16 offres sur devis restent refusées (403) sans paiement créé', refus.length === 0 && nPay() === nb, JSON.stringify(refus));
  const st3 = await co3({ offerId: 'landing-page', provider: 'stripe' }, `10.10.1.${ipx++}`);
  check('grille active : Stripe reste fermé (403)', st3.status === 403 && nPay() === nb);

  // 4. Affichage : HT en grand, TTC et TVA dessous ; offres sur devis sans prix.
  const off3 = strip(await (await fetch(APP3 + '/offres')).text());
  const fmt = (c) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: c % 100 ? 2 : 0, maximumFractionDigits: 2 }).format(c / 100).replace(/[\s  ]+/g, ' ');
  const manquants = [];
  for (const [id, ht] of Object.entries(GRILLE_LIGNE)) {
    const ttc = ttcCents(ht);
    // La TVA détaillée figure sous le prix des deux offres principales et dans la fenêtre de commande ; les prestations affichent HT et TTC.
    const attendus = [`${fmt(ht * 100)} HT`, `${fmt(ttc)} TTC`];
    if (id === 'landing-page' || id === 'site-vitrine') attendus.push(`TVA 20 % : ${fmt(ttc - ht * 100)}`);
    for (const x of attendus) if (!off3.includes(x)) manquants.push(`${id}: ${x}`);
  }
  check('grille active : chaque offre commandable affiche HT, TTC et TVA', manquants.length === 0, JSON.stringify(manquants.slice(0, 4)));
  // « 149 € HT par mois » est le prix de l'abonnement d'hébergement de la grille, pas l'ancien prix de la Landing page.
  check('grille active : anciens prix absents (149, 499, 2 500, 5 000, 10 000 €)', !/\b149 €(?! HT par mois)|\b499 €|2 500 €|5 000 €|10 000 €/.test(off3));
  const html3 = await (await fetch(APP3 + '/offres')).text();
  const c = (needle) => html3.split(needle).length - 1;
  check('grille active : 9 boutons « Commander » et 16 « Demander un devis »', c('Commander <') === 9 && c('Demander un devis <') === 16, `(${c('Commander <')} / ${c('Demander un devis <')})`);
  check('grille active : mention « prix hors taxes » et aucun tiret long', off3.includes('Prix en euros hors taxes (HT)') && !/[—–]/.test(off3));
  check('grille active : offres sur devis toujours sans prix', (off3.match(/Sur devis/g) ?? []).length >= 16);

  // 4 bis. Échéancier : libellés affichés sur la page Offres.
  const libelles = ['Acompte de 594 € TTC à la commande, puis 594 € TTC avant la livraison.', 'Paiement de 468 € TTC à la commande.', "Paiement en 3 échéances : 40 % à l'acceptation du devis, 40 % après validation de la conception, 20 % avant la livraison finale."];
  check('grille active : échéanciers affichés (Landing page, Site vitrine, MVP et SaaS)', libelles.every((x) => off3.includes(x)) && (off3.match(/Paiement en 3 échéances/g) ?? []).length === 3, '');
  check("grille active : 13 prestations sur devis, paiement intégral à l'acceptation du devis", (off3.match(/Paiement intégral à l'acceptation du devis\./g) ?? []).length === 13, String((off3.match(/Paiement intégral à l'acceptation du devis\./g) ?? []).length));
  check('grille désactivée : aucun libellé d\'échéancier ni d\'acompte', !/acompte|Paiement en 3 échéances|Paiement intégral à l'acceptation|Paiement de \d/i.test(off1));

  // 4 ter. Paiements : Site vitrine en deux fois, les autres en une fois ; métadonnées et libellé Mollie.
  const dernierPaiement = (id) => Object.values(fakeState().payments).filter((p) => p.metadata?.offer_id === id).at(-1);
  const vit = dernierPaiement('site-vitrine');
  check('Site vitrine : 594,00 € TTC encaissés à la commande, libellé « acompte 1/2 »', vit?.amount.value === '594.00' && vit?.description === 'Powamekka : Site vitrine (acompte 1/2)', `${vit?.amount?.value} ${vit?.description}`);
  check('Site vitrine : métadonnées d\'échéance (1/2, total 1188,00, solde 594,00)', vit?.metadata?.echeance === '1/2' && vit?.metadata?.total_ttc === '1188.00' && vit?.metadata?.solde_ttc === '594.00' && vit?.metadata?.grille === '2026', JSON.stringify(vit?.metadata));
  const lan = dernierPaiement('landing-page');
  check('Landing page : 468,00 € TTC en une fois, sans échéance', lan?.amount.value === '468.00' && lan?.description === 'Powamekka : Landing page' && !('echeance' in lan.metadata) && lan.metadata.grille === '2026', JSON.stringify(lan?.metadata));
  const unePasEcheance = Object.keys(GRILLE_LIGNE).filter((id) => id !== 'site-vitrine').every((id) => !('echeance' in (dernierPaiement(id)?.metadata ?? {})));
  check('seul le Site vitrine est payé en plusieurs échéances', unePasEcheance);

  // 4 quater. Notification interne, page de confirmation (acompte puis paiement unique).
  const wh3 = (id) => { const f = new FormData(); f.set('id', id); return fetch(`${APP3}/api/mollie/webhook`, { method: 'POST', body: f }); };
  await mock('/__reset');
  setFake((s) => { s.payments[vit.id].status = 'paid'; s.payments[lan.id].status = 'paid'; });
  r = await wh3(vit.id);
  let mails = await deliveries();
  const unesc = (h) => strip(h).replace(/&#(\d+);/g, (m, n) => String.fromCharCode(Number(n)));
  const norm1 = (x) => x.replace(/[\s\u00a0\u202f]+/g, ' ');
  const sujet = norm1(mails[0]?.payload.subject ?? ''), corps = unesc(mails[0]?.payload.html ?? '');
  check('notification de l\'acompte : sujet, montant TTC, échéance, total, solde et rappel de facturation', r.status === 200 && sujet.includes('594 € TTC') && sujet.includes('acompte 1/2') && ['594 € TTC', '1/2', 'Total de la commande', '1 188 € TTC', 'Solde à facturer', 'avant la livraison', "Émettre la facture d'acompte"].every((x) => corps.replace(/[\s  ]+/g, ' ').includes(x)), sujet);
  r = await wh3(lan.id);
  mails = await deliveries();
  const corpsL = unesc(mails[1]?.payload.html ?? '');
  check('notification d\'un paiement unique : montant TTC, rappel de facturation, aucune échéance', r.status === 200 && norm1(mails[1]?.payload.subject ?? '').includes('468 € TTC') && corpsL.includes('Émettre la facture (TVA 20 %)') && !corpsL.includes('Solde à facturer'), mails[1]?.payload.subject);
  const merciV = strip(await (await fetch(`${APP3}/merci?mollie_id=${vit.id}`)).text());
  check('page de confirmation de l\'acompte : montant TTC et solde à régler avant la livraison', merciV.includes('594 € TTC') && merciV.includes('Ce paiement est l\'acompte de votre commande') && merciV.includes('Le solde de 594 € TTC est à régler avant la livraison'));
  const merciL = strip(await (await fetch(`${APP3}/merci?mollie_id=${lan.id}`)).text());
  check('page de confirmation d\'un paiement unique : montant TTC, pas de solde', merciL.includes('468 € TTC') && !merciL.includes('acompte'));
  const merci1 = strip(await (await fetch(`${APP}/merci?mollie_id=${created.id}`)).text());
  check('grille désactivée : page de confirmation inchangée (montant sans « TTC », pas d\'acompte)', merci1.includes("Votre paiement de 149 € pour l'offre") && !merci1.includes('TTC') && !merci1.includes('acompte'));
  await mock('/__reset');

  // 4 quinquies. Fiches de la Landing page et du Site vitrine : inclus, non inclus, hébergement et abonnement.
  const cartes = ['Landing page', 'Site vitrine'];
  const fiches = ["12 mois d'hébergement inclus", '2 séries de révisions', 'Mise en ligne', 'Non inclus', 'Nom de domaine : enregistré à votre nom', 'Licences, API et services tiers', 'Aucune garantie de positionnement sur Google ni de résultat commercial', "149 € HT par mois (178,80 € TTC)", "uniquement sur votre accord écrit, sans reconduction automatique", 'Délai confirmé après cadrage et réception de vos éléments'];
  const manqF = fiches.filter((x) => !off3.includes(x));
  check('grille active : fiches Landing page et Site vitrine complètes (inclus, non inclus, hébergement, abonnement, délai conditionné)', manqF.length === 0 && (off3.match(/12 mois d'hébergement inclus/g) ?? []).length === 2, JSON.stringify(manqF));
  check('grille active : aucune promesse de résultat, de délai chiffré ni de classement dans les fiches', !/garanti(?!e de| de)|en 24 ?h|en \d+ jours|premier sur Google|résultats? garantis?/i.test(off3.replace('Aucune garantie de positionnement sur Google ni de résultat commercial', '')));
  check('grille désactivée : fiches inchangées (ni « Non inclus » ni hébergement)', !/Non inclus|12 mois d'hébergement|2 séries de révisions/.test(off1));

  // 5. Données structurées : prix HT précisé pour la Landing page et le Site vitrine, rien pour les offres sur devis.
  const ld = [...html3.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).find((j) => j['@type'] === 'OfferCatalog');
  const specs = (ld?.itemListElement ?? []).filter((o) => o.priceSpecification).map((o) => `${o.priceSpecification.price}/${o.priceSpecification.valueAddedTaxIncluded}`);
  check('grille active : données structurées en HT (390,00 et 990,00, TVA non incluse)', JSON.stringify(specs) === JSON.stringify(['390.00/false', '990.00/false']), JSON.stringify(specs));
}

console.log('\n== Commande en ligne fermée (valeur de production par défaut, quatrième serveur de test)');
{
  const APP4 = process.env.APP4_URL;
  const co4 = (body, ip) => fetch(`${APP4}/api/checkout`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify(body) });
  const strip4 = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/[\s  ]+/g, ' ');
  const nb = Object.keys(fakeState().payments).length, calls = fakeState().calls.length;
  const allIds = Object.keys(prices);
  const bad = [];
  let k = 1;
  for (const id of allIds) {
    for (const provider of ['mollie', 'stripe']) {
      const res = await co4({ offerId: id, provider, customer }, `10.11.${Math.floor(k / 250)}.${(k++ % 250) + 1}`);
      const j = await res.json().catch(() => ({}));
      if (res.status !== 403 || typeof j.error !== 'string' || j.url) bad.push(`${id}/${provider}: ${res.status}`);
    }
  }
  check(`commande fermée : les ${allIds.length} offres refusées (403) en Mollie comme en Stripe, sans adresse de paiement`, bad.length === 0 && allIds.length === 25, JSON.stringify(bad.slice(0, 3)));
  const a4 = fakeState();
  check('commande fermée : aucun paiement créé, aucun appel à Mollie ni à Stripe', Object.keys(a4.payments).length === nb && a4.calls.length === calls);
  const r4 = await co4({ offerId: 'inexistante', provider: 'mollie' }, '10.12.0.1');
  check('commande fermée : une offre inconnue reste une erreur 400', r4.status === 400);
  const h4 = await (await fetch(APP4 + '/offres')).text();
  const t4 = strip4(h4);
  const c4 = (n) => h4.split(n).length - 1;
  check('commande fermée : 25 « Demander un devis », aucun « Commander »', c4('Demander un devis <') === 25 && c4('Commander <') === 0, `(${c4('Demander un devis <')} / ${c4('Commander <')})`);
  check('commande fermée : aucun prix obsolète affiché (149, 205, 229, 499 €), « Sur devis » partout', !/\b(149|205|229|499|2 500|5 000|10 000) €/.test(t4) && (t4.match(/Sur devis/g) ?? []).length >= 25, '');
  check('commande fermée : textes de la page Offres cohérents (aucune promesse de commande ni de paiement en ligne)', t4.includes('un devis pour chaque projet') && !/Commandez|commander directement|paiement sécurisé par Mollie/i.test(t4));
  const ld4 = [...h4.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).find((j) => j['@type'] === 'OfferCatalog');
  check('commande fermée : aucun prix dans les données structurées', (ld4?.itemListElement ?? []).every((o) => !o.price && !o.priceSpecification));
  const faq4 = strip4(await (await fetch(APP4 + '/faq')).text());
  check('commande fermée : FAQ décrivant le parcours par devis', faq4.includes('chaque projet démarre par une demande de devis') && !faq4.includes('se commandent directement'));
  // La FAQ est une page statique : elle lit l'indicateur à la construction (Vercel reconstruit à chaque changement
  // de variable), donc seule la valeur de production par défaut est vérifiée ici.
  const faqLd = [...(await (await fetch(APP4 + '/faq')).text()).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).find((j) => j['@type'] === 'FAQPage');
  check('commande fermée : balisage FAQ cohérent avec la page (aucune réponse « commandent directement »)', !JSON.stringify(faqLd).includes('se commandent directement'));
}

console.log('\n== Contenu et référencement');
{
  const strip5 = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/[\s  ]+/g, ' ');
  const nf = await fetch(APP + '/page-qui-n-existe-pas');
  const nfh = await nf.text();
  check('page 404 : statut 404, aux couleurs du site (navigation, titre, liens), non indexée', nf.status === 404 && nfh.includes('Cette page n') && nfh.includes('href="/offres"') && /noindex/.test(nfh) && nfh.includes('Powamekka'), `(${nf.status})`);
  const offresHtml = await (await fetch(APP + '/offres')).text();
  check('page Offres : image de partage Open Graph présente', /property="og:image"/.test(offresHtml));
  const pagesTexte = [];
  for (const p of ['/', '/faq', '/services/sites', '/vision', '/offres']) pagesTexte.push(await (await fetch(APP + p)).text());
  check('aucune localisation non justifiée (Rouen, Normandie) ni profil LinkedIn non vérifié dans les pages', !/Rouen|Normandie|linkedin\.com/i.test(pagesTexte.join(' ')));
  check('badge de la carte recommandée : « Recommandé » (plus de « Le plus choisi »)', strip5(offresHtml).includes('Recommandé') && !strip5(offresHtml).includes('Le plus choisi'));
}

console.log('\n== Pages');
for (const p of ['/', '/offres', '/faq', '/vision', '/mentions-legales', '/confidentialite', '/blog', '/services/ia', '/services/audit', '/merci', '/sitemap.xml', '/robots.txt']) {
  r = await fetch(APP + p);
  check(`GET ${p} → 200`, r.status === 200, `(reçu ${r.status})`);
}
r = await fetch(APP + '/');
check('en-têtes de sécurité présents', r.headers.get('x-frame-options') === 'DENY' && r.headers.get('x-content-type-options') === 'nosniff');

console.log('\n== Pages légales');
{
  const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/[\s\u00a0\u202f]+/g, ' ');
  const ml = strip(await (await fetch(APP + '/mentions-legales')).text());
  const pc = strip(await (await fetch(APP + '/confidentialite')).text());
  check('mentions légales : identité, SIREN, SIRET, TVA, adresse, téléphone, hébergeur', ['Osee DIAMPO SENGELE EI', '822 349 841', '822 349 841 00012', 'FR35822349841', "22 rue d'Ottmarsheim", '+33 6 35 09 79 80', 'Vercel Inc.', 'contact@powamekka.com'].every((x) => ml.includes(x)));
  check('politique de confidentialité : responsable, prestataires, droits, CNIL', ['Osee DIAMPO SENGELE EI', 'Mollie B.V.', 'Resend', 'Vercel Inc.', 'CNIL'].every((x) => pc.includes(x)));
  check('aucun champ à compléter ni tiret long dans les pages légales', !/\[À|\[A |À FOURNIR|À DÉCIDER|À VALIDER|[—–]/.test(ml + pc));
  const home = await (await fetch(APP + '/')).text();
  check('pied de page : liens vers les mentions légales et la confidentialité', home.includes('href="/mentions-legales"') && home.includes('href="/confidentialite"'));
}

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
