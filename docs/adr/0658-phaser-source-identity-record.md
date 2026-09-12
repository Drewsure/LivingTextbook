# ADR 0658: Phaser Source Identity Record

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Every Phaser or outside-game candidate review must record the source
repository, human-readable snapshot identifier, and exact immutable source
commit SHA. The content-model validator requires the SHA to be a 40-character
hexadecimal commit identifier.

## Rationale

A snapshot label can be mistyped or reused. The commit SHA gives the review
packet a reproducible source boundary and lets Codex and the owner compare a
future returned package against the exact frozen source that was reviewed.

## Consequences

- Review packets are auditable without importing external source code.
- A changed or unidentified source cannot silently pass as the reviewed
  candidate.
- The source SHA proves provenance only; it does not approve a wrapper,
  package, route, scoring profile, persistence adapter, or student assignment.
