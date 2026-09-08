'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import {
  commemoration,
  ui,
  type CommemorationPhoto,
  type Locale,
} from '@/content/site';
import { Rise, useSettledReducedMotion } from '@/components/Motion';
import s from './Commemoration.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Commemoration({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useSettledReducedMotion();
  const featured = commemoration.photos[0];

  return (
    <>
      <div className={s.leadGrid}>
        <Rise className={s.edition} y={26}>
          <motion.b
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 34, rotate: -4, scale: 0.94 }
            }
            whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: reduce ? 0.3 : 0.85, ease: EASE }}
          >
            {commemoration.edition[locale]}
          </motion.b>
          <span>{commemoration.originalDate[locale]}</span>
        </Rise>

        <div className={s.featured}>
          <motion.div
            className={s.featuredFrame}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0.25, y: 18, filter: 'blur(8px)' }
            }
            whileInView={{
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
            }}
            viewport={{ once: true, amount: 0.01 }}
            transition={{ duration: reduce ? 0.3 : 0.8, ease: EASE }}
          >
            <motion.button
              type="button"
              className={s.photoButton}
              onClick={() => setOpen(0)}
              aria-label={`${ui.enlargeImage[locale]}: ${featured.alt[locale]}`}
              animate={
                reduce
                  ? undefined
                  : {
                      scale: [1, 1.008, 1.003, 1],
                      x: [0, 2, -1, 0],
                      y: [0, -2, 1, 0],
                    }
              }
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={reduce ? undefined : { scale: 1.014 }}
            >
              <Image
                src={featured.src}
                alt={featured.alt[locale]}
                fill
                sizes="(max-width: 980px) 100vw, 65vw"
                quality={92}
              />
              {!reduce && (
                <>
                  <motion.span
                    className={`${s.inkSweep} ${s.inkRed}`}
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{
                      scaleX: [0, 1, 1],
                      opacity: [0, 0.42, 0],
                    }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      duration: 1.1,
                      delay: 0.45,
                      times: [0, 0.55, 1],
                      ease: EASE,
                    }}
                    aria-hidden
                  />
                  <motion.span
                    className={`${s.inkSweep} ${s.inkGreen}`}
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{
                      scaleX: [0, 1, 1],
                      opacity: [0, 0.3, 0],
                    }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      duration: 1,
                      delay: 0.6,
                      times: [0, 0.55, 1],
                      ease: EASE,
                    }}
                    aria-hidden
                  />
                </>
              )}
              <span className={s.scanLine} aria-hidden />
            </motion.button>
          </motion.div>
          <motion.div
            className={s.photoLabel}
            initial={{ opacity: 0, x: reduce ? 0 : -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: reduce ? 0.3 : 0.65, delay: 0.45 }}
          >
            {commemoration.date[locale]} · {commemoration.venue[locale]}
          </motion.div>
        </div>
      </div>

      <div className={s.recordGrid}>
        <Rise className={s.account} y={20} delay={0.08}>
          <div className={s.accountKick}>{commemoration.title[locale]}</div>
          <p>{commemoration.intro[locale]}</p>
          <p>{commemoration.attendance[locale]}</p>
        </Rise>

        <div className={s.guests}>
          <Guest
            label={commemoration.guestLabels.chief[locale]}
            name={commemoration.chiefGuest.name[locale]}
            role={commemoration.chiefGuest.role[locale]}
            delay={0.12}
          />
          <Guest
            label={commemoration.guestLabels.special[locale]}
            name={commemoration.specialGuest.name[locale]}
            role={commemoration.specialGuest.role[locale]}
            delay={0.18}
          />
        </div>
      </div>

      <Rise className={s.honourHead} y={12} delay={0.12}>
        {commemoration.guestLabels.honour[locale]}
      </Rise>
      <div className={s.honourGrid}>
        {commemoration.guestsOfHonour.map((guest, i) => (
          <Rise key={guest.name.en} y={16} delay={0.16 + i * 0.08}>
            <article className={s.honourCard}>
              <span>0{i + 1}</span>
              <h3>{guest.name[locale]}</h3>
              <p>{guest.role[locale]}</p>
              <small>{guest.service[locale]}</small>
            </article>
          </Rise>
        ))}
      </div>

      <div className={s.galleryHead}>
        <span>{commemoration.galleryLabel[locale]}</span>
        <span aria-hidden>07.08.2026</span>
      </div>
      <PhotoScrollStack locale={locale} onOpen={setOpen} />

      <AnimatePresence>
        {open !== null && (
          <EventLightbox
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

function PhotoScrollStack({
  locale,
  onOpen,
}: {
  locale: Locale;
  onOpen: (index: number) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useSettledReducedMotion();
  const photos = commemoration.photos.slice(1);
  const visible = useInView(container, { amount: 0.35 });

  useEffect(() => {
    if (reduce || paused || !visible) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % photos.length),
      4200
    );
    return () => window.clearInterval(timer);
  }, [paused, photos.length, reduce, visible]);

  return (
    <div
      className={s.scrollStack}
      ref={container}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {photos.map((photo, index) => (
        <StackCard
          key={photo.src}
          photo={photo}
          index={index}
          total={photos.length}
          active={active}
          locale={locale}
          reduce={reduce}
          onOpen={() => onOpen(index + 1)}
          onSelect={() => setActive(index)}
        />
      ))}
      <div className={s.stackProgress}>
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            className={index === active ? s.stackProgressActive : ''}
            onClick={() => setActive(index)}
            aria-label={photo.alt[locale]}
          />
        ))}
      </div>
    </div>
  );
}

