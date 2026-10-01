# ADR 1412: Require A Bounded Pilot Human Evidence Packet

## Status

Accepted for the first saleable-pilot audit.

## Context

Delivery policy and release authorization are human decisions. Leaving them as
permanent placeholders makes the audit unable to distinguish “not supplied”
from “supplied and structurally verified,” while accepting arbitrary files
would create a false-ready path.

## Decision

Require an external folder containing `delivery-policy.json` and
`release-authorization.json`. Validate explicit delivery mode, hosted
persistence choice, policy references, reviewer identity, QR authorization,
browser rehearsal, rollback evidence, and final SHA-256 checksums. Require both
records to match the publisher tenant/package/unit identity when a publisher
root is supplied.

## Consequences

The audit can advance only on explicit, identity-bound human evidence. The
validator is metadata-only and keeps writes, package assembly, QR mutation,
persistence activation, and student access disabled.
