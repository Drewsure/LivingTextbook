# ADR 1107: Asset Manifest Release-Control Binding

Status: Accepted for the review-only foundation runtime

## Decision

Every asset manifest preview is reconciled with release-control evidence and a
declared deployment mode: hosted, local, or hybrid. The binding preserves
tenant, package, release gate, evidence packet, and manifest identities while
showing deployment-policy, hosted-storage, local-bundle, release, and approval
blockers.

The binding remains review-only. It cannot select a provider, write hosted or
local storage, activate a folder, promote an asset, mutate a QR route, or make
an asset student-facing.

## Rationale

White-label tenants may choose hosted, closed local, or hybrid delivery. A
manifest preview must not silently choose one or treat a local path as proof
of release. Binding the choices to the same release-control evidence prevents
deployment drift and keeps publisher-owned media safe across packaging modes.

## Consequences

- Teacher reviewers see one coherent asset decision across deployment modes.
- Release blockers and required approvals remain auditable.
- Provider selection and activation remain later gated work.

## References

- `packages/content-model/src/assetManifestReleaseControlRuntime.ts`
- `apps/web/src/data/sampleAssetEvidencePacket.ts`
- `docs/verification/CONTENT_INTAKE_CHECKS.md`
