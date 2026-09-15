# ADR 0807: First hosted progression rehearsal adapter

## Status

Accepted as a backend boundary, not as production persistence.

## Decision

Add a Next route-backed hosted-managed adapter that stores only validated progression continuity records in a process-local rehearsal map. Writes require all of the following: rehearsal-only mode, explicit non-durable write approval, and school-policy acceptance. Writes are idempotent by continuity id. Reads require the same tenant, package, launch, and student-session identity.

The default response is blocked. The process-local map is intentionally labeled `non-durable-rehearsal`; it is suitable for contract testing and adapter wiring, not for production learner records.

## Exit criteria for a durable adapter

- approved database and object-storage providers,
- tenant isolation and authentication review,
- retention/deletion and school policy,
- migration and backup plan,
- report event acceptance and export rules,
- production observability and failure recovery evidence.
