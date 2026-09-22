# ADR 0955: Human External Evidence Handoff

Status: Accepted

## Context

The frozen Phaser source is now hash-verified and mapped to a complete
eligibility record. The platform needs a safe point at which a human may ask
Z.ai for a return packet without confusing that request with integration
approval.

## Decision

Bind the Memory Match evidence-only handoff to the candidate eligibility id
and its complete required evidence-lane list. Keep the packet human-triggered,
review-only, and integration-blocked.

## Consequences

- Z.ai can receive a precise, repository-scoped evidence request.
- A returned package can be checked against the exact frozen candidate and
  canonical game contract.
- No outside builder can create app routes, scoring, persistence, promotion,
  or student assignment authority through the handoff.

## Verification

- `npm run verify:phaser-source-evidence`
- `node scripts/verify-memory-match-evidence-handoff.mjs`
- `npm run verify:foundation-composition`
