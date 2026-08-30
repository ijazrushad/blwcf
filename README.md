# BLWCF — Bangladesh Liberation War Courses Foundation

[![CI](https://github.com/ijazrushad/blwcf/actions/workflows/ci.yml/badge.svg)](https://github.com/ijazrushad/blwcf/actions/workflows/ci.yml)
[![Security](https://github.com/ijazrushad/blwcf/actions/workflows/security.yml/badge.svg)](https://github.com/ijazrushad/blwcf/actions/workflows/security.yml)
[![CodeQL](https://github.com/ijazrushad/blwcf/actions/workflows/codeql.yml/badge.svg)](https://github.com/ijazrushad/blwcf/actions/workflows/codeql.yml)
[![Lighthouse](https://github.com/ijazrushad/blwcf/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/ijazrushad/blwcf/actions/workflows/lighthouse.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Bilingual (English / বাংলা) archive site for the 1st and 2nd Bangladesh War
Courses, 1971–1972. Sixty-one guerrilla cadets were commissioned at Murti on
9 October 1971; forty-six more followed in August 1972. This site carries the
record and the surviving scans.

Built with Next.js 16 (App Router), TypeScript, CSS Modules and Framer Motion.
Every page is prerendered to static HTML at build time.

---

## Contents

- [What this is](#what-this-is)
- [Stack](#stack)
- [Running it locally](#running-it-locally)
- [Scripts](#scripts)
- [Layout](#layout)
- [How the page is put together](#how-the-page-is-put-together)
- [Things worth knowing before you edit](#things-worth-knowing-before-you-edit)
- [Adding an archive plate](#adding-an-archive-plate)
- [Performance](#performance)
- [Security](#security)
- [CI/CD](#cicd)
- [Deploying](#deploying)
- [Dependency policy](#dependency-policy)
- [Contributing](#contributing)
- [Still outstanding](#still-outstanding)
- [License](#license)

---

## What this is

A single long page, rendered twice — once at `/en` and once at `/bn` — from one
bilingual content file. It has no database, no API, no forms and no third-party
scripts. All the substance lives in [`src/content/site.ts`](src/content/site.ts):
every line of copy in both languages, and the true pixel dimensions of every
scan in the archive.

The design is a printed-matter treatment: paper grain, a halftone dot screen, a
misregistered red screenprint block for the numeral, plates pasted down with
tape. The archive reel takes that literally — each plate travels _out of
register_, red and green inks pulled apart, and pulls into register as it
crosses the press line at the centre of the strip.

## Stack

|               |                                                  |
| ------------- | ------------------------------------------------ |
| Framework     | Next.js 16 (App Router, Turbopack, React 19)     |
| Language      | TypeScript 5.9, `strict`                         |
| Styling       | CSS Modules + custom properties in `globals.css` |
| Motion        | Framer Motion 13                                 |
| Fonts         | `next/font/google`, self-hosted at build time    |
| Images        | `next/image`, AVIF and WebP                      |
| Lint / format | ESLint 9 (`eslint-config-next`) + Prettier 3     |
| CI            | GitHub Actions                                   |
| Hosting       | Vercel                                           |
| Runtime       | Node 22 (`.nvmrc`)                               |

## Running it locally

```bash
npm ci            # not `npm install` — respect the lockfile
npm run dev       # http://localhost:3000 — redirects to /en
```

Node 22 or newer is required. `nvm use` picks the right one up from `.nvmrc`.

Before pushing:

```bash
npm run verify    # format:check + lint + typecheck + build
```

## Scripts

| Script                 | What it does                                                |
| ---------------------- | ----------------------------------------------------------- |
| `npm run dev`          | Development server with Turbopack and Fast Refresh          |
| `npm run build`        | Production build; prerenders `/en` and `/bn` to static HTML |
| `npm start`            | Serves the production build on port 3000                    |
| `npm run lint`         | ESLint over the whole repository                            |
| `npm run lint:fix`     | The same, applying the fixable rules                        |
| `npm run typecheck`    | `tsc --noEmit`                                              |
| `npm run format`       | Prettier, writing                                           |
| `npm run format:check` | Prettier, checking — what CI runs                           |
| `npm run verify`       | All four gates in the order CI runs them                    |

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
  components/
    Nav.tsx              header and language toggle (server component)
    Motion.tsx           Develop / Rise / Parallax / Stagger primitives
    Archive.tsx          the broken-grid plates and the lightbox
    ArchiveStrip.tsx     the contact-sheet reel
  content/
    site.ts              all bilingual copy and image metadata
public/archive/          the scans
.github/workflows/       CI, security, CodeQL, Lighthouse, Scorecard
```

## How the page is put together

**Routing.** `/` redirects to `/en` (`next.config.ts`). `[locale]` is a dynamic
segment with `generateStaticParams`, so `/en` and `/bn` are both built as static
HTML — the build output labels them `● (SSG)`. Any other locale hits
`notFound()`.

**Content.** `page.tsx` is a server component. It reads `site.ts`, picks
`[locale]` off every bilingual string, and passes plain values down. Only four
things are client components: the four motion primitives, the reel, the
lightbox, and nothing else.

**Type.** Seven font families, because Bengali and Latin need different
treatment at display sizes and this design uses both in both languages. The
watermark, the section marks and the verse stay in Bengali on the English page
— they are art, not copy, and they are never translated away.

**Motion.** `Motion.tsx` defines the vocabulary: photographs _develop_ (blur and
contrast resolving, the way a print comes up in a tray) rather than sliding;
text rises a short distance; parallax is small enough to read as depth in the
paper. Everything collapses to a plain fade under `prefers-reduced-motion`, and
the reel swaps to a hand-scrolled rail entirely.

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
`--f` (0 to 1, by distance from the centre of the strip) onto each slide, and
all the visual work — the red and green ink separation, blur, tone, tilt, lift
and caption — happens in CSS off that single number. It defaults to `1` so the
strip renders correctly before JavaScript loads. Note that the drag deliberately
avoids `setPointerCapture`, which would retarget the click and stop plates from
opening.

**Font weights are not free, and not all of them are reachable.** The comment at
the top of `layout.tsx` explains how to work out whether a weight can actually
be selected by a stylesheet before you add one.

## Adding an archive plate

Drop the file in `public/archive/`, then append an entry to `archive` in
`src/content/site.ts` with its real pixel dimensions. Set `document: true` if
it carries small print. The reel picks it up automatically; the four plates in
the broken grid are chosen by id in `Archive.tsx`.

## Performance

The site is static HTML with no third-party requests, so the budget is spent
almost entirely on fonts and scans. The measures below are enforced by the
`Lighthouse` workflow on every pull request, against both locales.

What is deliberate:

- **Font weights are pruned to what a stylesheet can actually select.** A weight
  is reachable if a rule declares it, or if `b`/`h1`–`h6` fall back onto it —
  those request 700 and CSS font matching then picks the nearest shipped weight.
  Weight 500 was unreachable in Inter Tight and Hind Siliguri, 600 in Baloo Da 2,
  200/400 in Noto Serif Bengali. Removing them, plus dropping the preload on the
  family used only by the verse at the bottom of the page, took the fonts
  preloaded on first paint from **643 KB to 409 KB** with no visual change.
- **Every `next/image` carries a real `sizes`.** Without one, the browser
  assumes `100vw` and picks a variant for the viewport rather than the slot —
  the 52px header seal was shipping a 640px-wide variant of a 500px source.
- **The hero plate does not fade in from transparent.** An element at
  `opacity: 0` has not painted, so an LCP candidate that fades in delays
  Largest Contentful Paint by the whole animation duration. `Develop` takes an
  `eager` prop that holds opacity at 1 and resolves only the blur and contrast,
  which is where the effect actually lives.
- **The reel's frame loop does no DOM reads.** It used to call
  `getBoundingClientRect()` once per plate per frame — twenty-two forced
  synchronous layouts every frame, which is what made the strip stutter. Plate
  centres are now measured once per layout change through a `ResizeObserver`,
  and each frame is pure arithmetic. A plate whose value has not moved past the
  rounding of `--f` is skipped entirely, so off-screen plates cost no style
  recalculation.
- **Lightbox images are encoded at quality 95, not 100.** At 100 the encoder
  stops discarding anything and the file roughly doubles, which buys no visible
  detail on a soft scan.
- **Scans are immutable, so they are cached for a year** (`Cache-Control:
public, max-age=31536000, immutable`, and `minimumCacheTTL` to match on the
  image optimiser). A better scan arrives as a new entry, not as a replacement
  in place.

## Security

Full detail — including the one deliberate weakness in the CSP and why it is
there — is in [SECURITY.md](SECURITY.md). In short: the security headers are
set in [`next.config.ts`](next.config.ts) and **asserted against a running
server** on every CI run, so they cannot regress silently. `X-Powered-By` is
off. Fonts are self-hosted, so the browser never talks to another origin.

Report vulnerabilities through a
[private advisory](https://github.com/ijazrushad/blwcf/security/advisories/new),
never in a public issue.

## CI/CD

Deployment belongs to Vercel's Git integration; GitHub Actions is the quality
gate in front of it. The two are not duplicated — nothing in `.github/workflows`
deploys anything.

```
  push / pull request
        │
        ├── CI ─────────── prettier → eslint → tsc → build on Node 22 and 24
        │                  → assert both locales prerendered to static HTML
        │
        ├── Security ───── dependency review (PR only, fails at moderate)
        │                  npm audit, runtime tree, fails at any severity
        │                  npm audit, full tree, fails at high
        │                  gitleaks over full history
        │                  build + serve + assert the response headers
        │
        ├── CodeQL ─────── security-extended, results to the Security tab
        │
        ├── Lighthouse ─── /en and /bn, 3 runs each, budgets asserted
        │
        └── Vercel ─────── preview deployment, URL commented on the PR
                           merge to main → production
```

| Workflow          | File                                                 | Triggers                 |
| ----------------- | ---------------------------------------------------- | ------------------------ |
| CI                | [`ci.yml`](.github/workflows/ci.yml)                 | push, PR, merge queue    |
| Security          | [`security.yml`](.github/workflows/security.yml)     | push, PR, weekly, manual |
| CodeQL            | [`codeql.yml`](.github/workflows/codeql.yml)         | push, PR, weekly         |
| Lighthouse        | [`lighthouse.yml`](.github/workflows/lighthouse.yml) | push, PR, manual         |
| OpenSSF Scorecard | [`scorecard.yml`](.github/workflows/scorecard.yml)   | push to `main`, weekly   |

Every workflow declares least-privilege `permissions`, checks out with
`persist-credentials: false`, sets a `timeout-minutes`, and cancels superseded
runs through a `concurrency` group.

### Repository settings this expects

The workflows are only half of it. On GitHub, under **Settings**:

1. **Branches → protect `main`**: require a pull request, require the `CI`,
   `Security`, `CodeQL` and `Lighthouse` checks to pass, require branches to be
   up to date, require a code-owner review, and disallow force pushes.
2. **Code security**: enable Dependabot alerts, Dependabot security updates,
   secret scanning and push protection.
3. **Actions → General**: set workflow permissions to read-only by default.

## Deploying

The app sits at the repository root, so Vercel needs no configuration — import
the repo and it detects Next.js, `npm run build` and the `.next` output on its
own. There are no environment variables and no external services.

Vercel's Git integration handles both environments:

- **Preview** — every pull request gets its own URL, commented on the PR.
- **Production** — a merge to `main` promotes automatically.

Both languages are generated ahead of time (`/en` and `/bn`), and `/` redirects
to `/en` via `next.config.ts`. The response headers in `next.config.ts` are
served by Vercel's edge network as-is; there is no `vercel.json` and nothing
needs one.

Rolling back is Vercel's **Instant Rollback** on the previous production
deployment — faster than a revert commit, and the revert can follow at leisure.

## Dependency policy

Dependabot opens grouped pull requests every Monday: one for the framework
(`next`, `react`, `react-dom` and their types move together or not at all), one
for the rest of the dev tooling, one for GitHub Actions.

Two versions are held back on purpose, and both are worth re-testing when the
ecosystem catches up:

- **TypeScript is pinned to 5.9** even though 7.0 is out. `tsc --noEmit` passes
  clean on 7.0, but `eslint-config-next` bundles `typescript-eslint`, which
  refuses to load against the TypeScript 7 API
  ([typescript-eslint#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940)).
  Upgrading now would trade a working lint stage for nothing.
- **ESLint is pinned to 9** for the same reason from the other direction: ESLint
  10 removed `context.getFilename()`, which the `eslint-plugin-react` bundled
  inside `eslint-config-next` still calls.

To re-check either:

```bash
npm i -D typescript@latest eslint@latest && npm run lint
```

If it passes, the pin can go.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). The short version: run `npm run verify`,
check both languages and a narrow viewport in a browser, and if you are changing
a name, a date or a number, say in the pull request where the fact comes from.

Corrections to the historical record are welcome even without a pull request —
open a
[historical correction issue](https://github.com/ijazrushad/blwcf/issues/new?template=content_correction.yml).

## Still outstanding

- The Bengali translations need a review by a native speaker.
- The header and footer both use the full seal; a simplified header mark was
  discussed but not designed.
- Officer names in the two group photographs have not been transcribed.
- No automated test suite. The build, the type checker and the Lighthouse
  budgets are currently the only gates; component tests would be worth having
  before the site grows a second page.

## License

[MIT](LICENSE) for the code.

The photographs, documents and scans in `public/archive/` are historical
material reproduced here for the record. They are not covered by the MIT licence
and their own rights are held by their respective originators.
