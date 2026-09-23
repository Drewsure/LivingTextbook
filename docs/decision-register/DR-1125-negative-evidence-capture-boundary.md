# DR-1125: Explicit Negative Evidence Capture Boundary

## Decision

Only an explicit adult teacher action may mark the privacy-negative or
tenant-isolation lane as passed. Each record is bound to the exact local
rehearsal scope and carries a reviewer reference, capture id, timestamp, and
human notes.

## Status

Implemented and verified as review-only local evidence.

## Guardrail

The browser lane cannot stand in for privacy or tenant proof. Local records
are hidden when malformed, cross-tenant, or promotion-drifted, and they cannot
enable hosted persistence, learner-data collection, export, release promotion,
QR mutation, assignment, or student launch.

