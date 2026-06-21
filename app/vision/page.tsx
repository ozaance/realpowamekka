import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Notre Vision — Powamekka',
  description: 'Powamekka existe parce que les PME perdent chaque jour des heures sur des tâches que l\'IA peut faire. Nous construisons les systèmes qui rendent ce temps aux dirigeants.',
};

export default function VisionPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* HERO */}
        <section style={{ paddingTop: 'clamp(80px,13vh,150px)', paddingBottom: 'clamp(60px,10vh,120px)', borderBottom: '1px solid var(--line)' }}>
          <div className="wrap">
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>Notre vision</p>
            <h1 className="display" style={{ maxWidth: '16ch' }}>Le temps est la seule ressource qu'on ne récupère pas.</h1>
          </div>
        </section>

        {/* CONSTAT */}
        <section style={{ padding: 'clamp(60px,10vh,120px) 0', borderBottom: '1px solid var(--line)' }}>
          <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 'clamp(30px,6vw,80px)', alignItems: 'start' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-dim)', paddingTop: 8 }}>Le constat</p>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,2.2vw,28px)', lineHeight: 1.5, color: 'var(--ink)', fontWeight: 400, marginBottom: 24 }}>
                Un dirigeant de PME passe entre 30 et 40% de son temps sur des tâches administratives qui n'ont aucune valeur stratégique.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--ink-soft)' }}>
                Relances clients, rédaction de devis, mise à jour de tableaux, tri de messages. Ces tâches sont nécessaires. Mais elles n'ont pas besoin d'un dirigeant pour être faites. L'IA peut les prendre en charge aujourd'hui, sans formation lourde et sans budget de grand groupe.
              </p>
            </div>
          </div>
        </section>

        {/* POURQUOI POWAMEKKA */}
        <section style={{ padding: 'clamp(60px,10vh,120px) 0', borderBottom: '1px solid var(--line)' }}>
          <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 'clamp(30px,6vw,80px)', alignItems: 'start' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-dim)', paddingTop: 8 }}>Pourquoi nous</p>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,2.2vw,28px)', lineHeight: 1.5, color: 'var(--ink)', fontWeight: 400, marginBottom: 24 }}>
                Powamekka est né d'un refus. Celui de voir des dirigeants compétents perdre leur énergie sur ce qu'une machine peut faire mieux et plus vite.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--ink-soft)', marginBottom: 20 }}>
                Pas de promesses vagues sur la transformation digitale. Pas de rapports de 50 pages qui finissent dans un tiroir. On intervient sur vos processus réels, avec des outils concrets, et on mesure ce que ça libère.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--ink-soft)' }}>
                Notre obsession c'est la précision. Identifier exactement où votre temps se perd. Construire exactement ce qui le récupère. Rien de plus.
              </p>
            </div>
          </div>
        </section>

        {/* 3 PRINCIPES */}
        <section style={{ padding: 'clamp(60px,10vh,120px) 0', borderBottom: '1px solid var(--line)' }}>
          <div className="wrap">
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-dim)', marginBottom: 48 }}>Ce en quoi nous croyons</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line)' }}>
              {[
                {
                  no: '01',
                  title: 'La clarté avant l\'outil',
                  desc: 'Un outil déployé sans comprendre le problème crée de la complexité, pas de l\'efficacité. On commence toujours par un diagnostic.'
                },
                {
                  no: '02',
                  title: 'La précision plutôt que l\'exhaustivité',
                  desc: 'Mieux vaut un système qui résout trois problèmes précis qu\'une suite d\'outils qui en résout vingt à moitié. On priorise ce qui compte vraiment.'
                },
                {
                  no: '03',
                  title: 'L\'autonomie comme objectif final',
                  desc: 'Notre travail est réussi quand vous n\'avez plus besoin de nous au quotidien. On forme, on documente, on transfère. La dépendance n\'est pas un modèle.'
                },
              ].map((p) => (
                <div key={p.no} style={{ background: 'var(--paper)', padding: 'clamp(28px,3vw,42px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold)', letterSpacing: '0.1em' }}>{p.no}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,1.9vw,26px)', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-dim)' }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: 'clamp(70px,12vh,150px) 0', textAlign: 'center' }}>
          <div className="wrap">
            <h2 className="display" style={{ maxWidth: '18ch', margin: '0 auto 24px' }}>Vous reconnaissez votre entreprise dans ce constat ?</h2>
            <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: '38ch', margin: '0 auto 40px', lineHeight: 1.7 }}>
              Un premier échange suffit pour identifier où votre temps se perd et ce qu'on peut en récupérer.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/services/audit" className="btn" style={{ borderRadius: 18 }}>Demander un audit →</a>
              <a href="https://wa.me/33605715122" target="_blank" rel="noopener noreferrer"
                style={{ borderRadius: 18, border: '1px solid var(--ink)', padding: '12px 24px', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                WhatsApp →
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
