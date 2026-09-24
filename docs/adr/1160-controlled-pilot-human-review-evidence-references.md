# ADR 1160: Controlled Pilot Human Review Evidence References

Status: Accepted for the review-only foundation runtime

## Decision

Controlled-pilot human-review packets must include exactly the six record
identities named by their fields: readiness, release binding, pilot decision,
reviewer gate, storage preflight, and storage gate.

## Rationale

An evidence packet with six unique but unrelated strings can appear complete
while losing the records needed to audit the decision. The validator must
check identity membership, not only count and uniqueness.

## Consequences

- Missing or substituted evidence identity fails validation before review.
- The packet remains a review-only artifact with no approval or activation
  side effects.

## References

- `packages/content-model/src/controlledPilotHumanReviewPacket.ts`
- `scripts/verify-controlled-pilot-human-review-packet.mjs`
- `docs/adr/1159-controlled-pilot-storage-reconciliation.md`
