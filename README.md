# BLWCF — Bangladesh Liberation War Courses Foundation

Bilingual (English / বাংলা) archive site for the 1st and 2nd Bangladesh War
Courses, 1971–1972. Sixty-one guerrilla cadets were commissioned at Murti on
9 October 1971; forty-six more followed in August 1972. This site carries the
record and the surviving scans.

Built with Next.js 16 (App Router), TypeScript, CSS Modules and Framer Motion.

## Running it locally

```bash
npm install
npm run dev     # http://localhost:3000 — redirects to /en
npm run lint
npm run build
npm start
```

## Deploying

The app sits at the repository root, so Vercel needs no configuration —
import the repo and it detects Next.js, `npm run build` and the `.next`
output on its own. There are no environment variables and no external
services; every page is prerendered as static HTML at build time.

Both languages are generated ahead of time (`/en` and `/bn`), and `/`
redirects to `/en` via `next.config.ts`.

## Layout

```
src/
  app/
    globals.css          design tokens, paper grain, reduced-motion reset
    not-found.tsx        supplies its own <html>, see note below
    [locale]/
      layout.tsx         the root layout — fonts and <html lang>
      page.tsx           every section of the single page
      page.module.css
      lab/archive/       internal layout comparison, not linked from the site
  components/
    Nav.tsx              header and language toggle
    Motion.tsx           Develop / Rise / Parallax / Stagger primitives
    Archive.tsx          the broken-grid plates and the lightbox
    ArchiveStrip.tsx     the contact-sheet reel
  content/
    site.ts              all bilingual copy and image metadata
public/archive/          the scans
```

## Things worth knowing before you edit

**The root layout lives in `[locale]`.** There is no `app/layout.tsx`, because
`<html lang>` has to change per language and a root layout cannot read route
params. This is also why `app/not-found.tsx` carries its own `<html>` and
`<body>`.

**The scans are low resolution** — between 231px and 1290px wide. Two
consequences are baked in: `next.config.ts` does not generate variants above
1440px, and the lightbox "zoom" caps at each image's own pixel width rather
than filling the screen, since upscaling these further only produces mush. If
better scans arrive, update the `width`/`height` values in `src/content/site.ts`
— the gallery and the reel both read their layout from them.

**Nothing is cropped.** Aspect ratios run from 0.38 to 1.58, and several plates
are documents with printed name keys that have to stay readable. The grid
plates take their true `aspect-ratio` from the recorded dimensions, and the reel
gives every slide a uniform height with its width derived from the same ratio.

**Bengali needs more vertical room than Latin.** Matras and conjuncts clip
against a Latin line-height, so display type is sized separately per language
throughout — look for the `html[lang='bn']` blocks next to each rule rather
than adding a global override.

**The reel animation is driven by one custom property.** `ArchiveStrip` writes
`--f` (0 to 1, by distance from the centre of the strip) onto each slide every
frame, and all the visual work — the red and green ink separation, blur,
tone, tilt, lift and caption — happens in CSS off that single number. It
defaults to `1` so the strip renders correctly before JavaScript loads. Note
that the drag deliberately avoids `setPointerCapture`, which would retarget the
click and stop plates from opening.

## Adding an archive plate

Drop the file in `public/archive/`, then append an entry to `archive` in
`src/content/site.ts` with its real pixel dimensions. Set `document: true` if
it carries small print. The reel picks it up automatically; the four plates in
the broken grid are chosen by id in `Archive.tsx`.

## Still outstanding

- The Bengali translations need a review by a native speaker.
- The header and footer both use the full seal; a simplified header mark was
  discussed but not designed.
- Officer names in the two group photographs have not been transcribed.
