# DR-1189: Controlled-Pilot Human-Review Packet Reconciliation

## Decision

The decision-snapshot binding must be reconciled with the validated
controlled-pilot human-review packet rather than trusting an intermediate
release-review binding.

## Required identity

Packet ID, release-readiness ID, tenant, and package scope must match the
human-review packet record.

## Guardrail

Cross-tenant or stale-readiness packet evidence is blocked and cannot create
approval, persistence, promotion, export, activation, or student launch.

## Evidence

The shared validator and targeted verifier accept a matching packet and reject
cross-tenant and stale-readiness variants.
