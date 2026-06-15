"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = ["Approche", "Services", "Méthode", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={[
        "fixed top-0 left-0 right-0 z-50 bg-ivory transition-all duration-300",
        scrolled ? "border-b border-charcoal/10" : "",
      ].join(" ")}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 shrink-0">
          <span className="w-7 h-7 rounded-full border border-charcoal flex items-center justify-center font-label text-[11px] font-medium tracking-wider text-charcoal">
            P
          </span>
          <span className="font-label text-[11px] font-medium tracking-[0.22em] uppercase text-charcoal">
            POWAMEKKA
          </span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace("é", "e")}`}
              className="font-label text-[10px] tracking-[0.2em] uppercase text-charcoal/60 hover:text-charcoal transition-colors duration-150"
            >
              {link}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center px-5 py-2.5 border border-charcoal font-label text-[10px] tracking-[0.18em] uppercase text-charcoal hover:bg-charcoal hover:text-ivory transition-all duration-200"
        >
          Demander un audit
        </a>
      </div>
    </motion.nav>
  );
}
