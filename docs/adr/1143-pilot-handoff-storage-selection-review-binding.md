# ADR 1143: Pilot Handoff Storage Selection Review Binding

Status: Accepted for the review-only foundation runtime

## Decision

The controlled pilot handoff must carry the exact storage-selection preflight
and evidence-storage gate identities used by the evidence handoff and
deployment continuity decision. The pilot surface may compare hosted,
closed-local, and hybrid paths, but it must not select or activate a provider.

The handoff remains tenant/package scoped, review-only, and side-effect-free.
It cannot create storage, enable persistence, claim offline readiness, mutate
QR routes, authorize upload or download, promote a release, or launch a
classroom pilot.

## Rationale

Pilot review is the point where deployment recommendations can be mistaken for
approval. Carrying the storage review identity into the pilot package prevents
an incomplete provider decision from disappearing between evidence review,
deployment planning, and partner-facing release discussion.

## Consequences

- Pilot reviewers see one continuous storage decision lineage.
- Provider-specific implementation remains a later human-approved work order.
- Runtime validation rejects missing, drifted, selected, or enabled storage
  state in a pilot handoff.

## References

- `packages/content-model/src/pilotHandoff.ts`
- `apps/web/src/data/samplePilotHandoffPackage.ts`
- `apps/web/src/features/pilot/PilotHandoffPackagePanel.tsx`
- `docs/adr/1141-policy-gated-storage-selection-review.md`
- `docs/adr/1142-deployment-continuity-storage-review-binding.md`
