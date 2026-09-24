# ADR 1182: Assist-Language Audio Catalog Approval Reconciliation

## Status

Accepted for foundation scaffolding; production approval remains blocked.

## Decision

Add a deterministic reconciliation packet between the support-language audio
catalog approval preview and any future human approval workflow. The packet
must carry tenant, package, unit, catalog-record, evidence-record, and future
storage-record identities together. It must surface identity drift and open
evidence before approval capture can be considered.

## Boundaries

- Reconciliation is review-only and has no side effects.
- Approval remains `not-recorded`.
- No approval ledger is written.
- No catalog admission, hosted promotion, local activation, student-facing
  use, speech billing, or progression is enabled.
- The packet is a foundation evidence bridge, not a storage adapter.

## Rationale

The approval packet establishes what a human must review. Reconciliation proves
that the packet still refers to the same tenant, package, unit, and evidence
records. This prevents a future approval workflow from accepting a stale or
cross-tenant packet merely because its fields look complete.

## Verification

`verify:assist-language-audio-catalog-approval-reconciliation` validates
deterministic identity, required future records, fail-closed flags, route
exposure, and review-only behavior.
