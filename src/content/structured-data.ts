import { archive, brand, footer, locales, siteUrl, type Locale } from './site';

/**
 * Schema.org description of the site, emitted as JSON-LD in the document head.
 *
 * This is the part of the page a search engine or an AI answer engine can read
 * without having to interpret the layout. Everything below is derived from
 * `site.ts` — nothing is asserted here that the page does not already say, and
 * nothing is invented to look impressive. A wrong claim in structured data is
 * worse than no structured data at all.
 *
 * Three things are described:
 *
 *   Organization    who publishes this
 *   WebSite         the site itself, in both languages
 *   CollectionPage  the page, and the photographs on it, so that the scans can
 *                   surface in image search with their captions attached
 */

const ORGANIZATION_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;

function organization(locale: Locale) {
  const other = locale === 'en' ? 'bn' : 'en';

  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: brand.full[locale],
    alternateName: [brand.full[other], brand.short.en],
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      width: 500,
      height: 500,
    },
    slogan: brand.motto[locale],
    description: footer.blurb[locale],
  };
}

function website(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: siteUrl,
    name: brand.full[locale],
    inLanguage: [...locales],
    publisher: { '@id': ORGANIZATION_ID },
  };
}

function collectionPage(locale: Locale, title: string, description: string) {
  return {
    '@type': 'CollectionPage',
    '@id': `${siteUrl}/${locale}#page`,
    url: `${siteUrl}/${locale}`,
    name: title,
    description,
    inLanguage: locale,
    isPartOf: { '@id': WEBSITE_ID },
    about: {
      '@type': 'Event',
      name: 'Bangladesh Liberation War',
      startDate: '1971-03-26',
      endDate: '1971-12-16',
    },
    /*
     * Every scan, with the caption the page shows beside it. This is what lets
     * a search engine offer the photographs themselves as results rather than
     * only the page they sit on.
     */
    hasPart: archive.map((item) => ({
      '@type': 'ImageObject',
      '@id': `${siteUrl}/${locale}#${item.id}`,
      contentUrl: `${siteUrl}${item.src}`,
      width: item.width,
      height: item.height,
      name: item.title[locale],
      caption: `${item.title[locale]} · ${item.meta[locale]}`,
      creditText: brand.full[locale],
      isPartOf: { '@id': `${siteUrl}/${locale}#page` },
    })),
  };
}

export function structuredData(
  locale: Locale,
  page: { title: string; description: string }
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(locale),
      website(locale),
      collectionPage(locale, page.title, page.description),
    ],
  };
}

/**
 * JSON-LD is injected as raw HTML, so the one sequence that could break out of
 * a <script> block is neutralised. There is no user input on this site, but a
 * caption is content and content changes.
 */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
