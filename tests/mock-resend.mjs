// Faux serveur Resend : enregistre les envois, simule l'idempotence et les refus.
// Aucun e-mail réel n'est envoyé.
import http from 'node:http';

const PORT = Number(process.env.MOCK_RESEND_PORT || 4010);
const state = { mode: 'ok', deliveries: [], seenKeys: new Map() };

http
  .createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      const send = (code, obj) => {
        res.writeHead(code, { 'content-type': 'application/json' });
        res.end(JSON.stringify(obj));
      };
      if (req.url === '/__mode') { state.mode = JSON.parse(body).mode; return send(200, {}); }
      if (req.url === '/__state') return send(200, { deliveries: state.deliveries });
      if (req.url === '/__reset') { state.deliveries = []; state.seenKeys.clear(); return send(200, {}); }
      if (req.url === '/emails' && req.method === 'POST') {
        if (state.mode === 'fail') {
          return send(403, { statusCode: 403, name: 'validation_error', message: 'You can only send testing emails to your own email address' });
        }
        const key = req.headers['idempotency-key'];
        if (key && state.seenKeys.has(key)) return send(200, { id: state.seenKeys.get(key) });
        const id = `mock_${state.deliveries.length + 1}`;
        if (key) state.seenKeys.set(key, id);
        state.deliveries.push({ id, key: key ?? null, payload: JSON.parse(body) });
        return send(200, { id });
      }
      send(404, { message: 'not found' });
    });
  })
  .listen(PORT, '127.0.0.1', () => console.log(`mock-resend prêt sur ${PORT}`));
