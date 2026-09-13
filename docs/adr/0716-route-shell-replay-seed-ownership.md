# ADR 0716: Route-Shell Replay Seed Ownership

- Status: Accepted
- Date: 2026-09-14

## Context

Canonical games need deterministic layouts and auditable event evidence. The
progression adapter can preserve a platform-supplied replay seed, but allowing
each game component to derive its own value leaves the route boundary unclear
and makes future Phaser integration harder to review.

## Decision

`PlayableGameRouteShell` creates one canonical replay seed for the mounted
game and passes it as a required prop. Each canonical game consumes that value
and passes it explicitly to interaction, learning-audio, and completion event
factories. Components must not derive a second seed.

## Consequences

- All current canonical game evidence is tied to one route-owned seed.
- Future platform-issued seeds and approved Phaser wrappers have one explicit
  handoff point.
- The component contract is stricter, so incomplete wrappers fail typecheck or
  the canonical integration verifier before release review.
- The shell retains deterministic local seed creation until a platform seed
  provider is introduced.

## Verification

Run `npm run verify:canonical-games`, `npm run typecheck --workspace
@living-textbook/web`, and `npm run verify:foundation`.
