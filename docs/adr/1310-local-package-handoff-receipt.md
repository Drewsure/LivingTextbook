# ADR 1310: Local Package Handoff Receipt

## Status

Accepted for the first saleable-pilot foundation. Handoff receipt reads are
explicitly gated and remain read-only.

## Decision

Every verified closed-local or hybrid package must expose one bounded,
machine-readable handoff receipt. The receipt binds the tenant, package,
version, bundle, delivery manifest, release receipt, source checksum, QR print
artifact, QR print HTML checksum, QR registry record, route count, game count,
media inventory, and hosted-persistence decision identity.

The receipt is derived only after the local runtime has validated the package
and is served only through a separate handoff-read gate. It contains no raw
publisher payload or learner record and cannot mutate routes, activate
students, enable hosted persistence, or authorize production printing.

## Consequences

- A publisher receives a concise record of exactly what the package contains
  and which release identities it is bound to.
- Support and recovery work can compare package, QR, and release identities
  without opening learner data or raw source files.
- Handoff retrieval remains distinct from package assembly, production print,
  QR deployment, and classroom launch approval.
