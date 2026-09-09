import {
  Instrument_Serif,
  Inter_Tight,
  JetBrains_Mono,
  Caveat,
  Baloo_Da_2,
  Hind_Siliguri,
  Noto_Serif_Bengali,
} from 'next/font/google';

/**
 * The seven families, declared for the English page.
 *
 * All seven have to be declared here even though the English page draws only
 * some of them: the stylesheets are shared between both languages, and every
 * `--font-*` variable they reference has to resolve. What differs between this
 * file and its Bengali twin is only `preload`.
 *
 * `preload` emits a `<link rel="preload" as="font">`: a speculative,
 * high-priority fetch issued before the browser knows whether the page draws a
 * single glyph in that family. Dropping the flag does not stop a family
 * loading — the browser still fetches it off the stylesheet the moment some
 * rendered text needs a glyph in its unicode-range. It only stops the guess.
 *
 * Only one family is preloaded here: Instrument Serif, which sets the masked
 * hero word and the h1 and is therefore the LCP text candidate on this page.
 *
 * Everything else is discovered from the CSS a beat later, which for this site
 * is the better trade — the four families below were 329 KB of speculative
 * fetch competing with the hero photograph, and the Bengali pair among them
 * draws nothing on the English page but a watermark at opacity 0.1 and one
 * button:
 *
 *   Inter Tight       the body face, 44 KB
 *   JetBrains Mono    the motto, hero meta and nav links, 31 KB
 *   Caveat            one handwritten line under the hero plate, 50 KB
 *   Baloo Da 2        the Bengali watermark and the margin marks, 120 KB
 *   Hind Siliguri     136 KB, and the only rule on this page outside an
 *                     `html[lang='bn']` block that reaches it is `.langbtn`,
 *                     the one-word switch to Bengali
 *   Noto Serif        the verse, near the bottom of the page
 *
 * Two things make that safe. Every family sets `display: 'swap'`, so text
 * paints in the fallback immediately rather than hiding. And next/font keeps
 * its metric-adjusted fallback face regardless of `preload`, so the swap does
 * not move the line — which is what the CLS budget in .lighthouserc.json is
 * protecting.
 */

const instrument = Instrument_Serif({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

const interTight = Inter_Tight({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
  preload: false,
});

const mono = JetBrains_Mono({
  /* 500 is what `<b>` inside a mono rule resolves to — it has to stay */
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
});

const caveat = Caveat({
  weight: ['500'],
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
  preload: false,
});

const baloo = Baloo_Da_2({
  weight: ['700', '800'],
  subsets: ['bengali', 'latin'],
  variable: '--font-baloo',
  display: 'swap',
  preload: false,
});

const hind = Hind_Siliguri({
  weight: ['300', '400', '600'],
  subsets: ['bengali', 'latin'],
  variable: '--font-hind',
  display: 'swap',
  preload: false,
});

const notoBengali = Noto_Serif_Bengali({
  /* the verse sets 300 and nothing else uses this family */
  weight: ['300'],
  subsets: ['bengali'],
  variable: '--font-noto-bengali',
  display: 'swap',
  preload: false,
});

export const fontVars = [
  instrument.variable,
  interTight.variable,
  mono.variable,
  caveat.variable,
  baloo.variable,
  hind.variable,
  notoBengali.variable,
].join(' ');
