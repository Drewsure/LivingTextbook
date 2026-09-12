# ADR 0658: Phaser Source Identity Record

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Every Phaser or outside-game candidate review must record the source
repository, human-readable snapshot identifier, and exact immutable source
commit SHA. It must also record a repository-relative manifest of reviewed
source files, each with a 64-character SHA-256 hash. The content-model
validator requires the commit and file hashes to use their exact hexadecimal
lengths.

## Rationale

A snapshot label can be mistyped or reused. The commit SHA gives the review
packet a reproducible source boundary and lets Codex and the owner compare a
future returned package against the exact frozen source that was reviewed.

## Consequences

- Review packets are auditable without importing external source code.
- A changed or unidentified source cannot silently pass as the reviewed
  candidate.
- Reviewers can identify the exact scene, engine, type, and audio files that
  informed a finding.
- The source SHA proves provenance only; it does not approve a wrapper,
  package, route, scoring profile, persistence adapter, or student assignment.
