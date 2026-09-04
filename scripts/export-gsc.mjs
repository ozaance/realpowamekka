#!/usr/bin/env node
/**
 * Exporte les données Search Console (28 derniers jours) vers seo/data/.
 * Auth : compte de service, clé JSON dans GSC_SERVICE_ACCOUNT_JSON (variable
 * d'environnement, jamais un fichier commité). Aucune dépendance externe :
 * JWT signé à la main avec le module `crypto` natif de Node.
 */
import { createSign } from 'node:crypto';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = process.env.GSC_PROPERTY || 'https://www.powamekka.com/';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = {
    iss: serviceAccount.client_email,
    scope: SCOPE,
    aud: TOKEN_ENDPOINT,
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(serviceAccount.private_key).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const assertion = `${unsigned}.${signature}`;

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!res.ok) {
    throw new Error(`Échange de jeton refusé (${res.status}) : ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function queryAnalytics(accessToken, dimensions, rowLimit = 500) {
  const end = new Date();
  end.setDate(end.getDate() - 3); // délai de fraîcheur habituel de la donnée GSC
  const start = new Date(end);
  start.setDate(start.getDate() - 28);
  const fmt = (d) => d.toISOString().slice(0, 10);

  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: fmt(start),
        endDate: fmt(end),
        dimensions,
        rowLimit,
      }),
    }
  );
  if (!res.ok) {
    throw new Error(`Requête Search Console refusée (${res.status}) : ${await res.text()}`);
  }
  const data = await res.json();
  return { startDate: fmt(start), endDate: fmt(end), rows: data.rows || [] };
}

async function main() {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    console.error('GSC_SERVICE_ACCOUNT_JSON absente : export ignoré.');
    process.exit(1);
  }
  const serviceAccount = JSON.parse(raw);
  const accessToken = await getAccessToken(serviceAccount);

  const byQuery = await queryAnalytics(accessToken, ['query', 'page']);
  const byPage = await queryAnalytics(accessToken, ['page']);

  const snapshot = {
    site: SITE_URL,
    generatedAt: new Date().toISOString(),
    period: { startDate: byQuery.startDate, endDate: byQuery.endDate },
    queries: byQuery.rows.map((r) => ({
      query: r.keys[0],
      page: r.keys[1],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    })),
    pages: byPage.rows.map((r) => ({
      page: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    })),
  };

  const dataDir = path.join(process.cwd(), 'seo', 'data');
  await mkdir(dataDir, { recursive: true });
  const dateStamp = snapshot.period.endDate;
  await writeFile(path.join(dataDir, `gsc-${dateStamp}.json`), JSON.stringify(snapshot, null, 2));
  await writeFile(path.join(dataDir, 'latest.json'), JSON.stringify(snapshot, null, 2));

  console.log(
    `Export OK : ${snapshot.queries.length} lignes requête×page, ${snapshot.pages.length} pages, période ${snapshot.period.startDate} → ${snapshot.period.endDate}.`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
