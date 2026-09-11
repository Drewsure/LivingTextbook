# ADR-0552: Teacher Report Tenant Binding

Status: Accepted  
Date: 2026-09-11

## Decision

Every canonical unit key in a teacher report event stream must resolve to the runtime tenant ID.

## Context

Launch binding prevents cross-launch evidence, but white-label reports have an additional boundary: the requested tenant. An event can carry a valid canonical unit key and launch code while still belonging to another tenant.

## Consequences

- Cross-tenant report evidence becomes a review blocker.
- The shared canonical unit-key parser is the tenant identity source.
- Invalid unit keys remain blocked by envelope validation.
- This remains a verification guard before report export or persistence integration.

## Verification

- Runtime behavior rejects a report event whose canonical unit key belongs to another tenant.
- Content-model and web typechecks must pass.
- Foundation verification must pass before release.
