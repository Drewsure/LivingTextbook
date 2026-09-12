# ADR 0646: Canonical Game Launch Identity

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

At canonical game completion, the shared validator must confirm that every
learning event belongs to the exact unit, launch code, and student session that
opened the game. Missing optional identity fields are invalid for a canonical
playable-game stream.

## Rationale

Tenant identity prevents cross-publisher contamination, while launch identity
prevents cross-session contamination. Both are required for trustworthy teacher
progress summaries and for a future persistence adapter to safely deduplicate
or replay evidence.

## Boundaries

- The route shell supplies identity from the platform-owned launch session and
  student progression state.
- Game views and external wrappers cannot invent, replace, or omit identity.
- Validation rejects mismatches; it does not repair them or write state.
- Frozen Z.ai/Phaser source remains review-only until it satisfies the full
  tenant, score, and launch-identity contract.
