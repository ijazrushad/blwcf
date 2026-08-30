import Link from 'next/link';

/**
 * The root layout lives inside [locale], so a not-found at the top level has
 * no layout above it and must supply its own document shell.
 */
export default function NotFound() {
  return (
    <html lang="en">
      {/* React hoists these into <head>; this shell has no layout to do it. */}
      <title>Not found — Bangladesh Liberation War Courses Foundation</title>
      <meta name="robots" content="noindex, follow" />
      <body
        style={{
          background: '#efe9dc',
          color: '#17150f',
          fontFamily: 'system-ui, sans-serif',
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          margin: 0,
          padding: 24,
          textAlign: 'center',
        }}
      >
        <div>
          <p
            style={{
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              fontSize: 11,
              color: '#c8102e',
            }}
          >
            404
          </p>
          <h1 style={{ fontSize: 34, fontWeight: 400, margin: '14px 0 20px' }}>
            This page is not in the archive.
          </h1>
          <Link href="/en" style={{ color: '#0e4a33' }}>
            Return to the foundation
          </Link>
        </div>
      </body>
    </html>
  );
}
