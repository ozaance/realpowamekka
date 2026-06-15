"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const audiences = [
  "PME",
  "CONSTRUCTION",
  "INDUSTRIE",
  "SERVICES",
  "DIRIGEANTS & FONDATEURS",
];

export default function Mission() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="approche"
      className="bg-ivory border-t border-charcoal/10 py-[120px]"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-16 lg:gap-24">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-label text-[10px] tracking-[0.22em] uppercase text-charcoal/45 pt-1"
          >
            Notre Raison d&apos;Être
          </motion.p>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
              className="font-serif text-[36px] md:text-[42px] leading-[1.18] font-light text-charcoal mb-10"
            >
              Nous concevons des systèmes digitaux qui aident les entreprises à
              grandir avec plus de clarté, d&apos;efficacité et de contrôle.
            </motion.h2>

            <div className="flex flex-wrap gap-3">
              {audiences.map((label, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: 0.18 + i * 0.08,
                  }}
                  className="px-5 py-2 border border-charcoal/18 font-label text-[10px] tracking-[0.14em] uppercase text-charcoal/65"
                >
                  {label}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
