"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Conviction() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="conviction" className="bg-ivory">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-[120px] pb-14">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-label text-[10px] tracking-[0.22em] uppercase text-bronze mb-6"
        >
          La Conviction
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          className="font-serif text-[52px] md:text-[64px] leading-[1.06] font-light text-charcoal"
        >
          Nous transformons la
          <br />
          complexité en maîtrise.
        </motion.h2>
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Before — chaos */}
        <motion.div
          initial={{ opacity: 0, x: -48 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.18 }}
          className="relative bg-stone/35 overflow-hidden"
          style={{ aspectRatio: "4/3" }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 500 400"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M 40 200 C 110 80 210 340 290 120 C 370 -30 440 280 510 180"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.18"
              fill="none"
            />
            <path
              d="M 20 310 C 90 190 200 40 310 290 C 390 160 460 80 510 310"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.18"
              fill="none"
            />
            <path
              d="M 0 140 C 80 360 190 60 270 260 C 350 40 420 330 510 110"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.14"
              fill="none"
            />
            <path
              d="M 55 30 C 130 270 230 20 320 200 C 410 70 470 360 510 160"
              stroke="#1C1C1A"
              strokeWidth="1.2"
              strokeOpacity="0.16"
              fill="none"
            />
            <path
              d="M -10 260 C 100 40 200 390 310 90 C 390 360 460 30 510 300"
              stroke="#1C1C1A"
              strokeWidth="0.8"
              strokeOpacity="0.12"
              fill="none"
            />
            <path
              d="M 15 90 C 105 310 190 10 280 330 C 370 90 450 290 510 60"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.1"
              fill="none"
            />
          </svg>
          <div className="absolute inset-0 flex items-end p-8">
            <p className="font-label text-[10px] tracking-[0.2em] uppercase text-charcoal/45">
              Avant &mdash; Complexité
            </p>
          </div>
        </motion.div>

        {/* After — structure */}
        <motion.div
          initial={{ opacity: 0, x: 48 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.28 }}
          className="relative bg-stone/55 overflow-hidden"
          style={{ aspectRatio: "4/3" }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 500 420"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            {/* Root box */}
            <rect
              x="185"
              y="48"
              width="130"
              height="52"
              rx="2"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.35"
              fill="none"
            />
            {/* Root → branch 1 */}
            <line
              x1="250"
              y1="100"
              x2="250"
              y2="158"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.28"
            />
            {/* Branch node 1 */}
            <circle cx="250" cy="160" r="5" fill="#8B7355" />
            {/* Horizontal connector */}
            <line
              x1="115"
              y1="160"
              x2="390"
              y2="160"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.28"
            />
            {/* Left column */}
            <line
              x1="115"
              y1="160"
              x2="115"
              y2="215"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.28"
            />
            {/* Center column */}
            <line
              x1="250"
              y1="160"
              x2="250"
              y2="215"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.28"
            />
            {/* Center branch node */}
            <circle cx="250" cy="215" r="5" fill="#8B7355" />
            {/* Right column */}
            <line
              x1="390"
              y1="160"
              x2="390"
              y2="215"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.28"
            />

            {/* Left boxes */}
            <rect
              x="60"
              y="215"
              width="80"
              height="42"
              rx="2"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.35"
              fill="none"
            />
            <rect
              x="152"
              y="215"
              width="80"
              height="42"
              rx="2"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.35"
              fill="none"
            />

            {/* Left sub-tree */}
            <line
              x1="115"
              y1="257"
              x2="115"
              y2="295"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.24"
            />
            <line
              x1="78"
              y1="295"
              x2="152"
              y2="295"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.24"
            />
            <circle cx="115" cy="295" r="5" fill="#8B7355" />

            {/* Right box */}
            <rect
              x="340"
              y="215"
              width="100"
              height="42"
              rx="2"
              stroke="#1C1C1A"
              strokeWidth="1"
              strokeOpacity="0.35"
              fill="none"
            />
          </svg>
          <div className="absolute inset-0 flex items-end p-8">
            <p className="font-label text-[10px] tracking-[0.2em] uppercase text-bronze">
              Après &mdash; Maîtrise
            </p>
          </div>
        </motion.div>
      </div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.38 }}
        className="max-w-[1280px] mx-auto px-6 md:px-10 py-20 text-center"
      >
        <p className="font-serif text-xl text-charcoal/65 leading-[1.7] max-w-[580px] mx-auto">
          Un système clair n&apos;est pas un système pauvre.
          <br />
          C&apos;est un système où chaque élément a une raison d&apos;être
          &mdash; et où vous gardez le contrôle.
        </p>
      </motion.div>
    </section>
  );
}
