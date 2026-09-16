# ADR 0819: Canonical Memory Match Integration Gate

## Decision

Use the existing `PairingMemoryMatchGame` and `/memory/[code]` route as the
canonical platform reference. Add a dedicated teacher-facing gate for the
frozen MiniStar Phaser candidate so its evidence is assessed against the live
contracts before any source promotion or wrapper proposal.

## Required evidence

The gate joins candidate profile and frozen provenance with wrapper adapter,
reviewed fixture replay, canonical event replay, target-language audio,
deterministic scoring, mobile/accessibility, and Codex integration decision
records. A missing or blocked lane keeps the candidate blocked.

## Guardrails

- The candidate remains outside active application routes.
- The candidate cannot own payload, audio, scoring, Star Dust, persistence,
  progression, route registration, or assignment state.
- The gate is review-only and cannot authorize an import or app patch.
- Z.ai evidence work is requested only when this gate identifies a concrete
  missing evidence packet; Z.ai does not receive integration authority.

## Verification

Run `npm run verify:memory-match-gate`,
`npm run verify:canonical-games`, web typecheck, and the production build.
The gate must remain visible at `/teacher/game-readiness` and report the
frozen commit `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`.
