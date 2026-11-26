// Lance les tests d'intégration de bout en bout, sans aucun appel réel :
// faux Resend, faux Mollie et réseau sortant verrouillé (tests/fake-payments.mjs).
// Prérequis : un build de production (npm run build).
// Usage : npm run test:integration
import { spawn, spawnSync } from 'node:child_process';
import net from 'node:net';
import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const APP_PORT = Number(process.env.TEST_APP_PORT || 3190);
// Second serveur, même build, avec la collecte des informations de facturation et la case CGV activées :
// le serveur principal garde le comportement de production (tout désactivé).
const APP2_PORT = Number(process.env.TEST_APP2_PORT || APP_PORT + 1);
// Troisième serveur : grille tarifaire 2026 activée (PRICING_2026=1), seule.
const APP3_PORT = Number(process.env.TEST_APP3_PORT || APP_PORT + 2);
// Quatrième serveur : valeurs de production par défaut (commande en ligne fermée, aucune option activée).
const APP4_PORT = Number(process.env.TEST_APP4_PORT || APP_PORT + 3);
const MOCK_PORT = Number(process.env.MOCK_RESEND_PORT || 4010);
const STATE = join(tmpdir(), `powamekka-fake-payments-${process.pid}.json`);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

if (!existsSync(join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('Aucun build trouvé : lancez d’abord « npm run build ».');
  process.exit(1);
}

/** Un port déjà occupé par un autre serveur ferait tourner les tests contre CE serveur. */
const portIsFree = (port) =>
  new Promise((resolve) => {
    const srv = net.createServer();
    srv.once('error', () => resolve(false));
    srv.listen(port, '127.0.0.1', () => srv.close(() => resolve(true)));
  });
for (const [port, nom] of [[APP_PORT, 'TEST_APP_PORT'], [APP2_PORT, 'TEST_APP2_PORT'], [APP3_PORT, 'TEST_APP3_PORT'], [APP4_PORT, 'TEST_APP4_PORT'], [MOCK_PORT, 'MOCK_RESEND_PORT']]) {
  if (!(await portIsFree(port))) {
    console.error(`Le port ${port} est déjà utilisé : arrêt, pour ne pas tester un autre serveur (variable ${nom} pour en changer).`);
    process.exit(1);
  }
}

writeFileSync(STATE, JSON.stringify({ payments: {}, calls: [], failNext: false }));

// Valeurs de test imposées : elles priment sur un éventuel .env.local.
const env = {
  ...process.env,
  NODE_ENV: 'production',
  // Les serveurs 1 à 3 testent le parcours de commande : la commande en ligne y est ouverte. Le serveur 4
  // (APP4_URL) garde la valeur de production par défaut : commande en ligne fermée.
  ONLINE_ORDERS_OPEN: '1',
  RESEND_BASE_URL: `http://127.0.0.1:${MOCK_PORT}`,
  RESEND_API_KEY: 're_test_fake',
  MOLLIE_API_KEY: 'test_fake',
  STRIPE_SECRET_KEY: 'sk_test_fake',
  STRIPE_WEBHOOK_SECRET: 'whsec_test_fake',
  // Résultats indépendants de .env.local et de l'environnement de l'appelant.
  NEXT_PUBLIC_SITE_URL: 'https://www.powamekka.com',
  VERCEL_URL: '',
  VERCEL_BRANCH_URL: '',
  FAKE_PAYMENTS_STATE: STATE,
  NODE_OPTIONS: `--import ${join(ROOT, 'tests', 'fake-payments.mjs')}`,
};

// Le garde-fou réseau est testé avant le site : s'il ne bloque pas tout, rien ne démarre.
const garde = spawnSync('node', ['--import', join(ROOT, 'tests', 'fake-payments.mjs'), join(ROOT, 'tests', 'garde-fous.mjs')], { cwd: ROOT, stdio: 'inherit', env });
if (garde.status !== 0) {
  console.error('Le garde-fou réseau est en échec : les tests ne sont pas lancés.');
  rmSync(STATE, { force: true });
  process.exit(1);
}
writeFileSync(STATE, JSON.stringify({ payments: {}, calls: [], failNext: false }));

const children = [];
const start = (cmd, args, extraEnv) => {
  const c = spawn(cmd, args, { cwd: ROOT, env: extraEnv, stdio: ['ignore', 'pipe', 'pipe'] });
  children.push(c);
  return c;
};
const stopAll = () => { for (const c of children) { try { c.kill(); } catch {} } try { rmSync(STATE, { force: true }); } catch {} };
process.on('exit', stopAll);
process.on('SIGINT', () => { stopAll(); process.exit(130); });

start('node', [join(ROOT, 'tests', 'mock-resend.mjs')], { ...process.env, MOCK_RESEND_PORT: String(MOCK_PORT) });
const app = start(join(ROOT, 'node_modules', '.bin', 'next'), ['start', '-p', String(APP_PORT)], env);
const app2 = start(join(ROOT, 'node_modules', '.bin', 'next'), ['start', '-p', String(APP2_PORT)], { ...env, BILLING_FIELDS_ENABLED: '1', CGV_ACCEPTANCE_ENABLED: '1' });
let app2Exited = false;
app2.on('exit', () => { app2Exited = true; });
const app3 = start(join(ROOT, 'node_modules', '.bin', 'next'), ['start', '-p', String(APP3_PORT)], { ...env, PRICING_2026: '1' });
app3.on('exit', () => { app2Exited = true; });
const app4 = start(join(ROOT, 'node_modules', '.bin', 'next'), ['start', '-p', String(APP4_PORT)], { ...env, ONLINE_ORDERS_OPEN: '' });
app4.on('exit', () => { app2Exited = true; });
let appLog = '';
let appExited = false;
app.stdout.on('data', (b) => (appLog += b)); app.stderr.on('data', (b) => (appLog += b));
app.on('exit', () => { appExited = true; });

let ready = false;
for (let i = 0; i < 80 && !ready && !appExited && !app2Exited; i++) {
  await wait(250);
  try { ready = (await fetch(`http://127.0.0.1:${APP_PORT}/robots.txt`)).ok && (await fetch(`http://127.0.0.1:${APP2_PORT}/robots.txt`)).ok && (await fetch(`http://127.0.0.1:${APP3_PORT}/robots.txt`)).ok && (await fetch(`http://127.0.0.1:${APP4_PORT}/robots.txt`)).ok && (await fetch(`http://127.0.0.1:${MOCK_PORT}/__state`, { method: 'POST' })).ok; } catch {}
}
if (!ready) { console.error('Le serveur de test n’a pas démarré.\n' + appLog.slice(-2000)); stopAll(); process.exit(1); }

const t = spawn('node', [join(ROOT, 'tests', 'integration.mjs')], {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env, APP_URL: `http://127.0.0.1:${APP_PORT}`, APP2_URL: `http://127.0.0.1:${APP2_PORT}`, APP3_URL: `http://127.0.0.1:${APP3_PORT}`, APP4_URL: `http://127.0.0.1:${APP4_PORT}`, MOCK_URL: `http://127.0.0.1:${MOCK_PORT}`, FAKE_PAYMENTS_STATE: STATE },
});
t.on('exit', (code) => { stopAll(); process.exit(code ?? 1); });
