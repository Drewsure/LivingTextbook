# DR-1082: Web Security Header Baseline

Status: Implemented; the web app has a conservative tenant-compatible header
baseline.

Decision: Protect MIME handling, referrer leakage, framing, and browser
capabilities globally while allowing microphone access only to the app origin.

Guardrails: Camera and geolocation remain disabled. Cross-origin embedding is
not enabled in v1. A future CSP must be derived from reviewed tenant media/CDN
origins rather than copied into the config as a one-size-fits-all policy.

Evidence: `apps/web/next.config.ts`,
`scripts/verify-web-security-headers.mjs`, and
`docs/adr/1082-web-security-header-baseline.md`.

