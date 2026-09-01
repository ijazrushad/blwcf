import type { MetadataRoute } from 'next';
import { defaultLocale, locales, siteUrl } from '@/content/site';

/**
 * Two URLs, one per language, each declaring the other as its alternate.
 *
 * The pages are prerendered, so `lastModified` is the build time — which for a
 * site with no runtime content is also the last time anything on the page
 * could have changed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const languages = Object.fromEntries([
    ...locales.map((locale) => [locale, `${siteUrl}/${locale}`]),
    ['x-default', `${siteUrl}/${defaultLocale}`],
  ]);

  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: locale === defaultLocale ? 1 : 0.9,
    alternates: { languages },
  }));
}
