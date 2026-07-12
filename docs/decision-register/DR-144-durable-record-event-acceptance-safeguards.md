# DR-144: Durable Record Event Acceptance Safeguards

## Decision

Extend durable record contracts so progress-event and teacher-report-package records carry event acceptance safeguards.

## Reason

The durable record map is where future backend work starts. If it only says that records exist, but not that they must preserve event taxonomy and event acceptance status, a future backend implementation could pass the high-level map while losing the safety rules.

## Standard

- Progress-event durable records preserve event effect taxonomy.
- Progress-event durable records require a passed event acceptance gate.
- Teacher report package durable records preserve event acceptance summaries.
- `/teacher/intake` shows the safeguards in the durable record map.
