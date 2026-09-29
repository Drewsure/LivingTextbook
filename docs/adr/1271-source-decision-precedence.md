# ADR 1271: Source Decision Precedence

## Status

Accepted.

## Decision

Require an accepted quarantine source-review decision before creating the
immutable package-review packet.

## Rationale

Package-review packets are create-only snapshots. Allowing a blocked snapshot
before source review would create a dead-end record that cannot be replaced
after the reviewer resolves the source decision.

## Consequences

- The package-review gate has a deterministic source-to-packet order.
- Missing and changes-required decisions remain explicit blocked outcomes.
- Package assembly, release, QR, persistence, and student activation remain
  separate gates after packet capture.
