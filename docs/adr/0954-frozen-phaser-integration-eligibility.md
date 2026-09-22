# ADR 0954: Frozen Phaser Integration Eligibility

Status: Accepted

## Context

The platform has frozen Z.ai/Phaser contract reviews and canonical game gates,
but those records are separate. A candidate needs a single eligibility handoff
before a future wrapper work order can be considered.

## Decision

Create one eligibility record per candidate. It binds frozen provenance to the
canonical route, parent engine, deterministic scoring profile, and evidence
lanes for payload, events, audio, scoring, persistence, replay, and
accessibility. The foundation samples remain blocked and source-isolated.

## Consequences

- Z.ai work can be evaluated against measurable platform contracts.
- Memory Match and Balloon Pop can be compared without importing source code.
- A later wrapper decision has a clear evidence checklist and cannot silently
  transfer scoring or persistence ownership into a scene.

## Verification

- `node scripts/verify-phaser-candidate-integration-eligibility.mjs`
- `npm run verify:foundation-composition`
- `npm run typecheck --workspace @living-textbook/web`
