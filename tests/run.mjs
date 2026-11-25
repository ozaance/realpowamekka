// Lance les tests d'intégration de bout en bout, sans aucun appel réel :
// faux Resend, faux Mollie et Stripe bloqué (tests/fake-payments.mjs).
// Prérequis : un build de production (npm run build).
// Usage : npm run test:integration
import { spawn } from 'node:child_process';
import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const APP_PORT = Number(process.env.TEST_APP_PORT || 3190);
const MOCK_PORT = Number(process.env.MOCK_RESEND_PORT || 4010);
const STATE = join(tmpdir(), `powamekka-fake-payments-${process.pid}.json`);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

if (!existsSync(join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('Aucun build trouvé : lancez d’abord « npm run build ».');
  process.exit(1);
}

writeFileSync(STATE, JSON.stringify({ payments: {}, calls: [], failNext: false }));

// Valeurs de test imposées : elles priment sur un éventuel .env.local.
const env = {
  ...process.env,
  NODE_ENV: 'production',
  RESEND_BASE_URL: `http://127.0.0.1:${MOCK_PORT}`,
  RESEND_API_KEY: 're_test_fake',
  MOLLIE_API_KEY: 'test_fake',
  STRIPE_SECRET_KEY: 'sk_test_fake',
  STRIPE_WEBHOOK_SECRET: 'whsec_test_fake',
  FAKE_PAYMENTS_STATE: STATE,
  NODE_OPTIONS: `--import ${join(ROOT, 'tests', 'fake-payments.mjs')}`,
};

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
let appLog = '';
app.stdout.on('data', (b) => (appLog += b)); app.stderr.on('data', (b) => (appLog += b));

let ready = false;
for (let i = 0; i < 80 && !ready; i++) {
  await wait(250);
  try { ready = (await fetch(`http://127.0.0.1:${APP_PORT}/robots.txt`)).ok && (await fetch(`http://127.0.0.1:${MOCK_PORT}/__state`, { method: 'POST' })).ok; } catch {}
}
if (!ready) { console.error('Le serveur de test n’a pas démarré.\n' + appLog.slice(-2000)); stopAll(); process.exit(1); }

const t = spawn('node', [join(ROOT, 'tests', 'integration.mjs')], {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env, APP_URL: `http://127.0.0.1:${APP_PORT}`, MOCK_URL: `http://127.0.0.1:${MOCK_PORT}`, FAKE_PAYMENTS_STATE: STATE },
});
t.on('exit', (code) => { stopAll(); process.exit(code ?? 1); });
