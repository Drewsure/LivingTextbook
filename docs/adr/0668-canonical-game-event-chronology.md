# ADR 0668: Canonical Game Event Chronology

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Canonical game event streams must contain valid `occurredAt` timestamps in
nondecreasing order. The shared validator rejects a game sequence when an
event is timestamped before the event that precedes it.

## Rationale

Sequence position alone is not sufficient for replay and teacher reporting.
An out-of-order event can make a score, mastery update, or report summary
appear to occur before the interaction that caused it. The check is cheap at
the shared boundary and keeps future hosted, local, and Phaser wrappers
deterministic.

## Consequences

- Canonical game routes must append events in timestamp order.
- Equal timestamps remain valid for fast interactions.
- Invalid timestamps and out-of-order events block completion and report-ready
  status.
- Support-only media and audio events remain outside the canonical game group
  unless they are intentionally included as replay evidence.
