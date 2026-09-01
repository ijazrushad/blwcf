import Image from 'next/image';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Archive from '@/components/Archive';
import CourseArticle from '@/components/CourseArticle';
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

      {/* ================= hero ================= */}
      <header className={s.hero}>
        {/* permanent Bengali art layer, present in both languages */}
        <div className={s.watermarkHolder} aria-hidden>
          <Parallax distance={40}>
            <div className={s.watermark}>{hero.watermark}</div>
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
                {hero.titleBefore[l]} <span className={s.n}>{hero.titleNumber[l]}</span>{' '}
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
            <Develop className={s.bleedLim}>
              <Image
                src={bleed.src}
                alt={hero.plate.body[l]}
                width={bleed.width}
                height={bleed.height}
                sizes="80vw"
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
          <SectionHead
            n={sections.archive.n}
            kick={sections.archive.kick[l]}
            mark={sections.archive.mark[l]}
            title={
              l === 'bn' ? (
                <>
                  সংগ্রহ<i>শালা</i>
                </>
              ) : (
                <>
                  The <i>archive</i>
                </>
              )
            }
          />
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
          <SectionHead
            n={sections.courses.n}
            kick={sections.courses.kick[l]}
            mark={sections.courses.mark[l]}
            title={
              l === 'bn' ? (
                <>
                  দুইটি কোর্স,
                  <br />
                  <i>একটি সূচনা</i>
                </>
              ) : (
                <>
                  Two courses,
                  <br />
                  <i>one beginning</i>
                </>
              )
            }
          />
        </div>

        {courses.map((c, i) => (
          <CourseArticle
            key={c.year.en}
            course={c}
            locale={l}
            mirrored={i === 1}
          />
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
          <p className={s.bnq}>
            {verse.lines.map((line, i) => (
              <span key={i}>
                {line}
                {i < verse.lines.length - 1 && <br />}
              </span>
            ))}
          </p>
          <p className={s.tr}>{verse.translation[l]}</p>
          <small className={s.by}>{verse.by}</small>
        </div>
      </div>

      {/* ================= footer ================= */}
      <footer className={s.footer}>
        <div className="wrap">
          <div className={`g12 ${s.fGrid}`}>
            <div className={s.fa}>
              <h5>{brand.full[l]}</h5>
              <p>{footer.blurb[l]}</p>
            </div>

            {footer.cols.map((col, i) => (
              <div key={col.h.en} className={[s.fb2, s.fc, s.fd][i]}>
                <h5>{col.h[l]}</h5>
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
  n,
  kick,
  title,
  mark,
}: {
  n: string;
  kick: string;
  title: React.ReactNode;
  mark: string;
}) {
  return (
    <Rise className={s.sh}>
      <div className={`g12 ${s.shGrid}`}>
        <span className={s.shN}>{n}</span>
        <div className={s.shH}>
          <span className={s.kick}>{kick}</span>
          <h2>{title}</h2>
        </div>
        {/* permanent Bengali mark, shown in both languages */}
        <div className={s.mark}>{mark}</div>
      </div>
    </Rise>
  );
}