function StackCard({
  photo,
  index,
  total,
  active,
  locale,
  reduce,
  onOpen,
  onSelect,
}: {
  photo: CommemorationPhoto;
  index: number;
  total: number;
  active: number;
  locale: Locale;
  reduce: boolean;
  onOpen: () => void;
  onSelect: () => void;
}) {
  const forward = (index - active + total) % total;
  const previousDepth = total - forward;
  const isActive = forward === 0;
  const isUpcoming = forward > 0 && forward <= 2;
  const y = isActive
    ? '0%'
    : isUpcoming
      ? `calc(${96 + forward * 5}% + var(--stack-preview-offset, 0%))`
      : `${-Math.min(previousDepth * 9, 42)}px`;
  const scale = isActive
    ? 1
    : isUpcoming
      ? 0.985 - forward * 0.008
      : 1 - Math.min(previousDepth * 0.014, 0.075);
  const opacity = isActive || isUpcoming || previousDepth <= 4 ? 1 : 0;
  const zIndex = isActive
    ? total + 2
    : isUpcoming
      ? total - forward
      : total - previousDepth;

  return (
    <div className={s.stackSlot} style={{ zIndex }}>
      <motion.button
        type="button"
        className={`${s.stackCard} ${isActive ? s.stackCardActive : ''}`}
        onClick={isActive ? onOpen : onSelect}
        aria-label={
          isActive
            ? `${ui.enlargeImage[locale]}: ${photo.alt[locale]}`
            : photo.alt[locale]
        }
        initial={false}
        animate={{
          y: reduce ? 0 : y,
          scale: reduce ? 1 : scale,
          opacity,
          rotate: reduce ? 0 : isActive ? 0 : index % 2 === 0 ? -0.35 : 0.35,
          filter:
            reduce || !isUpcoming
              ? 'blur(0px) saturate(1)'
              : 'blur(9px) saturate(0.55)',
        }}
        transition={{ duration: reduce ? 0.2 : 0.82, ease: EASE }}
      >
        <div className={s.stackImage}>
          <Image
            src={photo.src}
            alt={photo.alt[locale]}
            fill
            sizes="(max-width: 700px) 94vw, (max-width: 1100px) 86vw, 920px"
            quality={92}
            style={{ objectFit: 'contain', objectPosition: 'center' }}
          />
        </div>
      </motion.button>
    </div>
  );
}

function Guest({
  label,
  name,
  role,
  delay,
}: {
  label: string;
  name: string;
  role: string;
  delay: number;
}) {
  return (
    <Rise y={16} delay={delay}>
      <article className={s.guestCard}>
        <div>{label}</div>
        <h3>{name}</h3>
        <p>{role}</p>
      </article>
    </Rise>
  );
}

function EventLightbox({
  index,
  locale,
  onClose,
  onIndex,
}: {
  index: number;
  locale: Locale;
  onClose: () => void;
  onIndex: (index: number) => void;
}) {
  const reduce = useSettledReducedMotion();
  const photo: CommemorationPhoto = commemoration.photos[index];

  const go = useCallback(
    (delta: number) => {
      onIndex(
        (index + delta + commemoration.photos.length) %
          commemoration.photos.length
      );
    },
    [index, onIndex]
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [go, onClose]);

  return (
    <motion.div
      className={s.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt[locale]}
    >
      <div className={s.lbBar}>
        <div className={s.lbTitle}>
          <b>{commemoration.title[locale]}</b>
          <span>{photo.alt[locale]}</span>
        </div>
        <div className={s.lbTools}>
          <button
            type="button"
            className={s.lbButton}
            onClick={onClose}
            aria-label={ui.close[locale]}
          >
            ×
          </button>
        </div>
      </div>

      <div className={s.lbStage}>
        <AnimatePresence mode="wait">
          <motion.div
            key={photo.src}
            className={s.lbImage}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) go(1);
              else if (info.offset.x > 70) go(-1);
            }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <Image
              src={photo.src}
              alt={photo.alt[locale]}
              fill
              sizes="100vw"
              quality={95}
              style={{ objectFit: 'contain', objectPosition: 'center' }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        type="button"
        className={`${s.lbNav} ${s.lbPrev}`}
        onClick={() => go(-1)}
        aria-label={ui.prev[locale]}
      >
        ‹
      </button>
      <button
        type="button"
        className={`${s.lbNav} ${s.lbNext}`}
        onClick={() => go(1)}
        aria-label={ui.next[locale]}
      >
        ›
      </button>

      <div className={s.lbCount}>
        {index + 1} / {commemoration.photos.length}
      </div>
    </motion.div>
  );
}
