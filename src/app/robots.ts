import type { MetadataRoute } from 'next';
import { siteUrl } from '@/content/site';

/**
 * The site wants to be found, so everything is open.
 *
 * The AI agents are named individually rather than left to the wildcard on
 * purpose. They divide into two kinds: crawlers that gather pages for model
 * training, and crawlers that fetch a page at the moment someone asks a
 * question so the answer can cite it. The second kind is how an archive like
 * this one gets surfaced in an AI answer at all, so if a future rule ever
 * narrows the wildcard, these lines keep that door open by name.
 *
 * To opt out of model training while staying citable, add a second rule
 * disallowing GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider,
 * Meta-ExternalAgent and Applebot-Extended. That is a decision for the
 * foundation, not a technical default, so nothing is blocked here.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: [
          'OAI-SearchBot',
          'ChatGPT-User',
          'Claude-SearchBot',
          'Claude-User',
          'PerplexityBot',
          'Perplexity-User',
        ],
        allow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
