# ADR 0723: Phaser Candidate Manifest Integrity

## Status

Accepted for foundation hardening; source integration remains blocked

## Context

Candidate profiles are shared by the teacher review surface and the external
package verifier. A malformed profile could otherwise create an empty replay
requirement or point a candidate at an unsupported parent engine. That would
make the evidence gate appear green while weakening the intended contract.

## Decision

Validate the shared profile manifest before candidate evaluation. It must be a
non-empty collection with unique target modes, labels, supported parent
engines, and at least four unique, non-blank deterministic scoring scenarios.
Invalid profile configuration fails closed. The manifest still describes
reviewability only; it never authorizes source import, route replacement,
package promotion, or student assignment.

## Consequences

The verifier cannot silently become permissive when a future candidate profile
is edited. The teacher panel and package gate continue to read one shared
configuration boundary, and adding a new candidate requires an explicit,
validated profile.
