# DR-484: Prototype Review Readiness Verifier

Date: 2026-08-21

## Decision

Add `npm run verify:prototype-review` as a focused foundation guard for tenant prototype review routes, generator cross-links, game-readiness prototype links, and blocked prototype integration behavior.

## Rationale

The user is continuing substantial Z.ai work outside this repository, but Codex must control the moment when outside game work becomes eligible for integration. A cheap source-based verifier lets us protect that boundary without spending local build time or enabling imports.

## Implementation

- Added `scripts/verify-prototype-review-readiness.mjs`.
- Added `verify:prototype-review` to `package.json`.
- Included the command in `verify:foundation`.
- Exposed `Prototype review readiness` on the teacher foundation gate.
- Added focused verification documentation.

## Guardrails

- The verifier does not import prototypes, create routes, approve Phaser wrappers, mutate scoring, write audio manifests, publish packages, or assign student work.
- Z.ai/Phaser work remains external until Codex integration evidence passes.

