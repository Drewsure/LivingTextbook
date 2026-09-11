# ADR 0555: Explicit Tenant Boundary Key

Status: Accepted

## Context

The persistence foundation now requires tenant-boundary preservation for progress events, teacher reports, prototype readiness gates, and Codex integration decisions. A boolean flag confirms intent but does not define the field a hosted database or local classroom store must bind.

## Decision

Add `tenantBoundaryKey` to durable record contracts and persistence write intents. Require a non-empty mapping for tenant-scoped categories:

- `canonical_unit_key.tenant_id` for progress-event and teacher-report records.
- `tenant_id` for prototype integration-readiness and Codex integration-review decision records.

## Consequences

- Backend schema and local storage migrations have an explicit tenant binding to implement.
- Hosted and local adapters can be checked for mapping drift before a provider is selected.
- Missing or blank mappings fail review-only validation.
- No live storage, prototype import, route write, scoring mutation, or student assignment is enabled.

## Verification

- Shared persistence validators reject tenant-scoped records and intents without a key.
- Runtime verification covers missing-key rejection.
- Backend storage verification checks the sample mappings.
