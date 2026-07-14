# ADR 0218: Classroom Launch Gate Preview

Date: 2026-07-15

## Status

Accepted

## Context

The platform now has a package publish gate, approval ledger, pilot evidence packet, pilot launch checklist, and teacher dry-run route. The next safety risk is that a successful teacher rehearsal could be mistaken for permission to invite real students.

## Decision

Add a `Classroom launch gate preview` derived from the publish gate, approval ledger, evidence packet, and teacher dry-run rehearsal.

The gate appears on `/teacher/intake` and `/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run`. It shows `Launch blocked`, `No live student session`, `No launch button`, `Real learner data blocked`, and `Report export still blocked`.

## Consequences

- Teacher rehearsal now has a visible final boundary before classroom use.
- Future launch work must close release, approval, evidence, dry-run, policy, and persistence obligations before adding live launch controls.
- The foundation remains preview-only and cannot collect real learner data or export reports.
