# ADR 1311: Local Package Integrity Ledger

## Status

Accepted for the foundation and pilot review path.

## Decision

Every assembled closed-local or hybrid package carries a metadata-only
integrity ledger. The ledger records a SHA-256 checksum and byte count for
each copied publisher content/media file and each generated package metadata
file, excluding the ledger itself to avoid a checksum cycle. The runtime
validates the ledger and re-reads every listed file before presenting the
package as available.

The ledger is bound to the tenant, package, version, bundle, source assembly
checksum, and package handoff receipt. A missing, malformed, drifting, or
unexpected file fails closed. It does not authorize package export, production
QR printing, local activation, hosted persistence, or learner-data writes.

## Why

Publishers need an inspectable answer to “is this the exact package we
reviewed?” before a local companion or future archive handoff can be trusted.
This gives that answer without introducing an unsafe download or release side
effect.

