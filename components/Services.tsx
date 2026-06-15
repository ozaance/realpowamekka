"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    num: "01",
    title: "Systèmes Digitaux",
    desc: "Une architecture unifiée qui relie vos outils, vos données et vos équipes en un seul système lisible.",
    tag: "SYS",
  },
  {
    num: "02",
    title: "Sites Premium",
    desc: "Des sites pensés comme des systèmes : crédibles, rapides, conçus pour convertir et durer.",
    tag: "WEB",
  },
  {
    num: "03",
    title: "IA & Automatisation",
    desc: "Automatiser le répétitif et augmenter vos décisions grâce à l'intelligence artificielle.",
    tag: "IA",
  },
  {
    num: "04",
    title: "Audits Stratégiques",
    desc: "Un diagnostic clair de vos opérations pour révéler vos leviers de croissance.",
    tag: "AUDIT",
  },
  {
    num: "05",
    title: "Formation & Adoption",
    desc: "Vos équipes maîtrisent durablement les nouveaux outils et les nouvelles méthodes.",
    tag: "ADOPT",
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="services"
      className="bg-ivory border-t border-charcoal/10 pt-[120px] pb-20"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-serif text-[42px] md:text-[52px] leading-tight font-light text-charcoal"
          >
            Cinq disciplines, un système.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="font-label text-[10px] tracking-[0.2em] uppercase text-charcoal/38 whitespace-nowrap pb-1"
          >
            Services &middot; 01&ndash;05
          </motion.p>
        </div>

        <div className="border-t border-charcoal/10">
          {services.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: 0.08 + i * 0.08,
              }}
              className="group grid grid-cols-[40px_1fr] md:grid-cols-[40px_240px_1fr_110px_28px] items-center gap-5 md:gap-8 py-7 border-b border-charcoal/10 hover:bg-stone/25 transition-colors duration-150 cursor-default"
            >
              <span className="font-label text-[11px] tracking-widest text-charcoal/28">
                {s.num}
              </span>
              <span className="font-serif text-[22px] font-light text-charcoal">
                {s.title}
              </span>
              <span className="hidden md:block font-serif text-sm text-charcoal/55 leading-relaxed">
                {s.desc}
              </span>
              <span className="hidden md:inline-flex items-center justify-center px-3 py-1.5 border border-charcoal/18 font-label text-[9px] tracking-[0.14em] uppercase text-charcoal/55 w-fit">
                {s.tag}
              </span>
              <span className="hidden md:block font-serif text-charcoal/35 group-hover:text-charcoal group-hover:translate-x-1 transition-all duration-200">
                &#8594;
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
