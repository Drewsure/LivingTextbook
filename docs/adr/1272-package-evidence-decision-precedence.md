# ADR 1272: Package Evidence Decision Precedence

## Status

Accepted.

## Decision

Require an accepted source-review decision before recording package evidence
lanes for content, games, audio, video, images, fonts, accessibility, and
rights.

## Rationale

The reviewed multimedia/game package must remain tied to a source that an
authorized reviewer has accepted into package review. This prevents a complete
lane checklist from being mistaken for approval of an unreviewed source.

## Consequences

- Package evidence capture follows the source checkpoint while remaining
  separate from release approval.
- The evidence sidecar remains metadata-only and immutable.
- Assembly, QR, persistence, and student-use gates remain blocked afterward.
