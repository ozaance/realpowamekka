import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { LegalDocument } from '@/lib/legal';

/* Page légale : mêmes en-tête et sections que la FAQ, sans appel à l'action. */
export default function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <>
      <Navbar />
      <main>
        <section
          style={{
            borderBottom: '1px solid var(--line)',
            paddingTop: 'clamp(80px,13vh,150px)',
            paddingBottom: 'clamp(50px,8vh,100px)',
          }}
        >
          <div className="wrap">
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 20,
              }}
            >
              {doc.kicker}
            </p>
            <h1 className="display" style={{ maxWidth: '18ch', marginBottom: 28 }}>
              {doc.title}
            </h1>
            <p className="lede" style={{ maxWidth: '48ch', marginBottom: 16 }}>
              {doc.lede}
            </p>
            <p style={{ fontSize: 13, color: 'var(--ink-dim)' }}>Dernière mise à jour : {doc.updated}</p>
          </div>
        </section>

        {doc.sections.map((section) => (
          <section
            key={section.title}
            style={{ padding: 'clamp(40px,6vh,80px) 0', borderBottom: '1px solid var(--line)' }}
          >
            <div
              className="wrap split split-19"
              style={{ display: 'grid', gap: 'clamp(30px,6vw,80px)', alignItems: 'start' }}
            >
              <h2
                className="sticky-desk"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-dim)',
                  fontWeight: 400,
                }}
              >
                {section.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {section.blocks.map((block, i) =>
                  typeof block === 'string' ? (
                    <p
                      key={i}
                      style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--ink-dim)', maxWidth: '62ch' }}
                    >
                      {block}
                    </p>
                  ) : (
                    <ul
                      key={i}
                      style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        maxWidth: '62ch',
                      }}
                    >
                      {block.list.map((item) => (
                        <li
                          key={item}
                          style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-dim)', display: 'flex', gap: 10 }}
                        >
                          <span style={{ color: 'var(--gold)', flexShrink: 0 }} aria-hidden="true">
                            •
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
