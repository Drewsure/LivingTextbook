# ADR-1227: Quarantine Record To Evidence Preview Binding

- Status: Accepted
- Date: 2026-09-29
- Scope: White-label publisher pilot review lineage

## Context

The controlled intake slice can create a validated quarantine record and the
repository already has an admission/evidence contract. The missing pilot link
was a way to inspect the real record through that contract without inventing a
second evidence shape or allowing a file to bypass review.

## Decision

Add an authorized GET route that reads one tenant-scoped quarantine record by
opaque id and derives `UploadQuarantineAdmissionPreview` with the existing
shared validator. The route returns safe metadata and a review-only preview;
it never returns raw bytes, paths, URLs, or a write capability. The intake
result links to both metadata review and evidence preview using the active
tenant identity.

## Consequences

- A publisher file now has a concrete intake-to-evidence lineage in the pilot.
- Admission requirements remain visible and deterministic.
- Evidence is still not durable, approved, assembled into a package, or
  student-facing; those remain later gates.

## Verification

Run `npm run verify:upload-quarantine-intake`,
`npm run verify:upload-quarantine-review`,
`npm run verify:upload-quarantine-admission`, and
`npm run verify:routes:preview`.
