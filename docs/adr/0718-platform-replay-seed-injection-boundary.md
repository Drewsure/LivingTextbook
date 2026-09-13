# ADR 0718: Platform Replay Seed Injection Boundary

Status: Accepted

## Context

Canonical games now receive one deterministic replay seed from the shared
route shell. Future Phaser candidates or a platform service may need an issued
seed so a reviewed game layout can be tied to a launch session or provider
contract. Adding that capability inside individual game components would
recreate the split ownership problem the canonical replay gate is designed to
prevent.

## Decision

`PlayableGameRouteShell` exposes an optional `platformReplaySeed` input. The
shell resolves the seed as follows:

1. Use the supplied platform seed only when it is a valid transport-safe
   `replay-v1:` value.
2. Otherwise use the deterministic unit-and-mode `replay-v1:` fallback.
3. Pass the resolved value to the mounted game as required `replaySeed` data.

Every mounted game must pass that same value to start, interaction, learning
audio, and completion event factories. The canonical integration verifier
guards the optional input, fallback, required game prop, and prohibition on
component-local seed derivation.

## Consequences

- A future approved Phaser wrapper has one explicit injection point.
- Local demos remain deterministic and do not need a backend service.
- Malformed provider input cannot enter canonical evidence; it resolves to the
  deterministic fallback.
- Replay evidence can later be bound to a platform session without changing
  the game component contract.
- The boundary alone does not enable persistence, networking, assignment,
  source import, route replacement, or provider promotion.

## Verification

Run `npm run verify:canonical-games`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation` after changing this boundary. A candidate still
requires its complete evidence packet and explicit review before integration.
