# ADR 1132: Controlled-Pilot Human Review Packet

## Decision

Carry the exact controlled-pilot readiness lineage into a single
tenant/package-scoped human review packet. The packet is a review artifact,
not an approval record.

## Boundaries

- Approval intent and signed approval remain uncaptured.
- Packet freezing, release mutation, assignment activation, and student launch
  remain blocked.
- The packet must preserve four evidence references and required human records.
- Future approval implementation must add its own identity, policy, storage,
  audit, retention, and revocation gates.

## Verification

- `npm run verify:controlled-pilot-approval-readiness`
- `npm run verify:routes`
- `npm run verify:foundation`
