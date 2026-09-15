# ADR 0805: Synchronous Event Append Boundary

- Status: Accepted
- Date: 2026-09-15
- Scope: Student canonical game completion and rehearsal evidence

## Decision

Student game flows must update their in-memory event reference synchronously
before scheduling the corresponding React state update. Completion gates must
validate that synchronous reference, because a game can emit the final
`mastery_updated` event and call its completion callback in the same turn.

## Why

The first browser replay showed a valid mastery event in the rendered event
log, while the completion gate still saw the previous event snapshot. React's
functional state updater had not run when the gate validated the completion.
That caused a valid canonical game to be rejected as if mastery evidence were
missing.

## Boundary

The synchronous ref is an in-turn replay snapshot, not hosted persistence and
not a classroom record. The later state update keeps the UI and local
browser-rehearsal evidence adapter aligned with the same event list.

## Verification

The production-shaped vertical-slice verifier requires the synchronous append
ordering, and the browser rehearsal must show `mastery_updated` followed by
`game_completed` without a canonical contract error.
