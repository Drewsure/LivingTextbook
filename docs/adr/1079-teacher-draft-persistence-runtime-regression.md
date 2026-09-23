# ADR 1079: Teacher Draft Persistence Runtime Regression Coverage

## Decision

Exercise the teacher draft persistence implementation-readiness record and adapter write intent in the runtime harness. A valid provider-neutral packet must validate; removing a provider-selection or assignment-promotion blocker must fail with a deterministic diagnostic.

## Rationale

Static backend alignment proves that the sample schema and migration documents contain the intended names. It does not prove that the shared content-model validators enforce the same guardrails when a future adapter or API receives a changed record. Runtime regression coverage closes that gap without enabling a provider or any live write.

## Consequences

- Future persistence changes must preserve both schema alignment and runtime blocker behavior.
- The test remains provider-neutral and does not execute a database, upload, route, or assignment operation.
- The nine acceptance tests remain evidence requirements rather than claims of execution.

## References

- `scripts/verify-runtime-behavior.mjs`
- `docs/verification/TEACHER_DRAFT_PERSISTENCE_IMPLEMENTATION_STORAGE_CHECKS.md`
