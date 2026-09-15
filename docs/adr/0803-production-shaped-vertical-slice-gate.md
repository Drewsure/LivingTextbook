# ADR 0803: Production-Shaped Vertical Slice Gate

- Status: accepted
- Date: 2026-09-15
- Decision owners: Living Textbook architecture

## Context

The platform has broad foundation coverage across content, audio, games,
progression, teacher evidence, local delivery, and white-label policy. Those
areas were previously verified by separate checks. A production-shaped slice
needs one auditable proof that they connect for a real tenant package and a
second white-label tenant without turning preview data into live persistence.

## Decision

The first release-shaped vertical slice must prove this path:

1. A teacher content package resolves for MiniStar and a second tenant.
2. A permanent QR/front-door route resolves to student entry practice.
3. Reviewed target-language audio is available with safe speech fallback.
4. Flashcard entry completion unlocks Memory Match and a canonical game.
5. Canonical games emit deterministic scoring, mastery, progression, and reward
   evidence through shared contracts.
6. The teacher route can display the resulting evidence in preview-safe form.
7. Hosted-first and local-first media/report boundaries are explicit.
8. Frozen Z.ai/Phaser source remains isolated until a later promotion review.

`npm run verify:vertical-slice` is the source-level gate for this proof and is
run before the broader `npm run verify:foundation` suite.

## Consequences

- The platform can demonstrate a coherent white-label product shape before
  enabling live storage, export, or broad game promotion.
- A second tenant is part of the proof, reducing the risk of MiniStar-only
  hard-coding.
- The teacher report is honest about its current preview/evidence boundary.
- Future backend work has a concrete contract to persist rather than inventing
  a parallel event model.
- The gate is intentionally stricter than a route smoke test and intentionally
  narrower than full production readiness.

## Verification

```text
npm run verify:vertical-slice
npm run verify:canonical-games
npm run verify:foundation
```
