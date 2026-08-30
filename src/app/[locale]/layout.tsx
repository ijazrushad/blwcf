import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import {
  Instrument_Serif,
  Inter_Tight,
  JetBrains_Mono,
  Caveat,
  Baloo_Da_2,
  Hind_Siliguri,
  Noto_Serif_Bengali,
} from 'next/font/google';
import {
  brand,
  defaultLocale,
  locales,
  siteUrl,
  type Locale,
} from '@/content/site';
import { serializeJsonLd, structuredData } from '@/content/structured-data';
import '../globals.css';

/*
 * Seven families is a lot of preloaded weight for one page, so each one below
 * asks for the narrowest set that the stylesheets can actually select.
 *
 * Two rules govern what stays. A weight is reachable if some rule declares it,
 * or if `b`/`h1`-`h6` fall back onto it — those ask for 700, and CSS font
 * matching then picks the nearest weight the family shipped. Weight 500 is
 * unreachable in Inter Tight and Hind Siliguri (nothing declares it, and 600
 * is nearer to 700), so it is gone; JetBrains Mono keeps its 500 precisely
 * because that is what its `<b>` resolves to.
 *
 * `preload: false` is for families that only appear well below the fold. They
 * still load, just without competing for bandwidth with the hero.
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
});

const mono = JetBrains_Mono({
  /* 500 is what `<b>` inside a mono rule resolves to — it has to stay */
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const caveat = Caveat({
  weight: ['500'],
  subsets: ['latin'],
  /* stays preloaded: the handwritten place-name under the hero plate is
     above the fold, and this is a single small Latin file */
  variable: '--font-caveat',
  display: 'swap',
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
});

const notoBengali = Noto_Serif_Bengali({
  /* the verse sets 300 and nothing else uses this family */
  weight: ['300'],
  subsets: ['bengali'],
  variable: '--font-noto-bengali',
  display: 'swap',
  /* the verse sits near the bottom of the page */
  preload: false,
});

const fontVars = [
  instrument.variable,
  interTight.variable,
  mono.variable,
  caveat.variable,
  baloo.variable,
  hind.variable,
  notoBengali.variable,
].join(' ');

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * What the page says about itself when it is not being looked at: search
 * results, a shared link, an AI answer that cites it. Kept next to the
 * structured data in `generateMetadata` so the two can never drift apart.
 */
const page = {
  en: {
    title: 'Bangladesh Liberation War Courses Foundation',
    description:
      'The 1st and 2nd Bangladesh War Courses, 1971–1972. Sixty-one guerrilla cadets commissioned at Murti on 9 October 1971, and the forty-six who followed.',
    social:
      'Those Magnificent 61 of ’71 — the officer courses of the Bangladesh Liberation War.',
    cardAlt:
      'Acting President Syed Nazrul Islam inspecting the guard of honour of the first batch of newly commissioned officers of the Mukti Bahini, Murti, 9 October 1971.',
  },
  bn: {
    title: 'বাংলাদেশ লিবারেশন ওয়ার কোর্সেস ফাউন্ডেশন',
    description:
      '১ম ও ২য় বাংলাদেশ ওয়ার কোর্স, ১৯৭১–১৯৭২। ১৯৭১ সালের ৯ অক্টোবর মুর্তিতে কমিশনপ্রাপ্ত ৬১ জন গেরিলা ক্যাডেট।',
    social: 'একাত্তরের সেই ৬১ বীর',
    cardAlt:
      'অস্থায়ী রাষ্ট্রপতি সৈয়দ নজরুল ইসলাম মুক্তিবাহিনীর সদ্য কমিশনপ্রাপ্ত প্রথম দলের গার্ড অব অনার পরিদর্শন করছেন। মুর্তি, ৯ অক্টোবর ১৯৭১।',
  },
} satisfies Record<
  Locale,
  { title: string; description: string; social: string; cardAlt: string }
>;

/**
 * The social card is a plain file in `public/` referenced by hand rather than
 * an `opengraph-image` convention file. Inside a dynamic `[locale]` segment
 * that convention cannot resolve the segment into the absolute URL it emits,
 * and produces `/-/opengraph-image.jpg` — a link to nothing.
 */
const socialCard = {
  url: '/social-card.jpg',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const copy = page[l];

  return {
    metadataBase: new URL(siteUrl),
    title: copy.title,
    description: copy.description,
    applicationName: brand.short.en,
    publisher: brand.full[l],
    alternates: {
      canonical: `/${l}`,
      languages: {
        en: '/en',
        bn: '/bn',
        /* which version to offer a visitor whose language matches neither */
        'x-default': `/${defaultLocale}`,
      },
    },
    /*
     * max-image-preview:large is the one that matters here. Without it Google
     * shows a thumbnail; with it the scans can appear full width in Images and
     * Discover, which for an archive is most of the point.
     */
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/${l}`,
      siteName: brand.full[l],
      locale: l === 'bn' ? 'bn_BD' : 'en_US',
      alternateLocale: l === 'bn' ? 'en_US' : 'bn_BD',
      title: copy.title,
      description: copy.social,
      images: [{ ...socialCard, alt: copy.cardAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.social,
      images: [{ ...socialCard, alt: copy.cardAlt }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#efe9dc',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;

  return (
    <html lang={l} className={fontVars} data-scroll-behavior="smooth">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(structuredData(l, page[l])),
          }}
        />
      </body>
    </html>
  );
}
