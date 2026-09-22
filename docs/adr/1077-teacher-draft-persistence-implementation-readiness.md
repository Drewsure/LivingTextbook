# ADR 1077: Teacher Draft Persistence Implementation Readiness

## Decision

Define a provider-neutral implementation-readiness packet before any teacher draft persistence adapter is selected or built.

The packet names the future work order and acceptance tests while keeping provider selection, implementation, migration, writes, uploads, route mutation, live test execution, assignment, and package promotion blocked.

## Rationale

The platform must support hosted, installed PWA, and closed-local white-label deployments without allowing a convenient candidate adapter to become an accidental product decision. Acceptance evidence must cover tenant isolation, source lineage, policy binding, idempotency, media exclusion, lifecycle controls, parity, recovery, and assignment guards.

## Consequences

- A future backend team receives an ordered, testable contract.
- The hosted pilot adapter remains a candidate rather than an active provider.
- No database, object store, upload channel, or route registry is changed by this slice.
- Human policy acceptance remains required before implementation can be approved.

## References

- `packages/content-model/src/teacherDraftPersistenceImplementationReadiness.ts`
- `docs/verification/TEACHER_DRAFT_PERSISTENCE_IMPLEMENTATION_READINESS_CHECKS.md`

