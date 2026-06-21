'use client';
import Link from 'next/link';

const services = [
  { id: "audits", title: "Audits Stratégiques", lede: "Comprendre vos opérations et nommer les leviers.", href: "/services/audit", width: 38 },
  { id: "systemes", title: "Systèmes Digitaux", lede: "Architecturer la base : outils, données, équipes reliés.", href: "/services/systemes", width: 55 },
  { id: "ia", title: "IA & Automatisation", lede: "Automatiser le répétitif, augmenter les décisions.", href: "/services/ia", width: 72 },
  { id: "sites", title: "Sites Premium", lede: "Donner au système une vitrine crédible et durable.", href: "/services/sites", width: 86 },
  { id: "formation", title: "Formation & Adoption", lede: "Ancrer la maîtrise durablement dans vos équipes.", href: "/services/formation", width: 100 },
];

export default function Services() {
  return (
    <section className="svc wrap" id="services">
      <div className="sec-head">
        <h3 className="shead rv d1">Cinq disciplines, un système.</h3>
      </div>
      <div className="v-svc pile">
        <div className="stack rv d1">
          {services.map((s) => (
            <Link key={s.id} href={s.href} className="layer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h4>{s.title}</h4>
              <p>{s.lede}</p>
              <div className="barwrap">
                <div className="bar" style={{ width: `${s.width}%` }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
