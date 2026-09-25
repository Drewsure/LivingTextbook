# ADR 1221: Foundation Filesystem Verifier Coverage

**Status:** Accepted  
**Date:** 2026-09-25

## Context

The durable database custody policy has focused tests for normalized paths and
real filesystem containment. The foundation gate must execute those tests, not
only inspect their source text, or a future regression could leave the broad
gate green while the actual junction/symlink behavior is broken.

## Decision

`verify-foundation-composition.mjs` executes
`verify-durable-progression-database-path.mjs` before the durable operations
contract check. The focused verifier remains deterministic, temporary-data
only, and side-effect free after cleanup.

## Consequences

- The foundation gate covers the real custody-boundary behavior.
- The verifier may report a host capability skip for junction creation, while
  lexical and existing-root checks remain mandatory.
- No production database or learner data is touched by the test.

## Verification

Run `npm run verify:foundation-composition` and the full `npm run
verify:foundation` gate.
