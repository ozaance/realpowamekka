"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const serviceLinks = [
  "Systèmes Digitaux",
  "Sites Premium",
  "IA & Automatisation",
  "Audits Stratégiques",
  "Formation & Adoption",
];

const maisonLinks = [
  { label: "Approche", href: "#approche" },
  { label: "Méthode", href: "#methode" },
  { label: "Contact", href: "#contact" },
  { label: "Dossier — 5 directions", href: "#" },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer
      ref={ref}
      style={{
        borderTop: "1px solid var(--line)",
        padding: "54px 0 40px",
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr",
            gap: "30px",
          }}
          className="foot-grid"
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <Image
                src="/logo-mark-ink.png"
                alt="POWAMEKKA"
                width={24}
                height={24}
                style={{ height: "24px", width: "auto" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "18px",
                  letterSpacing: "0.18em",
                  color: "var(--ink)",
                }}
              >
                POWAMEKKA
              </span>
            </div>
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: "var(--ink-dim)",
                maxWidth: "30ch",
              }}
            >
              Systèmes digitaux &amp; conseil en IA.
              <br />
              Building the future of business.
            </p>
          </div>

          {/* Services */}
          <div>
            <h5
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "10.5px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ink-dim)",
                marginBottom: "16px",
              }}
            >
              Services
            </h5>
            {serviceLinks.map((label) => (
              <a
                key={label}
                href="#services"
                style={{
                  display: "block",
                  fontSize: "13.5px",
                  color: "var(--ink-soft)",
                  padding: "5px 0",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--gold)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-soft)")
                }
              >
                {label}
              </a>
            ))}
          </div>

          {/* Maison */}
          <div>
            <h5
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "10.5px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ink-dim)",
                marginBottom: "16px",
              }}
            >
              Maison
            </h5>
            {maisonLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  display: "block",
                  fontSize: "13.5px",
                  color: "var(--ink-soft)",
                  padding: "5px 0",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--gold)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-soft)")
                }
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "16px",
            marginTop: "50px",
            paddingTop: "24px",
            borderTop: "1px solid var(--line)",
            fontFamily: "var(--font-label)",
            fontSize: "11px",
            letterSpacing: "0.04em",
            color: "var(--ink-dim)",
          }}
        >
          <span>© 2026 POWAMEKKA</span>
          <span>Moins de complexité. Plus d&apos;impact.</span>
          <a
            href="mailto:contact@powamekka.com"
            style={{ color: "var(--ink-dim)", transition: "color 0.3s" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "var(--gold)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-dim)")
            }
          >
            contact@powamekka.com
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .foot-grid { grid-template-columns: 1fr 1fr !important; }
          .foot-grid > div:first-child { grid-column: 1 / -1; }
        }
      `}</style>
    </footer>
  );
}
