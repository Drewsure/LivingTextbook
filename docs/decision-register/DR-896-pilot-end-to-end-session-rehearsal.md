# DR-896: Pilot End-to-End Session Rehearsal

## Decision

Make the first production-shaped white-label rehearsal an ordered,
tenant-neutral journey from the coded front door through Flashcards, Memory
Match, Sentence Builder, and the teacher report. The rehearsal gate checks
that the sequence is represented in the fixture, route handoffs, teacher
evidence boundary, and hosted persistence safety boundary.

## Included

- Teacher-only dry-run sequence with explicit route expectations.
- Target-language Flashcard completion as the first unlock trigger.
- Validated Memory Match and Sentence Builder handoffs.
- Cumulative, deduplicated local evidence bound to package and student session.
- Read-only teacher reconciliation of activity and progression summaries.
- Hosted persistence contract disabled by default behind policy gates.
- Deterministic completion and retry behavior.

## Excluded

- Direct URL unlocks, support-language-only progression, live assignments,
  exports, raw learner audio, transcripts, reward mutation, durable browser
  rehearsal writes, and unreviewed Z.ai/Phaser source integration.
