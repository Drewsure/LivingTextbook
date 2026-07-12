# ADR 0149: Local Bundle Readiness Verifier

## Status

Accepted

## Context

The white-label platform must support hosted PWA pilots and closed local textbook companions. A local companion is commercially valuable, but it carries extra responsibility: media rights, checksums, installer/update behavior, QR fallback, local reporting, backup/restore, and school privacy policy must be clear before handoff.

## Decision

Add `npm run verify:local-bundle` and include it in `npm run verify:foundation`.

## Consequences

- The verifier checks that local bundle manifests remain present for MiniStar and the sample publisher.
- The verifier checks that active local game modes stay represented in the local bundle plan.
- The verifier checks that package artifacts include content package, QR registry, game routes, report policy, and checksum expectations.
- The verifier blocks any accidental claim of offline readiness while media rights, checksums, deployment preflight, or release gates remain unresolved.
- The verifier preserves optional AI Tutor policy by requiring local bundle AI Tutor to default off.
- Local/closed deployment remains a first-class product path without being prematurely sold as production-ready.
