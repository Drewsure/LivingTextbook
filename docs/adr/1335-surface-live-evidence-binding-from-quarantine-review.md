# ADR 1335: Surface Live Evidence Binding From Quarantine Review

## Status

Accepted for the foundation and pilot-review track.

## Decision

Link the tenant-authorized source-to-package evidence binding from the
controlled quarantine intake result and the metadata-review contract whenever
a real quarantine identity is available.

The link is navigation to a GET-only metadata projection. It is not an
approval control and must not create a second upload path, write evidence,
assemble a package, print QR codes, activate persistence, or open a student
route.

## Rationale

The platform now has a safe live binding route, but a teacher should not need
to reconstruct its query parameters manually. Exposing the route at the two
places where the quarantine identity is already present makes the review
journey usable while preserving the existing authorization and side-effect
boundaries.

## Consequences

- A real quarantined publisher submission can be followed into the same bounded
  eight-lane evidence view used by the MiniStar reference source.
- The UI remains review-first and does not imply that a binding is a release
  decision.
- The focused verifier must continue to protect GET-only, metadata-only
  behavior.
- A future friendly HTML review page may wrap this projection, but it must use
  the same contract and must not expose payload bytes.
