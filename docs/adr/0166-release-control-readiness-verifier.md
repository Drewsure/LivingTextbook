# ADR 0166: Release Control Readiness Verifier

## Status

Accepted

## Context

The first partner pilot path depends on a clear distinction between demo-visible and pilot-publishable. Package publish gates, approval ledgers, and release candidate summaries must remain aligned as the build grows.

## Decision

Add `npm run verify:release-control` and include it in `npm run verify:foundation`.

## Consequences

- Release-control regressions are caught before typecheck/build.
- Pilot readiness remains derived from release-blocking gates and required approvals.
- `/teacher/intake` exposes release-control readiness in the foundation gate.
- The verifier protects against accidental production-publish language while blockers remain open.
