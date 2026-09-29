# DR-1226: Controlled Publisher Quarantine Intake

- Date: 2026-09-29
- Status: Accepted
- Decision: Expose the first publisher intake control only behind an explicit
  server flag and the existing quarantine custody boundary.

## Rationale

The pilot needs to accept a publisher's source and media files, but accepting a
file cannot silently mean extraction, approval, package promotion, QR creation,
playlist activation, assignment, or student use. A controlled quarantine panel
provides an implementation-shaped workflow while preserving each later gate.

## Required behavior

- Default route: no file input and review-only messaging.
- Enabled route: one tenant-scoped file, channel, and optional unit key.
- Response: safe quarantine metadata only; no raw payload, path, or download URL.
- Still blocked: extraction, promotion, QR mutation, game/playlist creation,
  assignment, and student-facing use.

## Verification

The decision is covered by the upload quarantine intake, upload channel, review,
admission, and preview-route verification commands.
