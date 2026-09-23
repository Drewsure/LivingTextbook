# DR-1135: Quarantine Evidence Admission Preview

- Compare each validated quarantine intake against scan, rights, source,
  target-mapping, accessibility, and release-control evidence before any
  promotion design.
- `evidence-ready` means the evidence list is complete for review; it never
  means promotion, student-facing use, storage activation, or release.
- Every preview must remain review-only with no side effect and explicit
  blockers for package, playlist, game, assignment, QR, local-bundle, and
  student-facing writes.

Evidence: `packages/content-model/src/uploadQuarantineAdmission.ts` and
`scripts/verify-upload-quarantine-admission.mjs`.
