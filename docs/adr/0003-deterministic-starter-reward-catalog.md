# ADR 0003: Deterministic Starter Reward Catalog

Status: Accepted

Date: 2026-06-28

## Context

Progression and collection mechanics are a major part of the Living Textbook product direction. They must create excitement and ownership for students while remaining parent-safe, teacher-explainable, and white-label friendly.

Random reward systems can be engaging, but they can also drift toward pressure-based or gambling-like mechanics if introduced too early or used as the primary progression loop.

## Decision

Use a deterministic starter reward catalog for the first vertical slice.

Rewards unlock through visible Star Dust thresholds. The first implementation proves the earned collection loop without randomization, purchasing pressure, or opaque reward odds.

## White-Label Impact

Positive.

A catalog structure can later be configured per tenant with different reward names, themes, avatars, rooms, titles, or cosmetics. MiniStar can use its own identity without making those reward labels universal platform rules.

## Cost Impact

Positive.

Catalog entries are cheap to implement and easy to change. This avoids building a premium asset pipeline, wardrobe system, room builder, or animated pet evolution before the core learning flow has been verified.

## Child-Safety Impact

Positive.

Students see what they earned and why. The reward path is transparent, mastery-linked, and easy for teachers or parents to understand.

## Implementation Boundary

Current slice:

- Reward catalog lives in `apps/web/src/features/rewards/rewardCatalog.ts`.
- Reward preview lives in `RewardPreviewCard`.
- Rewards unlock from current local Star Dust state.

Not included yet:

- Random reward rolls.
- Purchases.
- Premium cosmetics.
- Room/base rendering.
- Avatar or pet evolution art.
- Persistent reward ownership.

## Revisit Criteria

Revisit after:

- The first vertical slice is locally verified.
- Persistence requirements are clear.
- Tenant reward configuration is needed.
- Premium visual assets are ready to be introduced after structure is stable.
