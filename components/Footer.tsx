"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const serviceLinks = [
  "Systèmes Digitaux",
  "Sites Premium",
  "IA & Automatisation",
  "Audits Stratégiques",
  "Formation & Adoption",
];

const maisonLinks = ["Approche", "Méthode", "Contact", "Dossier — 5 directions"];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer
      ref={ref}
      className="bg-ivory border-t border-charcoal/10 pt-14 pb-8"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-[1fr_180px_160px] gap-14 pb-14"
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 rounded-full border border-charcoal flex items-center justify-center font-label text-[11px] font-medium text-charcoal">
                P
              </span>
              <span className="font-label text-[11px] tracking-[0.22em] uppercase text-charcoal">
                POWAMEKKA
              </span>
            </div>
            <p className="font-serif text-sm text-charcoal/55 leading-relaxed max-w-[200px]">
              Systèmes digitaux &amp; conseil en IA.
              <br />
              Building the future of business.
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="font-label text-[9px] tracking-[0.25em] uppercase text-charcoal/38 mb-5">
              Services
            </p>
            <ul className="space-y-3">
              {serviceLinks.map((label) => (
                <li key={label}>
                  <a
                    href="#services"
                    className="font-serif text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Maison */}
          <div>
            <p className="font-label text-[9px] tracking-[0.25em] uppercase text-charcoal/38 mb-5">
              Maison
            </p>
            <ul className="space-y-3">
              {maisonLinks.map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="font-serif text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-charcoal/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-label text-[9px] tracking-[0.14em] uppercase text-charcoal/35">
            &copy; 2026 POWAMEKKA
          </p>
          <p className="font-label text-[9px] tracking-[0.14em] uppercase text-charcoal/35">
            Moins de complexité. Plus d&apos;impact.
          </p>
          <a
            href="mailto:contact@powamekka.com"
            className="font-label text-[9px] tracking-[0.14em] uppercase text-charcoal/35 hover:text-charcoal/70 transition-colors duration-150"
          >
            contact@powamekka.com
          </a>
        </div>
      </div>
    </footer>
  );
}
