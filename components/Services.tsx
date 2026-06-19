'use client';

import { useEffect, useState } from 'react';

type Service = {
  id: string;
  title: string;
  lede: string;
  body: string;
  points: string[];
  width: number;
};

const services: Service[] = [
  {
    id: "audits",
    title: "Audits Stratégiques",
    lede: "Comprendre vos opérations et nommer les leviers.",
    body: "Avant toute solution, nous prenons le temps de comprendre votre réalité. Vos outils, vos flux de travail, vos points de friction. Cet audit n'est pas un rapport théorique, mais un diagnostic concret qui révèle où se cachent vos leviers de clarté, d'efficacité et de croissance.",
    points: [
      "Diagnostic complet de vos outils et flux de travail",
      "Cartographie des points de friction et des opportunités",
      "Plan d'action priorisé, avec un impact estimé pour chaque levier",
    ],
    width: 38,
  },
  {
    id: "systemes",
    title: "Systèmes Digitaux",
    lede: "Architecturer la base : outils, données, équipes reliés.",
    body: "Nous construisons l'architecture qui relie vos outils entre eux : CRM, facturation, planning, communication. Vos données circulent automatiquement d'un système à l'autre, sans ressaisie manuelle ni perte d'information entre vos équipes.",
    points: [
      "Connexion de vos outils existants (CRM, facturation, planning)",
      "Centralisation et fiabilisation de vos données",
      "Documentation claire du système pour vos équipes",
    ],
    width: 55,
  },
  {
    id: "ia",
    title: "IA & Automatisation",
    lede: "Automatiser le répétitif, augmenter les décisions.",
    body: "L'intelligence artificielle prend en charge les tâches répétitives : rédaction de devis, tri des messages, relances clients. Pendant ce temps, des tableaux de bord vous donnent une vision claire pour décider plus vite et avec plus de justesse.",
    points: [
      "Automatisation des tâches administratives répétitives",
      "Assistants IA pour la rédaction de devis et réponses clients",
      "Tableaux de bord pour des décisions plus rapides et mieux informées",
    ],
    width: 72,
  },
  {
    id: "sites",
    title: "Sites Premium",
    lede: "Donner au système une vitrine crédible et durable.",
    body: "Votre site n'est pas un dépliant en ligne : c'est la vitrine de votre système. Nous le construisons rapide, crédible et pensé pour convertir, en le reliant directement à vos outils internes pour que chaque demande arrive là où il faut.",
    points: [
      "Design sur-mesure aligné à votre identité",
      "Développement rapide et optimisé (Next.js)",
      "Intégration avec vos outils internes (devis, contact, prise de rendez-vous)",
    ],
    width: 86,
  },
  {
    id: "formation",
    title: "Formation & Adoption",
    lede: "Ancrer la maîtrise durablement dans vos équipes.",
    body: "Un système n'a de valeur que si vos équipes le maîtrisent. Nous formons vos collaborateurs aux nouveaux outils et restons présents après le déploiement, pour que les bonnes habitudes s'installent durablement, pas seulement le jour de la livraison.",
    points: [
      "Formations pratiques adaptées à votre équipe",
      "Documentation et supports de référence",
      "Accompagnement post-déploiement pour ancrer les nouvelles habitudes",
    ],
    width: 100,
  },
];

export default function Services() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = services.find((s) => s.id === activeId) ?? null;

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);

  return (
    <section className="svc wrap" id="services">
      <div className="sec-head">
        <h3 className="shead rv d1">Cinq disciplines, un système.</h3>
      </div>

      <div className="v-svc pile">
        <div className="stack rv d1">
          {services.map((s) => (
            <div key={s.id} className="layer" role="button" tabIndex={0} onClick={() => setActiveId(s.id)} onKeyDown={(e) => e.key === 'Enter' && setActiveId(s.id)}>
              <h4>{s.title}</h4>
              <p>{s.lede}</p>
              <div className="barwrap">
                <div className="bar" style={{ width: `${s.width}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {active && (
        <div className="svc-modal-overlay" onClick={() => setActiveId(null)}>
          <div className="svc-modal" onClick={(e) => e.stopPropagation()}>
            <button className="svc-modal-close" onClick={() => setActiveId(null)} aria-label="Fermer">{"\u00D7"}</button>
            <span className="svc-modal-kicker">Service</span>
            <h3 className="svc-modal-title">{active.title}</h3>
            <p className="svc-modal-lede">{active.lede}</p>
            <p className="svc-modal-body">{active.body}</p>
            <ul className="svc-modal-points">
              {active.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <a className="btn" href="https://wa.me/33605715122?text=Bonjour%2C%20je%20souhaite%20demander%20un%20audit%20pour%20mon%20entreprise." target="_blank" rel="noopener noreferrer" style={{ borderRadius: 18 }} onClick={() => setActiveId(null)}>Demander un audit<span className="ar">{"\u2192"}</span></a>
          </div>
        </div>
      )}
    </section>
  );
}
