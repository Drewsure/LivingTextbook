# ADR 1340: Reconcile Reviewed Package Lanes Into Source Evidence

## Status

Accepted for the foundation and pilot-review track.

## Decision

The source-to-package evidence bridge may mark its audio, multimedia-rights,
and game-verification lanes present only when the same tenant-scoped package
evidence record contains the corresponding reviewed lane. The bridge must keep
sentence approval, Japanese support review, package release, QR printing,
persistence activation, and student use as separate gates.

## Rationale

The first bridge was intentionally conservative, but it could not reflect
progress after a reviewer recorded package evidence. Reconciliation makes the
publisher review conversation truthful without turning evidence review into
release approval.

## Consequences

- Reviewers can see which multimedia/game lanes have actually advanced.
- Evidence status is derived from the real package review record, not UI state.
- The source bridge remains blocked and side-effect-free until downstream gates
  are separately closed.
- The bridge verifier now covers both blocked and partially reviewed cases.
