# DR-059: Sentence Builder Playable Slice

Date: 2026-07-09

Status: accepted

## Decision

Add a playable Sentence Builder route as the first text-spelling implementation slice.

## Rationale

The platform needs syntax construction as a real engine path, not only a planning card. The first implementation should stay structural: reviewed payload, ordered tiles, audio support, deterministic scoring, standard local events, and no premium polish.

## Consequences

- `/sentence/[code]` becomes available for sample launch contexts.
- Text-spelling moves from preview-only to playable scaffold.
- Future premium skins and Z.ai prototypes have a stronger integration target.
