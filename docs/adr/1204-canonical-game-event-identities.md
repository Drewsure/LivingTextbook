# ADR 1204: Canonical Game Event Identity Boundaries

**Status:** Accepted  
**Date:** 2026-09-25

## Context

Canonical game events are the shared boundary for game completion, audio
evidence, deterministic scoring, progression, reporting, and persistence. The
sequence validator already checked that unit, launch, and student-session
identities were present and consistent, but presence alone allowed malformed
or path-like identifiers to reach downstream boundaries.

## Decision

Require every canonical game event to use bounded safe identities. Unit keys
may contain the namespaced separators already used by publisher content, while
launch codes and student-session identifiers use a narrower portable shape.
Blank, oversized, path-like, or control-character identities are rejected
before sequence validity can be accepted.

## Consequences

- Tenant, route, learner-session, report, and persistence joins receive
  portable identity values.
- Existing namespaced unit keys remain compatible with white-label content.
- This changes validation only; it does not enable persistence, telemetry,
  rewards, assignments, route promotion, or external Z.ai source import.
- Returned Phaser candidates remain review-only and must still pass their
  separate evidence-package gate.

## Verification

- Canonical integration marker verification covers all three rejection paths.
- Runtime behavior covers unsafe unit, launch, and student-session identities.
- Canonical game, replay, AI-service, web typecheck, production build, and
  89-route preview checks pass.
