'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  motion,
} from 'framer-motion';
import { archive, type Locale } from '@/content/site';
import s from './ArchiveStrip.module.css';

/**
 * A contact-sheet reel carrying every plate in the archive.
 *
 * The motion is not a plain slide. Each plate travels *out of register* —
 * its red and green inks pulled apart, the image soft, grey and tilted — and
 * pulls into register as it crosses the press line at the centre, where the
 * inks converge, the tilt squares up and the photograph resolves. It falls
 * back out of register as it leaves. This is the misregistration idea from
 * F's cut numeral, expressed as movement.
 *
 * Widths come from each scan's true ratio at a uniform height, so nothing is
 * ever cropped.
 */

const SPEED = 22; // px per second

/** Keep a value inside [min, max), wrapping at both ends. */
function wrapValue(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

export default function ArchiveStrip({
  locale,
  onOpen,
}: {
  locale: Locale;
  onOpen: (index: number) => void;
}) {
  const reduce = useReducedMotion();

  const label =
    locale === 'en'
      ? `All ${archive.length} plates`
      : `সবগুলো ছবি — ${archive.length}টি`;
  const hint =
    locale === 'en'
      ? 'drag to scrub · select to enlarge'
      : 'টেনে দেখুন · বড় করে দেখতে ক্লিক করুন';

  return (
    <div className={s.strip}>
      <div className={s.stripHead}>
        <span className={s.stripLabel}>{label}</span>
        <span className={s.stripHint}>{hint}</span>
      </div>
      {reduce ? (
        <StaticRail locale={locale} onOpen={onOpen} />
      ) : (
        <Reel locale={locale} onOpen={onOpen} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Reel({
  locale,
  onOpen,
}: {
  locale: Locale;
  onOpen: (index: number) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [half, setHalf] = useState(0);

  const baseX = useMotionValue(0);
  const paused = useRef(false);
  const drag = useRef({ active: false, lastX: 0, moved: 0 });

  /* the track holds the plates twice; one set's width is the wrap distance */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => setHalf(el.scrollWidth / 2);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const x = useTransform(baseX, (v) =>
    half ? `${wrapValue(-half, 0, v)}px` : '0px'
  );

  useAnimationFrame((_, delta) => {
    if (half && !paused.current && !drag.current.active) {
      baseX.set(baseX.get() - SPEED * (delta / 1000));
    }

    const viewport = viewportRef.current;
    if (!viewport) return;

    /*
     * Drive each plate's registration from how close it is to the press line.
     * All reads happen before all writes so the browser only lays out once.
     */
    const box = viewport.getBoundingClientRect();
    const centre = box.left + box.width / 2;
    // how far a plate can be from the line before it is fully out of register
    const reach = Math.max(box.width * 0.34, 220);

    const slides = slideRefs.current;
    const focus: number[] = [];

    for (let i = 0; i < slides.length; i++) {
      const el = slides[i];
      if (!el) {
        focus.push(0);
        continue;
      }
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - centre);
      const t = Math.max(0, 1 - d / reach);
      // ease the falloff so the plate snaps into register near the line
      focus.push(t * t * (3 - 2 * t));
    }

    for (let i = 0; i < slides.length; i++) {
      slides[i]?.style.setProperty('--f', focus[i].toFixed(3));
    }
  });

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, lastX: e.clientX, moved: 0 };
  };

  /*
   * Drag is tracked on the window rather than through setPointerCapture.
   * Capturing on the viewport retargets the follow-up click to the viewport
   * itself, so the plate's own click handler never fired. Window listeners
   * keep the drag alive outside the strip without stealing the click.
   */
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.lastX;
      drag.current.lastX = e.clientX;
      drag.current.moved += Math.abs(dx);
      baseX.set(baseX.get() + dx);
    };
    const up = () => {
      drag.current.active = false;
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [baseX]);

  /* a drag that travelled should not also open the lightbox */
  const handleSelect = useCallback((index: number) => {
    if (drag.current.moved > 6) return;
    onOpen(index);
  }, [onOpen]);

  const total = archive.length;

  return (
    <div
      className={s.viewport}
      ref={viewportRef}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onPointerDown={onPointerDown}
    >
      <motion.div className={s.track} ref={trackRef} style={{ x }}>
        {archive.map((item, i) => (
          <Slide
            key={item.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            item={item}
            index={i}
            locale={locale}
            onSelect={handleSelect}
          />
        ))}
        {/* the second pass makes the loop seamless */}
        {archive.map((item, i) => (
          <Slide
            key={`dup-${item.id}`}
            ref={(el) => {
              slideRefs.current[total + i] = el;
            }}
            item={item}
            index={i}
            locale={locale}
            onSelect={handleSelect}
            duplicate
          />
        ))}
      </motion.div>
    </div>
  );
}

/** Reduced-motion fallback: the same reel, scrolled by hand, fully in register. */
function StaticRail({
  locale,
  onOpen,
}: {
  locale: Locale;
  onOpen: (index: number) => void;
}) {
  return (
    <div className={`${s.viewport} ${s.rail}`}>
      <div className={s.track}>
        {archive.map((item, i) => (
          <Slide
            key={item.id}
            item={item}
            index={i}
            locale={locale}
            onSelect={onOpen}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Slide({
  ref,
  item,
  index,
  locale,
  onSelect,
  duplicate = false,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  item: (typeof archive)[number];
  index: number;
  locale: Locale;
  onSelect: (index: number) => void;
  duplicate?: boolean;
}) {
  return (
    <button
      ref={ref}
      className={s.slide}
      onClick={() => onSelect(index)}
      tabIndex={duplicate ? -1 : 0}
      aria-hidden={duplicate || undefined}
      aria-label={item.title[locale]}
      /* width follows the true ratio at a fixed height, so no plate is cut */
      style={{ aspectRatio: `${item.width} / ${item.height}` }}
    >
      <span className={s.sheet}>
        <Image
          src={item.src}
          alt={duplicate ? '' : item.title[locale]}
          width={item.width}
          height={item.height}
          sizes="(max-width: 700px) 44vw, 26vw"
          quality={88}
          draggable={false}
        />
      </span>
      <span className={s.slideNo}>{String(index + 1).padStart(2, '0')}</span>
      <span className={s.slideCap}>{item.title[locale]}</span>
    </button>
  );
}
