# Contributing

Thanks for wanting to help. This is a small site with an unusually specific
job: it carries a historical record, and it has to stay accurate, readable in
two languages, and fast on a phone in Bangladesh.

## Getting set up

```bash
git clone https://github.com/ijazrushad/blwcf.git
cd blwcf
npm ci          # not `npm install` — respect the lockfile
npm run dev     # http://localhost:3000, redirects to /en
```

Node 22 or newer (`.nvmrc` pins it; `nvm use` picks it up).

## Before you open a pull request

```bash
npm run verify
```

That is `format:check`, `lint`, `typecheck` and `build` in sequence — the same
four things CI runs first. If `format:check` fails, `npm run format` fixes it.

Then look at the change in a browser, in **both** languages, at a **narrow
width**, and — if you touched anything that moves — with **reduce motion** on.
CI cannot check any of those four for you.

## Branching and commits

Branch off `main`. Name the branch for the work: `fix/reel-drag-on-touch`,
`content/1972-course-names`.

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(archive): add the Murti camp sketch map
fix(nav): keep the language toggle reachable at 320px
content(bn): correct the 5 August commissioning date
perf(fonts): drop unreachable weights from the preload set
chore(deps): bump next to 16.3.4
```

Not enforced by a hook. It just makes the history readable.

## What CI will do to your pull request

| Workflow     | What it checks                                                             |
| ------------ | -------------------------------------------------------------------------- |
| `CI`         | Prettier, ESLint, TypeScript, then a build on Node 22 and 24               |
| `Security`   | Dependency review, `npm audit`, gitleaks, live response-header assertion   |
| `CodeQL`     | Static analysis, `security-extended` rule set                              |
| `Lighthouse` | Performance, accessibility, SEO and best-practices budgets on both locales |

Vercel builds a preview deployment at the same time and comments the URL on the
pull request. Review the preview, not just the diff — this is a site where the
diff frequently does not tell you what changed.

Everything above has to be green before a merge, and pull requests need a
review from a code owner (see [`.github/CODEOWNERS`](.github/CODEOWNERS)).

## House rules for the code

Read the "Things worth knowing before you edit" section of the
[README](README.md) first. It is short and it is all load-bearing. In summary:

- **The root layout lives in `[locale]`.** There is no `app/layout.tsx`.
- **Nothing is cropped.** Plates take their true aspect ratio from the recorded
  pixel dimensions. Do not add `object-fit: cover` to an archive plate.
- **Bengali is sized separately.** Look for the `html[lang='bn']` block next to
  a rule rather than adding a global override.
- **Reduced motion is a real code path**, not a CSS afterthought. `Motion.tsx`
  and `ArchiveStrip.tsx` branch on it.
- CSS Modules for component styles; design tokens live in `globals.css`.
- No new runtime dependency without a reason in the pull request description.
  Every one of them ships to a visitor.

## Adding an archive plate

1. Put the file in `public/archive/`.
2. Append an entry to `archive` in `src/content/site.ts` with its **real pixel
   dimensions** — the gallery and the reel both lay out from these, so a wrong
   number produces a crop or a layout shift.
3. Write both `title` and `meta` in English and Bengali. These are not
   decoration: they become the plate's caption, its accessible name, and the
   `ImageObject` description a search engine reads.

The reel picks it up automatically. The four plates in the grid above the reel
are chosen by id in `Archive.tsx`.

## Changing a historical fact

Names, dates, unit designations, medal counts and translations are the point of
the site. A pull request that changes one needs to say **where the fact comes
from** — a book and page, a gazette notification, a newspaper issue, a
photograph caption, or first-hand knowledge stated as such.

If you have a correction but no time for a pull request, open a
[historical correction issue](https://github.com/ijazrushad/blwcf/issues/new?template=content_correction.yml).

## Performance

The performance work in this repository is deliberate and documented. Before
adding something that costs bandwidth or frames:

- **Images** always go through `next/image` with a real `sizes`. A missing
  `sizes` silently ships a far larger variant than the slot needs.
- **Fonts**: seven families is already at the limit. Do not add a weight that
  no rule can select — see the comment at the top of `layout.tsx` for how to
  work out whether a weight is reachable.
- **Animation frames**: never call `getBoundingClientRect()` inside a
  `useAnimationFrame` loop. `ArchiveStrip.tsx` measures on resize and does
  arithmetic per frame, and it is that way for a reason.
- Anything above the fold that fades in from `opacity: 0` may become the
  Largest Contentful Paint element and delay it by the full animation duration.
  `Develop` takes an `eager` prop for exactly this.

## Reporting security problems

Not here. See [SECURITY.md](SECURITY.md).

## Conduct

[Contributor Covenant](CODE_OF_CONDUCT.md). Be decent.
