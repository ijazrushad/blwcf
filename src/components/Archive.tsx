'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import ArchiveStrip from './ArchiveStrip';
import { archive, ui, type ArchiveItem, type Locale } from '@/content/site';
import s from './Archive.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The four plates that appear in the grid above the reel, in the order the
 * grid places them. Everything else in `archive` is still reachable — the reel
 * carries all of it, and the lightbox walks the whole set.
 */
const FEATURED_IDS = [
  'joy-bangla',
  'commission',
  'cadet-portrait',
  'photo-report',
];

const SLOTS = ['r1', 'r2', 'r3', 'r4'] as const;

function byId(id: string) {
  return archive.find((a) => a.id === id)!;
}

export default function Archive({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState<number | null>(null);

  const shown = FEATURED_IDS.map(byId);

  /* the lightbox walks the whole archive regardless of what the grid shows */
  const indexOf = (item: ArchiveItem) =>
    archive.findIndex((a) => a.id === item.id);

  return (
    <>
      <div className={`g12 ${s.grid}`}>
        {shown.map((item, i) => (
          <figure
            key={item.id}
            className={`${s.plate} ${s[SLOTS[i]]}`}
            onClick={() => setOpen(indexOf(item))}
          >
            <div
              className={s.im}
              /* the plate takes the true shape of the scan, so nothing crops */
              style={{ aspectRatio: `${item.width} / ${item.height}` }}
            >
              <Image
                src={item.src}
                alt={item.title[locale]}
                width={item.width}
                height={item.height}
                sizes="(max-width: 980px) 92vw, 48vw"
                quality={92}
              />
            </div>
            <figcaption className={s.cap}>
              {item.title[locale]} · {item.meta[locale]}
            </figcaption>
          </figure>
        ))}
      </div>

      <ArchiveStrip locale={locale} onOpen={setOpen} />

      <AnimatePresence>
        {open !== null && (
          <Lightbox
            index={open}
            locale={locale}
            onClose={() => setOpen(null)}
            onIndex={setOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function Lightbox({
  index,
  locale,
  onClose,
  onIndex,
}: {
  index: number;
  locale: Locale;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const [zoom, setZoom] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const item = archive[index];

  const go = useCallback(
    (delta: number) => {
      setZoom(false);
      onIndex((index + delta + archive.length) % archive.length);
    },
    [index, onIndex]
  );

  useEffect(() => {
    stage.current?.scrollTo({ top: 0, left: 0 });
  }, [index, zoom]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  /*
   * These are low resolution originals, so "zoom" means 100% of native
   * pixels rather than filling the screen.
   */
  const nativeWidth = `min(${item.width}px, 100%)`;

  return (
    <motion.div
      className={s.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={item.title[locale]}
    >
      <div className={s.lbBar}>
        <div className={s.lbTitle}>
          <b>{item.title[locale]}</b>
          <span>{item.meta[locale]}</span>
        </div>
        <div className={s.lbTools}>
          <button
            className={`${s.lbBtn} ${zoom ? s.active : ''}`}
            onClick={() => setZoom((z) => !z)}
            aria-pressed={zoom}
            aria-label={ui.zoom[locale]}
            title={ui.zoom[locale]}
          >
            {zoom ? '−' : '+'}
          </button>
          <button
            className={s.lbBtn}
            onClick={onClose}
            aria-label={ui.close[locale]}
            title={ui.close[locale]}
          >
            ×
          </button>
        </div>
      </div>

      <div className={s.lbStage} ref={stage}>
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            className={s.lbImgWrap}
            drag={zoom ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) go(1);
              else if (info.offset.x > 70) go(-1);
            }}
            style={{
              width: zoom ? nativeWidth : `min(${item.width * 1.6}px, 100%)`,
              maxHeight: zoom ? 'none' : '100%',
              aspectRatio: `${item.width} / ${item.height}`,
            }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {/*
             * quality 95 rather than 100: at 100 the encoder stops discarding
             * anything and the file roughly doubles, which on a soft 1290px
             * scan buys no visible detail. `priority` would only add a preload
             * hint for an image the browser is already fetching on demand.
             */}
            <Image
              src={item.src}
              alt={item.title[locale]}
              width={item.width}
              height={item.height}
              sizes="100vw"
              quality={95}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        className={`${s.lbNav} ${s.lbPrev}`}
        onClick={() => go(-1)}
        aria-label={ui.prev[locale]}
      >
        ‹
      </button>
      <button
        className={`${s.lbNav} ${s.lbNext}`}
        onClick={() => go(1)}
        aria-label={ui.next[locale]}
      >
        ›
      </button>

      <div className={s.lbCount}>
        {index + 1} / {archive.length}
      </div>
    </motion.div>
  );
}
