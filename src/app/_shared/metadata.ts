import type { Metadata, Viewport } from 'next';
import { brand, defaultLocale, siteUrl, type Locale } from '@/content/site';

/**
 * What the page says about itself when it is not being looked at: search
 * results, a shared link, an AI answer that cites it. Kept next to the
 * structured data this file feeds so the two can never drift apart.
 */
export const pageCopy = {
  en: {
    title: 'Bangladesh Liberation War Courses Foundation',
    description:
      'The 1st and 2nd Bangladesh War Courses, 1971–1972. Sixty-one guerrilla cadets commissioned at Murti on 9 October 1971, and the forty-six who followed.',
    social:
      'Those Magnificent 61 of ’71 — the officer courses of the Bangladesh Liberation War.',
    cardAlt:
      'Those Magnificent 61 of Seventy-One — Acting President Syed Nazrul Islam inspects the guard of honour at Murti, 9 October 1971. Bangladesh Liberation War Courses Foundation.',
  },
  bn: {
    title: 'বাংলাদেশ লিবারেশন ওয়ার কোর্সেস ফাউন্ডেশন',
    description:
      '১ম ও ২য় বাংলাদেশ ওয়ার কোর্স, ১৯৭১–১৯৭২। ১৯৭১ সালের ৯ অক্টোবর মুর্তিতে কমিশনপ্রাপ্ত ৬১ জন গেরিলা ক্যাডেট।',
    social:
      'একাত্তরের সেই ৬১ বীর — মুক্তিযুদ্ধের ১ম ও ২য় বাংলাদেশ ওয়ার কোর্স।',
    cardAlt:
      'একাত্তরের সেই ৬১ বীর — অস্থায়ী রাষ্ট্রপতি সৈয়দ নজরুল ইসলাম মুর্তিতে গার্ড অব অনার পরিদর্শন করছেন, ৯ অক্টোবর ১৯৭১। বাংলাদেশ লিবারেশন ওয়ার কোর্সেস ফাউন্ডেশন।',
  },
} satisfies Record<
  Locale,
  { title: string; description: string; social: string; cardAlt: string }
>;

/**
 * The social card is a plain file in `public/` referenced by hand rather than
 * an `opengraph-image` convention file. The convention emits an absolute URL
 * built from the segment it sits in, and pointing every locale at one shared
 * card is both what we want and simpler to keep correct by hand.
 */
const socialCard = {
  url: '/social-card.jpg',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
} as const;

export function buildMetadata(l: Locale): Metadata {
  const copy = pageCopy[l];
  const pageUrl = `${siteUrl}/${l}`;
  const cardUrl = `${siteUrl}${socialCard.url}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: copy.title,
      template: `%s · ${brand.short.en}`,
    },
    description: copy.description,
    applicationName: brand.short.en,
    authors: [{ name: brand.full.en, url: siteUrl }],
    creator: brand.full.en,
    publisher: brand.full[l],
    category: 'history',
    keywords: [
      'Bangladesh Liberation War',
      'Mukti Bahini',
      'BLWCF',
      'Murti',
      '1st Bangladesh War Course',
      '2nd Bangladesh War Course',
      '1971',
    ],
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
    /*
     * The tab icon is NOT declared here. It comes from src/app/favicon.ico,
     * which Next emits by convention as image/x-icon on a hashed URL.
     *
     * Declaring it here as well is what broke the favicon. `public/` is served
     * ahead of the generated routes, so the copies that used to sit there
     * shadowed the real ones — and public/favicon.ico was a PNG carrying an
     * .ico extension, which is why browsers fell back to a blank page icon
     * instead of showing the seal. Those copies are deleted; do not restore
     * them. The old entry here also typed favicon.ico as image/png.
     *
     * `apple` does have to stay. Setting `icons` at all suppresses the
     * apple-icon.png convention link, and iOS probes /apple-touch-icon.png
     * rather than the /apple-icon.png this project generates — so without the
     * line below the home-screen icon is simply never found.
     */
    icons: {
      icon: [{ url: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    openGraph: {
      type: 'website',
      url: pageUrl,
      siteName: brand.full[l],
      locale: l === 'bn' ? 'bn_BD' : 'en_US',
      alternateLocale: l === 'bn' ? 'en_US' : 'bn_BD',
      title: copy.title,
      description: copy.social,
      images: [
        {
          url: cardUrl,
          secureUrl: cardUrl,
          width: socialCard.width,
          height: socialCard.height,
          type: socialCard.type,
          alt: copy.cardAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.social,
      images: [
        {
          url: cardUrl,
          width: socialCard.width,
          height: socialCard.height,
          alt: copy.cardAlt,
        },
      ],
    },
    other: {
      'og:image:alt': copy.cardAlt,
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#efe9dc',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};
