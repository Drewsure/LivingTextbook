# ADR-0628: Progression Runtime Strict Flags

Status: Accepted

## Decision

The progression runtime boundary must validate policy, persistence, reporting,
deterministic-reward, and target-language evidence fields as actual booleans.

## Required behavior

- Progression policy, persistence, report runtime, reward policy, and target-language
  evidence fields must be booleans.
- Stringified values must produce deterministic validation errors and must not control
  mastery, score, Star Dust, game unlock, or event-authority branches.
- Support-language and report-only events remain excluded from progression authority;
  target-language evidence remains required for progress-affecting events.

## Guardrails

This is a review-only boundary. It does not mutate mastery, scores, Star Dust, rewards,
game unlocks, learner progress, or student records, and it does not enable Z.ai/game integration.

## Verification

Run `npm run verify:progression-runtime`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation`.
