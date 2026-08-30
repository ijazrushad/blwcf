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
import { locales, type Locale } from '@/content/site';
import '../globals.css';

const instrument = Instrument_Serif({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

const interTight = Inter_Tight({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const mono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const caveat = Caveat({
  weight: ['500'],
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

const baloo = Baloo_Da_2({
  weight: ['600', '700', '800'],
  subsets: ['bengali', 'latin'],
  variable: '--font-baloo',
  display: 'swap',
});

const hind = Hind_Siliguri({
  weight: ['300', '400', '500', '600'],
  subsets: ['bengali', 'latin'],
  variable: '--font-hind',
  display: 'swap',
});

const notoBengali = Noto_Serif_Bengali({
  weight: ['200', '300', '400'],
  subsets: ['bengali'],
  variable: '--font-noto-bengali',
  display: 'swap',
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const bn = locale === 'bn';

  return {
    metadataBase: new URL('https://blwcf.org'),
    title: bn
      ? 'বাংলাদেশ লিবারেশন ওয়ার কোর্সেস ফাউন্ডেশন'
      : 'Bangladesh Liberation War Courses Foundation',
    description: bn
      ? '১ম ও ২য় বাংলাদেশ ওয়ার কোর্স, ১৯৭১–১৯৭২। ১৯৭১ সালের ৯ অক্টোবর মুর্তিতে কমিশনপ্রাপ্ত ৬১ জন গেরিলা ক্যাডেট।'
      : 'The 1st and 2nd Bangladesh War Courses, 1971–1972. Sixty-one guerrilla cadets commissioned at Murti on 9 October 1971, and the forty-six who followed.',
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', bn: '/bn' },
    },
    openGraph: {
      type: 'website',
      locale: bn ? 'bn_BD' : 'en_US',
      title: bn
        ? 'বাংলাদেশ লিবারেশন ওয়ার কোর্সেস ফাউন্ডেশন'
        : 'Bangladesh Liberation War Courses Foundation',
      description: bn
        ? 'একাত্তরের সেই ৬১ বীর'
        : 'Those Magnificent 61 of ’71 — the officer courses of the Bangladesh Liberation War.',
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

  return (
    <html lang={locale} className={fontVars} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
