# DR-1188: Upstream Release-Review Identity Reconciliation

## Decision

Compare the assist-audio decision-snapshot binding with its upstream
release-review binding at the shared content-model boundary. Do not treat a
present ID or a composite label as sufficient lineage evidence.

## Required identity

Reconciliation, reviewer gate, controlled human-review packet,
release-readiness, release-control gate, approval ledger, tenant, package, and
unit scope must match the source release-review record.

## Guardrail

Mismatch is review evidence drift. It must not become approval, promotion,
persistence, export, activation, or student launch.

## Evidence

The shared validator and targeted verifier accept a matching source record and
reject tampered reviewer-gate and human-review identities.
