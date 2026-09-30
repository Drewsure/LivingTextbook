# ADR 1305: QR Print Authorization Preflight

## Status

Accepted for foundation hardening; production QR printing remains blocked.

## Decision

The Living Textbook handoff must derive a tenant- and package-bound QR print
authorization preflight before any future production print control or durable
alias write is considered. The preflight reconciles the delivery manifest,
release receipt, QR alias registry preview, source checksum, exact alias set,
fallback paths, and rollback evidence.

The preflight may become `ready-for-authorization` when the underlying release
evidence is complete, but it always keeps `authorizationStatus: pending`,
`printArtifactAllowed: false`, route mutation disabled, student activation
disabled, and `sideEffect: none`. A separate human authorization record and a
durable registry selection remain required before production textbook printing.

## Consequences

- A review sheet cannot be mistaken for a production print authorization.
- Identity drift is surfaced before a publisher prints a stale QR code.
- Closed-local and hosted/hybrid delivery paths share one print gate.
- The first saleable pilot still requires explicit human release evidence.

## Rejected alternative

Enabling the existing browser print button after a release receipt alone was
rejected because `window.print()` cannot prove registry durability, rollback,
fallback testing, or human print authorization.
