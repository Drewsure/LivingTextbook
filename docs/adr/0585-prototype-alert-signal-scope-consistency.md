# ADR 0585: Prototype Alert and Signal Scope Consistency

Status: Accepted

## Decision

When a prototype-intake alert is validated against a readiness signal, the alert tenant and readiness-signal tenant must match. Route scope, alert scope, and readiness scope form one identity chain.

## Context

Tenant-scoped alert and summary records can still be paired incorrectly by a caller. Validating each object independently is not enough for a white-label review boundary.

## Consequences

- A tenant alert cannot summarize another tenant’s readiness lanes.
- The platform scope remains valid when both records use `platform`.
- Cross-record identity is checked before any future handoff decision.
- The guard remains review-only and cannot authorize import or student use.

## Verification

The runtime harness must cover matching and mismatched alert/readiness tenant IDs. Prototype-review verification, web typecheck, full foundation verification, production build, and active route checks remain required.
