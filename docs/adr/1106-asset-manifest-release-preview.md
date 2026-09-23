# ADR 1106: Asset Manifest Release Preview

Status: Accepted for the review-only foundation runtime

## Decision

Validated asset evidence can be reconciled into a provider-neutral manifest
preview for a game asset, media manifest, or source-document target. The
preview copies only approved metadata references: tenant, package, asset,
source lineage, kind, MIME type, size, checksum, target, release gate, and
blockers.

The preview remains review-only and side-effect-free. It never selects hosted
storage, local storage, a media transformer, a playlist writer, a game-manifest
writer, a download path, or a student-facing route.

## Rationale

The platform needs target-specific planning without recreating a generic
"upload and publish" shortcut. A manifest preview lets teachers and publishers
see what is missing for each asset type while keeping white-label deployment
choices and release approvals explicit.

## Consequences

- Game, media, and source-document asset lanes share one provider-neutral shape.
- Blockers are visible before a storage provider is selected.
- Evidence-ready cannot be mistaken for production activation.
- Future adapters must validate the preview and preserve all blocked actions.

## References

- `packages/content-model/src/assetManifestRuntime.ts`
- `apps/web/src/data/sampleAssetEvidencePacket.ts`
- `docs/verification/CONTENT_INTAKE_CHECKS.md`
