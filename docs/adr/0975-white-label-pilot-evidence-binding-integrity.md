# ADR 0975: Validate Pilot Evidence Binding Integrity

Status: Accepted

## Context

Pilot evidence bindings identify the records supporting a controlled-pilot
decision. Filtering blank values or accepting duplicates can make an incomplete
packet appear to contain sufficient evidence.

## Decision

Pilot evidence bindings must be non-empty strings and unique within the packet.
The shared validator rejects malformed or duplicate values.

## Consequences

- Incomplete pilot evidence remains visible as invalid instead of being
  normalized into a misleading green state.
- The rule is tenant-neutral and applies to MiniStar and every publisher.
- Pilot launch, reporting, persistence, promotion, and student access remain
  separately blocked.

## Verification

Behavior verification covers duplicate and blank binding rejection.
