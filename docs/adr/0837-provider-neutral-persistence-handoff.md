# ADR 0837: Provider-Neutral Persistence Handoff

## Status

Accepted for review-only foundation work.

## Decision

Represent the future persistence implementation handoff as a provider-neutral
packet built from the existing durable-record contracts, adapter write intents,
and backend selection gate. The packet may prove coverage and expose blockers,
but it must not select a vendor or perform a storage, export, migration,
backup, restore, or policy-acceptance action.

## Rationale

The platform must support hosted PWA, local classroom, and closed companion
deployments without creating a hosted-only source of truth. A single handoff
packet makes missing category coverage visible before implementation and keeps
cost, privacy, and tenant boundaries reviewable by the platform owner and each
white-label tenant.

## Consequences

- Future adapters consume the same category and tenant-boundary map.
- Hosted and local plans can be compared without duplicating storage logic.
- Open policy or cost criteria remain explicit implementation blockers.
- The workbench remains safe to show during partner discussions because it has
  no live side effect.

## Excluded

Provider credentials, bucket creation, signed URLs, migrations, durable writes,
exports, backups, restores, billing activation, and student-data collection.
