# ADR 1403: Create-Once Source Preflight Evidence Request Bridge

## Status

Accepted for the first saleable white-label pilot foundation.

## Context

The canonical publisher source preflight already verifies the declared source
folder, supported MIME types, file sizes, checksums, and unlisted-file
blocking. The tenant-bound evidence endpoint accepts that report only after
it is associated with a quarantine record. Operators still needed to copy the
report into an endpoint-shaped request by hand, which invited tenant,
quarantine, or package drift and made the real publisher handoff harder to
repeat.

## Decision

Add `scripts/create-publisher-source-preflight-evidence-request.mjs`. It runs
the canonical preflight, requires a complete inventory, and writes one
create-once JSON request containing the report plus the tenant and opaque
quarantine identities. The artifact is metadata-only and preserves every
protected action as false. It never copies, uploads, assembles, promotes,
prints QR codes, activates persistence, or enables students.

## Consequences

- A real publisher folder has a deterministic handoff artifact for the
  source-preflight evidence route.
- The evidence request cannot silently replace an earlier request.
- The report remains review evidence, not source approval or package release.
- The operator still needs authorized tenant access and a matching quarantine
  checksum before the server records the evidence.

## Verification

- `npm run verify:publisher-source-preflight-evidence-request`
- `npm run verify:publisher-source-preflight-evidence-binding`
- `npm run verify:source-package-evidence-binding`
