# ADR 0708: Completion Scoring Profile Integrity

## Status

Accepted for canonical game integration.

## Decision

Every canonical game completion sequence must identify the deterministic
scoring profile on both `mastery_updated` and `game_completed`. The two profile
identifiers must match. A missing completion profile or a mismatch blocks the
completion boundary and therefore blocks progression, reporting, and durable
write planning.

## Rationale

The mastery event and completion event are separate evidence records. Requiring
the profile on both prevents a route or future Phaser wrapper from awarding a
profile-specific result while reporting or persisting an ambiguous completion.
It also keeps teacher reports auditable when scoring profiles evolve.

## Verification

The canonical game verifier checks the shared contract marker. The runtime
behavior harness covers a valid profile, a missing completion profile, and a
same-sequence profile mismatch.
