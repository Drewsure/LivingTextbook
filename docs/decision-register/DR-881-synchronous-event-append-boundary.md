# DR-881: Synchronous Event Append Boundary

- Status: Accepted
- Date: 2026-09-15
- Decision owner: Codex architecture review

## Decision

Canonical student game flows update the event ref synchronously before calling
the React state setter. Completion verification reads that ref so final
`mastery_updated` evidence cannot be hidden behind a deferred state update.

## Evidence

The first production-shaped browser replay rendered the mastery event but the
completion gate rejected the game because the deferred state updater had not
yet updated the ref. The corrected replay accepted the same deterministic
event sequence and rendered `game_completed` without a contract error.

## Consequences

This is an in-memory ordering rule only. It does not promote the browser
rehearsal adapter into hosted persistence, export, or a live classroom record.
The standing vertical-slice verifier checks the code boundary so future event
stream refactors cannot reintroduce the race.
