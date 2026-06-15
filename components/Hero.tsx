"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

const pillars = [
  {
    title: "Visibilité",
    desc: "Une présence digitale qui inspire confiance.",
  },
  {
    title: "Efficacité",
    desc: "Des opérations fluides, automatisées, mesurées.",
  },
  {
    title: "Croissance",
    desc: "Des décisions plus rapides, mieux informées.",
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-ivory flex flex-col pt-16">
      <div className="flex flex-1">
        {/* Left — content */}
        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.1 }}
          className="flex-1 flex flex-col justify-center px-6 md:px-10 py-24 max-w-[600px]"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-label text-[10px] tracking-[0.25em] uppercase text-bronze mb-8"
          >
            Systèmes Digitaux &amp; Conseil en IA
          </motion.p>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="font-serif text-[56px] md:text-[72px] leading-[1.04] font-light text-charcoal mb-8"
          >
            Bâtir des entreprises plus claires.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-serif text-lg leading-relaxed text-charcoal/65 mb-12 max-w-[460px]"
          >
            Visibilité, opérations, croissance : POWAMEKKA conçoit les systèmes
            et l&apos;IA qui mettent de l&apos;ordre dans la complexité.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-charcoal text-ivory font-label text-[10px] tracking-[0.18em] uppercase hover:bg-charcoal-light transition-colors duration-200"
            >
              Demander un audit
              <span aria-hidden>&#8594;</span>
            </a>
            <a
              href="#approche"
              className="inline-flex items-center px-6 py-3.5 border border-charcoal/25 font-label text-[10px] tracking-[0.18em] uppercase text-charcoal hover:border-charcoal/60 transition-colors duration-200"
            >
              Notre approche
            </a>
          </motion.div>
        </motion.div>

        {/* Right — warm textured panel */}
        <div
          className="hidden lg:block flex-1 relative overflow-hidden"
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 35% 45%, #D4C9B0 0%, #E0D9CC 35%, #E8E3D9 65%, #F0EDE6 100%)",
            }}
          />
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.18]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id="noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.72"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>
      </div>

      {/* Bottom — three pillars */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5, ease: "easeOut" }}
        className="border-t border-charcoal/10 grid grid-cols-1 md:grid-cols-3"
      >
        {pillars.map((p, i) => (
          <div
            key={p.title}
            className={[
              "px-6 md:px-10 py-9",
              i < pillars.length - 1 ? "md:border-r border-charcoal/10" : "",
            ].join(" ")}
          >
            <h3 className="font-serif text-[22px] font-light text-charcoal mb-1.5">
              {p.title}
            </h3>
            <p className="font-serif text-sm text-charcoal/55">{p.desc}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
