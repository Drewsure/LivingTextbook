# ADR 1416: Pilot Audit May Resolve One Nested Candidate Package

- **Status:** Accepted
- **Date:** 2026-10-01

## Context

Returned ZIP files are often extracted into an outer folder. Requiring an
operator to guess the inner candidate path creates avoidable handoff errors,
while choosing between multiple returned packages would be unsafe.

## Decision

The first-pilot audit may resolve an outer folder when it contains exactly one
nested `evidence/return-package.json`. It must reject zero matches and multiple
matches, and it must still pass the resolved root through the canonical Phaser
candidate verifier. No files are copied or promoted.

## Consequences

- A normal single-package extraction can be audited directly.
- Ambiguous or frozen folders remain blocked and require an explicit operator
  choice.
- Candidate provenance and all existing import/promotion gates remain intact.

See `docs/decision-register/DR-1416-pilot-audit-candidate-folder-resolution.md`.
