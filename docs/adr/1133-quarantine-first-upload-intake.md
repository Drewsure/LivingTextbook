# ADR 1133: Quarantine-First Upload Intake

## Status

Accepted for foundation implementation; live promotion remains separately gated.

## Decision

The platform may accept publisher or teacher media only through an explicitly
enabled, tenant-scoped quarantine intake boundary. The boundary accepts the
four approved source channels, validates MIME type and size, computes a
SHA-256 checksum, and writes an immutable intake record plus payload into a
tenant-scoped quarantine directory.

Every record remains pending scan, unknown for rights, unreviewed for source,
and false for mapping, promotion, student-facing use, and learner media. No
download, playlist, game, assignment, QR, or student route is created by
intake. The default server setting is disabled; a future service may enable it
only with explicit deployment configuration and teacher/service authorization.

## Consequences

- Publisher-content intake now has a real backend boundary without implying
  that an uploaded file is safe or publishable.
- Storage can later be replaced by a managed or closed-local adapter behind
  the same metadata contract.
- The review-only upload workbench remains the teacher-facing planning surface;
  it does not silently gain a file picker.
- Scan, rights, source review, target mapping, release approval, and student
  assignment remain independent future gates.
