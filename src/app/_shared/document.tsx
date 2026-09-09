import { serializeJsonLd, structuredData } from '@/content/structured-data';
import type { Locale } from '@/content/site';
import { pageCopy } from './metadata';
import '../globals.css';

/**
 * The document shell, shared by the two root layouts.
 *
 * There is no `app/layout.tsx`: `/en` and `/bn` are each the top of their own
 * tree, so each supplies its own `<html>`. That is what lets the two preload
 * different fonts — the font CSS is imported by the layout, and layouts in
 * separate trees get separate CSS chunks. Everything else about the two
 * documents is identical, and lives here so it stays that way.
 */
export default function SiteDocument({
  locale,
  fontVars,
  children,
}: {
  locale: Locale;
  fontVars: string;
  children: React.ReactNode;
}) {
  return (
    <html lang={locale} className={fontVars} data-scroll-behavior="smooth">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(structuredData(locale, pageCopy[locale])),
          }}
        />
      </body>
    </html>
  );
}
