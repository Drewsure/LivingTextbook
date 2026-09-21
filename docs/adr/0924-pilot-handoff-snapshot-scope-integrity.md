# ADR 0924: Pilot Handoff Snapshot Scope Integrity

Status: Accepted for review-only foundation

## Decision

Pilot handoff report evidence must fail closed when its snapshot identifier
does not encode the evidence tenant, package, and launch scope, or when its
fingerprint does not use the canonical report-snapshot fingerprint namespace.

## Required invariants

- Snapshot identity is deterministic from tenant, package, and launch values.
- Fingerprints use the provider-neutral report snapshot fingerprint prefix.
- Scope and fingerprint checks remain metadata validation only; they do not
  authorize persistence, export, recovery, or classroom launch.
- Existing privacy exclusions and hosted/local rehearsal coverage remain
  unchanged.

## Consequence

Copied or hand-edited pilot evidence cannot appear valid merely because its
fields are non-empty. The handoff remains useful for partner review while
preserving a clean boundary for any future real persistence adapter.
