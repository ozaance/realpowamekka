"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    num: "01 — Audit",
    title: "Comprendre",
    desc: "Nous analysons vos opérations, vos données et vos objectifs avant toute solution.",
  },
  {
    num: "02 — Conception",
    title: "Architecturer",
    desc: "Nous dessinons le système juste — sans superflu, aligné sur votre réalité.",
  },
  {
    num: "03 — Déploiement",
    title: "Mettre en œuvre",
    desc: "Nous déployons l'IA et les automatisations qui créent une valeur réelle.",
  },
  {
    num: "04 — Pilotage",
    title: "Piloter la croissance",
    desc: "Nous mesurons, ajustons et accompagnons votre montée en maîtrise.",
  },
];

export default function Methode() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="methode"
      className="bg-ivory border-t border-charcoal/10 py-[120px]"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-serif text-[42px] md:text-[52px] leading-tight font-light text-charcoal"
          >
            Une méthode qui inspire confiance.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="font-label text-[10px] tracking-[0.2em] uppercase text-charcoal/38 whitespace-nowrap pb-1"
          >
            Méthode &middot; 4 Étapes
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-charcoal/10">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: 0.1 + i * 0.1,
              }}
              className={[
                "pt-10 pb-8",
                i < 3 ? "lg:border-r border-charcoal/10" : "",
                i > 0 ? "lg:pl-8" : "",
              ].join(" ")}
            >
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-bronze border-b border-charcoal/10 pb-4 mb-6">
                {step.num}
              </p>
              <h3 className="font-serif text-[28px] leading-tight font-light text-charcoal mb-4">
                {step.title}
              </h3>
              <p className="font-serif text-sm text-charcoal/55 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
