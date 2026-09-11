# ADR 0579: Prototype Intake Alert Contract

Status: Accepted

## Decision

Validate the Z.ai prototype intake alert as a review-only contract. The alert must preserve its human handoff timing, isolated repository scope, required evidence, Codex ownership, and blocked actions before it can be displayed as a valid gate.

## Context

The intake alert status was derived correctly from readiness lanes, but the payload itself could drift: a future edit could remove a blocked action or change the handoff wording while the status derivation still passed.

## Consequences

- The user-facing handoff signal remains explicit and auditable.
- Preview records cannot silently become a request to import or patch the app.
- Z.ai and Phaser work remains isolated until a real returned package and evidence packet exist for a specific candidate.
- The contract is provider-neutral and does not authorize live workflow.

## Verification

Runtime behavior, prototype-review verification, web typecheck, full foundation verification, production build, and active route checks remain required.
