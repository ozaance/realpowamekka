"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function CTAFinal() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="contact"
      style={{
        borderTop: "1px solid var(--line)",
        padding: "clamp(70px, 12vh, 150px) 0",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {/* Atmospheric light */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: "var(--light)",
          background:
            "linear-gradient(118deg, transparent 42%, color-mix(in oklab, #fff 55%, transparent) 52%, transparent 64%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "0 var(--pad)",
          position: "relative",
          zIndex: 2,
        }}
      >
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
            marginBottom: "24px",
          }}
        >
          Parlons de votre entreprise
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: "var(--disp-weight)" as unknown as number,
            fontSize: "clamp(30px, 5vw, 68px)",
            lineHeight: 1.06,
            letterSpacing: "var(--disp-track)",
            color: "var(--ink)",
            maxWidth: "18ch",
            margin: "0 auto 14px",
          }}
        >
          Reprenez le contrôle
          <br />
          de vos systèmes.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 }}
          style={{
            fontSize: "clamp(14px, 1.1vw, 16px)",
            lineHeight: 1.75,
            color: "var(--ink-dim)",
            maxWidth: "48ch",
            margin: "0 auto 40px",
          }}
        >
          Un échange de 30 minutes suffit pour identifier vos premiers leviers
          de clarté, d&apos;efficacité et de croissance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.26 }}
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <BtnPrimary href="mailto:contact@powamekka.com">
            Demander un audit →
          </BtnPrimary>
          <BtnGhost href="mailto:contact@powamekka.com">
            contact@powamekka.com
          </BtnGhost>
        </motion.div>
      </div>
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
