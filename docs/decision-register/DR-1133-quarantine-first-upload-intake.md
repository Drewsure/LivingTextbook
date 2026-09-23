# DR-1133: Quarantine-First Upload Intake

- Publisher PDF/text, labelled-diagram images, audio/music, and video may
  enter only through an explicit server-enabled quarantine boundary.
- Each intake must be tenant-scoped, channel-scoped, MIME-checked, size
  bounded, checksum-recorded, and stored with pending scan, unknown rights,
  and unreviewed source status.
- Quarantine metadata must keep target mapping, promotion, student-facing use,
  and learner-media flags false.
- Intake must not create a download URL, playlist, game, assignment, QR route,
  local bundle activation, or student-facing media path.
- The existing review-only upload and evidence workspaces remain the required
  human review surfaces before any future promotion design.

Evidence: `packages/content-model/src/uploadQuarantineIntake.ts`,
`apps/web/src/server/uploads/quarantineUploadStore.ts`,
`apps/web/src/app/api/teacher/uploads/intake/route.ts`, and
`scripts/verify-upload-quarantine-intake.mjs`.
