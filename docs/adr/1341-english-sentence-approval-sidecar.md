# ADR 1341: English Sentence Approval Sidecar

## Status

Accepted for the first saleable white-label pilot.

## Decision

Store exactly two distinct English target sentences as an immutable,
tenant-scoped sentence-approval sidecar for a quarantined publisher source.
The record binds the source checksum, proposal identity, reviewer, and
decision. It is review evidence only: package assembly, promotion, QR
printing, persistence activation, and student-facing use remain false.

## Context

The source-to-package bridge distinguishes extracted source terms from
platform-authored sentence candidates, but the live publisher path had no
durable way to record approval. Leaving the lane permanently blocked made the
pilot evidence picture inaccurate; allowing a generic package-ready flag to
advance it would be unsafe.

## Consequences

- English sentence approval is now a real, auditable review lane.
- Japanese or other support-language text cannot satisfy this target-language
  gate; support language remains a separate review lane.
- The write requires an accepted source review and the explicit local operator
  gate `LIVING_TEXTBOOOK_SENTENCE_APPROVALS_ENABLED=true`.
- Conflicting second writes are rejected rather than overwriting the first
  reviewer decision.
- The live source and package readiness projections show the lane as present
  only when the stored decision is `approved`.

## Rejected alternatives

- Treating a package evidence review as sentence approval loses the exact
  target and reviewer decision boundary.
- Allowing one or more than two targets conflicts with the canonical unit
  contract and makes game verification ambiguous.
- Allowing support-language approval to unlock the lane violates the
  target-language progression rule.
