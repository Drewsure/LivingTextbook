# ADR 1166: Shared Pairing Skin Ordering

Status: Accepted

## Context

Pairing game skins must be replayable across tenant delivery modes. Separate
local sorting rules invite drift between Memory Match and Match Up, especially
when compact seeded keys collide.

## Decision

Expose one shared replay-seeded pairing-card ordering helper. It sorts by the
platform replay key and then by canonical card identity. Memory Match and Match
Up both consume it; future pairing skins must do the same.

## Consequences

- Pairing skins share one deterministic layout contract.
- Card ordering remains presentation-only and cannot award progress or rewards.
- Frozen Z.ai/Phaser source remains outside the canonical game route until its
  evidence packet is returned and reviewed.

## Verification

- `npm run verify:pairing-engine-runtime`
- `npm run verify:canonical-games`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
