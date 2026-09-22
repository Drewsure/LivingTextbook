# DR-1076: Teacher Draft Acceptance Readiness

Decision: reconcile future acceptance, draft ownership, retention, export, recovery, rollback, and activation evidence before provider-specific persistence work.

Required invariants:

- Exact draft, tenant, package, release-candidate, policy, and evidence identity binding.
- Policy, retention, export, deletion, backup, restore, rollback, signature, activation, and assignment remain blocked.
- Raw learner audio and transcripts remain excluded from core retention and export.

Evidence: `packages/content-model/src/teacherDraftAcceptanceReadiness.ts` and `apps/web/src/features/content-intake/TeacherDraftAcceptanceReadinessPanel.tsx`.
