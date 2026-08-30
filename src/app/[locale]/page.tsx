import Image from 'next/image';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Archive from '@/components/Archive';
import { Develop, Parallax, Rise } from '@/components/Motion';
import {
  archive,
  brand,
  courses,
  dates,
  figures,
  footer,
  hero,
  locales,
  sections,
  verse,
  type Locale,
} from '@/content/site';
import s from './page.module.css';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!locales.includes(raw as Locale)) notFound();
  const l = raw as Locale;

  const bleed = archive.find((a) => a.id === 'guard-of-honour')!;

  return (
    <>
      <Nav locale={l} />

      <main>
        {/* ================= hero ================= */}
        <header className={s.hero}>
          {/* permanent Bengali art layer, present in both languages */}
          <div className={s.watermarkHolder} aria-hidden>
            <Parallax distance={40}>
              <div className={s.watermark} lang="bn">
                {hero.watermark}
              </div>
            </Parallax>
          </div>

          <div className={`wrap ${s.heroWrap}`}>
            <div className="g12">
              <div className={s.motto}>{brand.motto[l]}</div>

              <div
                className={`${s.masked} ${l === 'bn' ? s.maskedBn : s.maskedEn}`}
              >
                {hero.masked[l]}
              </div>

              <div className={s.htitle}>
                <h1 className={s.h1}>
                  {hero.titleBefore[l]}{' '}
                  <span className={s.n}>{hero.titleNumber[l]}</span>{' '}
                  <i>{hero.titleAfter[l]}</i>
                </h1>
              </div>

              <div className={s.hmeta}>
                {hero.meta.map((m) => (
                  <span key={m.k.en}>
                    <b>{m.k[l]}</b> · {m.v[l]}
                    <br />
                  </span>
                ))}
              </div>

              <p className={s.hsub}>{hero.lead[l]}</p>
            </div>

            <div className={s.bleedL}>
              <Develop className={s.bleedLim} eager>
                <Image
                  src={bleed.src}
                  alt={hero.plate.body[l]}
                  width={bleed.width}
                  height={bleed.height}
                  /* .bleedLim is 74vw above the 980px breakpoint, full width below */
                  sizes="(max-width: 980px) 100vw, 74vw"
                  quality={95}
                  priority
                />
              </Develop>

              <div className={s.note}>
                <span className="tape" aria-hidden />
                <div className={s.noteKick}>{hero.plate.label[l]}</div>
                <p>{hero.plate.body[l]}</p>
                <div className={s.noteHand}>{hero.plate.place[l]}</div>
              </div>
            </div>
          </div>
        </header>

        {/* ================= dates ================= */}
        <div className={s.dates} id="dates">
          <div className={`wrap ${s.datesInner}`}>
            {dates.map((d) => (
              <div key={d.d.en} className={s.dt}>
                <b>{d.d[l]}</b>
                <span>{d.n[l]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 01 archive ================= */}
        <section id="archive" className={s.section}>
          <div className="wrap">
            <SectionHead section={sections.archive} locale={l} />
            <Archive locale={l} />
          </div>
        </section>

        {/* ================= figures ================= */}
        <section className={s.section}>
          <div className="wrap">
            <div className={`g12 ${s.figGrid}`}>
              <div className={`${s.fig} ${s.f1}`}>
                <b>{figures.a.n[l]}</b>
                <div className={s.lb}>{figures.a.l[l]}</div>
              </div>

              <div className={s.figtxt}>{figures.text[l]}</div>

              <div className={`${s.fig} ${s.f2}`}>
                <b>{figures.b.n[l]}</b>
                <div className={s.lb}>{figures.b.l[l]}</div>
              </div>

              <div className={`${s.fig} ${s.f3}`}>
                <b>{figures.c.n[l]}</b>
                <div className={s.lb}>{figures.c.l[l]}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 02 courses ================= */}
        <section id="courses" className={s.section}>
          <div className="wrap">
            <SectionHead section={sections.courses} locale={l} />
          </div>

          {courses.map((c, i) => (
            <article
              key={c.year.en}
              className={`${s.cse} ${i === 0 ? s.c1 : s.c2}`}
            >
              <div className="wrap">
                <div className="g12">
                  <Develop className={s.cseIm}>
                    <Image
                      src={c.image.src}
                      alt={c.title[l]}
                      width={c.image.width}
                      height={c.image.height}
                      sizes="(max-width: 980px) 92vw, 56vw"
                      quality={95}
                    />
                  </Develop>

                  <div className={`${s.tx} ${s.sheet}`}>
                    <span className="tape" aria-hidden />
                    <div className={s.yr}>{c.year[l]}</div>
                    <h3>{c.title[l]}</h3>
                    <div className={s.dt2}>{c.when[l]}</div>
                    <p>{c.body[l]}</p>
                    <div className={s.hand}>{c.hand[l]}</div>
                    <div className={s.med}>
                      {c.medals.map((m) => (
                        <div key={m.l.en}>
                          <b>{m.n[l]}</b>
                          <span>{m.l[l]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* ================= verse ================= */}
        <div className={s.verse}>
          <div className={s.bgim} aria-hidden>
            <Parallax distance={38} className={s.bgimInner}>
              <Image
                src="/archive/photo-report.jpg"
                alt=""
                fill
                sizes="100vw"
                quality={80}
              />
            </Parallax>
          </div>
          <div className={`wrap ${s.verseWrap}`}>
            {/* the verse is never translated away — it stays in Bengali in both languages */}
            <p className={s.bnq} lang="bn">
              {verse.lines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < verse.lines.length - 1 && <br />}
                </span>
              ))}
            </p>
            <p className={s.tr}>{verse.translation[l]}</p>
            <small className={s.by} lang="bn">
              {verse.by}
            </small>
          </div>
        </div>
      </main>

      {/* ================= footer ================= */}
      {/*
       * These are h2 rather than the h5 the type size suggests. Heading level
       * is document structure, not size — the footer groups sit alongside the
       * page's other top-level sections, and jumping h3 to h5 leaves a hole a
       * screen reader has to guess at. The size comes from the stylesheet.
       */}
      <footer className={s.footer}>
        <div className="wrap">
          <div className={`g12 ${s.fGrid}`}>
            <div className={s.fa}>
              <h2>{brand.full[l]}</h2>
              <p>{footer.blurb[l]}</p>
            </div>

            {footer.cols.map((col, i) => (
              <div key={col.h.en} className={[s.fb2, s.fc, s.fd][i]}>
                <h2>{col.h[l]}</h2>
                {col.links.map((link, j) => (
                  <a key={j} href={link.href}>
                    {link.label[l]}
                  </a>
                ))}
              </div>
            ))}
          </div>

          <div className={s.fbar}>
            <span>© {new Date().getFullYear()} BLWCF</span>
            <span>{brand.motto[l]}</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function SectionHead({
  section,
  locale,
}: {
  section: (typeof sections)[keyof typeof sections];
  locale: Locale;
}) {
  const { lead, italic, tight, stacked } = section.title;

  return (
    <Rise className={s.sh}>
      <div className={`g12 ${s.shGrid}`}>
        <span className={s.shN}>{section.n}</span>
        <div className={s.shH}>
          <span className={s.kick}>{section.kick[locale]}</span>
          <h2>
            {lead[locale]}
            {stacked ? <br /> : tight?.[locale] ? null : ' '}
            <i>{italic[locale]}</i>
          </h2>
        </div>
        {/*
         * The mark repeats the heading in the *other* language, and stays
         * there in both — it reads as a printed margin note rather than as
         * copy, so it is marked up in the language it is actually written in.
         */}
        <div className={s.mark} lang={locale === 'en' ? 'bn' : 'en'}>
          {section.mark[locale]}
        </div>
      </div>
    </Rise>
  );
}
