# ADR 1437: Surface The Z.ai Candidate Handoff Gate

## Status

Accepted for the first saleable white-label pilot.

## Decision

The publisher pilot requirements surface exposes the human-side commands for
verifying an isolated Z.ai candidate package and running the combined
read-only pilot audit. The candidate path must remain outside `LivingTextbook`
and must contain exactly one `evidence/return-package.json` with the reviewed
artifact set. A frozen source snapshot is provenance, not a candidate.

## Consequences

Operators have one visible handoff path and a clear failure state when the
returned package is absent, ambiguous, or incomplete. Verification remains
separate from integration and cannot copy source, replace routes, own scoring,
write persistence, promote a package, or activate students.
