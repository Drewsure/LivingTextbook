# ADR 0711: Phaser Candidate Evidence Completeness

## Status

Accepted for controlled Phaser candidate intake.

## Decision

The candidate package verifier must inspect the evidence artifacts themselves,
not only the return manifest and checksums. A Memory Match candidate must prove
fixture shape, canonical event replay, reviewed audio coverage, deterministic
scoring scenarios, accessibility behavior, safe source-manifest paths, and
wrapper boundaries before Codex can consider a wrapper decision.

## Rationale

An intact archive can still conceal non-deterministic behavior, missing audio,
scene-owned scoring, inaccessible controls, or unsafe persistence. Evidence
content is therefore part of the review contract and must be checked before a
candidate can move from isolated source review toward a platform wrapper.

## Boundary

Passing the evidence gate does not import source, replace a route, grant a
student assignment, authorize live telemetry, or permit scene-owned score,
mastery, reward, persistence, or reporting decisions.

## Verification

`npm run verify:phaser-candidate-package-contract` guards the verifier and
review guide. `npm run verify:phaser-candidate-package` validates an actual
isolated return folder when `LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT` is supplied.
