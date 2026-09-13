# ADR 0722: Phaser Candidate Profile Gate

## Status

Accepted for foundation hardening; source integration remains blocked

## Context

The external Phaser package verifier was initially written for the first
candidate, Memory Match. Balloon Pop is now the second mapped candidate, and
future candidates will need the same evidence envelope with mode-specific
parent-engine and scoring expectations. A verifier that silently assumes one
mode would either reject valid future evidence or encourage copied, weakened
checks.

## Decision

Define explicit approved candidate profiles in the package verifier. The active
profiles are:

- `memory-match` -> `pairing`, with `correct`, `incorrect`, `retry`, and
  `completion` scoring scenarios.
- `balloon-pop` -> `selection`, with the same scenarios plus `miss`.

Fixture metadata and every replay event must match the selected profile. The
shared eight-artifact evidence envelope and all blocked actions remain
unchanged. Adding a profile only makes its evidence reviewable; it never
authorizes source import, route replacement, package promotion, or student
assignment.

## Consequences

The gate is reusable across the mapped Phaser candidates and makes the
different risk profiles explicit. The first Z.ai handoff remains Memory Match,
while Balloon Pop can be reviewed later without creating a second verifier or
loosening the platform boundary.
