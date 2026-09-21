# ADR 0923: Pilot Handoff Report Snapshot Evidence

Status: Accepted for review-only foundation

## Decision

Carry sanitized teacher report snapshot evidence in the partner pilot handoff
package. The evidence covers both `hosted-managed` and `local-classroom`
deployment rehearsals while remaining separate from persistence activation,
report export, classroom launch, and provider selection.

## Required invariants

- Tenant, package, and launch scope must be preserved in the handoff packet.
- The packet must state that both recovery rehearsals are valid before it is
  considered contract-valid.
- Export, writes, raw learner audio, transcripts, and real learner identifiers
  must remain explicitly blocked or excluded.
- A valid evidence packet proves alignment only; it does not authorize a
  provider, create storage, restore a snapshot, or start a classroom.
- The pilot panel must show these boundaries to an adult reviewer without
  exposing raw event payloads.

## Consequence

Partner conversations can demonstrate hosted/local reporting parity without
promising a production persistence adapter. The evidence is intentionally
metadata-first and can later be replaced by a real adapter only after policy,
retention, access, backup, and release gates are accepted.
