# DR-218: Classroom Launch Gate Preview

Date: 2026-07-15

## Decision

Add a classroom launch gate preview as the final visible boundary between teacher dry run and real student use.

## Rationale

The product must support teacher-led rehearsal without implying that children can be invited immediately. The launch boundary should be visible on the broad intake page and the focused dry-run route.

## Standard

- The gate derives from the package publish gate, approval ledger, pilot evidence packet, and teacher dry-run rehearsal.
- It must show `Launch blocked`, `No live student session`, `No launch button`, `Real learner data blocked`, and `Report export still blocked`.
- It must appear on `/teacher/intake` and `/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run`.
- It cannot invite students, create assignments, store real learner data, export reports, or approve pilot status.
