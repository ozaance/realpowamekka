"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    num: "01",
    title: "Systèmes Digitaux",
    desc: "Une architecture unifiée qui relie vos outils, vos données et vos équipes en un seul système lisible.",
    tag: "SYS",
  },
  {
    num: "02",
    title: "Sites Premium",
    desc: "Des sites pensés comme des systèmes : crédibles, rapides, conçus pour convertir et durer.",
    tag: "WEB",
  },
  {
    num: "03",
    title: "IA & Automatisation",
    desc: "Automatiser le répétitif et augmenter vos décisions grâce à l'intelligence artificielle.",
    tag: "IA",
  },
  {
    num: "04",
    title: "Audits Stratégiques",
    desc: "Un diagnostic clair de vos opérations pour révéler vos leviers de croissance.",
    tag: "AUDIT",
  },
  {
    num: "05",
    title: "Formation & Adoption",
    desc: "Vos équipes maîtrisent durablement les nouveaux outils et les nouvelles méthodes.",
    tag: "ADOPT",
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="services"
      style={{
        borderTop: "1px solid var(--line)",
        padding: "clamp(60px, 10vh, 120px) 0",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "0 var(--pad)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "30px",
            marginBottom: "48px",
            flexWrap: "wrap",
          }}
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: "var(--disp-weight)" as unknown as number,
              fontSize: "clamp(24px, 3vw, 40px)",
              lineHeight: 1.1,
              letterSpacing: "var(--disp-track)",
              color: "var(--ink)",
            }}
          >
            Cinq disciplines, un système.
          </motion.h3>

          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ink-dim)",
            }}
          >
            Services · 01&mdash;05
          </motion.span>
        </div>

        {/* Service index rows */}
        <div style={{ borderTop: "1px solid var(--line)" }}>
          {services.map((s, i) => (
            <ServiceRow key={s.num} service={s} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({
  service,
  index,
  inView,
}: {
  service: (typeof services)[0];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.a
      href="#contact"
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 + index * 0.08 }}
      style={{
        display: "grid",
        gridTemplateColumns: "70px 1.1fr 1.7fr 130px 34px",
        gap: "28px",
        alignItems: "center",
        padding: "32px 6px",
        borderBottom: "1px solid var(--line)",
        position: "relative",
        cursor: "pointer",
        transition: "padding 0.5s",
        textDecoration: "none",
        color: "inherit",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.paddingLeft = "22px";
        const before = el.querySelector(".srow-bg") as HTMLDivElement;
        if (before) before.style.opacity = "1";
        const arrow = el.querySelector(".srow-arrow") as HTMLSpanElement;
        if (arrow) {
          arrow.style.transform = "translateX(7px)";
          arrow.style.color = "var(--gold)";
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.paddingLeft = "6px";
        const before = el.querySelector(".srow-bg") as HTMLDivElement;
        if (before) before.style.opacity = "0";
        const arrow = el.querySelector(".srow-arrow") as HTMLSpanElement;
        if (arrow) {
          arrow.style.transform = "translateX(0)";
          arrow.style.color = "var(--ink-dim)";
        }
      }}
    >
      {/* Hover background sweep */}
      <div
        className="srow-bg"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, color-mix(in oklab, var(--gold) 8%, transparent), transparent 60%)",
          opacity: 0,
          transition: "opacity 0.5s",
          pointerEvents: "none",
          borderRadius: "18px",
        }}
      />

      <span
        style={{
          fontFamily: "var(--font-label)",
          fontSize: "13px",
          color: "var(--gold)",
          position: "relative",
        }}
      >
        {service.num}
      </span>

      <h4
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: "var(--disp-weight)" as unknown as number,
          fontSize: "clamp(22px, 2.2vw, 30px)",
          color: "var(--ink)",
          position: "relative",
        }}
      >
        {service.title}
      </h4>

      <p
        style={{
          fontSize: "13.5px",
          lineHeight: 1.6,
          color: "var(--ink-dim)",
          maxWidth: "42ch",
          position: "relative",
        }}
        className="srow-desc"
      >
        {service.desc}
      </p>

      <span
        style={{
          fontFamily: "var(--font-label)",
          fontSize: "10.5px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink-dim)",
          border: "1px solid var(--line-strong)",
          padding: "6px 10px",
          borderRadius: "18px",
          textAlign: "center",
          justifySelf: "start",
          position: "relative",
        }}
      >
        {service.tag}
      </span>

      <span
        className="srow-arrow"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "20px",
          color: "var(--ink-dim)",
          justifySelf: "end",
          transition: "transform 0.5s, color 0.4s",
          position: "relative",
        }}
      >
        →
      </span>

      <style>{`
        @media (max-width: 860px) {
          .srow-desc, [class*="srow-arrow"] { display: none !important; }
        }
      `}</style>
    </motion.a>
  );
}
