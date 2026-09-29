# ADR 1276: Delivery Release Lineage Boundary

## Status

Accepted for foundation hardening.

## Decision

The controlled delivery release and metadata-write routes must require a
tenant-bound `quarantineId` and reconcile it against the accepted source
review, complete package evidence, ready package review packet, intake checksum,
and selected delivery-mode decision before writing delivery metadata.

## Why

A valid delivery manifest can be constructed independently of a live publisher
submission. Without a custody-bound lineage check, a token holder could write
release metadata for a package that has never passed the live review chain.

## Boundaries

The existing dedicated tokens and explicit environment gates remain required.
The lineage validator only allows the write boundary to continue; it does not
activate students, print QR codes, or enable hosted persistence by itself.

## Verification

`scripts/verify-live-release-lineage-boundary.mjs` and the full foundation
composition verify the route markers and the blocked activation boundary.
