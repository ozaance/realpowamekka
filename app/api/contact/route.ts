import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message, service } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'Powamekka <onboarding@resend.dev>',
      to: 'contact@powamekka.com',
      replyTo: email,
      subject: `Nouvelle demande — ${service || 'Site web'}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <h2 style="color:#1c1813;margin-bottom:8px">Nouvelle demande de contact</h2>
          <p style="color:#888;font-size:13px;margin-bottom:32px">Via powamekka.com${service ? ' — ' + service : ''}</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:12px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;width:120px">Nom</td><td style="padding:12px 0;border-bottom:1px solid #eee;color:#1c1813">${name}</td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #eee;color:#888;font-size:13px">Email</td><td style="padding:12px 0;border-bottom:1px solid #eee"><a href="mailto:${email}" style="color:#b8975a">${email}</a></td></tr>
            <tr><td style="padding:12px 16px 0 0;color:#888;font-size:13px;vertical-align:top">Message</td><td style="padding:16px 0 0;color:#1c1813;line-height:1.6">${message.replace(/\n/g, '<br>')}</td></tr>
          </table>
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #eee">
            <a href="mailto:${email}" style="background:#1c1813;color:#fff;padding:12px 24px;border-radius:18px;text-decoration:none;font-size:13px">Répondre à ${name}</a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
