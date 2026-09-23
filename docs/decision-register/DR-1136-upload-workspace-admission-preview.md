# DR-1136: Upload Workspace Admission Preview

## Decision

Connect the quarantine admission preview to the tenant upload workspace so
teachers can inspect missing evidence versus evidence complete for human review.

## Rationale

The contract was verified in isolation, but an unexposed contract cannot guide
teacher or publisher review. Showing both states makes the safety boundary
operationally legible without prematurely enabling uploads or publication.

## Guardrails

- The preview remains tenant-bound, review-only, and side-effect-free.
- `evidence-ready` does not authorize storage activation, package release,
  assignment, QR mutation, local bundle activation, or student use.
- No file picker, approval action, file URL, quarantine mutation, or provider
  selection is introduced.

## Evidence

Recorded in `docs/BUILD_SESSIONS.md`, the focused quarantine admission verifier,
and the active route verifier for `/teacher/uploads/sample-publisher`.
