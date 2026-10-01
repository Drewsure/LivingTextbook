# ADR 1415: Saleability Audits Require A Source-Bound Production Build

- **Status:** Accepted
- **Date:** 2026-10-01

## Context

An existing Next `.next/BUILD_ID` proves only that some production build once
completed. It does not prove that the current source revision was built. A
stale artifact could therefore make the pilot audit look healthier than the
code being reviewed.

## Decision

The web workspace writes `apps/web/.next/living-textbook-build-proof.json`
only after a successful webpack production build. The proof records the build
ID, current source revision, timestamp, and build command. The saleability
audit accepts the production-build gate only when that proof matches the
current source revision and build ID.

## Consequences

- A commit after the last build is visibly blocked until rebuilt.
- The audit remains fast after a verified build and does not silently rebuild
  the application itself.
- Local and hosted build environments can provide the source revision through
  the standard CI revision variables when Git metadata is unavailable.

See `docs/decision-register/DR-1415-source-bound-production-build-proof.md`.
