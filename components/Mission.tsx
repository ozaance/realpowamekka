"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const audiences = [
  "PME",
  "Construction",
  "Industrie",
  "Services",
  "Dirigeants & fondateurs",
];

export default function Mission() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="approche"
      style={{
        borderTop: "1px solid var(--line)",
        padding: "clamp(46px, 8vh, 96px) 0",
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "clamp(28px, 5vw, 72px)",
            alignItems: "start",
          }}
          className="posband-grid"
        >
          {/* Label */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ink-dim)",
              whiteSpace: "nowrap",
              paddingTop: "8px",
            }}
          >
            Notre Raison d&apos;Être
          </motion.span>

          {/* Content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: "var(--disp-weight)" as unknown as number,
                fontSize: "clamp(22px, 2.7vw, 36px)",
                lineHeight: 1.32,
                letterSpacing: "var(--disp-track)",
                color: "var(--ink)",
                maxWidth: "24ch",
                marginBottom: "28px",
              }}
            >
              Nous concevons des systèmes digitaux qui aident les entreprises à
              grandir avec plus de clarté, d&apos;efficacité et de contrôle.
            </motion.p>

            {/* Sector chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {audiences.map((label, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: 0.18 + i * 0.07,
                  }}
                  style={{
                    fontFamily: "var(--font-label)",
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--ink-soft)",
                    border: "1px solid var(--line-strong)",
                    padding: "7px 14px",
                    borderRadius: "18px",
                  }}
                >
                  {label}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .posband-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
