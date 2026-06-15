"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Conviction() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        borderTop: "1px solid var(--line)",
        padding: "clamp(60px, 11vh, 130px) 0",
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
        <div style={{ marginBottom: "50px" }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "13px",
              fontFamily: "var(--font-label)",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--gold)",
            }}
          >
            La conviction
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(30px, 5vw, 68px)",
              lineHeight: 1.06,
              letterSpacing: "-0.015em",
              color: "var(--ink)",
              marginTop: "22px",
            }}
          >
            Nous transformons la
            <br />
            complexité en maîtrise.
          </motion.h2>
        </div>

        {/* Before / After panels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.18 }}
          className="conviction-panels"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "clamp(20px, 4vw, 56px)",
            alignItems: "center",
          }}
        >
          {/* BEFORE — chaos */}
          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: "18px",
              aspectRatio: "1 / 0.74",
              position: "relative",
              overflow: "hidden",
              background: "color-mix(in oklab, var(--plaster) 40%, var(--paper))",
            }}
          >
            <svg
              viewBox="0 0 300 220"
              preserveAspectRatio="none"
              aria-hidden
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            >
              <g className="svg-tangle">
                <path d="M20 40 C90 10 130 180 210 90 S260 30 285 120" />
                <path d="M30 180 C110 120 90 30 200 70 S250 200 280 60" />
                <path d="M15 110 C80 200 160 20 230 160 S270 90 290 170" />
                <path d="M40 20 C60 120 200 140 150 200 S40 150 20 90" />
                <path d="M25 150 C120 80 170 200 250 40" />
                <path d="M60 200 C140 160 120 60 260 110" />
              </g>
            </svg>
            <span
              style={{
                position: "absolute",
                left: "16px",
                bottom: "14px",
                fontFamily: "var(--font-label)",
                fontSize: "10.5px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink-dim)",
              }}
            >
              Avant — complexité
            </span>
          </div>

          {/* Arrow */}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "30px",
              color: "var(--ink-dim)",
            }}
          >
            →
          </span>

          {/* AFTER — order */}
          <div
            style={{
              borderRadius: "18px",
              aspectRatio: "1 / 0.74",
              position: "relative",
              overflow: "hidden",
              background: `
                radial-gradient(120% 90% at 70% 12%, color-mix(in oklab, var(--gold) 14%, transparent), transparent 60%),
                linear-gradient(158deg, color-mix(in oklab, var(--gold) 7%, #fcfbf7), color-mix(in oklab, var(--gold) 11%, var(--plaster)))
              `,
              boxShadow:
                "0 34px 66px -42px color-mix(in oklab, var(--gold) 45%, rgba(28,24,19,.5)), inset 0 0 0 1px color-mix(in oklab, var(--gold) 24%, transparent)",
            }}
          >
            <svg
              viewBox="0 0 300 220"
              preserveAspectRatio="none"
              aria-hidden
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            >
              <g>
                {/* Lines */}
                <polyline className="svg-after-ln" points="150,28 150,192" />
                <polyline className="svg-after-ln" points="150,70 70,70 70,150" />
                <polyline className="svg-after-ln" points="150,110 230,110 230,150" />
                <polyline className="svg-after-ln" points="150,150 110,150" />
                {/* Modules */}
                <rect className="svg-after-mod" x="116" y="14" width="68" height="28" rx="18" />
                <rect className="svg-after-mod" x="40" y="150" width="60" height="26" rx="18" />
                <rect className="svg-after-mod" x="200" y="150" width="60" height="26" rx="18" />
                <rect className="svg-after-mod" x="80" y="150" width="60" height="26" rx="18" />
                {/* Nodes */}
                <circle className="svg-after-nd" cx="150" cy="70" r="4" />
                <circle className="svg-after-nd" cx="150" cy="110" r="4" />
                <circle className="svg-after-nd" cx="150" cy="150" r="4" />
              </g>
            </svg>
            <span
              style={{
                position: "absolute",
                left: "16px",
                bottom: "14px",
                fontFamily: "var(--font-label)",
                fontSize: "10.5px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--gold)",
              }}
            >
              Après — maîtrise
            </span>
          </div>
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          style={{
            marginTop: "46px",
            textAlign: "center",
            maxWidth: "40ch",
            margin: "46px auto 0",
            fontSize: "clamp(14px, 1.1vw, 16px)",
            lineHeight: 1.75,
            color: "var(--ink-dim)",
          }}
        >
          Un système clair n&apos;est pas un système pauvre. C&apos;est un
          système où chaque élément a une raison d&apos;être — et où vous gardez
          le contrôle.
        </motion.p>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .conviction-panels {
            grid-template-columns: 1fr !important;
          }
          .conviction-panels span[style*="font-size: 30px"] {
            transform: rotate(90deg);
            justify-self: center;
          }
        }
      `}</style>
    </section>
  );
}
