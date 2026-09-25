# ADR 1199: Source Runtime Checksum Format

## Decision

The source-runtime request boundary must require the canonical
`sha256:<64 hexadecimal characters>` checksum format already required by source
extraction previews and source-package assembly packets.

## Why

Source identity is carried through upload review, extraction review, package
assembly, and teacher-draft review. Accepting an arbitrary checksum at the
earlier runtime boundary creates a weaker link that can no longer be safely
reconciled downstream.

## Consequences

- Source identity validation is consistent across the publisher intake stages.
- Existing review-only behavior and no-side-effect guarantees are unchanged.
- Fixtures and external adapters must provide a canonical SHA-256 identity
  before a source-runtime request can be considered structurally valid.
