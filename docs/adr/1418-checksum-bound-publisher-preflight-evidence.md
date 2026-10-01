# ADR 1418: Checksum-Bound Publisher Preflight Evidence

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

The publisher intake preflight is intentionally review-only, but a transient
successful command is too weak for a saleability decision. A publisher could
change the intake brief after preflight while leaving the old report or the
same-looking folder in place.

## Decision

The intake preflight writes a versioned report containing the SHA-256 checksum
of the exact `publisher-pilot-intake.json` that it inspected. The first-pilot
audit requires that report at
`evidence/publisher-intake-preflight.json`, rechecks the current brief
checksum, and requires complete inventory plus review-only protected actions.

## Consequences

- Publisher evidence is durable and reviewable across operator handoffs.
- Brief edits force a fresh preflight rather than silently reusing stale proof.
- No source or media files are copied, uploaded, promoted, or made
  student-facing by this change.

See `docs/decision-register/DR-1418-checksum-bound-publisher-preflight-evidence.md`.
