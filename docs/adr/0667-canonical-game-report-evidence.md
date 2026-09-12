# ADR 0667: Canonical Game Report Evidence

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Teacher-facing report previews and future report adapters must validate
canonical game evidence separately from support, media, and navigation events.
Events are grouped by unit, launch, learner session, and game mode, then passed
through the shared canonical event-sequence validator. A group is report-ready
only when its required learning sequence, replay evidence, tenant identity,
launch identity, and completion boundary all pass.

## Rationale

Generic progress-event envelopes prove that an event is structurally safe, but
they do not prove that a game attempt contains a complete and trustworthy
learning sequence. Without this boundary, a report could summarize a
standalone completion or partial game row as authoritative learning evidence.

## Consequences

- Teacher reports can show incomplete sample evidence without presenting it as
  verified completion.
- Support-only audio, media, background media, and route guidance remain
  visible but cannot satisfy game evidence.
- Hosted, local, and hybrid report adapters inherit the same canonical gate.
- The current review fixture remains blocked until it contains complete,
  tenant-bound, replayable game sequences; no persistence or export is enabled.
