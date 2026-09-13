# ADR 0685: Training Recovery Award Boundary

## Status

Accepted

## Context

Training Academy is a recovery lane, but its local completion adapter is still
a progression writer in the foundation slice. It previously added a recovery
award without the shared unit ceiling and accepted malformed practice counts.
It also lacked the direct launch-identity defense now used by canonical games.

## Decision

Normalize practice counts to non-negative integers, cap recovery awards against
the shared `UNIT_STAR_DUST_CAP`, and preserve the normalized count and award in
the completion event. Reject a mismatched unit, launch, or learner session
without a completion event or progression change.

## Consequences

- Training recovery cannot push a unit above its published Star Dust ceiling.
- Malformed counts cannot reduce or inflate learner state.
- Recovery evidence remains aligned with progression and teacher reports.
- Training Academy remains deterministic, local, and independent of AI Tutor.

## Verification

- Web TypeScript validation covers the optional blocked completion event.
- The recovery contract documents the shared cap and identity rule.
- Existing foundation and recovery verification remain required before release.
