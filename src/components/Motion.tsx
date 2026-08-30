'use client';

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import { useRef, type ReactNode } from 'react';

/**
 * Motion vocabulary for the site.
 *
 * The archival photographs "develop" — blur and contrast resolving, the way a
 * print comes up in a tray — instead of the generic fade-up-and-slide. Text
 * rises a short distance only. Everything collapses to a plain fade when the
 * visitor prefers reduced motion.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export function Develop({
  children,
  delay = 0,
  className,
  eager = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /**
   * For content already in the first viewport. Runs on mount rather than on
   * scroll, and holds opacity at 1 throughout — an element that starts fully
   * transparent has not painted, so if it is the Largest Contentful Paint
   * candidate the browser does not record LCP until the fade finishes. The
   * blur and contrast still resolve, which is where the effect actually lives.
   */
  eager?: boolean;
}) {
  const reduce = useReducedMotion();

  /*
   * Matches the mockup's .dev reveal: opacity and blur only, no scale.
   * Animating scale would write to `transform` and wipe out the static
   * rotations F puts on the pasted cards and course plates.
   */
  const hidden = reduce
    ? { opacity: eager ? 1 : 0 }
    : { opacity: eager ? 1 : 0, filter: 'blur(9px) contrast(2)' };

  const shown = reduce
    ? { opacity: 1 }
    : { opacity: 1, filter: 'blur(0px) contrast(1)' };

  const transition = { duration: reduce ? 0.4 : 1.15, delay, ease: EASE };

  if (eager) {
    return (
      <motion.div
        className={className}
        initial={hidden}
        animate={shown}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, amount: 0.18 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

export function Rise({
  children,
  delay = 0,
  y = 22,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'span' | 'li';
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduce ? 0.4 : 0.75, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/**
 * Slow vertical drift as the element passes through the viewport. Kept small
 * on purpose — this should read as depth in the paper, not as a slideshow.
 */
export function Parallax({
  children,
  distance = 60,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduce ? undefined : { y }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers its Stagger.Item children into view. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.05 } },
};

export function StaggerGroup({
  children,
  className,
  amount = 0.12,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();

  const variants: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.4 } },
      }
    : {
        hidden: { opacity: 0, y: 26, filter: 'blur(10px) contrast(2)' },
        show: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px) contrast(1)',
          transition: { duration: 0.95, ease: EASE },
        },
      };

  return (
    <motion.div className={className} style={style} variants={variants}>
      {children}
    </motion.div>
  );
}
