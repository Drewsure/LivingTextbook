# ADR 0889: Returned Package Request Lineage

## Status

Accepted for controlled candidate review.

## Context

Returned prototype manifests already carried a `requestId`, but the intake
queue and return checklist identified work only by tenant and queue item. That
left a gap in the evidence chain: a package could reuse a valid queue item
while belonging to a different generation request.

## Decision

The intake queue item and return checklist must carry the authoritative
generation `requestId`. Returned-package alignment must compare that request ID
against both references, in addition to tenant, queue item, repository, mode,
engine, and target surface. Teacher review panels show the request ID so the
operator can audit lineage before review.

This remains a review gate. Request identity alignment does not authorize
source import, route creation, wrapper approval, package promotion, student
assignment, or live AI dispatch.

## Consequences

- A returned package cannot silently cross generation requests.
- Intake, checklist, manifest, and evidence records share one auditable root.
- Existing queue items must be assigned to an explicit generation request.
- The external Z.ai/Phaser source remains isolated until all other evidence gates pass.

## Evidence

- `packages/content-model/src/aiPrototypeReturnedPackageAlignment.ts`
- `apps/web/src/data/samplePrototypeIntakeQueue.ts`
- `apps/web/src/data/samplePrototypeReturnPackageChecklist.ts`
- `apps/web/src/data/sampleAiPrototypeReturnedPackageManifest.ts`
- `scripts/verify-runtime-behavior.mjs`
