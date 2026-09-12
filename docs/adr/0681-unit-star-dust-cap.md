# ADR 0681: Unit Star Dust Capacity

Status: Accepted

Date: 2026-09-13

## Context

The platform economy defines a strict maximum of 1,000 Star Dust per unit.
Several curated games may be available for one unit, so a completion adapter
that simply adds every mode award could exceed the published capacity and make
module thresholds, overflow tickets, continuity snapshots, and reports
inconsistent.

## Decision

`completeFlashcardEntryPractice` and `completeGameMode` must cap each award to
the remaining capacity in the current unit. The shared application constant is
`UNIT_STAR_DUST_CAP = 1000` in the shared content-model economy policy, and the
completion event records the capped award, not the requested award. Web
adapters and AI gamification validation consume that shared constant rather
than defining competing capacity literals.

The cap applies after the existing deterministic scoring profile calculation
and before progression, event, reward, or report state changes. Replays and
already-completed modes remain zero-award operations.

## Consequences

Positive:

- The runtime matches the 1,000-Dust unit contract.
- Additional curated modes cannot inflate Star Dust or continuity snapshots.
- Teacher reports and future overflow-ticket calculations receive the actual
  accepted award.

Tradeoffs:

- A late game may legitimately receive less than its profile cap when the unit
  is already near capacity.
- Future module-level aggregation must keep unit awards separate from overflow
  ticket conversion.

## Verification

`npm run verify:progression-runtime`, `npm run verify:canonical-games`, and
`npm run verify:ai-generator` check the shared policy consumers, and the web
typecheck covers both completion consumers.
