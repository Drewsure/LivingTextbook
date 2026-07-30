# ADR 0298: AI Reward Readiness Gate Storage Contract

Status: Accepted  
Date: 2026-07-31

## Decision

Promote `ai_reward_readiness_gate` / `ai-reward-readiness-gate` into the backend-neutral storage plan.

The record stores generated reward readiness checks for Star Dust caps, mastery thresholds, deterministic unlocks, accepted event sources, correction-queue clearance, blocked reward actions, and next reward records.

## Rationale

The generator route now displays a reward readiness gate. That gate must not remain UI-only if it will later control reward publishing, collection inventory, Spin Wheel tickets, avatar evolution, or student assignments. Hosted and local deployments need the same durable contract before backend selection.

## Consequences

- Backend schema, migration candidates, migration specs, durable records, and persistence adapter plans now name the reward readiness gate.
- Hosted and local adapters must preserve deterministic reward checks.
- Reward publishing, collection inventory writes, generated surprise rewards, Spin Wheel ticket issuance, avatar evolution writes, and student assignment remain blocked.
- `npm run verify:backend-storage` checks the storage contract.
