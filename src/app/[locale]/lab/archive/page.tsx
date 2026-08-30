import { notFound } from 'next/navigation';
import Archive, { type ArchiveVariant } from '@/components/Archive';
import { locales, type Locale } from '@/content/site';
import s from './lab.module.css';

/**
 * Side-by-side comparison of the three ways F's broken archive grid can
 * handle the fact that the scans have wildly different aspect ratios.
 * Not linked from the site — open /en/lab/archive directly.
 */

const OPTIONS: {
  variant: ArchiveVariant;
  name: string;
  pitch: string;
  cost: string;
}[] = [
  {
    variant: 'exact',
    name: 'A · The mockup exactly as drawn',
    pitch:
      'Fixed ratios (4:3, 1:1, 3:4, 16:10) with object-fit: cover. The cleanest rhythm — every plate locks to the grid and the eye travels the zigzag without interruption.',
    cost:
      'It crops. The tall cadet portrait loses its top and bottom, and the two group photographs would lose the printed name keys along their edges.',
  },
  {
    variant: 'trueRatio',
    name: 'B · Same grid, true ratios',
    pitch:
      'Identical column placements and vertical offsets, but each plate is as tall as the scan really is. Nothing is cropped and the documents stay whole.',
    cost:
      'The zigzag gets looser, because a 0.38-ratio portrait next to a 1.58-ratio landscape makes rows of very uneven height.',
  },
  {
    variant: 'featured',
    name: 'C · True ratios, six plates, plus the reel — chosen',
    pitch:
      'Option B plus two more plates continuing the rhythm, and a full-bleed contact-sheet reel carrying all eleven scans. The reel drifts on its own, pauses when pointed at, and can be dragged to scrub.',
    cost:
      'The reel is a new element that is not in F, so it is styled off the same 1.5px ink rule and mono labels to stay in the language.',
  },
];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!locales.includes(raw as Locale)) notFound();
  const l = raw as Locale;

  return (
    <main className={s.lab}>
      <div className="wrap">
        <p className={s.eyebrow}>Archive layout — pick one</p>
        <h1 className={s.title}>
          Three ways to keep F&rsquo;s broken grid
        </h1>
        <p className={s.intro}>
          All three keep the asymmetric placement, the vertical offsets and the
          ruled captions from Treatment F. They differ only in how they handle
          the aspect ratios. Every plate opens in the lightbox, which always
          carries the full set of eleven scans regardless of what the grid shows.
        </p>
      </div>

      {OPTIONS.map((opt) => (
        <section key={opt.variant} className={s.block}>
          <div className="wrap">
            <div className={s.head}>
              <h2>{opt.name}</h2>
              <div className={s.cols}>
                <p>
                  <b>Gains</b>
                  {opt.pitch}
                </p>
                <p className={s.cost}>
                  <b>Costs</b>
                  {opt.cost}
                </p>
              </div>
            </div>
            <Archive locale={l} variant={opt.variant} />
          </div>
        </section>
      ))}
    </main>
  );
}
