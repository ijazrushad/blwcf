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
 * The same seven families, declared for the Bengali page. See the header of
 * the English twin beside this file for why the two exist and why the only
 * difference between them is `preload`.
 *
 * Only Baloo Da 2 is preloaded: `html[lang='bn']` overrides Instrument Serif
 * onto it for the masked hero word and the h1, making it this page's LCP text.
 *
 * The rest are discovered from the stylesheet when some rendered glyph needs
 * them, which costs a beat and saves the speculative fetch:
 *
 *   Hind Siliguri   the body face via `html[lang='bn'] body`, 136 KB
 *   Inter Tight     unreachable here. `globals.css` sets it on `body` and the
 *                   `html[lang='bn'] body` rule directly below replaces it.
 *                   Nothing else in the codebase names the variable, so it is
 *                   declared only to keep that first declaration valid — 44 KB
 *                   that is now never fetched at all on this page.
 *   JetBrains Mono  nearly all of the mono rules carry an `html[lang='bn']`
 *                   override onto Hind Siliguri
 *   Instrument      the same, plus lightbox titles that need a click first
 *   Caveat          overridden onto Hind Siliguri on this page
 *   Noto Serif      the verse, near the bottom of the page
 */

const instrument = Instrument_Serif({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
  preload: false,
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
