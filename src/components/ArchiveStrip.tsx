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

  /*
   * Layout geometry, sampled only when the layout actually changes. The frame
   * loop below used to call getBoundingClientRect() once per plate — twenty-two
   * forced synchronous layouts every frame, which is what made the reel stutter
   * on slower machines. The plates sit in a static flex row, so their centres
   * are fixed relative to the track and the only thing moving is the track's
   * own transform. That makes the per-frame work pure arithmetic.
   */
  const geometry = useRef({ centres: [] as number[], line: 0, reach: 0 });
  /* last value written per plate, so unchanged plates cost no style recalc */
  const written = useRef<number[]>([]);

  /* the track holds the plates twice; one set's width is the wrap distance */
  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const measure = () => {
      setHalf(track.scrollWidth / 2);

      const vp = viewport.getBoundingClientRect();
      /*
       * Measuring against the track's own rect rather than the viewport's is
       * what makes this translation-independent: whatever the track is
       * currently translated by is in both rects and cancels, so these centres
       * describe the untranslated row. The frame loop then adds the live
       * translation back. The track is a static, full-width child of .viewport
       * and .viewport has no horizontal padding, so an untranslated track
       * starts exactly at the viewport's left edge — which is what lets the
       * two be compared against `line` below.
       */
      const tr = track.getBoundingClientRect();

      geometry.current = {
        /*
         * A plate's rect is scaled and rotated, but both transforms are about
         * its own centre, so the centre this reads is the untransformed one.
         */
        centres: slideRefs.current.map((el) => {
          if (!el) return 0;
          const r = el.getBoundingClientRect();
          return r.left + r.width / 2 - tr.left;
        }),
        /* the press line, in those same track-relative coordinates */
        line: vp.width / 2,
        // how far a plate can be from the line before it is fully out of register
        reach: Math.max(vp.width * 0.34, 220),
      };
      written.current = [];
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(track);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, []);

  const x = useTransform(baseX, (v) =>
    half ? `${wrapValue(-half, 0, v)}px` : '0px'
  );

  useAnimationFrame((_, delta) => {
    const { centres, line, reach } = geometry.current;
    if (!half || !reach) return;

    if (!paused.current && !drag.current.active) {
      baseX.set(baseX.get() - SPEED * (delta / 1000));
    }

    /* the same wrap the visual transform uses, so the two never disagree */
    const trackX = wrapValue(-half, 0, baseX.get());

    const slides = slideRefs.current;
    for (let i = 0; i < slides.length; i++) {
      const el = slides[i];
      if (!el) continue;

      const d = Math.abs(centres[i] + trackX - line);
      const t = Math.max(0, 1 - d / reach);
      // ease the falloff so the plate snaps into register near the line
      const f = t * t * (3 - 2 * t);

      /* below the rounding of --f, writing again only costs a recalc */
      if (Math.abs((written.current[i] ?? -1) - f) < 0.002) continue;
      written.current[i] = f;
      el.style.setProperty('--f', f.toFixed(3));
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
  const handleSelect = useCallback(
    (index: number) => {
      if (drag.current.moved > 6) return;
      onOpen(index);
    },
    [onOpen]
  );

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
