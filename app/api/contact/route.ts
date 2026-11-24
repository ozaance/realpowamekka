import { NextResponse } from 'next/server';
import { describeEmailError, sendMail } from '@/lib/email';
import { clientIp, escapeHtml, rateLimit, singleLine } from '@/lib/security';

const LIMITS = { name: 100, email: 254, message: 5000, service: 80 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 5 demandes par IP et par tranche de 10 minutes. */
const RATE = { limit: 5, windowMs: 10 * 60 * 1000 };

type ContactInput = { name: string; email: string; message: string; service: string };

function parseInput(raw: unknown): { ok: true; value: ContactInput } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'Requête invalide' };
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

  const name = singleLine(str(r.name));
  const email = str(r.email);
  const message = str(r.message);
  const service = singleLine(str(r.service));

  if (!name || !email || !message) return { ok: false, error: 'Champs manquants' };
  if (name.length > LIMITS.name) return { ok: false, error: 'Nom trop long' };
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) return { ok: false, error: 'Email invalide' };
  if (message.length > LIMITS.message) return { ok: false, error: 'Message trop long' };
  if (service.length > LIMITS.service) return { ok: false, error: 'Service invalide' };

  return { ok: true, value: { name, email, message, service } };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  // Honeypot : champ invisible pour un humain. Un robot qui le remplit reçoit
  // une réponse de succès, sans qu'aucun email ne parte.
  const trap = (body as Record<string, unknown> | null)?.hp_extra;
  if (typeof trap === 'string' && trap.trim() !== '') {
    console.warn('[contact] honeypot rempli, demande ignorée');
    return NextResponse.json({ success: true });
  }

  if (!rateLimit(`contact:${clientIp(req)}`, RATE.limit, RATE.windowMs)) {
    return NextResponse.json(
      { error: 'Trop de demandes. Réessayez dans quelques minutes.' },
      { status: 429 }
    );
  }

  const parsed = parseInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { name, email, message, service } = parsed.value;
  const n = escapeHtml(name);
  const e = escapeHtml(email);
  const m = escapeHtml(message).replace(/\n/g, '<br>');
  const s = escapeHtml(service);

  try {
    await sendMail({
      replyTo: email,
      subject: `Nouvelle demande — ${service || 'Site web'}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <h2 style="color:#1c1813;margin-bottom:8px">Nouvelle demande de contact</h2>
          <p style="color:#888;font-size:13px;margin-bottom:32px">Via powamekka.com${s ? ' — ' + s : ''}</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:12px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;width:120px">Nom</td><td style="padding:12px 0;border-bottom:1px solid #eee;color:#1c1813">${n}</td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #eee;color:#888;font-size:13px">Email</td><td style="padding:12px 0;border-bottom:1px solid #eee"><a href="mailto:${e}" style="color:#b8975a">${e}</a></td></tr>
            <tr><td style="padding:12px 16px 0 0;color:#888;font-size:13px;vertical-align:top">Message</td><td style="padding:16px 0 0;color:#1c1813;line-height:1.6">${m}</td></tr>
          </table>
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #eee">
            <a href="mailto:${e}" style="background:#1c1813;color:#fff;padding:12px 24px;border-radius:18px;text-decoration:none;font-size:13px">Répondre à ${n}</a>
          </div>
        </div>
      `,
    });
  } catch (err) {
    // Le prestataire a refusé l'envoi : surtout ne pas afficher « Message envoyé ».
    console.error('[contact] envoi impossible', describeEmailError(err));
    return NextResponse.json(
      { error: "L'envoi a échoué. Réessayez ou écrivez-nous directement." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
