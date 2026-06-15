"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section
      style={{
        paddingTop: "68px",
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
        {/* Split hero inner */}
        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1.04fr 0.96fr",
            gap: "clamp(30px, 5vw, 70px)",
            alignItems: "center",
            padding: "clamp(30px, 5vh, 72px) 0 clamp(46px, 8vh, 96px)",
          }}
          className="hero-split-grid"
        >
          {/* Left: copy */}
          <div>
            <motion.span
              variants={fadeUp}
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
                marginBottom: "24px",
              }}
            >
              Systèmes digitaux &amp; conseil en IA
            </motion.span>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.55, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(36px, 4.7vw, 68px)",
                lineHeight: 1.02,
                letterSpacing: "-0.015em",
                color: "var(--ink)",
                marginTop: "8px",
                marginBottom: "28px",
              }}
            >
              Des systèmes qui
              <br />
              vous redonnent le
              <br />
              contrôle.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                fontSize: "clamp(15px, 1.2vw, 18px)",
                lineHeight: 1.78,
                color: "var(--ink-soft)",
                maxWidth: "46ch",
                marginBottom: "36px",
              }}
            >
              POWAMEKKA aide les PME, la construction et l&apos;industrie à
              gagner en visibilité, à fluidifier leurs opérations et à
              accélérer leur croissance — grâce à des systèmes digitaux et de
              l&apos;IA conçus pour durer.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}
            >
              <BtnPrimary href="#contact">Demander un audit →</BtnPrimary>
              <BtnGhost href="#services">Voir les services</BtnGhost>
            </motion.div>
          </div>

          {/* Right: light panel */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hero-panel"
            style={{
              position: "relative",
              borderRadius: "18px",
              overflow: "hidden",
              height: "clamp(380px, 60vh, 540px)",
              background:
                "linear-gradient(158deg, #fcfbf7, color-mix(in oklab, var(--plaster) 88%, #fff))",
              boxShadow:
                "calc(40px * var(--light)) calc(52px * var(--light)) 90px -54px rgba(28,24,19,.5), inset 0 0 0 1px rgba(255,255,255,.5)",
            }}
          >
            {/* Grid lines */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.5,
                background: `
                  repeating-linear-gradient(0deg, transparent 0 calc(20% - 1px), var(--line) calc(20% - 1px) 20%),
                  repeating-linear-gradient(90deg, transparent 0 calc(25% - 1px), var(--line) calc(25% - 1px) 25%)
                `,
              }}
            />

            {/* System architecture SVG */}
            <svg
              viewBox="0 0 440 320"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            >
              <polyline className="svg-ln" points="96,86 220,86 220,160" />
              <polyline className="svg-ln" points="344,90 344,160 220,160" />
              <polyline className="svg-ln" points="220,160 220,234 110,234" />
              <polyline className="svg-ln" points="220,234 340,234" />
              <rect className="svg-mod" x="48" y="60" width="96" height="52" rx="18" />
              <rect className="svg-mod-hl" x="296" y="64" width="96" height="52" rx="18" />
              <rect className="svg-mod" x="172" y="136" width="96" height="48" rx="18" />
              <rect className="svg-mod" x="56" y="208" width="96" height="52" rx="18" />
              <rect className="svg-mod" x="296" y="208" width="96" height="52" rx="18" />
              <circle className="svg-nd" cx="220" cy="86" r="4" />
              <circle className="svg-nd" cx="344" cy="160" r="4" />
              <circle className="svg-nd" cx="220" cy="160" r="4" />
              <circle className="svg-nd" cx="220" cy="234" r="4" />
            </svg>

            {/* Light beam */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "-12%",
                left: "6%",
                width: "42%",
                height: "124%",
                transform: "rotate(15deg)",
                background: `linear-gradient(180deg, rgba(255,255,255,${0.9 * 0.9}), rgba(255,255,255,0))`,
                mixBlendMode: "screen",
                pointerEvents: "none",
              }}
            />

            {/* Caption */}
            <div
              style={{
                position: "absolute",
                left: "18px",
                bottom: "15px",
                fontFamily: "var(--font-label)",
                fontSize: "10.5px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ink-dim)",
              }}
            >
              Système unifié · Architecture POWAMEKKA
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Hero panel responsive override */}
      <style>{`
        @media (max-width: 920px) {
          .hero-split-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-panel {
            height: 300px !important;
            order: -1;
          }
        }
      `}</style>
    </section>
  );
}

function BtnPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        background: "var(--ink)",
        color: "var(--paper)",
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        fontSize: "13px",
        letterSpacing: "0.04em",
        padding: "15px 28px",
        borderRadius: "18px",
        transition: "background 0.4s, transform 0.4s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = "var(--gold)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = "var(--ink)";
        el.style.transform = "translateY(0)";
      }}
    >
      {children}
    </a>
  );
}

function BtnGhost({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        background: "transparent",
        color: "var(--ink)",
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        fontSize: "13px",
        letterSpacing: "0.04em",
        padding: "15px 28px",
        borderRadius: "18px",
        border: "1px solid var(--line-strong)",
        transition: "border-color 0.4s, transform 0.4s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.borderColor = "var(--ink)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.borderColor = "var(--line-strong)";
        el.style.transform = "translateY(0)";
      }}
    >
      {children}
    </a>
  );
}
