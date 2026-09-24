# DR-1176: Teacher Dry-Run Local Observation

**Status:** Accepted for foundation and controlled-pilot rehearsal

**Decision:** Add a teacher-only local observation receipt to the dry-run workspace. Use the shared browser rehearsal observation schema, but bind it to the rehearsal package and a deterministic `teacher-dry-run:` synthetic session identity.

**Why:** A dry run needs auditable adult evidence without fabricating learner data or requiring hosted persistence. Reusing the validated observation contract keeps identity and review-only guarantees consistent.

**Blocked:** Learner records, hosted persistence, report export, assignment creation, QR mutation, release promotion, and pilot approval.

**Verification:** `npm run verify:teacher-dry-run-observation`, web typecheck, production build, route preview, and full foundation verification.
