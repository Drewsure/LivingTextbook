# ADR 0929: Source Package Assembly Lineage Integrity

Status: Accepted for review-only foundation

## Decision

Harden the review-only source-to-package assembly packet so every candidate
unit and media reference is traceable to a checksum-shaped source record and
cannot contain ambiguous duplicate identifiers.

## Required invariants

- Source checksums use `sha256:` followed by exactly 64 hexadecimal characters.
- Candidate unit keys, candidate media asset ids, required records, and
  blockers are non-blank and unique.
- A `draft-candidate` packet requires source-lineage review, accepted
  extraction review, target mapping review, and a teacher review handoff.
- Review-only promotion flags remain false; this contract never creates a
  draft, publishes a package, assigns students, or captures approval.

## Consequence

Publisher and tenant reviewers receive a deterministic evidence packet whose
identity cannot be weakened by placeholder checksums, duplicate candidates, or
an incomplete review handoff. Real file hashes and live promotion remain later
operational concerns behind separate policy and release gates.
