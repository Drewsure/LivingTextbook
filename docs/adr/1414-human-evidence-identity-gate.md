# ADR 1414: Human Evidence Identity Must Gate Both Decisions

- **Status:** Accepted
- **Date:** 2026-10-01

## Context

The delivery-policy and release-authorization records are separate human-owned
evidence files. Each record can be structurally valid while referring to a
different tenant, package, unit, delivery mode, or hosted-persistence choice.
Treating those records independently could produce a false-ready saleability
report.

## Decision

The pilot audit marks both the delivery-policy and release-authorization gates
as proved only when the canonical human-evidence verifier reports a proved
identity binding across the two records. Identity drift blocks the saleability
report even when every individual record passes its own field checks. The
verifier self-test must include a mismatched-record case.

## Consequences

- A human evidence packet cannot accidentally authorize a different package
  than the one described by its policy.
- The audit remains fail-closed and metadata-only.
- Operators receive a clear blocked result and must correct the packet before
  requesting release review.

See `docs/decision-register/DR-1414-human-evidence-identity-gate.md`.
