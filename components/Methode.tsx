"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    num: "01 — Audit",
    title: "Comprendre",
    desc: "Nous analysons vos opérations, vos données et vos objectifs avant toute solution.",
  },
  {
    num: "02 — Conception",
    title: "Architecturer",
    desc: "Nous dessinons le système juste — sans superflu, aligné sur votre réalité.",
  },
  {
    num: "03 — Déploiement",
    title: "Mettre en œuvre",
    desc: "Nous déployons l'IA et les automatisations qui créent une valeur réelle.",
  },
  {
    num: "04 — Pilotage",
    title: "Piloter la croissance",
    desc: "Nous mesurons, ajustons et accompagnons votre montée en maîtrise.",
  },
];

export default function Methode() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="methode"
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
            marginBottom: "46px",
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
            Une méthode qui inspire confiance.
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
            Méthode · 4 étapes
          </motion.span>
        </div>

        {/* Steps grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "clamp(20px, 3vw, 44px)",
            marginTop: "46px",
          }}
          className="method-steps"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 + i * 0.1 }}
              style={{ position: "relative" }}
            >
              {/* Step number with trailing line */}
              <div
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  color: "var(--gold)",
                  marginBottom: "18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {step.num}
                <span
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "var(--line)",
                  }}
                />
              </div>

              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: "var(--disp-weight)" as unknown as number,
                  fontSize: "clamp(20px, 1.9vw, 26px)",
                  color: "var(--ink)",
                  marginBottom: "12px",
                  lineHeight: 1.2,
                }}
              >
                {step.title}
              </h4>

              <p
                style={{
                  fontSize: "13.5px",
                  lineHeight: 1.65,
                  color: "var(--ink-dim)",
                }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .method-steps { grid-template-columns: 1fr 1fr !important; gap: 34px !important; }
        }
        @media (max-width: 520px) {
          .method-steps { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
