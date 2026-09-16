# ADR 0812: Hosted adapter read-path probe

## Status

Accepted for teacher persistence readiness review.

## Decision

Expose a teacher-only, read-only probe for the first hosted progression rehearsal adapter. The probe checks endpoint reachability with a coded sample identity and reports whether a rehearsal record exists. It never submits a write and labels the adapter as non-durable.

## Consequences

- Adapter wiring can be tested from the persistence workbench without enabling learner-data writes.
- A missing record is an expected fresh-rehearsal result, not a failure of the persistence contract.
- The eventual durable provider can replace the client and route behind the same identity and record contract.
