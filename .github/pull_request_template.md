## What this changes

<!-- One or two sentences. If it closes an issue, write "Closes #123". -->

## Why

<!-- What problem this solves. For historical content, cite where the fact
     comes from — a book, a gazette notification, a photograph caption. -->

## Type of change

- [ ] Content — copy, translation, a new archive plate, a corrected fact
- [ ] Design — layout, type, motion
- [ ] Code — components, configuration, tooling
- [ ] Infrastructure — CI, security headers, dependencies

## Checks I ran

- [ ] `npm run verify` passes locally (format, lint, types, build)
- [ ] Checked **both** `/en` and `/bn` in the browser
- [ ] Checked at a narrow width (≤ 700px) as well as desktop
- [ ] Checked with "reduce motion" enabled if this touches animation

## If this adds or replaces an archive scan

- [ ] The file is in `public/archive/`
- [ ] Its real pixel `width`/`height` are recorded in `src/content/site.ts`
- [ ] `document: true` is set if it carries small print that has to stay readable
- [ ] Nothing about the plate is cropped

## Screenshots

<!-- Before and after, for anything visual. Both languages if the type changed. -->
