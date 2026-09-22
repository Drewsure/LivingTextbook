# DR-1075: Teacher Draft Owner and Policy Binding

Decision: keep tenant-scoped teacher review authorization, teacher draft ownership, and school policy acceptance as separate, explicitly reconciled gates.

Required invariants:

- Exact tenant, package, draft, persistence-preflight, policy-preflight, and acceptance-preview identity binding.
- Teacher review access cannot be interpreted as school policy acceptance.
- School policy evidence cannot be interpreted as teacher owner authorization.
- Persistence activation, assignment, signature capture, and launch readiness remain blocked.

Evidence: `packages/content-model/src/teacherDraftOwnerPolicyBinding.ts`, `apps/web/src/data/sampleTeacherDraftOwnerPolicyBinding.ts`, and `docs/verification/TEACHER_DRAFT_OWNER_POLICY_BINDING_CHECKS.md`.
