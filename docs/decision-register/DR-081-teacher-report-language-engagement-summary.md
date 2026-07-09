# DR-081: Teacher Report Language Engagement Summary

## Decision

Show English audio engagement and support-language taps as separate teacher report metrics.

## Rationale

Students should not progress by pressing support-language text. Teachers still benefit from seeing support-language use as comprehension support. The report surface should make that distinction visible.

## Consequences

- Teacher-visible summaries now count English audio heard, support taps, and support unlock events.
- Support-language taps remain reportable but not progression triggers.
- The report stays sample-data only and does not imply production storage.

## Non-Goals

- Backend event storage.
- Personal learner profiles.
- Raw audio storage.
- Transcript storage.
