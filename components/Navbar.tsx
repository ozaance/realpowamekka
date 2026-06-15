"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const links = [
  { label: "Approche", href: "#approche" },
  { label: "Services", href: "#services" },
  { label: "Méthode", href: "#methode" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "var(--paper)",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        transition: "border-color 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "0 var(--pad)",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Brand */}
        <a
          href="#"
          style={{ display: "flex", alignItems: "center", gap: "13px", flexShrink: 0 }}
        >
          <Image
            src="/logo-mark-ink.png"
            alt="POWAMEKKA"
            width={27}
            height={27}
            style={{ height: "27px", width: "auto" }}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "19px",
              letterSpacing: "0.2em",
              paddingLeft: "0.2em",
              color: "var(--ink)",
            }}
          >
            POWAMEKKA
          </span>
        </a>

        {/* Nav links */}
        <nav
          style={{
            display: "flex",
            gap: "32px",
            fontSize: "13.5px",
            color: "var(--ink-soft)",
          }}
          className="hidden md:flex"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                position: "relative",
                paddingBottom: "3px",
                transition: "color 0.3s",
                color: "var(--ink-soft)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-soft)")}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#contact"
          className="hidden md:inline-flex"
          style={{
            alignItems: "center",
            gap: "9px",
            fontSize: "12.5px",
            fontWeight: 500,
            letterSpacing: "0.03em",
            border: "1px solid var(--ink)",
            padding: "11px 20px",
            borderRadius: "18px",
            transition: "background 0.4s, color 0.4s",
            color: "var(--ink)",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = "var(--ink)";
            el.style.color = "var(--paper)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = "transparent";
            el.style.color = "var(--ink)";
          }}
        >
          Demander un audit
        </a>
      </div>
    </motion.header>
  );
}
