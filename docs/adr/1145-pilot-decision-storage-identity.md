# ADR 1145: Pilot Decision Storage Identity

Status: Accepted for the review-only foundation runtime

## Decision

The canonical pilot review decision and white-label release-readiness evidence
must carry the exact provider-neutral storage-selection preflight and
evidence-storage gate identities already established by the pilot handoff.

Both records must preserve `blocked` status and `allowed: false`. Generic
evidence bindings are not sufficient because a later reviewer must be able to
trace the storage policy boundary without inferring it from another record.

## Rationale

Release surfaces are where evidence is most likely to be mistaken for
permission. Explicit storage identities prevent a pilot decision, dashboard,
or future approval workflow from silently dropping the cost, privacy,
retention, backup, deletion, and tenant-isolation policy review.

## Consequences

- Pilot decisions remain provider-neutral and fail closed if storage identity
  is missing, enabled, or not blocked.
- White-label release dashboards can show the exact storage review lineage to a
  school or publisher without selecting a provider.
- Persistence writes, provider activation, export, release mutation, QR
  mutation, assignment, and classroom launch remain blocked.

## References

- `packages/content-model/src/pilotReviewDecision.ts`
- `packages/content-model/src/whiteLabelReleaseReadiness.ts`
- `apps/web/src/features/pilot/PilotReviewDecisionPanel.tsx`
- `apps/web/src/features/release/WhiteLabelReleaseReadinessPanel.tsx`
- `docs/adr/1144-controlled-pilot-storage-policy-boundary.md`
