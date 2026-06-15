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
      className="bg-stone/30 border-t border-charcoal/10 py-[120px]"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-label text-[10px] tracking-[0.25em] uppercase text-bronze mb-8"
        >
          Parlons de Votre Entreprise
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
          className="font-serif text-[56px] md:text-[76px] leading-[1.04] font-light text-charcoal mb-6"
        >
          Reprenez le contrôle
          <br />
          de vos systèmes.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 }}
          className="font-serif text-lg text-charcoal/60 mb-12 max-w-[480px] mx-auto leading-relaxed"
        >
          Un échange de 30 minutes suffit pour identifier vos premiers leviers
          de clarté, d&apos;efficacité et de croissance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.26 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="mailto:contact@powamekka.com"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-charcoal text-ivory font-label text-[10px] tracking-[0.18em] uppercase hover:bg-charcoal-light transition-colors duration-200"
          >
            Demander un audit
            <span aria-hidden>&#8594;</span>
          </a>
          <a
            href="mailto:contact@powamekka.com"
            className="inline-flex items-center px-8 py-4 border border-charcoal/28 font-label text-[10px] tracking-[0.12em] text-charcoal/75 hover:border-charcoal/60 hover:text-charcoal transition-colors duration-200"
          >
            contact@powamekka.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}
