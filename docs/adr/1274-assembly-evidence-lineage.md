# ADR 1274: Assembly Evidence Lineage

## Status

Accepted.

## Decision

Make assembly preflight read and enforce the live package evidence sidecar in
addition to the durable package-review packet.

## Rationale

The package writer must never appear ready while the multimedia and game
evidence lanes are missing. Binding the sidecar at preflight keeps the final
assembly decision tied to the real quarantine checksum and reviewer record.

## Consequences

- Missing evidence remains visible as a specific blocker.
- Complete evidence can close only its own preflight requirement.
- All release, QR, persistence, and student-use boundaries remain blocked.
