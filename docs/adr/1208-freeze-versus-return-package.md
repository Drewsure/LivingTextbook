# ADR 1208: Freeze Does Not Satisfy Candidate Return

**Status:** Accepted  
**Date:** 2026-09-25

## Context

The Z.ai Memory Match source freeze proves that a known repository state can be
identified and reproduced. It does not prove compatibility with the
LivingTextBook parent-engine, audio, scoring, accessibility, privacy, tenant,
or wrapper contracts.

## Decision

Treat the frozen snapshot and the returned candidate evidence package as two
separate gates. Candidate review begins only after an isolated package contains
`evidence/return-package.json`, eight reviewed artifacts, and passes the
canonical package verifier.

## Consequences

- A frozen ZIP cannot be copied, executed, routed, or assigned as a game.
- The human-side Z.ai handoff remains explicit and reproducible.
- A passing package check starts review only; Codex still owns the integration
  decision and promotion blockers.

## Verification

The foundation intake gate, human handoff guide, package verifier, contract
test, and behavior test all preserve this separation.
