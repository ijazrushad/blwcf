'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Develop } from '@/components/Motion';
import { ui, type Course, type Locale } from '@/content/site';
import s from '@/app/[locale]/page.module.css';
import m from './CourseArticle.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CourseArticle({
  course,
  locale,
  mirrored,
}: {
  course: Course;
  locale: Locale;
  mirrored: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);

  const plate = (
    <Develop
      key="im"
      className={s.cseIm}
      style={{ aspectRatio: `${course.image.width} / ${course.image.height}` }}
    >
      <button
        type="button"
        className={m.plateBtn}
        onClick={() => setImageOpen(true)}
        aria-label={ui.enlargeImage[locale]}
      >
        <Image
          src={course.image.src}
          alt={course.title[locale]}
          fill
          sizes="(max-width: 980px) 92vw, 56vw"
          quality={95}
        />
      </button>
    </Develop>
  );

  const sheet = (
    <div
      key="tx"
      className={`${s.tx} ${s.sheet} ${m.sheetBtn}`}
      role="button"
      tabIndex={0}
      onClick={openModal}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      }}
      aria-label={ui.readFull[locale]}
    >
      <span className="tape" aria-hidden />
      <div className={s.yr}>{course.year[locale]}</div>
      <h3>{course.title[locale]}</h3>
      <div className={s.dt2}>{course.when[locale]}</div>
      <p>{course.body[locale]}</p>
      <div className={m.readRow}>
        <span className={m.readLabel}>{ui.readFull[locale]}</span>
      </div>
      <div className={s.hand}>{course.hand[locale]}</div>
      <div className={s.med}>
        {course.medals.map((medal) => (
          <div key={medal.l.en}>
            <b>{medal.n[locale]}</b>
            <span>{medal.l[locale]}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <article className={`${s.cse} ${mirrored ? s.c2 : s.c1}`}>
        <div className="wrap">
          <div className={`g12 ${s.cseGrid}`}>
            {mirrored ? (
              <>
                {sheet}
                {plate}
              </>
            ) : (
              <>
                {plate}
                {sheet}
              </>
            )}
          </div>
        </div>
      </article>

      <AnimatePresence>
        {modalOpen && (
          <CourseModal
            course={course}
            locale={locale}
            onClose={() => setModalOpen(false)}
          />
        )}
        {imageOpen && (
          <CourseImageLightbox
            course={course}
            locale={locale}
            onClose={() => setImageOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function CourseImageLightbox({
  course,
  locale,
  onClose,
}: {
  course: Course;
  locale: Locale;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(false);
  const nativeWidth = `min(${course.image.width}px, 100%)`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      className={m.lbBackdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={ui.enlargeImage[locale]}
    >
      <div className={m.lbBar}>
        <div className={m.lbTitle}>
          <b>{course.title[locale]}</b>
          <span>{course.when[locale]}</span>
        </div>
        <div className={m.lbTools}>
          <button
            type="button"
            className={`${m.lbBtn} ${zoom ? m.lbBtnActive : ''}`}
            onClick={() => setZoom((z) => !z)}
            aria-pressed={zoom}
            aria-label={ui.zoom[locale]}
            title={ui.zoom[locale]}
          >
            {zoom ? '−' : '+'}
          </button>
          <button
            type="button"
            className={m.lbBtn}
            onClick={onClose}
            aria-label={ui.close[locale]}
            title={ui.close[locale]}
          >
            ×
          </button>
        </div>
      </div>

      <div className={m.lbStage}>
        <div
          className={m.lbImgWrap}
          style={{
            width: zoom
              ? nativeWidth
              : `min(${course.image.width * 1.6}px, 100%)`,
            maxHeight: zoom ? 'none' : '100%',
            aspectRatio: `${course.image.width} / ${course.image.height}`,
          }}
        >
          <Image
            src={course.image.src}
            alt={course.title[locale]}
            width={course.image.width}
            height={course.image.height}
            sizes="100vw"
            quality={100}
            priority
          />
        </div>
      </div>
    </motion.div>
  );
}

function CourseModal({
  course,
  locale,
  onClose,
}: {
  course: Course;
  locale: Locale;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      className={m.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={course.title[locale]}
    >
      <motion.div
        className={m.dialog}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.42, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={m.head}>
          <div className={m.headText}>
            <div className={m.yr}>{course.year[locale]}</div>
            <h2>{course.title[locale]}</h2>
            <div className={m.when}>{course.when[locale]}</div>
          </div>
          <button
            type="button"
            className={m.close}
            onClick={onClose}
            aria-label={ui.close[locale]}
            title={ui.close[locale]}
          >
            ×
          </button>
        </header>

        <div className={m.body}>
          <div
            className={m.im}
            style={{
              aspectRatio: `${course.image.width} / ${course.image.height}`,
            }}
          >
            <Image
              src={course.image.src}
              alt={course.title[locale]}
              fill
              sizes="(max-width: 980px) 92vw, 44vw"
              quality={95}
              priority
            />
          </div>

          <div className={m.scroll}>
            <p className={m.lead}>{course.body[locale]}</p>
            {course.full.map((para) => (
              <p key={para.en}>{para[locale]}</p>
            ))}
            <div className={m.hand}>{course.hand[locale]}</div>
            <div className={m.med}>
              {course.medals.map((medal) => (
                <div key={medal.l.en}>
                  <b>{medal.n[locale]}</b>
                  <span>{medal.l[locale]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
