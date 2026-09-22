# ADR 0957: Phaser Candidate Evidence Adjudication

Status: Accepted

## Context

The evidence-return packet now proves whether required external evidence has
arrived, but the workbench needs an explicit next-owner state. Without one,
teams can mistake a complete packet for permission to begin integration.

## Decision

Add a provider-neutral adjudication record with three states: awaiting external
return, returned awaiting Codex review, and blocked. Derive the state from the
packet status and packet validation errors. Keep the adjudication permanently
approval-disabled.

## Consequences

- The next human action is visible and auditable.
- A returned packet cannot silently become a wrapper work order.
- The same state machine can govern Z.ai, another builder, or an internally
  authored candidate without changing tenant or game contracts.

## Verification

- `node scripts/verify-phaser-candidate-evidence-adjudication.mjs`
- `npm run verify:foundation-composition`

