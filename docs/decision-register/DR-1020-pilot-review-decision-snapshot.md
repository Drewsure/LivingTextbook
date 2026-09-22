# DR-1020: Pilot Review Decision Snapshot

Decision: represent the canonical review decision with one provider-neutral,
versioned and fingerprinted snapshot for hosted and closed-local continuity.

The snapshot is review evidence only. It excludes raw learner audio,
transcripts, and real learner identifiers, and keeps restore, export, writes,
and activation blocked.

Evidence: `docs/adr/0948-pilot-review-decision-snapshot.md`,
`packages/content-model/src/pilotReviewDecisionPersistence.ts`, and
`scripts/verify-pilot-review-decision-snapshot.mjs`.
