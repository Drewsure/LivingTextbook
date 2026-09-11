# ADR-0553: Persistence Tenant-Boundary Preservation

Status: Accepted  
Date: 2026-09-11

## Decision

Durable progress-event and teacher-report records, together with hosted and local write intents, must explicitly preserve tenant-boundary evidence.

## Context

Teacher-report runtime validation now rejects cross-tenant canonical unit keys. A future persistence provider could still weaken that boundary if the record and adapter contracts do not require tenant preservation.

## Consequences

- Record and write-intent validation fails when tenant preservation is undeclared.
- Hosted and local deployments share the same white-label isolation requirement.
- This remains a review-only storage contract; no provider or write is activated.

## Verification

- Sample durable records and adapter plans declare tenant-boundary preservation.
- Backend readiness verification checks the contract marker.
- Foundation verification must pass before release.
