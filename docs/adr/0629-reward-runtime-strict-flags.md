# ADR-0629: Reward Runtime Strict Flags

Status: Accepted

## Decision

The reward runtime boundary must validate mastery, provenance, policy, persistence,
release, and anti-gacha fields as actual booleans.

## Required behavior

- Earned mastery, ownership provenance, reward policy, persistence, release approval,
  random-reward, gacha-pressure, purchase-required, and Spin Wheel request fields must
  be booleans.
- Stringified values must produce deterministic validation errors and must not control
  collection ownership, Star Dust, ticket issuance, or reward safety branches.
- Random rewards, gacha pressure, purchase-required rewards, and unapproved Spin Wheel
  tickets remain blocked by the child-safe earned-collection boundary.

## Guardrails

This is a review-only boundary. It does not write inventory, mutate ownership, issue
Spin Wheel tickets, bypass mastery, or enable Z.ai/game integration.

## Verification

Run `npm run verify:reward-runtime`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation`.
