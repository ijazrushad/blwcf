# Security policy

## Reporting a vulnerability

Please **do not open a public issue**.

Report privately through GitHub:
[**Report a vulnerability**](https://github.com/ijazrushad/blwcf/security/advisories/new).

Tell us what you found, how to reproduce it, and what an attacker could do with
it. You will get an acknowledgement within **72 hours** and an assessment within
**7 days**. If the report is valid we will fix it, publish an advisory, and
credit you unless you would rather we did not.

## Supported versions

Only the currently deployed `main` branch is supported. There are no released
versions to patch backwards.

## What this site is, in security terms

It helps to know what the attack surface actually is, because it is unusually
small:

- Every page is **prerendered to static HTML at build time**. There is no
  server-side rendering per request, no API route, no server action.
- There is **no user input anywhere** — no form, no search, no comment, no
  login, no session, no cookie.
- There is **no database**, no backend service and no environment variable.
- There is **no third-party script** — no analytics, no tag manager, no embed.
- Fonts are **self-hosted at build time** by `next/font`, so the browser makes
  no request to Google or any other origin.

What remains worth reporting: dependency vulnerabilities that reach the client
bundle, a response header that is missing or weaker than it should be, a way to
get script to execute in the page, and anything that lets the site be framed or
impersonated.

## Response headers

Set in [`next.config.ts`](./next.config.ts) and asserted on every run of the
`Security` workflow against a real server, so they cannot silently regress:

| Header                       | Value                                                 |
| ---------------------------- | ----------------------------------------------------- |
| `Content-Security-Policy`    | `default-src 'self'`, everything locked to the origin |
| `Strict-Transport-Security`  | `max-age=63072000; includeSubDomains; preload`        |
| `X-Content-Type-Options`     | `nosniff`                                             |
| `X-Frame-Options`            | `DENY` (with `frame-ancestors 'none'` in the CSP)     |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`                     |
| `Permissions-Policy`         | camera, microphone, geolocation and the rest denied   |
| `Cross-Origin-Opener-Policy` | `same-origin`                                         |
| `X-Powered-By`               | not sent — `poweredByHeader` is off                   |

### The one deliberate weakness

`script-src` includes `'unsafe-inline'`.

Next.js streams the React Server Component payload to the browser as inline
`self.__next_f.push(...)` scripts. Noncing them requires middleware that stamps
a fresh nonce per request, which makes every page dynamic and throws away the
fully prerendered HTML the whole site is built on — trading a real, measurable
loss for a theoretical gain on a page with no injection vector.

This is worth revisiting if the site ever gains user input, a third-party
script, or a route that renders per request. Until then it is a considered
trade, not an oversight.

## Automated checks

| Check                        | Runs on                | Blocks a merge    |
| ---------------------------- | ---------------------- | ----------------- |
| CodeQL (`security-extended`) | push, PR, weekly       | yes               |
| Dependency review            | PR                     | yes, ≥ moderate   |
| `npm audit` (runtime deps)   | push, PR, weekly       | yes, any severity |
| `npm audit` (full tree)      | push, PR, weekly       | yes, ≥ high       |
| Gitleaks secret scan         | push, PR, weekly       | yes               |
| Response header assertion    | push, PR, weekly       | yes               |
| OpenSSF Scorecard            | push to `main`, weekly | no, reports       |

Dependabot opens grouped update pull requests every Monday for npm packages and
GitHub Actions.
