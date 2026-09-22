# ADR 1075: Teacher Draft Owner and Policy Binding

Status: Accepted as review-only foundation evidence

## Decision

Keep tenant-scoped teacher review authorization, teacher draft ownership, and school policy acceptance as separate, explicitly reconciled gates. The draft route may display their identities and blockers, but no one gate can satisfy another.

## Consequences

- Provider implementations must bind an expiring tenant-scoped owner role and policy lineage before future draft persistence.
- Policy acceptance remains school-owned, versioned, and not accepted in the foundation sample.
- No persistence activation, assignment, signature capture, or launch-ready status is enabled.

Evidence: `packages/content-model/src/teacherDraftOwnerPolicyBinding.ts`, `apps/web/src/data/sampleTeacherDraftOwnerPolicyBinding.ts`, and `docs/verification/TEACHER_DRAFT_OWNER_POLICY_BINDING_CHECKS.md`.
