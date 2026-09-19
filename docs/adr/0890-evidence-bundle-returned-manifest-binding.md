# ADR 0890: Evidence Bundle Returned Manifest Binding

## Status

Accepted for controlled candidate review.

## Context

The prototype evidence alignment bundle validated return-review metadata and
the downstream replay reports, while the returned-package manifest was checked
separately. That split allowed the evidence bundle to appear aligned without
proving that its actual returned artifact manifest belonged to the same tenant
and generation request.

## Decision

Every prototype evidence alignment bundle must include the returned-package
manifest. The shared validator must validate that manifest and require its
tenant and generation request to match the return review and all downstream
evidence. Collections must also reject duplicate returned manifest IDs.

The bundle remains review-only. Binding the manifest does not authorize import,
route creation, wrapper approval, package promotion, or student assignment.

## Consequences

- Evidence alignment covers the actual returned package record, not only its
  surrounding review reports.
- Request lineage remains auditable from intake through manifest and replay
  evidence.
- A malformed or cross-request manifest fails closed before integration review.

## Evidence

- `packages/content-model/src/aiPrototypeEvidenceAlignment.ts`
- `apps/web/src/data/sampleAiPrototypeEvidenceAlignment.ts`
- `scripts/verify-runtime-behavior.mjs`
