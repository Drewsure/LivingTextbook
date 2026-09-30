# ADR 1352: Source Preflight Evidence Bridge Reference

Date: 2026-10-01
Status: Accepted

## Decision

The source-to-package evidence bridge may carry a validated publisher source
preflight reference containing the report ID, manifest ID, manifest checksum,
and inventory checksum. The reference is optional until a real publisher
submission has a durable preflight record; an absent reference remains visible
as an open provenance gap.

## Rationale

The preflight runs before quarantine, while the source-to-package bridge is
resolved during tenant-authorized review. Carrying the reference through the
bridge connects those phases without pretending that a local report is already
durably stored. This lets MiniStar demonstrate the intended lineage while real
publishers remain blocked until their report is attached and reconciled.

## Boundaries

The reference is metadata-only. It cannot approve source content, create a
draft, write quarantine, promote assets, assemble a package, print QR codes,
activate hosted persistence, create learner records, or open student use.

