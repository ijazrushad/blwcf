'use client';

import { motion } from 'framer-motion';
import { Develop, Rise, useSettledReducedMotion } from '@/components/Motion';
import { about, type Locale } from '@/content/site';
import s from '@/styles/page.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * About body — year mark, taped sheet, and the four gatherings.
 * Uses the site's Develop / Rise vocabulary so the section comes up the way
 * a print and a pasted note would, not as a generic fade-slide deck.
 */
export default function AboutBlock({ locale }: { locale: Locale }) {
  const reduce = useSettledReducedMotion();

  return (
    <div className={`g12 ${s.aboutGrid}`}>
      <Rise className={s.aboutYear} y={28} delay={0.04}>
        <b>{about.year[locale]}</b>
        <span>{about.yearNote[locale]}</span>
      </Rise>

      <Develop className={`${s.aboutSheet} ${s.sheet}`} delay={0.12}>
        <span className="tape" aria-hidden />
        <div className={s.aboutEyebrow}>{about.eyebrow[locale]}</div>
        {about.body.map((para) => (
          <p key={para.en}>{para[locale]}</p>
        ))}
      </Develop>

      <ol className={s.aboutGather}>
        {about.gatherings.map((g, i) => (
          <motion.li
            key={g.d.en}
            initial={{ opacity: 0, y: reduce ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: reduce ? 0.35 : 0.7,
              delay: reduce ? 0 : 0.2 + i * 0.1,
              ease: EASE,
            }}
          >
            <div className={s.aboutGatherD}>{g.d[locale]}</div>
            <div className={s.aboutGatherN}>{g.n[locale]}</div>
            <div className={s.aboutGatherNote}>{g.note[locale]}</div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
