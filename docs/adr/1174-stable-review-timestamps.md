# ADR 1174: Stable Review Timestamps

## Status

Accepted

## Context

Review panels are rendered through the Next.js server and then hydrated in the
teacher's browser. Browser-local date formatting can produce different strings
for the same evidence, particularly across school time zones and runtime
locales. That creates hydration warnings and weakens the readability of audit
packets.

## Decision

Use one deterministic UTC formatter for teacher evidence, browser adjudication,
privacy/tenant review, and teacher operations-access timestamps. Keep learner
content localization independent from these audit labels.

## Consequences

Review evidence is stable across SSR, browser, screenshots, and exported
packets. Teachers see an explicit UTC suffix and can apply their local school
time separately when needed. No scoring, progression, persistence, or release
permission changes.

## Verification

`npm run verify:review-keys` checks the governed surfaces and formatter tokens;
the normal typecheck, build, and preview-route gates remain required.
