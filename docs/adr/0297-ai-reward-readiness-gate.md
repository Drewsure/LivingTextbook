# ADR 0297: AI Reward Readiness Gate

Status: Accepted  
Date: 2026-07-31

## Decision

Add a review-only AI reward readiness gate to the teacher/admin generator route.

The gate checks that generated gamification mappings preserve the 1,000 Star Dust unit cap, 75% mastery thresholds, deterministic collection unlocks, accepted learning-event sources, and correction-queue clearance.

## Rationale

The Living Textbook product depends on strong progression and collection mechanics, but those mechanics must remain child-safe, transparent, mastery-driven, and white-label configurable. AI should not be able to invent surprise rewards, issue Spin Wheel tickets, evolve avatars, write collection inventory, or mark assignments ready.

## Consequences

- Generated reward mappings have a visible review gate before student-facing use.
- Reward publishing, collection inventory writes, Spin Wheel ticket issuance, avatar evolution writes, and student assignment remain blocked.
- Reward readiness depends on the AI draft correction queue, so invalid generated content cannot unlock rewards.
- `npm run verify:ai-generator` checks the reward gate.
