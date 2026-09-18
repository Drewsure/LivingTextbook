# ADR 0871: Local Media Manifest Reconciliation

## Status

Accepted for foundation rehearsal.

## Context

The local package manifest and the reviewed media evidence binding now exist as
separate provider-neutral records. Without a comparison step, a future writer
could mistake a valid-looking media entry for a package-compatible asset even
when tenant identity, version, or path scope has drifted.

## Decision

Define a read-only reconciliation seam that compares manifest identity, the
declared media artifact, package and artifact versions, and the safe media path
root against every bound asset. Return `aligned`, `needs-evidence`, or
`mismatch` without repairing or mutating either record.

## Consequences

Pending rights, checksum, scan, mapping, or accessibility evidence remains
visible as an evidence gap. Identity, version, missing-artifact, or path drift
is a mismatch and cannot be silently corrected. Media copy, package writes,
local activation, student promotion, and QR mutation remain blocked.
