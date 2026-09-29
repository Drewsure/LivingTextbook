# ADR 1240: Controlled Local Pilot Package Assembly

## Status

Accepted for foundation implementation. Production use remains blocked until
real publisher evidence and manual release approval exist.

## Decision

Add a disabled-by-default local package assembly adapter beside the
metadata-only pilot delivery writer. The adapter accepts only a complete,
approved delivery manifest, release receipt, package index, and offline-ready
local bundle manifest. It copies only explicitly declared files from a
separately configured approved asset root.

The adapter validates asset rights, checksums, scans, target mapping, and
accessibility evidence. It rejects unsafe paths and filesystem escapes,
verifies staged output, and commits atomically. Repeated identical requests
are idempotent; different or incomplete output for the same identity is a
conflict.

## Consequences

- A publisher package can eventually be a real local handoff rather than only
  a metadata preview.
- Quarantined uploads are never promoted automatically.
- Hosted persistence, QR alias mutation, printing, and student activation
  remain independent decisions.
- The first real pilot still requires human-supplied publisher assets,
  rights/accessibility evidence, approved placement, rollback evidence, and
  release decisions.

## Verification

The local assembler verifier checks the route, feature gates, approved-root
boundary, explicit copy plan, checksum read-back, atomic commit markers, and
student/hosted/QR side-effect boundaries.
