'use client';
import Link from 'next/link';
import { useState } from 'react';

export type ServicePageProps = {
  kicker: string;
  title: string;
  lede: string;
  intro: string;
  points: { title: string; desc: string }[];
  relatedServices: { label: string; href: string }[];
};

export default function ServicePage({
  kicker,
  title,
  lede,
  intro,
  points,
  relatedServices,
}: ServicePageProps) {
  const WA = "https://wa.me/33605715122?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services.";
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, service: kicker }),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const inputStyle = {
    background: 'var(--paper)',
    border: '1px solid var(--line)',
    borderRadius: 18,
    padding: '12px 16px',
    fontSize: 14,
    color: 'var(--ink)',
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'var(--ink-dim)',
  };

  return (
    <main>
      {/* HERO */}
      <section style={{ borderBottom: '1px solid var(--line)', paddingTop: 'clamp(80px,13vh,150px)', paddingBottom: 'clamp(60px,10vh,120px)' }}>
        <div className="wrap">
          <Link href="/#services" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
            ← Tous les services
          </Link>
          <p className="kicker rv d1" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>
            {kicker}
          </p>
          <h1 className="display rv d2" style={{ maxWidth: '16ch', marginBottom: 28 }}>{title}</h1>
          <p className="lede rv d3" style={{ maxWidth: '44ch' }}>{lede}</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 40 }} className="rv d4">
            <a href="#contact" className="btn" style={{ borderRadius: 18 }}>
              Demander un audit <span className="ar">→</span>
            </a>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ borderRadius: 18, border: '1px solid var(--ink)', padding: '12px 24px', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section style={{ padding: 'clamp(60px,10vh,120px) 0', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 'clamp(30px,6vw,80px)', alignItems: 'start' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-dim)' }}>Pourquoi ce service</p>
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,2vw,24px)', lineHeight: 1.5, color: 'var(--ink)', fontWeight: 400 }}>
            {intro}
          </p>
        </div>
      </section>

      {/* POINTS */}
      <section style={{ padding: 'clamp(60px,10vh,120px) 0', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-dim)', marginBottom: 48 }}>Ce que vous obtenez</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 1, background: 'var(--line)', border: '1px solid var(--line)' }}>
            {points.map((pt, i) => (
              <div key={i} style={{ background: 'var(--paper)', padding: 'clamp(28px,3vw,42px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold)', letterSpacing: '0.1em' }}>0{i + 1}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,1.9vw,26px)', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>{pt.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-dim)' }}>{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTRES SERVICES */}
      <section style={{ padding: 'clamp(50px,8vh,100px) 0', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-dim)', marginBottom: 32 }}>Nos autres services</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {relatedServices.map((s) => (
              <Link key={s.href} href={s.href} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: 100, padding: '9px 18px', textDecoration: 'none', transition: 'color 0.3s, border-color 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-soft)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; }}>
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: 'clamp(70px,12vh,150px) 0' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,100px)', alignItems: 'start' }}>
          <div>
            <h2 className="display" style={{ maxWidth: '14ch', marginBottom: 24 }}>Parlons de votre projet.</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-dim)', marginBottom: 32 }}>
              Un premier échange suffit pour identifier vos leviers de croissance. Aucun engagement.
            </p>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn" style={{ borderRadius: 18 }}>
              WhatsApp direct →
            </a>
            <p style={{ marginTop: 20, fontSize: 13, color: 'var(--ink-dim)' }}>
              Ou par email : <a href="mailto:contact@powamekka.com" style={{ color: 'var(--gold)' }}>contact@powamekka.com</a>
            </p>
          </div>

          <div>
            {status === 'sent' ? (
              <div style={{ padding: 40, border: '1px solid var(--line)', borderRadius: 18, textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginBottom: 12 }}>Message envoyé.</p>
                <p style={{ fontSize: 14, color: 'var(--ink-dim)' }}>On revient vers vous sous 24h.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor="name" style={labelStyle}>Nom & prénom</label>
                  <input id="name" type="text" required placeholder="Jean Dupont" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor="email" style={labelStyle}>Email professionnel</label>
                  <input id="email" type="email" required placeholder="jean@entreprise.fr" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor="message" style={labelStyle}>Votre situation</label>
                  <textarea id="message" required rows={5} placeholder="Décrivez votre activité et ce que vous cherchez à résoudre..."
                    value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                {status === 'error' && (
                  <p style={{ fontSize: 13, color: '#c0392b' }}>Une erreur est survenue. Réessayez ou contactez-nous sur WhatsApp.</p>
                )}
                <button type="submit" disabled={status === 'sending'} className="btn"
                  style={{ alignSelf: 'flex-start', marginTop: 8, borderRadius: 18, opacity: status === 'sending' ? 0.6 : 1 }}>
                  {status === 'sending' ? 'Envoi en cours...' : 'Envoyer →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
