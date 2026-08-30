'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useSyncExternalStore, type ReactNode } from 'react';

/**
 * The motion vocabulary for the site. Three primitives, used everywhere:
 *
 *   Develop   photographs come up out of a blur, the way a print appears in a
 *             developing tray. Deliberately not a slide or a zoom.
 *   Rise      text lifts a short distance into place.
 *   Parallax  a slow drift as an element crosses the viewport, small enough to
 *             read as depth in the paper rather than as a moving slideshow.
 *
 * All three reduce to a plain fade when the visitor asks for reduced motion.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/**
 * Whether the visitor has asked for reduced motion, in a way that survives
 * hydration.
 *
 * framer-motion's own `useReducedMotion` reads `matchMedia` during render and
 * never updates afterwards. On a prerendered page that produces a mismatch:
 * the server has no `matchMedia` and says "no preference", the visitor's very
 * first client render says "reduce", and React finds different markup than the
 * HTML it was given. `useSyncExternalStore` is built for exactly this — the
 * third argument is the value used while hydrating, so the first render always
 * agrees with the HTML, and React re-renders with the real value immediately
 * after. Changing the setting mid-visit now takes effect too.
 *
 * One consequence to respect when using this: an animation's *finished* state
 * must not depend on which branch ran, because the branch can change one
 * commit in. Both branches have to land on the same styles, or the swap would
 * strand an element part-way through an effect.
 */
export function useSettledReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    /* the prerendered HTML is built as though nobody had a preference */
    () => false
  );
}

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
   * scroll, and holds opacity at 1 the whole way through. An element sitting
   * at `opacity: 0` has not painted, so if it is the Largest Contentful Paint
   * candidate the browser will not record LCP until the fade ends. The blur
   * and contrast still resolve, and that is where the effect actually lives.
   */
  eager?: boolean;
}) {
  const reduce = useSettledReducedMotion();

  /*
   * Opacity, blur and contrast only — never scale. Scale would write to
   * `transform`, and several of the elements wrapped here carry a static
   * rotation there that makes them look like pasted-down paper.
   */
  const from = {
    opacity: eager ? 1 : 0,
    filter: reduce ? 'blur(0px) contrast(1)' : 'blur(9px) contrast(2)',
  };
  const to = { opacity: 1, filter: 'blur(0px) contrast(1)' };
  const transition = { duration: reduce ? 0.4 : 1.15, delay, ease: EASE };

  if (eager) {
    return (
      <motion.div
        className={className}
        initial={from}
        animate={to}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={from}
      whileInView={to}
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
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useSettledReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduce ? 0.4 : 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

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
  const reduce = useSettledReducedMotion();

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
