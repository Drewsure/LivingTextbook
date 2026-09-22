# DR-1015: Canonical Pilot Package Scope

Decision: use one canonical tenant/package identity across the partner pilot's
content, release, approval, report, persistence, and activation evidence.

The sample partner scope is `sample-publisher-l1-u1-routines-package`.
Handoff identifiers, release-candidate labels, and route slugs remain separate
display fields. Validators reject package drift, and a mismatch blocks release
review. This record remains review-only and does not activate storage,
publishing, or classroom launch.

Stable route keys are separate from canonical package scope so identity cleanup
does not break printed QR or teacher review paths.

Evidence:

- `packages/content-model/src/pilotHandoff.ts`
- `scripts/verify-pilot-handoff-scope.mjs`
- `apps/web/src/data/samplePilotHandoffPackage.ts`
- `apps/web/src/data/samplePackagePublishGate.ts`
- `apps/web/src/data/samplePackageApprovalLedger.ts`
