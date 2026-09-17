# ADR 0823: Teacher Rehearsal Reconciliation

## Status

Accepted for browser rehearsal only.

## Context

The local evidence store now preserves events across separate student routes,
but the teacher page only showed aggregate counts. It also accepted a launch
code alone, which was not enough to explain whether a browser record belonged
to the expected package and student session.

## Decision

Pass the teacher session's expected tenant, package, and student-session
identities into the local evidence panel. Hide and explain any mismatch. For a
bound record, derive a read-only activity journey from the event history and
progression snapshot, showing observed modes and coded event counts.

## Consequences

- A teacher can understand the Flashcards -> Memory Match -> Sentence Builder
  rehearsal path from one page.
- Cross-tenant or cross-session local evidence is not displayed as valid.
- The panel remains a rehearsal preview and cannot mutate progression, rewards,
  assignment state, or reports.
- Future hosted persistence must preserve the same identity and privacy checks
  before this surface can become live reporting.
